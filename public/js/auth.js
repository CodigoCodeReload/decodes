/**
 * Authentication module for Pica Game Timer
 * Handles user registration, login, and session management
 * Follows Single Responsibility Principle by focusing only on authentication
 */
class AuthService {
  /**
   * Register a new user
   * @param {string} username - Username to register
   * @returns {Promise<object>} - Registration result with token and userId
   */
  static async register(username) {
    if (!username || username.trim() === '') {
      throw new Error('Username is required');
    }
    
    const result = await ApiService.post(Config.api.auth.register, { username });
    
    if (result.token && result.userId) {
      // Save authentication data to localStorage
      localStorage.setItem(Config.storage.token, result.token);
      localStorage.setItem(Config.storage.userId, result.userId);
      localStorage.setItem(Config.storage.username, username);
    }
    
    return result;
  }
  
  /**
   * Login an existing user
   * @param {string} username - Username to login with
   * @returns {Promise<object>} - Login result with token and userId
   */
  static async login(username) {
    if (!username || username.trim() === '') {
      throw new Error('Username is required');
    }
    
    const result = await ApiService.post(Config.api.auth.login, { username });
    
    if (result.token && result.userId) {
      // Save authentication data to localStorage
      localStorage.setItem(Config.storage.token, result.token);
      localStorage.setItem(Config.storage.userId, result.userId);
      localStorage.setItem(Config.storage.username, username);
    }
    
    return result;
  }
  
  /**
   * Check if user is authenticated
   * @returns {boolean} - Whether user is authenticated
   */
  static isAuthenticated() {
    return !!localStorage.getItem(Config.storage.token);
  }
  
  /**
   * Get current user ID
   * @returns {string|null} - Current user ID or null if not authenticated
   */
  static getUserId() {
    return localStorage.getItem(Config.storage.userId);
  }
  
  /**
   * Get current username
   * @returns {string|null} - Current username or null if not authenticated
   */
  static getUsername() {
    return localStorage.getItem(Config.storage.username);
  }
  
  /**
   * Get authentication token
   * @returns {string|null} - Current token or null if not authenticated
   */
  static getToken() {
    return localStorage.getItem(Config.storage.token);
  }
  
  /**
   * Logout current user
   */
  static logout() {
    localStorage.removeItem(Config.storage.token);
    localStorage.removeItem(Config.storage.userId);
    localStorage.removeItem(Config.storage.username);
  }
}
