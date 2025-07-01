
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import type { User, UserRole } from '../shared/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role: UserRole, profileData?: any) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Get dashboard route based on user role
  const getDashboardRoute = (role: UserRole): string => {
    const roleDashboardMap: Record<UserRole, string> = {
      'super_admin': '/admin-dashboard',
      'investor': '/investor-dashboard',
      'entrepreneur': '/entrepreneur-dashboard',
      'service_provider': '/service-provider-dashboard',
      'observer': '/observer-dashboard'
    };
    return roleDashboardMap[role];
  };

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const userProfile = await fetchUserProfile(authUser.id);
      setUser(userProfile);
    }
  };

  // Handle post-login redirection
  const handlePostLoginRedirect = (user: User) => {
    const dashboardRoute = getDashboardRoute(user.role);
    
    // Check if user was trying to access a specific page before login
    const from = location.state?.from?.pathname;
    
    if (from && from !== '/' && from !== '/login' && from !== '/signup' && from !== dashboardRoute) {
      navigate(from, { replace: true });
    } else {
      navigate(dashboardRoute, { replace: true });
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        console.log('Auth state changed:', event, session?.user?.email);

        if (event === 'SIGNED_IN' && session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile && isMounted) {
            setUser(userProfile);
            handlePostLoginRedirect(userProfile);
            toast.success(`Welcome back, ${userProfile.full_name}!`);
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            navigate('/', { replace: true });
            toast.info('You have been signed out');
          }
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Refresh user profile when token is refreshed
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile && isMounted) {
            setUser(userProfile);
          }
        }

        if (isMounted) {
          setLoading(false);
        }
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (userProfile && isMounted) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('An unexpected error occurred during sign in');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, profileData?: any) => {
    try {
      setLoading(true);
      
      // Check if this is an admin registration
      const isAdminEmail = email === 'abathwabiz@gmail.com' || email === 'admin@abathwa.com';
      
      if (isAdminEmail) {
        if (!profileData?.adminKey || profileData.adminKey !== 'vvv.ndev') {
          const error = { message: 'Invalid Admin Key. Please enter the correct admin key.' };
          toast.error(error.message);
          return { error };
        }
        role = 'super_admin';
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            role,
            full_name: `${profileData?.first_name || ''} ${profileData?.last_name || ''}`.trim(),
            first_name: profileData?.first_name || '',
            last_name: profileData?.last_name || '',
            phone: profileData?.phone || '',
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Please check your email to confirm your account');
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('An unexpected error occurred during sign up');
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
