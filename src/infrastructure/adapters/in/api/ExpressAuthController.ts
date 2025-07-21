import { Request, Response, Router } from 'express';
import { AuthUseCase } from '../../../../application/ports/in/AuthUseCase';
import { AuthController } from '../../../../application/ports/in/AuthController';

/**
 * ExpressAuthController
 * Adapter implementing the AuthController port using Express
 */
export class ExpressAuthController implements AuthController {
  private router: Router;
  
  constructor(private readonly authService: AuthUseCase) {
    this.router = Router();
    this.initializeRoutes();
  }
  
  /**
   * Initialize controller routes
   */
  private initializeRoutes(): void {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
  }
  
  /**
   * Register a new user
   * @param req - Express request
   * @param res - Express response
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;
      
      if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }
      
      const result = await this.authService.register(username);
      
      res.status(201).json({
        userId: result.userId,
        token: result.token,
        message: 'User registered successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during registration';
      res.status(400).json({ error: errorMessage });
    }
  }
  
  /**
   * Login an existing user
   * @param req - Express request
   * @param res - Express response
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.body;
      
      if (!username) {
        res.status(400).json({ error: 'Username is required' });
        return;
      }
      
      const result = await this.authService.login(username);
      
      res.status(200).json({
        userId: result.userId,
        token: result.token,
        message: 'Login successful'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred during login';
      res.status(401).json({ error: errorMessage });
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
