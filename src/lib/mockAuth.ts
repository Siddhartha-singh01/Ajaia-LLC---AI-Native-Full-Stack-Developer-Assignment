// Mock auth — no real login system.
// Current user is stored in localStorage on the client.
// API routes read it from the x-user-id request header.

export const MOCK_USERS = [
  { id: 'user_alice', email: 'alice@ajaia.com', name: 'Alice Johnson' },
  { id: 'user_bob',   email: 'bob@ajaia.com',   name: 'Bob Smith'     },
  { id: 'user_carol', email: 'carol@ajaia.com', name: 'Carol White'   },
]

export const DEFAULT_USER_ID = 'user_alice'

/**
 * Read current user ID from request header.
 * Falls back to Alice if header is missing.
 */
export function getCurrentUserId(request: Request): string {
  return request.headers.get('x-user-id') || DEFAULT_USER_ID
}
