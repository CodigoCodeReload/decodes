import { Request, Response, Router } from 'express';
import { GameUseCase } from '../../../../application/ports/in/GameUseCase';
import { GameController } from '../../../../application/ports/in/GameController';
import { AuthMiddleware } from './AuthMiddleware';

/**
 * ExpressGameController
 * Adapter implementing the GameController port using Express
 */
export class ExpressGameController implements GameController {
  private router: Router;
  
  constructor(
    private readonly gameService: GameUseCase,
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
    
    // Game routes
    this.router.post('/start', this.startGame.bind(this));
    this.router.post('/stop', this.stopGame.bind(this));
    this.router.get('/results/:userId', this.authMiddleware.authorizeUser, this.getUserResults.bind(this));
  }
  
  /**
   * Start a game session
   * @param req - Express request
   * @param res - Express response
   */
  async startGame(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      
      const result = await this.gameService.startGame(userId);
      
      res.status(201).json({
        sessionToken: result.sessionToken,
        startTime: result.startTime,
        expiresAt: result.expiresAt,
        message: 'Game started successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while starting the game';
      res.status(400).json({ error: errorMessage });
    }
  }
  
  /**
   * Stop a game session
   * @param req - Express request
   * @param res - Express response
   */
  async stopGame(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(400).json({ error: 'User ID is required' });
        return;
      }
      
      const result = await this.gameService.stopGame(userId);
      
      res.status(200).json({
        startTime: result.startTime,
        endTime: result.endTime,
        duration: result.duration,
        deviation: result.deviation,
        score: result.score,
        message: 'Game stopped successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while stopping the game';
      res.status(400).json({ error: errorMessage });
    }
  }
  
  /**
   * Get user game results
   * @param req - Express request
   * @param res - Express response
   */
  async getUserResults(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      
      const results = await this.gameService.getUserResults(userId);
      
      if (!results) {
        res.status(404).json({ error: 'No results found for this user' });
        return;
      }
      
      res.status(200).json(results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred while retrieving game results';
      res.status(400).json({ error: errorMessage });
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
