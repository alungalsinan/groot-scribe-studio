import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  created_at: string;
  last_login?: string;
  is_active: boolean;
}

interface UserRole {
  user_id: string;
  role: 'author' | 'super_admin';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  role: 'author' | 'super_admin' | null;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthor: boolean;
  isSuperAdmin: boolean;
  refreshUserData: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<'author' | 'super_admin' | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchUserProfile = useCallback(async (userId: string): Promise<void> => {
    try {
      console.log('🔍 Fetching user profile for:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          console.log('📝 Creating new profile for user:', userId);
          
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user?.email || '',
              name: user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
              is_active: true,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (createError) {
            console.error('❌ Failed to create profile:', createError);
            throw createError;
          }
          
          console.log('✅ Profile created successfully:', newProfile);
          setProfile(newProfile);
        } else {
          console.error('❌ Profile fetch error:', error);
          throw error;
        }
      } else {
        console.log('✅ Profile fetched successfully:', data);
        setProfile(data);
      }
    } catch (err) {
      console.error('❌ Error in fetchUserProfile:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load user profile';
      setError(errorMessage);
      toast({
        title: 'Profile Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [user]);

  const fetchUserRole = useCallback(async (userId: string): Promise<void> => {
    try {
      console.log('🔍 Fetching user role for:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If role doesn't exist, create default author role
        if (error.code === 'PGRST116') {
          console.log('📝 Creating default author role for user:', userId);
          
          const { data: newRole, error: createError } = await supabase
            .from('user_roles')
            .insert({
              user_id: userId,
              role: 'author'
            })
            .select()
            .single();

          if (createError) {
            console.error('❌ Failed to create role:', createError);
            // Don't throw, just set default role
            console.log('⚠️ Setting default author role');
            setRole('author');
            return;
          }
          
          console.log('✅ Role created successfully:', newRole);
          setRole('author');
        } else {
          console.error('❌ Role fetch error:', error);
          // Don't throw, just set default role
          console.log('⚠️ Setting default author role due to error');
          setRole('author');
        }
      } else {
        console.log('✅ Role fetched successfully:', data.role);
        setRole(data.role);
      }
    } catch (err) {
      console.error('❌ Error in fetchUserRole:', err);
      // Set default role on any error
      console.log('⚠️ Setting default author role due to catch');
      setRole('author');
    }
  }, []);

  const refreshUserData = useCallback(async (): Promise<void> => {
    if (!user) return;
    
    console.log('🔄 Refreshing user data for:', user.id);
    setLoading(true);
    
    try {
      await Promise.all([
        fetchUserProfile(user.id),
        fetchUserRole(user.id)
      ]);
    } catch (err) {
      console.error('❌ Error refreshing user data:', err);
    } finally {
      setLoading(false);
    }
  }, [user, fetchUserProfile, fetchUserRole]);

  useEffect(() => {
    let mounted = true;
    console.log('🚀 SupabaseAuthProvider initializing...');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.id);
        
        if (!mounted) {
          console.log('⚠️ Component unmounted, ignoring auth change');
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);
        clearError();

        if (session?.user) {
          console.log('👤 User authenticated, fetching profile and role...');
          setLoading(true);
          
          try {
            await Promise.all([
              fetchUserProfile(session.user.id),
              fetchUserRole(session.user.id)
            ]);
          } catch (err) {
            console.error('❌ Error fetching user data:', err);
          } finally {
            if (mounted) {
              setLoading(false);
              setInitialized(true);
            }
          }
        } else {
          console.log('🚪 User logged out, clearing data...');
          setProfile(null);
          setRole(null);
          setLoading(false);
          setInitialized(true);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking for existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session check error:', error);
          setError(error.message);
        }
        
        if (!mounted) {
          console.log('⚠️ Component unmounted during session check');
          return;
        }

        console.log('📱 Session check result:', session?.user?.id || 'No session');
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          console.log('👤 Existing session found, fetching user data...');
          setLoading(true);
          
          try {
            await Promise.all([
              fetchUserProfile(session.user.id),
              fetchUserRole(session.user.id)
            ]);
          } catch (err) {
            console.error('❌ Error fetching existing user data:', err);
          }
        }
      } catch (err) {
        console.error('❌ Auth initialization error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize authentication';
        setError(errorMessage);
      } finally {
        if (mounted) {
          console.log('✅ Auth initialization complete');
          setLoading(false);
          setInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('🧹 SupabaseAuthProvider cleanup');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserProfile, fetchUserRole, clearError]);

  const signIn = async (email: string, password: string): Promise<void> => {
    console.log('🔑 Signing in user:', email);
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      console.log('✅ Sign in successful');
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in',
      });
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Failed to sign in';
      console.error('❌ Sign in error:', errorMessage);
      setError(errorMessage);
      toast({
        title: 'Sign In Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    console.log('📝 Signing up user:', email);
    setLoading(true);
    setError(null);
    
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      console.log('✅ Sign up successful');
      toast({
        title: 'Account Created',
        description: 'Please check your email to verify your account.',
      });
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Failed to create account';
      console.error('❌ Sign up error:', errorMessage);
      setError(errorMessage);
      toast({
        title: 'Sign Up Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    console.log('🚪 Signing out user');
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log('✅ Sign out successful');
      toast({
        title: 'Goodbye!',
        description: 'Successfully signed out',
      });
    } catch (err) {
      const authError = err as AuthError;
      const errorMessage = authError.message || 'Failed to sign out';
      console.error('❌ Sign out error:', errorMessage);
      setError(errorMessage);
      toast({
        title: 'Sign Out Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const isAuthor = role === 'author';
  const isSuperAdmin = role === 'super_admin';

  const contextValue: AuthContextType = {
    user,
    session,
    profile,
    role,
    loading,
    initialized,
    signIn,
    signUp,
    signOut,
    isAuthor,
    isSuperAdmin,
    refreshUserData,
    error,
    clearError,
  };

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🐛 Auth Context State:', {
      user: user?.id,
      profile: profile?.name,
      role,
      loading,
      initialized,
      error
    });
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSupabaseAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
}
