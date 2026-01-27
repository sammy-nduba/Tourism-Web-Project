import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, AdminUser } from '../../services/AuthService';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  adminProfile: AdminUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminProfile, setAdminProfile] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('[AuthProvider] Initializing authentication...');
        const session = await authService.getSession();
        if (session?.user) {
          console.log('[AuthProvider] Session found for user:', session.user.email);
          setUser(session.user);
          const profile = await authService.getAdminProfile(session.user.id);
          setAdminProfile(profile);
        } else {
          console.log('[AuthProvider] No active session found');
        }
      } catch (error) {
        console.error('[AuthProvider] Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const unsubscribe = authService.onAuthStateChange((newUser) => {
      (async () => {
        console.log('[AuthProvider] Auth state changed:', newUser ? `User: ${newUser.email}` : 'Logged out');
        setUser(newUser);
        if (newUser) {
          const profile = await authService.getAdminProfile(newUser.id);
          setAdminProfile(profile);
          console.log('[AuthProvider] Admin profile loaded:', profile?.role);
        } else {
          setAdminProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[AuthProvider] signIn called for:', email);
    try {
      const { user: newUser } = await authService.signIn(email, password);
      setUser(newUser);
      const profile = await authService.getAdminProfile(newUser.id);
      setAdminProfile(profile);
      console.log('[AuthProvider] Login successful for:', email);
    } catch (error) {
      console.error('[AuthProvider] Login failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('[AuthProvider] signOut called');
    try {
      await authService.signOut();
      setUser(null);
      setAdminProfile(null);
      console.log('[AuthProvider] Logout successful');
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, adminProfile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
