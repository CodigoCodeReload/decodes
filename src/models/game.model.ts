import { IGameSession, IGameResult, IGameStartResponse, IGameStopResponse } from '../interfaces/game.interface';
import { generateSessionToken } from '../utils/auth.utils';
import config from '../config/config';

/**
 * Game model class for managing game sessions and results
 * Follows Single Responsibility Principle by focusing only on game management
 */
export class GameModel {
  private gameSessions: Map<string, IGameSession>;
  private gameResults: Map<string, IGameResult>;
  
  constructor() {
    this.gameSessions = new Map<string, IGameSession>();
    this.gameResults = new Map<string, IGameResult>();
  }
  
  /**
   * Start a new game session for a user
   * @param userId The user's ID
   * @returns Object containing session token and start time
   */
  public startGame(userId: string): IGameStartResponse {
    const now = Date.now();
    const expiresAt = now + config.auth.sessionExpiry;
    
    // Create a session token that expires in 30 minutes
    const sessionToken = generateSessionToken(userId, now);
    
    // Store the session
    this.gameSessions.set(userId, {
      userId,
      startTime: now,
      sessionToken,
      expiresAt
    });
    
    return {
      startTime: now,
      sessionToken,
      expiresAt,
      message: 'Game session started. You have 30 minutes to stop the timer.'
    };
  }
  
  /**
   * Stop a game session and calculate the score
   * @param userId The user's ID
   * @returns Object containing deviation from target time and score information
   */
  public stopGame(userId: string): IGameStopResponse {
    const session = this.gameSessions.get(userId);
    if (!session) {
      return { error: 'No active game session found for this user' };
    }
    
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
      this.gameSessions.delete(userId);
      return { error: 'Game session has expired' };
    }
    
    const stopTime = Date.now();
    const elapsedTime = stopTime - session.startTime;
    const deviation = Math.abs(elapsedTime - config.game.targetTime);
    
    // Calculate score - 1 point if within acceptable deviation
    const scored = deviation <= config.game.acceptableDeviation ? 1 : 0;
    
    // Initialize user results if not exists
    if (!this.gameResults.has(userId)) {
      this.gameResults.set(userId, {
        userId,
        deviations: [],
        scores: [],
        bestDeviation: Number.MAX_VALUE
      });
    }
    
    const userResults = this.gameResults.get(userId)!;
    
    // Update user results
    userResults.deviations.push(deviation);
    userResults.scores.push(scored);
    
    // Update best deviation if current is better
    if (deviation < userResults.bestDeviation) {
      userResults.bestDeviation = deviation;
    }
    
    // Clean up the session
    this.gameSessions.delete(userId);
    
    return {
      elapsedTime,
      targetTime: config.game.targetTime,
      deviation,
      scored,
      totalScore: userResults.scores.reduce((sum, score) => sum + score, 0),
      totalGames: userResults.deviations.length,
      averageDeviation: Math.round(
        userResults.deviations.reduce((sum, dev) => sum + dev, 0) / userResults.deviations.length
      ),
      bestDeviation: userResults.bestDeviation
    };
  }
  
  /**
   * Get game results for a specific user
   * @param userId The user's ID
   * @returns The user's game results or undefined if not found
   */
  public getUserResults(userId: string): IGameResult | undefined {
    return this.gameResults.get(userId);
  }
  
  /**
   * Get all game results
   * @returns Map of all game results
   */
  public getAllResults(): Map<string, IGameResult> {
    return this.gameResults;
  }
}
