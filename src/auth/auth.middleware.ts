import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth.utils';
import { IAuthPayload } from '../interfaces/user.interface';

/**
 * Extend Express Request interface to include user property
 */
declare global {
  namespace Express {
    interface Request {
      user?: IAuthPayload;
    }
  }
}

/**
 * Authentication middleware class
 * Follows Single Responsibility Principle by focusing only on authentication
 */
export class AuthMiddleware {
  /**
   * Authenticate a request using JWT token
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authorization header missing or invalid' });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }
    
    req.user = decoded;
    next();
  }
  
  /**
   * Authorize a user to access a specific user's resources
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  public static authorizeUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    const { userId } = req.params;
    
    if (req.user.userId !== userId) {
      res.status(403).json({ error: 'Not authorized to access this resource' });
      return;
    }
    
    next();
  }
}

// Export middleware functions for easier usage
export const authenticate = AuthMiddleware.authenticate;
export const authorizeUser = AuthMiddleware.authorizeUser;