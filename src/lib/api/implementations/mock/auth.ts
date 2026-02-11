/**
 * Mock auth repository - returns demo user, no Supabase.
 */

import { DEMO_DOCTOR_ID } from "@/lib/constants"
import type { IAuthRepository, AuthUser } from "../../interfaces/auth.interface"

const DEMO_USER: AuthUser = {
  id: DEMO_DOCTOR_ID,
  email: "demo@tabibdesk.com",
}

export class MockAuthRepository implements IAuthRepository {
  async getCurrentUser(): Promise<AuthUser | null> {
    return DEMO_USER
  }

  async signIn(_email: string, _password: string): Promise<{ user: AuthUser }> {
    return { user: DEMO_USER }
  }

  async signOut(): Promise<void> {
    // No-op in demo
  }

  async signUp(_email: string, _password: string): Promise<{ user: AuthUser }> {
    return { user: DEMO_USER }
  }
}
