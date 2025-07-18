/**
 * Main application module for Pica Game Timer
 * Initializes the application and connects UI elements to service modules
 * Follows Single Responsibility Principle by focusing only on application initialization
 */
class App {
  constructor() {
    // DOM elements
    this.elements = {
      // Auth elements
      username: document.getElementById('username'),
      registerBtn: document.getElementById('registerBtn'),
      loginBtn: document.getElementById('loginBtn'),
      authResult: document.getElementById('authResult'),
      
      // Game elements
      timer: document.getElementById('timer'),
      startBtn: document.getElementById('startBtn'),
      stopBtn: document.getElementById('stopBtn'),
      gameResult: document.getElementById('gameResult'),
      
      // Leaderboard elements
      leaderboardBtn: document.getElementById('leaderboardBtn'),
      leaderboardResult: document.getElementById('leaderboardResult')
    };
    
    // Initialize the application
    this.init();
  }
  
  /**
   * Initialize the application
   */
  init() {
    // Add event listeners
    this.addEventListeners();
    
    // Check if user is already authenticated
    this.checkAuthStatus();
  }
  
  /**
   * Add event listeners to UI elements
   */
  addEventListeners() {
    // Auth events
    this.elements.registerBtn.addEventListener('click', () => this.register());
    this.elements.loginBtn.addEventListener('click', () => this.login());
    
    // Game events
    this.elements.startBtn.addEventListener('click', () => this.startGame());
    this.elements.stopBtn.addEventListener('click', () => this.stopGame());
    
    // Leaderboard events
    this.elements.leaderboardBtn.addEventListener('click', () => this.showLeaderboard());
  }
  
  /**
   * Check if user is already authenticated
   */
  checkAuthStatus() {
    if (AuthService.isAuthenticated()) {
      const username = AuthService.getUsername();
      this.elements.username.value = username;
      this.elements.authResult.textContent = `Logged in as: ${username}`;
      this.elements.startBtn.disabled = false;
    }
  }
  
  /**
   * Register a new user
   */
  async register() {
    const username = this.elements.username.value.trim();
    
    try {
      const result = await AuthService.register(username);
      this.elements.authResult.textContent = JSON.stringify(result, null, 2);
      this.elements.startBtn.disabled = false;
    } catch (error) {
      this.elements.authResult.textContent = `Error: ${error.message}`;
    }
  }
  
  /**
   * Login an existing user
   */
  async login() {
    const username = this.elements.username.value.trim();
    
    try {
      const result = await AuthService.login(username);
      this.elements.authResult.textContent = JSON.stringify(result, null, 2);
      this.elements.startBtn.disabled = false;
    } catch (error) {
      this.elements.authResult.textContent = `Error: ${error.message}`;
    }
  }
  
  /**
   * Start a game session
   */
  async startGame() {
    try {
      const result = await gameService.startGame();
      this.elements.gameResult.textContent = JSON.stringify(result, null, 2);
      
      // Update UI
      this.elements.startBtn.disabled = true;
      this.elements.stopBtn.disabled = false;
      
      // Start timer display updates
      gameService.startTimerDisplay((elapsed) => {
        this.elements.timer.textContent = GameService.formatTime(elapsed);
      });
    } catch (error) {
      this.elements.gameResult.textContent = `Error: ${error.message}`;
    }
  }
  
  /**
   * Stop a game session
   */
  async stopGame() {
    try {
      const result = await gameService.stopGame();
      this.elements.gameResult.textContent = JSON.stringify(result, null, 2);
      
      // Update UI
      this.elements.startBtn.disabled = false;
      this.elements.stopBtn.disabled = true;
      
      // Stop timer display updates
      gameService.stopTimerDisplay();
    } catch (error) {
      this.elements.gameResult.textContent = `Error: ${error.message}`;
    }
  }
  
  /**
   * Show the leaderboard
   */
  async showLeaderboard() {
    try {
      const result = await LeaderboardService.getLeaderboard();
      
      // Format and display the leaderboard
      if (result.leaderboard && result.leaderboard.length > 0) {
        const formattedLeaderboard = LeaderboardService.formatLeaderboard(result.leaderboard);
        this.elements.leaderboardResult.innerHTML = '';
        this.elements.leaderboardResult.appendChild(formattedLeaderboard);
      } else {
        this.elements.leaderboardResult.textContent = 'No leaderboard entries available.';
      }
    } catch (error) {
      this.elements.leaderboardResult.textContent = `Error: ${error.message}`;
    }
  }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
