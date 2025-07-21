import { Request, Response, NextFunction } from 'express';
import { 
  ApplicationError, 
  AuthenticationError, 
  AuthorizationError, 
  NotFoundError, 
  ValidationError,
  GameSessionError
} from '../../../../infrastructure/utils/ErrorTypes';

/**
 * Error handling middleware for Express
 * Maps domain errors to appropriate HTTP responses
 */
export class ErrorMiddleware {
  /**
   * Handle errors and send appropriate HTTP responses
   */
  static handleError = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);

    // Map error types to HTTP status codes
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else if (err instanceof AuthenticationError) {
      res.status(401).json({ error: err.message });
    } else if (err instanceof AuthorizationError) {
      res.status(403).json({ error: err.message });
    } else if (err instanceof NotFoundError) {
      res.status(404).json({ error: err.message });
    } else if (err instanceof GameSessionError) {
      res.status(400).json({ error: err.message });
    } else if (err instanceof ApplicationError) {
      res.status(400).json({ error: err.message });
    } else {
      // Generic error handler
      res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }
  };

  /**
   * Handle 404 errors for routes that don't exist
   */
  static handleNotFound = (req: Request, res: Response): void => {
    res.status(404).json({ error: 'Resource not found' });
  };
}
