/**
 * Leaderboard entry interface for a single user's stats
 */
export interface ILeaderboardEntry {
  userId: string;
  username: string;
  totalGames: number;
  averageDeviation: number;
  bestDeviation: number;
  totalScore: number;
}

/**
 * Leaderboard response interface for API responses
 */
export interface ILeaderboardResponse {
  leaderboard: ILeaderboardEntry[];
  timestamp: string;
  totalPlayers: number;
}

/**
 * Detailed leaderboard response with pagination
 */
export interface IDetailedLeaderboardResponse extends ILeaderboardResponse {
  limit: number;
  offset: number;
  hasMore: boolean;
}
