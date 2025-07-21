import { Request, Response, Router } from 'express';
import { LeaderboardUseCase } from '../../../../application/ports/in/LeaderboardUseCase';
import { LeaderboardController } from '../../../../application/ports/in/LeaderboardController';
import { AuthMiddleware } from './AuthMiddleware';

/**
 * ExpressLeaderboardController
 * Adapter implementing the LeaderboardController port using Express
 */
export class ExpressLeaderboardController implements LeaderboardController {
  private router: Router;
  
  constructor(
    private readonly leaderboardService: LeaderboardUseCase,
    private readonly authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.initializeRoutes();
  }
  
  /**
   * Initialize controller routes
   */
  private initializeRoutes(): void {
    // Apply authentication middleware to all routes
    this.router.use(this.authMiddleware.authenticate);
    
    // Leaderboard routes
    this.router.get('/', this.getLeaderboard.bind(this));
    this.router.get('/detailed', this.getDetailedLeaderboard.bind(this));
  }
  
  /**
   * Get the leaderboard
   * @param req - Express request
   * @param res - Express response
   */
  async getLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const leaderboard = await this.leaderboardService.getLeaderboard();
      res.status(200).json(leaderboard);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while retrieving the leaderboard';
      res.status(500).json({ error: errorMessage });
    }
  }
  
  /**
   * Get detailed leaderboard with pagination
   * @param req - Express request
   * @param res - Express response
   */
  async getDetailedLeaderboard(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string || '10', 10);
      const offset = parseInt(req.query.offset as string || '0', 10);
      
      const leaderboard = await this.leaderboardService.getDetailedLeaderboard(limit, offset);
      res.status(200).json(leaderboard);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while retrieving the detailed leaderboard';
      res.status(500).json({ error: errorMessage });
    }
  }
  
  /**
   * Get the Express router
   * @returns Express router
   */
  getRouter(): Router {
    return this.router;
  }
}
