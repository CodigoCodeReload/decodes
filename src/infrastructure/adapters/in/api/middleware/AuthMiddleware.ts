import { Request, Response, NextFunction } from 'express';
import { TokenService, TokenPayload } from '../../../../../application/ports/out/TokenService';
import { AuthenticationError, AuthorizationError } from '../../../../../infrastructure/utils/ErrorTypes';

/**
 * Authentication middleware - Input adapter
 * Handles authentication and authorization for API requests
 */
export class AuthMiddleware {
  private tokenService: TokenService;

  /**
   * Constructor with dependency injection
   * @param tokenService Token service for verifying JWT tokens
   */
  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
    
    // Bind methods to preserve 'this' context when used as middleware
    this.authenticate = this.authenticate.bind(this);
    this.authorizeUser = this.authorizeUser.bind(this);
  }

  /**
   * Middleware to authenticate requests using JWT token
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AuthenticationError('No token provided');
      }
      
      const token = authHeader.split(' ')[1];
      const payload = this.tokenService.verifyToken(token);
      
      // Add user info to request object for use in controllers
      req.user = {
        id: payload.sub,
        username: payload.username
      };
      
      next();
    } catch (error) {
      if (error instanceof Error) {
        next(new AuthenticationError('Authentication failed', error));
      } else {
        next(new AuthenticationError('Authentication failed'));
      }
    }
  }

  /**
   * Authorize a user based on the user ID in the request parameters
   * @param req - Express request
   * @param res - Express response
   * @param next - Express next function
   */
  public authorizeUser(req: Request, res: Response, next: NextFunction): void {
    const { userId } = req.params;
    const user = req.user;

    if (!user) {
      next(new AuthenticationError('User not authenticated'));
      return;
    }

    if (user.id !== userId) {
      next(new AuthorizationError('Not authorized to access this resource'));
      return;
    }

    next();
  }
}

// Extend Express Request interface to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
      };
    }
  }
}
