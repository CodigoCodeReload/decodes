import { v4 as uuidv4 } from 'uuid';
import { User } from '../../domain/entities/User';
import { AuthUseCase } from '../ports/in/AuthUseCase';
import { UserRepository } from '../ports/out/UserRepository';
import { TokenService } from '../ports/out/TokenService';

/**
 * AuthService
 * Application service implementing the AuthUseCase port
 */
export class AuthService implements AuthUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Register a new user
   * @param username - Username to register
   * @returns User ID and authentication token
   */
  async register(username: string): Promise<{ userId: string; token: string }> {
    // Check if username exists
    const exists = await this.userRepository.existsByUsername(username);
    if (exists) {
      throw new Error('Username already exists');
    }

    // Create new user
    const userId = uuidv4();
    const user = new User(userId, username);
    await this.userRepository.save(user);

    // Generate token
    const token = this.tokenService.generateToken(userId, username);

    return { userId, token };
  }

  /**
   * Login an existing user
   * @param username - Username to login with
   * @returns User ID and authentication token
   */
  async login(username: string): Promise<{ userId: string; token: string }> {
    // Find user by username
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate token
    const token = this.tokenService.generateToken(user.id, user.username);

    return { userId: user.id, token };
  }

  /**
   * Verify an authentication token
   * @param token - Token to verify
   * @returns Decoded token payload if valid
   */
  async verifyToken(token: string): Promise<{ userId: string; username: string } | null> {
    try {
      console.log('🔍 AuthService: Verifying token...');
      const payload = this.tokenService.verifyToken(token);
      console.log('🔍 Token payload:', payload);
      
      if (!payload) {
        console.log('❌ AuthService: No payload returned');
        return null;
      }
      
      if (!payload.userId && !payload.sub) {
        console.log('❌ AuthService: No userId or sub in payload');
        return null;
      }
      
      if (!payload.username) {
        console.log('❌ AuthService: No username in payload');
        return null;
      }

      // Handle both 'userId' and 'sub' fields (JWT standard uses 'sub')
      const userId = payload.userId || payload.sub;
      
      console.log('✅ AuthService: Token valid for user:', userId);
      return {
        userId,
        username: payload.username
      };
    } catch (error) {
      console.log('❌ AuthService: Token verification error:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }
}
