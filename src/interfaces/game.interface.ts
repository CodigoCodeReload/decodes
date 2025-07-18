/**
 * Game session interface representing an active game
 */
export interface IGameSession {
  userId: string;
  startTime: number;
  sessionToken: string;
  expiresAt: number;
}

/**
 * Game result interface for storing user game results
 */
export interface IGameResult {
  userId: string;
  deviations: number[];
  scores: number[];
  bestDeviation: number;
}

/**
 * Game start response interface
 */
export interface IGameStartResponse {
  startTime: number;
  sessionToken: string;
  expiresAt: number;
  message: string;
}

/**
 * Game stop response interface
 */
export interface IGameStopResponse {
  elapsedTime?: number;
  targetTime?: number;
  deviation?: number;
  scored?: number;
  totalScore?: number;
  totalGames?: number;
  averageDeviation?: number;
  bestDeviation?: number;
  error?: string;
}
