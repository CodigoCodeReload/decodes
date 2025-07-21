import { Request, Response } from 'express';
import { ApplicationError, AuthenticationError, AuthorizationError, NotFoundError, ValidationError, GameSessionError } from './ErrorTypes';

/**
 * Error handler utility class
 * Provides centralized error handling for the application
 */
export class ErrorHandler {
  /**
   * Handle errors in a consistent way across the application
   * Maps different error types to appropriate HTTP responses
   * @param error Error to handle
   * @param req Express request object
   * @param res Express response object
   */
  public static handleError(error: Error, req: Request, res: Response): void {
    console.error(`Error: ${error.message}`, error);
    
    // Handle specific error types
    if (error instanceof AuthenticationError) {
      res.status(401).json({
        success: false,
        message: error.message,
        error: 'AUTHENTICATION_ERROR'
      });
      return;
    }
    
    if (error instanceof AuthorizationError) {
      res.status(403).json({
        success: false,
        message: error.message,
        error: 'AUTHORIZATION_ERROR'
      });
      return;
    }
    
    if (error instanceof NotFoundError) {
      res.status(404).json({
        success: false,
        message: error.message,
        error: 'NOT_FOUND_ERROR'
      });
      return;
    }
    
    if (error instanceof ValidationError) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: 'VALIDATION_ERROR'
      });
      return;
    }
    
    if (error instanceof GameSessionError) {
      res.status(400).json({
        success: false,
        message: error.message,
        error: 'GAME_SESSION_ERROR'
      });
      return;
    }
    
    // Handle generic errors
    const statusCode = error instanceof ApplicationError ? (error as ApplicationError).statusCode : 500;
    
    res.status(statusCode).json({
      success: false,
      message: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message,
      error: 'SERVER_ERROR'
    });
  }
}

// GameSessionError is now imported from ErrorTypes.ts
