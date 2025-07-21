import { results } from '../game/game.service';
import { userModel } from '../auth/auth.controller';

/**
 * Leaderboard entry interface matching the required format
 */
export interface LeaderboardEntry {
  userId: string;
  username: string;
  totalGames: number;
  averageDeviation: number;
  bestDeviation: number;
  totalScore: number;
}

/**
 * Get the top 10 users with the smallest average time difference
 * @returns Array of leaderboard entries sorted by average deviation
 */
export function getLeaderboard(): LeaderboardEntry[] {
  const leaderboard: LeaderboardEntry[] = [];

  for (const [userId, userResults] of results.entries()) {
    // Skip users with no games
    if (userResults.deviations.length === 0) continue;
    
    // Calculate average deviation
    const totalGames = userResults.deviations.length;
    const totalScore = userResults.scores.reduce((sum, score) => sum + score, 0);
    const averageDeviation = Math.round(
      userResults.deviations.reduce((sum, dev) => sum + dev, 0) / totalGames
    );
    
    // Get username from userModel
    const user = userModel.findById(userId);
    const username = user ? user.username : 'Unknown';
    
    leaderboard.push({
      userId,
      username,
      totalGames,
      averageDeviation,
      bestDeviation: userResults.bestDeviation,
      totalScore
    });
  }

  // Sort by average deviation (lowest to highest) and take top 10
  return leaderboard
    .sort((a, b) => a.averageDeviation - b.averageDeviation)
    .slice(0, 10);
}