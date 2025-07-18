/**
 * User interface representing a registered user in the system
 */
export interface IUser {
  userId: string;
  username: string;
}

/**
 * Authentication payload interface for JWT tokens
 */
export interface IAuthPayload {
  userId: string;
  username: string;
  action?: string;
  startTime?: number;
}

/**
 * Authentication response interface for login/register operations
 */
export interface IAuthResponse {
  message: string;
  userId: string;
  username: string;
  token: string;
}
