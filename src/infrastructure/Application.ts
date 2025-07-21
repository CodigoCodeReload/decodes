import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';

// Config
import { AppConfig } from './config/AppConfig';

// Domain services
import { GameService } from '../domain/services/GameService';

// Application services
import { AuthService } from '../application/services/AuthService';
import { GameApplicationService } from '../application/services/GameApplicationService';
import { LeaderboardService } from '../application/services/LeaderboardService';

// Infrastructure adapters
import { JwtTokenService } from './adapters/out/auth/JwtTokenService';
import { InMemoryUserRepository } from './adapters/out/persistence/InMemoryUserRepository';
import { InMemoryGameSessionRepository } from './adapters/out/persistence/InMemoryGameSessionRepository';
import { InMemoryGameResultRepository } from './adapters/out/persistence/GameResultRepository';

// API controllers
import { AuthMiddleware } from './adapters/in/api/AuthMiddleware';
import { ErrorMiddleware } from './adapters/in/api/ErrorMiddleware';
import { ExpressAuthController } from './adapters/in/api/ExpressAuthController';
import { ExpressGameController } from './adapters/in/api/ExpressGameController';
import { ExpressLeaderboardController } from './adapters/in/api/ExpressLeaderboardController';

/**
 * Main application class
 * Wires together all components of the hexagonal architecture
 */
export class Application {
  private app: Express;
  private config: AppConfig;

  constructor() {
    // Initialize configuration
    this.config = new AppConfig();
    
    // Create Express application
    this.app = express();
    
    // Configure middleware
    this.configureMiddleware();
    
    // Configure routes
    this.configureRoutes();
    
    // Configure error handling
    this.configureErrorHandling();
  }

  /**
   * Configure Express middleware
   */
  private configureMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(path.join(process.cwd(), 'public')));
  }

  /**
   * Configure API routes
   */
  private configureRoutes(): void {
    // Initialize repositories (adapters)
    const userRepository = new InMemoryUserRepository();
    const gameSessionRepository = new InMemoryGameSessionRepository();
    const gameResultRepository = new InMemoryGameResultRepository();
    const tokenService = new JwtTokenService(this.config);
    
    // Initialize domain services
    const gameService = new GameService();
    
    // Initialize application services
    const authService = new AuthService(userRepository, tokenService);
    const gameApplicationService = new GameApplicationService(
      gameService,
      gameSessionRepository,
      gameResultRepository,
      tokenService
    );
    const leaderboardService = new LeaderboardService(userRepository, gameResultRepository);
    
    // Initialize middleware
    const authMiddleware = new AuthMiddleware(authService);
    
    // Initialize controllers
    const authController = new ExpressAuthController(authService);
    const gameController = new ExpressGameController(gameApplicationService, authMiddleware);
    const leaderboardController = new ExpressLeaderboardController(leaderboardService, authMiddleware);
    
    // Register routes
    this.app.use('/api/auth', authController.getRouter());
    this.app.use('/api/game', gameController.getRouter());
    this.app.use('/api/leaderboard', leaderboardController.getRouter());
    
    // Root route
    this.app.get('/', (req: Request, res: Response) => {
      res.sendFile(path.join(process.cwd(), 'public/index.html'));
    });
  }

  /**
   * Configure error handling middleware
   */
  private configureErrorHandling(): void {
    // 404 handler for routes that don't exist
    this.app.use(ErrorMiddleware.handleNotFound);
    
    // Global error handler
    this.app.use(ErrorMiddleware.handleError);
  }

  /**
   * Start the server
   */
  public start(): void {
    const port = this.config.server.port;
    
    this.app.listen(port, () => {
      console.log(`Server running on port ${port} in ${this.config.server.nodeEnv} mode`);
    });
  }
}
