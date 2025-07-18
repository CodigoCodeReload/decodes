import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../interfaces/user.interface';

/**
 * User model class for managing user data
 * Follows Single Responsibility Principle by focusing only on user management
 */
export class UserModel {
  private users: Map<string, IUser>;

  constructor() {
    this.users = new Map<string, IUser>();
  }

  /**
   * Create a new user
   * @param username Username for the new user
   * @returns The created user object
   */
  public createUser(username: string): IUser {
    const userId = uuidv4();
    const user: IUser = { userId, username };
    this.users.set(userId, user);
    return user;
  }

  /**
   * Find a user by their username
   * @param username Username to search for
   * @returns User object if found, undefined otherwise
   */
  public findByUsername(username: string): IUser | undefined {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  /**
   * Find a user by their ID
   * @param userId User ID to search for
   * @returns User object if found, undefined otherwise
   */
  public findById(userId: string): IUser | undefined {
    return this.users.get(userId);
  }

  /**
   * Get all users
   * @returns Array of all users
   */
  public getAllUsers(): IUser[] {
    return Array.from(this.users.values());
  }

  /**
   * Check if a username already exists
   * @param username Username to check
   * @returns True if username exists, false otherwise
   */
  public usernameExists(username: string): boolean {
    return !!this.findByUsername(username);
  }
}
