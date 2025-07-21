/**
 * GameResult entity
 * Core domain entity representing the result of a completed game
 */
export class GameResult {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly startTime: number,
    public readonly endTime: number,
    public readonly deviation: number,
    public readonly score: number
  ) {}

  /**
   * Calculate the duration of the game in milliseconds
   */
  public getDuration(): number {
    return this.endTime - this.startTime;
  }

  /**
   * Get the absolute deviation from the target time
   */
  public getAbsoluteDeviation(): number {
    return Math.abs(this.deviation);
  }
}
