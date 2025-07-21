import express, { Request, Response, Router } from 'express';
import { GameUseCase } from '../../../../application/ports/in/GameUseCase';
import { AuthMiddleware } from './middleware/AuthMiddleware';
import { GameSessionDTO } from '../../../../application/dtos/GameSessionDTO';
import { GameResultDTO } from '../../../../application/dtos/GameResultDTO';
import { ErrorHandler } from '../../../utils/ErrorHandler';

/**
 * Game controller class - Input adapter implementing the GameController port
 * Handles HTTP requests for game operations and delegates to the GameUseCase
 */
export class GameController {
  private router: Router;
  private gameUseCase: GameUseCase;
  private authMiddleware: AuthMiddleware;

  /**
   * Constructor with dependency injection
   * Follows Dependency Inversion Principle
   */
  constructor(gameUseCase: GameUseCase, authMiddleware: AuthMiddleware) {
    this.router = express.Router();
    this.gameUseCase = gameUseCase;
    this.authMiddleware = authMiddleware;
    this.initializeRoutes();
  }

  /**
   * Initialize controller routes
   */
  private initializeRoutes(): void {
    // Apply authentication to all game routes
    this.router.use(this.authMiddleware.authenticate);
    
    // Start a game session
    this.router.post('/:userId/start', this.authMiddleware.authorizeUser, this.startGame.bind(this));
    
    // Stop a game session
    this.router.post('/:userId/stop', this.authMiddleware.authorizeUser, this.stopGame.bind(this));
    
    // Get user game history
    this.router.get('/:userId/history', this.authMiddleware.authorizeUser, this.getUserResults.bind(this));
  }

  /**
   * Get the Express router
   * @returns Express router instance
   */
  public getRouter(): Router {
    return this.router;
  }

  /**
   * Start a game session
   * @param req Express request object
   * @param res Express response object
   */
  private async startGame(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      const gameSession = await this.gameUseCase.startGame(userId);
      
      res.status(201).json({
        success: true,
        message: 'Game session started successfully',
        data: {
          sessionToken: gameSession.sessionToken,
          startTime: gameSession.startTime,
          expiresAt: gameSession.expiresAt
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        ErrorHandler.handleError(error, req, res);
      } else {
        ErrorHandler.handleError(new Error('Unknown error occurred'), req, res);
      }
    }
  }

  /**
   * Stop a game session
   * @param req Express request object
   * @param res Express response object
   */
  private async stopGame(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      const gameResult = await this.gameUseCase.stopGame(userId);
      
      res.status(200).json({
        success: true,
        message: 'Game session stopped successfully',
        data: {
          startTime: gameResult.startTime,
          endTime: gameResult.endTime,
          duration: gameResult.duration,
          deviation: gameResult.deviation,
          score: gameResult.score
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        ErrorHandler.handleError(error, req, res);
      } else {
        ErrorHandler.handleError(new Error('Unknown error occurred'), req, res);
      }
    }
  }

  /**
   * Get user game results history
   * @param req Express request object
   * @param res Express response object
   */
  private async getUserResults(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      
      const results = await this.gameUseCase.getUserResults(userId);
      
      res.status(200).json({
        success: true,
        message: 'User game history retrieved successfully',
        data: results
      });
    } catch (error) {
      if (error instanceof Error) {
        ErrorHandler.handleError(error, req, res);
      } else {
        ErrorHandler.handleError(new Error('Unknown error occurred'), req, res);
      }
    }
  }
}
