import express from 'express';
import path from 'path';
import config from './config/config';
import authRoutes from './auth/auth.controller';
import gameRoutes from './game/game.controller';
import leaderboardRoutes from './leaderboard/leaderboard.controller';

/**
 * Application class
 * Follows Single Responsibility Principle by focusing only on application setup
 */
class Application {
  public app: express.Application;
  
  constructor() {
    this.app = express();
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
  }
  
  /**
   * Configure middleware
   */
  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Serve static files from the public directory
    this.app.use(express.static(path.join(__dirname, '../public')));
  }
  
  /**
   * Configure API routes
   */
  private configureRoutes(): void {
    // API routes
    this.app.use('/auth', authRoutes);
    this.app.use('/games', gameRoutes);
    this.app.use('/leaderboard', leaderboardRoutes);
    
    // Serve the main HTML page
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }
  
  /**
   * Configure error handling middleware
   */
  private configureErrorHandling(): void {
    this.app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      res.status(500).json({
        error: 'Internal Server Error',
        message: config.server.nodeEnv === 'production' ? undefined : err.message
      });
    });
  }
  
  /**
   * Start the server
   */
  public start(): void {
    const PORT = config.server.port;
    this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
}

// Create and start the application
const application = new Application();
application.start();