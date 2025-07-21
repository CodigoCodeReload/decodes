import { GameUseCase } from '../ports/in/GameUseCase';
import { GameSessionRepository } from '../ports/out/GameSessionRepository';
import { GameResultRepository } from '../ports/out/GameResultRepository';
import { TokenService } from '../ports/out/TokenService';
import { GameSessionError, NotFoundError } from '../../infrastructure/utils/ErrorTypes';
import { GameSessionDTO } from '../dtos/GameSessionDTO';
import { GameResultDTO } from '../dtos/GameResultDTO';

/**
 * GameService
 * Application service implementing the GameUseCase port
 * Acts as the orchestrator between domain entities and infrastructure adapters
 */
export class GameService implements GameUseCase {
  private static readonly SESSION_EXPIRY_SECONDS = 60; // 1 minute game session

  constructor(
    private readonly gameSessionRepository: GameSessionRepository,
    private readonly gameResultRepository: GameResultRepository,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Start a new game session for a user
   * @param userId - User ID
   * @returns Game session details
   */
  async startGame(userId: string): Promise<{ 
    sessionToken: string;
    startTime: number;
    expiresAt: number;
  }> {
    // Check if user already has an active session
    const activeSession = await this.gameSessionRepository.findActiveSessionByUserId(userId);
    if (activeSession) {
      throw new GameSessionError('User already has an active game session');
    }

    const startTime = Date.now();
    const expiresAt = startTime + (GameService.SESSION_EXPIRY_SECONDS * 1000);
    
    // Generate session token
    const sessionToken = this.tokenService.generateSessionToken(userId, GameService.SESSION_EXPIRY_SECONDS);
    
    // Create session in repository
    await this.gameSessionRepository.createSession({
      userId,
      sessionToken,
      startTime: new Date(startTime),
      expiresAt: new Date(expiresAt),
      isActive: true
    });

    return {
      sessionToken,
      startTime,
      expiresAt
    };
  }

  /**
   * Stop an active game session
   * @param userId - User ID
   * @returns Game result details
   */
  async stopGame(userId: string): Promise<{
    startTime: number;
    endTime: number;
    duration: number;
    deviation: number;
    score: number;
  }> {
    // Find active session for user
    const activeSession = await this.gameSessionRepository.findActiveSessionByUserId(userId);
    if (!activeSession) {
      throw new NotFoundError('No active game session found for user');
    }

    // Calculate game metrics
    const endTime = Date.now();
    // Handle the startTime which could be a number or Date object
    const startTime = typeof activeSession.startTime === 'number' ? 
      activeSession.startTime : 
      new Date(activeSession.startTime as any).getTime();
    const targetDuration = GameService.SESSION_EXPIRY_SECONDS * 1000; // Target is 60 seconds
    const actualDuration = endTime - startTime;
    const deviation = Math.abs(actualDuration - targetDuration);
    
    // Calculate score - perfect score is 1000, decreases as deviation increases
    const maxDeviation = targetDuration; // Maximum possible deviation (60s)
    const score = Math.max(0, Math.floor(1000 * (1 - deviation / maxDeviation)));

    // Mark session as inactive
    await this.gameSessionRepository.deactivateSession(activeSession.id);
    
    // Create game result
    const gameResult = await this.gameResultRepository.createResult({
      userId,
      sessionId: activeSession.id,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      duration: actualDuration,
      deviation,
      score
    });

    return {
      startTime,
      endTime,
      duration: actualDuration,
      deviation,
      score
    };
  }

  /**
   * Get game results for a user
   * @param userId - User ID
   * @returns Game results history
   */
  async getUserResults(userId: string): Promise<{
    userId: string;
    totalGames: number;
    averageDeviation: number;
    bestDeviation: number;
    totalScore: number;
    deviations: number[];
    scores: number[];
  } | null> {
    const results = await this.gameResultRepository.findByUserId(userId);
    
    if (!results || results.length === 0) {
      return null;
    }

    const deviations = results.map(result => result.deviation);
    const scores = results.map(result => result.score);
    
    return {
      userId,
      totalGames: results.length,
      averageDeviation: deviations.reduce((sum, dev) => sum + dev, 0) / deviations.length,
      bestDeviation: Math.min(...deviations),
      totalScore: scores.reduce((sum, score) => sum + score, 0),
      deviations,
      scores
    };
  }
}
