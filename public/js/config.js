/**
 * Configuration module for Pica Game Timer
 * Contains application constants and settings
 */
const Config = {
  // API endpoints
  api: {
    auth: {
      register: '/auth/register',
      login: '/auth/login'
    },
    game: {
      start: (userId) => `/games/${userId}/start`,
      stop: (userId) => `/games/${userId}/stop`,
      results: (userId) => `/games/${userId}`
    },
    leaderboard: {
      top: '/leaderboard',
      detailed: '/leaderboard/detailed'
    }
  },
  
  // Game settings
  game: {
    targetTime: 10000, // 10 seconds in milliseconds
    timerUpdateInterval: 10, // Update timer display every 10ms
    acceptableDeviation: 500 // ±500ms is considered acceptable
  },
  
  // Storage keys
  storage: {
    token: 'pica_auth_token',
    userId: 'pica_user_id',
    username: 'pica_username'
  }
};
