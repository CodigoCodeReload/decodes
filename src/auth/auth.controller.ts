import express from 'express';
import { UserModel } from '../models/user.model';
import { generateToken } from '../utils/auth.utils';
import { IAuthResponse } from '../interfaces/user.interface';

/**
 * Authentication controller class
 * Follows Single Responsibility Principle by focusing only on auth routes
 */
class AuthController {
  private router: express.Router;
  private userModel: UserModel;
  
  /**
   * Constructor with dependency injection
   * Follows Dependency Inversion Principle
   */
  constructor(userModel: UserModel) {
    this.router = express.Router();
    this.userModel = userModel;
    this.initializeRoutes();
  }
  
  /**
   * Initialize controller routes
   */
  private initializeRoutes(): void {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.get('/users', this.getUsers.bind(this));
  }
  
  /**
   * Get the Express router
   * @returns Express router instance
   */
  public getRouter(): express.Router {
    return this.router;
  }
  
  /**
   * Register a new user
   * @param req Express request object
   * @param res Express response object
   */
  private register(req: express.Request, res: express.Response): void {
    const { username } = req.body;
    
    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }
    
    // Check if username already exists
    if (this.userModel.usernameExists(username)) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }
    
    // Create new user
    const user = this.userModel.createUser(username);
    
    // Generate JWT token
    const token = generateToken({ userId: user.userId, username: user.username });
    
    const response: IAuthResponse = {
      message: 'User registered successfully',
      userId: user.userId,
      username: user.username,
      token
    };
    
    res.status(201).json(response);
  }
  
  /**
   * Login an existing user
   * @param req Express request object
   * @param res Express response object
   */
  private login(req: express.Request, res: express.Response): void {
    const { username } = req.body;
    
    if (!username) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }
    
    // Find user by username
    const user = this.userModel.findByUsername(username);
    
    if (!user) {
      // Auto-register if user doesn't exist
      const newUser = this.userModel.createUser(username);
      const token = generateToken({ userId: newUser.userId, username: newUser.username });
      const response: IAuthResponse = {
        message: 'Login successful',
        userId: newUser.userId,
        username: newUser.username,
        token
      };
      res.json(response);
      return;
    }
    
    // Generate JWT token
    const token = generateToken({ userId: user.userId, username: user.username });
    
    const response: IAuthResponse = {
      message: 'Login successful',
      userId: user.userId,
      username: user.username,
      token
    };
    
    res.json(response);
  }
  
  /**
   * Get all users (for testing purposes)
   * @param req Express request object
   * @param res Express response object
   */
  private getUsers(req: express.Request, res: express.Response): void {
    const userList = this.userModel.getAllUsers();
    res.json(userList);
  }
}

// Create instances
const userModel = new UserModel();
const authController = new AuthController(userModel);

// Export the router and model for use in other modules
export { userModel };
export default authController.getRouter();