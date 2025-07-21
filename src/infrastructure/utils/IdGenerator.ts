import { v4 as uuidv4 } from 'uuid';

/**
 * IdGenerator
 * Utility service for generating unique IDs
 */
export class IdGenerator {
  /**
   * Generate a unique ID
   * @returns Unique ID string
   */
  static generate(): string {
    return uuidv4();
  }
}
