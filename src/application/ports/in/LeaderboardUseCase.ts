import { LeaderboardEntry } from '../../../domain/entities/LeaderboardEntry';

/**
 * LeaderboardUseCase
 * Port (interface) for leaderboard use cases
 */
export interface LeaderboardUseCase {
  /**
   * Get the top leaderboard entries
   * @returns List of leaderboard entries
   */
  getLeaderboard(): Promise<{
    leaderboard: LeaderboardEntry[];
    timestamp: string;
    totalPlayers: number;
  }>;
  
  /**
   * Get detailed leaderboard with pagination
   * @param limit - Maximum number of entries to return
   * @param offset - Number of entries to skip
   * @returns Paginated list of leaderboard entries
   */
  getDetailedLeaderboard(limit: number, offset: number): Promise<{
    leaderboard: LeaderboardEntry[];
    timestamp: string;
    totalPlayers: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }>;
}
