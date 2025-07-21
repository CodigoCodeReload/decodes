import { GameSession } from '../entities/GameSession';
import { GameResult } from '../entities/GameResult';

/**
 * GameService
 * Core domain service containing the business logic for game operations
 */
export class GameService {
  // Target time in milliseconds (10 seconds)
  private static readonly TARGET_TIME = 10000;
  
  // Acceptable deviation range in milliseconds (±500ms)
  private static readonly ACCEPTABLE_DEVIATION = 500;
  
  /**
   * Calculate the deviation from the target time
   * @param startTime - Game start time in milliseconds
   * @param endTime - Game end time in milliseconds
   * @returns Deviation in milliseconds (negative if too early, positive if too late)
   */
  public calculateDeviation(startTime: number, endTime: number): number {
    const duration = endTime - startTime;
    return duration - GameService.TARGET_TIME;
  }
  
  /**
   * Calculate the score based on the deviation
   * @param deviation - Deviation from target time in milliseconds
   * @returns Score (1 if within acceptable range, 0 otherwise)
   */
  public calculateScore(deviation: number): number {
    const absoluteDeviation = Math.abs(deviation);
    return absoluteDeviation <= GameService.ACCEPTABLE_DEVIATION ? 1 : 0;
  }
  
  /**
   * Check if a game session is valid
   * @param session - Game session to validate
   * @returns True if the session is valid, false otherwise
   */
  public isValidSession(session: GameSession | null): boolean {
    if (!session) {
      return false;
    }
    
    return !session.isExpired();
  }
}
