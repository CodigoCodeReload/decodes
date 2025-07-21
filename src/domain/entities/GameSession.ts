/**
 * GameSession entity
 * Core domain entity representing a game session
 */
export class GameSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly startTime: number,
    public readonly token: string,
    public readonly expiresAt: number
  ) {}

  /**
   * Check if the session has expired
   */
  public isExpired(): boolean {
    return Date.now() > this.expiresAt;
  }
}
