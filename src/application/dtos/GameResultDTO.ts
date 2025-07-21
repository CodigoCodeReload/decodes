/**
 * Data Transfer Object for Game Result
 * Used to transfer game result data between layers
 */
export interface GameResultDTO {
  id?: string;      // Optional for creation
  userId: string;
  sessionId: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  deviation: number;
  score: number;
}
