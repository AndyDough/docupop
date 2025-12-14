export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  user: AuthUser;
}

const API_BASE = (process.env.NEXT_PUBLIC_LOCAL_API_BASE || '').replace(/\/$/, '');
const API_PREFIX = `${API_BASE}/api/auth`;

const buildUrl = (path: string) => `${API_PREFIX}${path}`;

async function request<T>(path: string, options?: RequestInit) {
  const response = await fetch(buildUrl(path), {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || 'Authentication request failed');
  }

  return data as T;
}

class AuthService {
  private currentUser: AuthUser | null = null;

  async loadCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await fetch(buildUrl('/me'), { credentials: 'include' });
      if (!response.ok) {
        this.currentUser = null;
        return null;
      }

      const data = (await response.json()) as { user: AuthUser | null };
      this.currentUser = data.user;
      return this.currentUser;
    } catch {
      this.currentUser = null;
      return null;
    }
  }

  async signIn(email: string, password: string): Promise<AuthUser> {
    const data = await request<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.currentUser = data.user;
    return data.user;
  }

  async signUp(email: string, password: string, name: string): Promise<AuthUser> {
    const data = await request<AuthResponse>('/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    this.currentUser = data.user;
    return data.user;
  }

  async signOut(): Promise<void> {
    await request<{ success: boolean }>('/logout', { method: 'POST' });
    this.currentUser = null;
  }
}

export const authService = new AuthService();

