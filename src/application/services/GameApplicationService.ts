import { v4 as uuidv4 } from 'uuid';
import { GameService } from '../../domain/services/GameService';
import { GameSession } from '../../domain/entities/GameSession';
import { GameResult } from '../../domain/entities/GameResult';
import { GameUseCase } from '../ports/in/GameUseCase';
import { GameSessionRepository } from '../ports/out/GameSessionRepository';
import { GameResultRepository } from '../ports/out/GameResultRepository';
import { TokenService } from '../ports/out/TokenService';

/**
 * GameApplicationService
 * Application service implementing the GameUseCase port
 */
export class GameApplicationService implements GameUseCase {
  // Session expiry time in seconds (30 minutes)
  private static readonly SESSION_EXPIRY = 30 * 60;
  
  constructor(
    private readonly gameService: GameService,
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
    const existingSession = await this.gameSessionRepository.findActiveSessionByUserId(userId);
    if (existingSession && !existingSession.isExpired()) {
      throw new Error('User already has an active game session');
    }

    // Create new session
    const sessionId = uuidv4();
    const startTime = Date.now();
    const expiresAt = startTime + (GameApplicationService.SESSION_EXPIRY * 1000);
    
    // Generate session token
    const sessionToken = this.tokenService.generateSessionToken(
      userId,
      GameApplicationService.SESSION_EXPIRY
    );

    // Save session
    const session = new GameSession(
      sessionId,
      userId,
      startTime,
      sessionToken,
      expiresAt
    );
    
    await this.gameSessionRepository.save(session);

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
    // Find active session
    const session = await this.gameSessionRepository.findActiveSessionByUserId(userId);
    if (!session) {
      throw new Error('No active game session found');
    }

    // Check if session is valid
    if (!this.gameService.isValidSession(session)) {
      throw new Error('Game session has expired');
    }

    // Calculate game result
    const endTime = Date.now();
    const deviation = this.gameService.calculateDeviation(session.startTime, endTime);
    const score = this.gameService.calculateScore(deviation);

    // Save result
    const resultId = uuidv4();
    const gameResult = new GameResult(
      resultId,
      userId,
      session.startTime,
      endTime,
      deviation,
      score
    );
    
    await this.gameResultRepository.save(gameResult);
    
    // Delete session
    await this.gameSessionRepository.deleteByUserId(userId);

    return {
      startTime: session.startTime,
      endTime,
      duration: endTime - session.startTime,
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
    // Get all results for user
    const results = await this.gameResultRepository.findByUserId(userId);
    if (!results || results.length === 0) {
      return null;
    }

    // Calculate statistics
    const deviations = results.map(result => result.deviation);
    const scores = results.map(result => result.score);
    const totalGames = results.length;
    const totalScore = scores.reduce((sum, score) => sum + score, 0);
    
    // Calculate average deviation (absolute values)
    const averageDeviation = Math.round(
      results.reduce((sum, result) => sum + Math.abs(result.deviation), 0) / totalGames
    );
    
    // Find best deviation (smallest absolute value)
    const bestDeviation = Math.min(
      ...results.map(result => Math.abs(result.deviation))
    );

    return {
      userId,
      totalGames,
      averageDeviation,
      bestDeviation,
      totalScore,
      deviations,
      scores
    };
  }
}
