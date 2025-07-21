/**
 * Data Transfer Object for Game Session
 * Used to transfer game session data between layers
 */
export interface GameSessionDTO {
  id?: string;           // Optional for creation
  userId: string;
  sessionToken: string;  // JWT token for the session
  startTime: Date;
  isActive: boolean;
  expiresAt: Date;
}
