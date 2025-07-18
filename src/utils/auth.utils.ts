import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { IAuthPayload } from '../interfaces/user.interface';
import config from '../config/config';

/**
 * Generate a JWT token for authentication
 * @param payload The data to include in the token
 * @param expiresIn Token expiration time (default from config)
 * @returns JWT token string
 */
export const generateToken = (
  payload: IAuthPayload, 
  expiresIn: string = config.auth.tokenExpiry
): string => {
  return jwt.sign(payload, config.auth.jwtSecret as jwt.Secret, { expiresIn });
};

/**
 * Verify a JWT token
 * @param token The token to verify
 * @returns Decoded token payload or null if invalid
 */
export const verifyToken = (token: string): IAuthPayload | null => {
  try {
    return jwt.verify(token, config.auth.jwtSecret) as IAuthPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Generate a session token for game sessions
 * @param userId User ID
 * @param startTime Game start time
 * @returns Session token string
 */
export const generateSessionToken = (userId: string, startTime: number): string => {
  return generateToken(
    { userId, username: '', action: 'game', startTime }, 
    '30m'
  );
};
