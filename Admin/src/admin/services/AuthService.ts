// Replaces Supabase Auth with custom JWT authentication

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000');

export interface User {
  id: string;
  email: string;
}

export interface Session {
  user: User;
  access_token: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  permissions: string[];
}

type AuthListener = (user: User | null) => void;

class AuthService {
  private listeners: Set<AuthListener> = new Set();

  async signIn(email: string, password: string): Promise<{ user: User; session: Session }> {
    console.log('[AuthService] Sign-in attempt:', { email, timestamp: new Date().toISOString() });

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Authentication failed');
    }

    const { token, user: profile } = await response.json();

    const user: User = {
      id: profile.id,
      email: profile.email,
    };

    const session: Session = {
      user,
      access_token: token,
    };

    // Save token and profile to localStorage
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(profile));

    // Notify listeners
    this.notify(user);

    return { user, session };
  }

  async signOut(): Promise<void> {
    console.log('[AuthService] Sign-out initiated');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    this.notify(null);
  }

  async getCurrentUser(): Promise<User | null> {
    const userJson = localStorage.getItem('admin_user');
    if (!userJson) return null;

    try {
      const profile = JSON.parse(userJson);
      return { id: profile.id, email: profile.email };
    } catch {
      return null;
    }
  }

  async getSession(): Promise<Session | null> {
    const token = localStorage.getItem('admin_token');
    const userJson = localStorage.getItem('admin_user');

    if (!token || !userJson) return null;

    try {
      const profile = JSON.parse(userJson);
      const user = { id: profile.id, email: profile.email };
      return { user, access_token: token };
    } catch {
      return null;
    }
  }

  async checkAdminRole(userId: string): Promise<boolean> {
    const userJson = localStorage.getItem('admin_user');
    if (!userJson) return false;

    try {
      const profile = JSON.parse(userJson);
      return profile.id === userId && (profile.role === 'admin' || profile.role === 'superadmin');
    } catch {
      return false;
    }
  }

  async getAdminProfile(userId: string): Promise<AdminUser | null> {
    const userJson = localStorage.getItem('admin_user');
    if (!userJson) return null;

    try {
      const profile = JSON.parse(userJson);
      if (profile.id !== userId) return null;
      return {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        permissions: profile.permissions || [],
      };
    } catch {
      return null;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify(user: User | null) {
    this.listeners.forEach((listener) => {
      try {
        listener(user);
      } catch (err) {
        console.error('[AuthService] Listener error:', err);
      }
    });
  }
}

export const authService = new AuthService();
export type { User as AuthUser };