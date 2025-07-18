import express, { Request, Response } from 'express';
import { authenticate } from '../auth/auth.middleware';
import { LeaderboardModel } from '../models/leaderboard.model';
import { userModel } from '../auth/auth.controller';
import { gameModel } from '../game/game.controller';

/**
 * Leaderboard controller class
 * Follows Single Responsibility Principle by focusing only on leaderboard routes
 */
class LeaderboardController {
  private router: express.Router;
  private leaderboardModel: LeaderboardModel;
  
  /**
   * Constructor with dependency injection
   * Follows Dependency Inversion Principle
   */
  constructor(leaderboardModel: LeaderboardModel) {
    this.router = express.Router();
    this.leaderboardModel = leaderboardModel;
    this.initializeRoutes();
  }
  
  /**
   * Initialize controller routes
   */
  private initializeRoutes(): void {
    // Get top 10 leaderboard (public endpoint)
    this.router.get('/', this.getLeaderboard.bind(this));
    
    // Get detailed leaderboard with pagination (authenticated endpoint)
    this.router.get('/detailed', authenticate, this.getDetailedLeaderboard.bind(this));
  }
  
  /**
   * Get the Express router
   * @returns Express router instance
   */
  public getRouter(): express.Router {
    return this.router;
  }
  
  /**
   * Get top leaderboard entries
   * @param req Express request object
   * @param res Express response object
   */
  private getLeaderboard(req: Request, res: Response): void {
    const leaderboardResponse = this.leaderboardModel.getLeaderboard();
    res.json(leaderboardResponse);
  }
  
  /**
   * Get detailed leaderboard with pagination
   * @param req Express request object
   * @param res Express response object
   */
  private getDetailedLeaderboard(req: Request, res: Response): void {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
    
    const leaderboard = this.leaderboardModel.getDetailedLeaderboard(limit, offset);
    res.json({
      leaderboard: leaderboard,
      timestamp: new Date().toISOString(),
      totalPlayers: leaderboard.totalPlayers,
      limit,
      offset,
      hasMore: leaderboard.hasMore
    });
  }
}

// Create instances
const leaderboardModel = new LeaderboardModel(gameModel, userModel);
const leaderboardController = new LeaderboardController(leaderboardModel);

// Export the router for use in other modules
export default leaderboardController.getRouter();