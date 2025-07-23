import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../../../application/ports/in/AuthUseCase';
import { IAuthPayload } from '../../../../interfaces/user.interface';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: IAuthPayload;
    }
  }
}

/**
 * Authentication middleware for Express
 * Verifies JWT tokens and attaches user information to the request
 */
export class AuthMiddleware {
  constructor(private readonly authService: AuthUseCase) {}

  /**
   * Middleware function to authenticate requests
   */
  authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('🔐 Auth middleware - checking request:', req.method, req.path);
      
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      console.log('🔐 Auth header:', authHeader ? 'Present' : 'Missing');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ Auth failed: No Bearer token');
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const token = authHeader.split(' ')[1];
      console.log('🔐 Token extracted, length:', token.length);
      
      const decodedToken = await this.authService.verifyToken(token);
      console.log('🔐 Token verification result:', decodedToken ? 'Valid' : 'Invalid');

      if (!decodedToken) {
        console.log('❌ Auth failed: Invalid token');
        res.status(401).json({ error: 'Invalid or expired token' });
        return;
      }

      // Attach user info to request
      req.user = {
        userId: decodedToken.userId,
        username: decodedToken.username
      };

      next();
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  };

  /**
   * Middleware to ensure user can only access their own resources
   */
  authorizeUser = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { userId } = req.params;
      const authenticatedUserId = req.user?.userId;

      if (!authenticatedUserId || userId !== authenticatedUserId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      next();
    } catch (error) {
      res.status(403).json({ error: 'Authorization failed' });
    }
  };
}
