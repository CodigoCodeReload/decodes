import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Application configuration object
 * Centralizes all configuration settings for the application
 */
export const config = {
  server: {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'supersecret',
    tokenExpiry: '1h',
    sessionExpiry: 30 * 60 * 1000, // 30 minutes in milliseconds
  },
  game: {
    targetTime: 10000, // 10 seconds in milliseconds
    acceptableDeviation: 500, // ±500ms is considered a successful attempt
  },
  leaderboard: {
    defaultLimit: 10,
  }
};

export default config;
