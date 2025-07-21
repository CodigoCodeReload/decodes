/**
 * LeaderboardEntry entity
 * Core domain entity representing an entry in the leaderboard
 */
export class LeaderboardEntry {
  constructor(
    public readonly userId: string,
    public readonly username: string,
    public readonly totalGames: number,
    public readonly averageDeviation: number,
    public readonly bestDeviation: number,
    public readonly totalScore: number
  ) {}
}
