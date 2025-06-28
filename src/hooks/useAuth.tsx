import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import type { User, UserRole } from '../shared/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, role: UserRole) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
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

  // Handle post-login redirection
  const handlePostLoginRedirect = (user: User) => {
    const dashboardRoute = getDashboardRoute(user.role);
    
    // Check if user was trying to access a specific page before login
    const from = location.state?.from?.pathname;
    
    if (from && from !== '/' && from !== dashboardRoute) {
      // User was trying to access a specific page, redirect there
      navigate(from, { replace: true });
    } else {
      // Default redirect to user's dashboard
      navigate(dashboardRoute, { replace: true });
    }
  };

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user profile from our users table
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userProfile && !error) {
            setUser(userProfile);
          }
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user profile
          const { data: userProfile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userProfile && !error) {
            setUser(userProfile);
            handlePostLoginRedirect(userProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          navigate('/', { replace: true });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // User will be redirected in the auth state change listener
        return { error: null };
      }

      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Create user profile in our users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              role,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);

        if (profileError) {
          console.error('Error creating user profile:', profileError);
          return { error: profileError };
        }
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 