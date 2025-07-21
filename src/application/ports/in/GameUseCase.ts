import { GameResult } from '../../../domain/entities/GameResult';

/**
 * GameUseCase
 * Port (interface) for game use cases
 */
export interface GameUseCase {
  /**
   * Start a new game session for a user
   * @param userId - User ID
   * @returns Game session details
   */
  startGame(userId: string): Promise<{ 
    sessionToken: string;
    startTime: number;
    expiresAt: number;
  }>;
  
  /**
   * Stop an active game session
   * @param userId - User ID
   * @returns Game result details
   */
  stopGame(userId: string): Promise<{
    startTime: number;
    endTime: number;
    duration: number;
    deviation: number;
    score: number;
  }>;
  
  /**
   * Get game results for a user
   * @param userId - User ID
   * @returns Game results history
   */
  getUserResults(userId: string): Promise<{
    userId: string;
    totalGames: number;
    averageDeviation: number;
    bestDeviation: number;
    totalScore: number;
    deviations: number[];
    scores: number[];
  } | null>;
}
