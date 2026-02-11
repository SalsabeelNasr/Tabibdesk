/**
 * Unified error types for repository and API layers.
 * Enables consistent error handling and translation from backend-specific errors (e.g. Supabase).
 */

export class RepositoryError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message)
    this.name = "RepositoryError"
  }
}

export class NotFoundError extends RepositoryError {
  constructor(resource: string, id: string) {
    super(`${resource} not found: ${id}`, "NOT_FOUND", { resource, id })
    this.name = "NotFoundError"
  }
}

export class ValidationError extends RepositoryError {
  constructor(message: string, details?: unknown) {
    super(message, "VALIDATION_ERROR", details)
    this.name = "ValidationError"
  }
}

export class UnauthorizedError extends RepositoryError {
  constructor(message = "Unauthorized") {
    super(message, "UNAUTHORIZED")
    this.name = "UnauthorizedError"
  }
}

/**
 * Translate unknown errors (e.g. from Supabase) to RepositoryError.
 * Use in Supabase implementation to normalize errors.
 */
export function translateError(error: unknown): RepositoryError {
  if (error instanceof RepositoryError) return error
  const message = error instanceof Error ? error.message : String(error)
  return new RepositoryError(message, "UNKNOWN_ERROR", error)
}
