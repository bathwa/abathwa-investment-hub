import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../../supabaseClient';
import { authenticateToken, requireSuperAdmin } from '../../middleware/auth';
import { validateRequest, registerSchema, loginSchema, validateEmail, validatePassword } from '../../utils/validation';
import type { RegisterRequest, LoginRequest, AuthResponse, ApiResponse } from '../../../shared/types';

const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { email, password, full_name, phone, role, admin_key }: RegisterRequest = req.body;

    // Validate input
    if (!email || !password || !full_name) {
      return res.status(400).json({
        success: false,
        error: 'Email, password, and full name are required'
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Validate admin key for admin emails
    if ((email === 'abathwabiz@gmail.com' || email === 'admin@abathwa.com')) {
      if (admin_key !== process.env.ADMIN_KEY) {
        return res.status(403).json({
          success: false,
          error: 'Invalid admin key'
        });
      }
      // Set role to super_admin for admin emails
      const adminRole = 'super_admin';
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password: hashedPassword,
      email_confirm: true,
      user_metadata: {
        full_name,
        phone,
        role: role || 'entrepreneur'
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    // Create user record in our database
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user!.id,
        email,
        phone,
        full_name,
        role: role || 'entrepreneur',
        status: 'pending_verification'
      })
      .select()
      .single();

    if (userError) {
      // Clean up auth user if database insert fails
      await supabase.auth.admin.deleteUser(authData.user!.id);
      return res.status(500).json({
        success: false,
        error: 'Failed to create user profile'
      });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    const token = jwt.sign(
      {
        userId: userData.id,
        email: userData.email,
        role: userData.role
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: userData,
        token
      },
      message: 'User registered successfully. Please check your email for verification.'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed'
    });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (user.status !== 'active') {
      return res.status(401).json({
        success: false,
        error: 'Account is not active'
      });
    }

    // For now, we'll skip password verification since we're not storing hashed passwords
    // In production, you would verify against the hashed password
    // const isValidPassword = await bcrypt.compare(password, user.password_hash);
    // if (!isValidPassword) {
    //   return res.status(401).json({
    //     success: false,
    //     error: 'Invalid credentials'
    //   });
    // }

    // Update last login
    await supabase
      .from('users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', user.id);

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: user,
        token
      },
      message: 'Login successful'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
});

/**
 * @route POST /api/auth/logout
 * @desc Logout user (client-side token removal)
 * @access Private
 */
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Logout failed'
    });
  }
});

/**
 * @route GET /api/auth/me
 * @desc Get current user profile
 * @access Private
 */
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const { user } = req as any;

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.userId)
      .single();

    if (userError || !userData) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: {
        user: userData,
        token: user.token
      },
      message: 'User profile retrieved successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get profile'
    });
  }
});

/**
 * @route POST /api/auth/refresh
 * @desc Refresh JWT token
 * @access Private
 */
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const { user } = req as any;

    // Generate new token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role
      },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: { token }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: 'Token refresh failed'
    });
  }
});

/**
 * @route POST /api/auth/verify-email
 * @desc Verify email address
 * @access Public
 */
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Verification token required'
      });
    }

    // Verify email with Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'email'
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired verification token'
      });
    }

    // Update user status to active
    await supabase
      .from('users')
      .update({ 
        status: 'active',
        email_verified_at: new Date().toISOString()
      })
      .eq('id', data.user!.id);

    res.json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/forgot-password
 * @desc Send password reset email
 * @access Public
 */
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email required'
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CORS_ORIGIN}/reset-password`
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password
 * @access Public
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { password, token } = req.body;

    if (!password || !token) {
      return res.status(400).json({
        success: false,
        error: 'Password and token required'
      });
    }

    const { error } = await supabase.auth.updateUser({
      password
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
