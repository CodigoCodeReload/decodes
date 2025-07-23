/**
 * Game module for Pica Game Timer
 * Handles game session management and timer functionality
 * Follows Single Responsibility Principle by focusing only on game logic
 */
class GameService {
  constructor() {
    this.startTime = 0;
    this.timerInterval = null;
    this.isRunning = false;
  }
  
  /**
   * Start a new game session
   * @returns {Promise<object>} - Game session data
   */
  async startGame() {
    if (!AuthService.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    const result = await ApiService.post(Config.api.game.start, {}, true);
    
    // Start the client-side timer
    this.startTime = Date.now();
    this.isRunning = true;
    
    return result;
  }
  
  /**
   * Stop the current game session
   * @returns {Promise<object>} - Game result data
   */
  async stopGame() {
    if (!AuthService.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    if (!this.isRunning) {
      throw new Error('No active game session');
    }
    
    const result = await ApiService.post(Config.api.game.stop, {}, true);
    
    // Stop the client-side timer
    this.isRunning = false;
    
    return result;
  }
  
  /**
   * Get user game results
   * @returns {Promise<object>} - User game history
   */
  async getUserResults() {
    if (!AuthService.isAuthenticated()) {
      throw new Error('Authentication required');
    }
    
    const userId = AuthService.getUserId();
    return ApiService.get(Config.api.game.results(userId), true);
  }
  
  /**
   * Start the timer display update
   * @param {Function} updateCallback - Callback function to update the UI
   */
  startTimerDisplay(updateCallback) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      if (this.isRunning) {
        const elapsed = Date.now() - this.startTime;
        updateCallback(elapsed);
      }
    }, Config.game.timerUpdateInterval);
  }
  
  /**
   * Stop the timer display update
   */
  stopTimerDisplay() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }
  
  /**
   * Format milliseconds into a readable time string (MM:SS.mmm)
   * @param {number} milliseconds - Time in milliseconds
   * @returns {string} - Formatted time string
   */
  static formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    const ms = milliseconds % 1000;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
}

// Create a singleton instance
const gameService = new GameService();
