/**
 * AuthUseCase
 * Port (interface) for authentication use cases
 */
export interface AuthUseCase {
  /**
   * Register a new user
   * @param username - Username to register
   * @returns User ID and authentication token
   */
  register(username: string): Promise<{ userId: string; token: string }>;
  
  /**
   * Login an existing user
   * @param username - Username to login with
   * @returns User ID and authentication token
   */
  login(username: string): Promise<{ userId: string; token: string }>;
  
  /**
   * Verify an authentication token
   * @param token - Token to verify
   * @returns Decoded token payload if valid
   */
  verifyToken(token: string): Promise<{ userId: string; username: string } | null>;
}
