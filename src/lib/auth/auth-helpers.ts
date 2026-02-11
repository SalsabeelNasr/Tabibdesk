/**
 * Auth helper functions - use repository factory (mock or Supabase).
 */

import { getAuthRepository } from "@/lib/api/repository-factory"

export async function getCurrentUser() {
  const repo = await getAuthRepository()
  return repo.getCurrentUser()
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    return { id: "demo-user-id", email: "demo@tabibdesk.com" }
  }
  return user
}

export async function signOut() {
  const repo = await getAuthRepository()
  await repo.signOut()
}

export async function signInWithEmail(email: string, password: string) {
  const repo = await getAuthRepository()
  const { user } = await repo.signIn(email, password)
  return { data: { user }, error: null }
}

export async function signUpWithEmail(email: string, password: string) {
  const repo = await getAuthRepository()
  const { user } = await repo.signUp(email, password)
  return { data: { user }, error: null }
}
