import { Request, Response, Router } from 'express';

/**
 * LeaderboardController
 * Port (interface) for the leaderboard controller
 */
export interface LeaderboardController {
  /**
   * Get the leaderboard
   * @param req - Express request
   * @param res - Express response
   */
  getLeaderboard(req: Request, res: Response): Promise<void>;
  
  /**
   * Get detailed leaderboard with pagination
   * @param req - Express request
   * @param res - Express response
   */
  getDetailedLeaderboard(req: Request, res: Response): Promise<void>;
  
  /**
   * Get the Express router
   * @returns Express router
   */
  getRouter(): Router;
}
