import express, { Request, Response } from 'express';
import { authenticate, authorizeUser } from '../auth/auth.middleware';
import { GameModel } from '../models/game.model';

/**
 * Game controller class
 * Follows Single Responsibility Principle by focusing only on game routes
 */
class GameController {
  private router: express.Router;
  private gameModel: GameModel;
  
  /**
   * Constructor with dependency injection
   * Follows Dependency Inversion Principle
   */
  constructor(gameModel: GameModel) {
    this.router = express.Router();
    this.gameModel = gameModel;
    this.initializeRoutes();
  }
  
  /**
   * Initialize controller routes
   */
  private initializeRoutes(): void {
    // Apply authentication to all game routes
    this.router.use(authenticate);
    
    // Start a game session
    this.router.post('/:userId/start', authorizeUser, this.startGame.bind(this));
    
    // Stop a game session
    this.router.post('/:userId/stop', authorizeUser, this.stopGame.bind(this));
    
    // Get user game history
    this.router.get('/:userId', authorizeUser, this.getUserResults.bind(this));
  }
  
  /**
   * Get the Express router
   * @returns Express router instance
   */
  public getRouter(): express.Router {
    return this.router;
  }
  
  /**
   * Start a game session
   * @param req Express request object
   * @param res Express response object
   */
  private startGame(req: Request, res: Response): void {
    const { userId } = req.params;
    const result = this.gameModel.startGame(userId);
    res.json(result);
  }
  
  /**
   * Stop a game session
   * @param req Express request object
   * @param res Express response object
   */
  private stopGame(req: Request, res: Response): void {
    const { userId } = req.params;
    const result = this.gameModel.stopGame(userId);
    res.json(result);
  }
  
  /**
   * Get user game results
   * @param req Express request object
   * @param res Express response object
   */
  private getUserResults(req: Request, res: Response): void {
    const { userId } = req.params;
    const results = this.gameModel.getUserResults(userId);
    
    if (!results) {
      res.status(404).json({ error: 'No game history found for this user' });
      return;
    }
    
    const totalGames = results.deviations.length;
    const totalScore = results.scores.reduce((sum: number, score: number) => sum + score, 0);
    const averageDeviation = Math.round(
      results.deviations.reduce((sum: number, dev: number) => sum + dev, 0) / totalGames
    );
    
    res.json({
      userId,
      totalGames,
      averageDeviation,
      bestDeviation: results.bestDeviation,
      totalScore,
      deviations: results.deviations,
      scores: results.scores
    });
  }
}

// Create instances
const gameModel = new GameModel();
const gameController = new GameController(gameModel);

// Export the router and model for use in other modules
export { gameModel };
export default gameController.getRouter();