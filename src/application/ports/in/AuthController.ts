import { Request, Response, NextFunction, Router } from 'express';

/**
 * AuthController
 * Port (interface) for the authentication controller
 */
export interface AuthController {
  /**
   * Register a new user
   * @param req - Express request
   * @param res - Express response
   */
  register(req: Request, res: Response): Promise<void>;
  
  /**
   * Login an existing user
   * @param req - Express request
   * @param res - Express response
   */
  login(req: Request, res: Response): Promise<void>;
  
  /**
   * Get the Express router
   * @returns Express router
   */
  getRouter(): Router;
}
