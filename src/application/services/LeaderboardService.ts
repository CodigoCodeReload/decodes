import { LeaderboardEntry } from '../../domain/entities/LeaderboardEntry';
import { LeaderboardUseCase } from '../ports/in/LeaderboardUseCase';
import { UserRepository } from '../ports/out/UserRepository';
import { GameResultRepository } from '../ports/out/GameResultRepository';

/**
 * LeaderboardService
 * Application service implementing the LeaderboardUseCase port
 */
export class LeaderboardService implements LeaderboardUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly gameResultRepository: GameResultRepository
  ) {}

  /**
   * Get the top leaderboard entries
   * @returns List of leaderboard entries
   */
  async getLeaderboard(): Promise<{
    leaderboard: LeaderboardEntry[];
    timestamp: string;
    totalPlayers: number;
  }> {
    const leaderboardEntries = await this.generateLeaderboardEntries();
    
    // Sort by average deviation (ascending)
    const sortedEntries = leaderboardEntries.sort(
      (a, b) => a.averageDeviation - b.averageDeviation
    );
    
    // Get top 10 entries
    const topEntries = sortedEntries.slice(0, 10);
    
    return {
      leaderboard: topEntries,
      timestamp: new Date().toISOString(),
      totalPlayers: leaderboardEntries.length
    };
  }
  
  /**
   * Get detailed leaderboard with pagination
   * @param limit - Maximum number of entries to return
   * @param offset - Number of entries to skip
   * @returns Paginated list of leaderboard entries
   */
  async getDetailedLeaderboard(limit: number, offset: number): Promise<{
    leaderboard: LeaderboardEntry[];
    timestamp: string;
    totalPlayers: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }> {
    const leaderboardEntries = await this.generateLeaderboardEntries();
    
    // Sort by average deviation (ascending)
    const sortedEntries = leaderboardEntries.sort(
      (a, b) => a.averageDeviation - b.averageDeviation
    );
    
    // Apply pagination
    const paginatedEntries = sortedEntries.slice(offset, offset + limit);
    
    return {
      leaderboard: paginatedEntries,
      timestamp: new Date().toISOString(),
      totalPlayers: leaderboardEntries.length,
      limit,
      offset,
      hasMore: offset + limit < leaderboardEntries.length
    };
  }
  
  /**
   * Generate leaderboard entries from users and game results
   * @returns List of leaderboard entries
   */
  private async generateLeaderboardEntries(): Promise<LeaderboardEntry[]> {
    // Get all users and game results
    const users = await this.userRepository.findAll();
    const allResults = await this.gameResultRepository.findAll();
    
    // Group results by user ID
    const resultsByUser = new Map<string, { 
      deviations: number[],
      scores: number[],
      bestDeviation: number
    }>();
    
    // Initialize results for all users
    users.forEach(user => {
      resultsByUser.set(user.id, {
        deviations: [],
        scores: [],
        bestDeviation: Number.MAX_SAFE_INTEGER
      });
    });
    
    // Populate results
    allResults.forEach(result => {
      const userResults = resultsByUser.get(result.userId);
      if (userResults) {
        userResults.deviations.push(result.deviation);
        userResults.scores.push(result.score);
        
        // Update best deviation if this one is better
        const absDeviation = Math.abs(result.deviation);
        if (absDeviation < userResults.bestDeviation) {
          userResults.bestDeviation = absDeviation;
        }
      }
    });
    
    // Create leaderboard entries
    const entries: LeaderboardEntry[] = [];
    
    for (const user of users) {
      const userResults = resultsByUser.get(user.id);
      if (userResults && userResults.deviations.length > 0) {
        const totalGames = userResults.deviations.length;
        const totalScore = userResults.scores.reduce((sum, score) => sum + score, 0);
        
        // Calculate average deviation (absolute values)
        const averageDeviation = Math.round(
          userResults.deviations.reduce((sum, dev) => sum + Math.abs(dev), 0) / totalGames
        );
        
        entries.push(new LeaderboardEntry(
          user.id,
          user.username,
          totalGames,
          averageDeviation,
          userResults.bestDeviation,
          totalScore
        ));
      }
    }
    
    return entries;
  }
}
