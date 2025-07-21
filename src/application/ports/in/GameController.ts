import { Request, Response, Router } from 'express';

/**
 * GameController
 * Port (interface) for the game controller
 */
export interface GameController {
  /**
   * Start a game session
   * @param req - Express request
   * @param res - Express response
   */
  startGame(req: Request, res: Response): Promise<void>;
  
  /**
   * Stop a game session
   * @param req - Express request
   * @param res - Express response
   */
  stopGame(req: Request, res: Response): Promise<void>;
  
  /**
   * Get user game results
   * @param req - Express request
   * @param res - Express response
   */
  getUserResults(req: Request, res: Response): Promise<void>;
  
  /**
   * Get the Express router
   * @returns Express router
   */
  getRouter(): Router;
}
