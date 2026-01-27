import { supabase } from '../../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '../../lib/database.types';

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

export class AuthService {
  async signIn(email: string, password: string): Promise<{ user: User; session: Session }> {
    console.log('[AuthService] Sign-in attempt:', { email, timestamp: new Date().toISOString() });
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('[AuthService] Sign-in failed - Auth error:', { email, error: error.message });
      throw error;
    }
    
    if (!data.user || !data.session) {
      console.error('[AuthService] Sign-in failed - No user or session returned', { email });
      throw new Error('Authentication failed');
    }

    console.log('[AuthService] Auth successful, checking admin role:', { userId: data.user.id, email });
    const isAdmin = await this.checkAdminRole(data.user.id);
    
    if (!isAdmin) {
      console.warn('[AuthService] Access denied - User is not admin:', { userId: data.user.id, email });
      await supabase.auth.signOut();
      throw new Error('Unauthorized: Admin access required');
    }

    console.log('[AuthService] Admin login successful:', { userId: data.user.id, email, timestamp: new Date().toISOString() });
    return { user: data.user, session: data.session };
  }

  async signOut(): Promise<void> {
    console.log('[AuthService] Sign-out initiated:', { timestamp: new Date().toISOString() });
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('[AuthService] Sign-out error:', error);
      throw error;
    }
    console.log('[AuthService] Sign-out successful');
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async checkAdminRole(userId: string): Promise<boolean> {
    try {
      console.log('[AuthService] Checking admin role for user:', userId);
      const { data, error } = await supabase
        .from('admin_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('[AuthService] Error checking admin role:', { userId, error: error.message });
        return false;
      }

      const isAdmin = !!data;
      console.log('[AuthService] Admin role check result:', { userId, isAdmin, role: data?.role || 'N/A' });
      return isAdmin;
    } catch (err) {
      console.error('[AuthService] Exception checking admin role:', { userId, error: err });
      return false;
    }
  }

  async getAdminProfile(userId: string): Promise<AdminUser | null> {
    try {
      console.log('[AuthService] Fetching admin profile:', userId);
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle<Database['public']['Tables']['admin_roles']['Row']>();

      if (error) {
        console.error('[AuthService] Error fetching admin profile:', { userId, error: error.message });
        return null;
      }

      if (!data) {
        console.warn('[AuthService] No admin profile found for user:', userId);
        return null;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('[AuthService] Could not get current user for profile');
        return null;
      }

      const profile = {
        id: user.id,
        email: user.email || '',
        role: data.role,
        permissions: (data.permissions as string[]) || [],
      };
      
      console.log('[AuthService] Admin profile loaded successfully:', { userId, role: profile.role, permissions: profile.permissions });
      return profile;
    } catch (err) {
      console.error('[AuthService] Exception getting admin profile:', { userId, error: err });
      return null;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      callback(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}

export const authService = new AuthService();