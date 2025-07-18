import { ILeaderboardEntry, ILeaderboardResponse, IDetailedLeaderboardResponse } from '../interfaces/leaderboard.interface';
import { GameModel } from './game.model';
import { UserModel } from './user.model';
import config from '../config/config';

/**
 * Leaderboard model class for managing leaderboard data
 * Follows Single Responsibility Principle by focusing only on leaderboard functionality
 */
export class LeaderboardModel {
  private gameModel: GameModel;
  private userModel: UserModel;
  
  /**
   * Constructor with dependency injection
   * Follows Dependency Inversion Principle by depending on abstractions
   */
  constructor(gameModel: GameModel, userModel: UserModel) {
    this.gameModel = gameModel;
    this.userModel = userModel;
  }
  
  /**
   * Get the top leaderboard entries
   * @param limit Maximum number of entries to return (default from config)
   * @returns Leaderboard response object with entries sorted by average deviation
   */
  public getLeaderboard(limit: number = config.leaderboard.defaultLimit): ILeaderboardResponse {
    const entries = this.generateLeaderboardEntries();
    
    // Sort by average deviation (ascending)
    const sortedEntries = entries
      .sort((a, b) => a.averageDeviation - b.averageDeviation)
      .slice(0, limit);
    
    return {
      leaderboard: sortedEntries,
      timestamp: new Date().toISOString(),
      totalPlayers: entries.length
    };
  }
  
  /**
   * Get detailed leaderboard with pagination
   * @param limit Maximum number of entries per page
   * @param offset Number of entries to skip
   * @returns Detailed leaderboard response with pagination info
   */
  public getDetailedLeaderboard(
    limit: number = config.leaderboard.defaultLimit,
    offset: number = 0
  ): IDetailedLeaderboardResponse {
    const entries = this.generateLeaderboardEntries();
    
    // Sort by average deviation (ascending)
    const sortedEntries = entries.sort((a, b) => a.averageDeviation - b.averageDeviation);
    
    const paginatedEntries = sortedEntries.slice(offset, offset + limit);
    const hasMore = offset + limit < sortedEntries.length;
    
    return {
      leaderboard: paginatedEntries,
      timestamp: new Date().toISOString(),
      totalPlayers: entries.length,
      limit,
      offset,
      hasMore
    };
  }
  
  /**
   * Generate leaderboard entries from game results and user data
   * @returns Array of leaderboard entries
   */
  private generateLeaderboardEntries(): ILeaderboardEntry[] {
    const gameResults = this.gameModel.getAllResults();
    const entries: ILeaderboardEntry[] = [];
    
    for (const [userId, result] of gameResults.entries()) {
      const user = this.userModel.findById(userId);
      
      if (user && result.deviations.length > 0) {
        const totalScore = result.scores.reduce((sum, score) => sum + score, 0);
        const averageDeviation = Math.round(
          result.deviations.reduce((sum, dev) => sum + dev, 0) / result.deviations.length
        );
        
        entries.push({
          userId: user.userId,
          username: user.username,
          totalGames: result.deviations.length,
          averageDeviation,
          bestDeviation: result.bestDeviation,
          totalScore
        });
      }
    }
    
    return entries;
  }
}
