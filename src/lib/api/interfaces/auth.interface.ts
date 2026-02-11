/**
 * Auth repository interface.
 * Implemented by mock (demo user) and Supabase implementations.
 */

export interface AuthUser {
  id: string
  email: string
  [key: string]: unknown
}

export interface IAuthRepository {
  getCurrentUser(): Promise<AuthUser | null>
  signIn(email: string, password: string): Promise<{ user: AuthUser }>
  signOut(): Promise<void>
  signUp(email: string, password: string): Promise<{ user: AuthUser }>
}
