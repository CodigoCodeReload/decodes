import { Request, Response, NextFunction } from 'express';
import { AuthUseCase } from '../../../../application/ports/in/AuthUseCase';

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
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const token = authHeader.split(' ')[1];
      const decodedToken = await this.authService.verifyToken(token);

      if (!decodedToken) {
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
