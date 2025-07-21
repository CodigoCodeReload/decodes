/**
 * User entity
 * Core domain entity representing a user in the system
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly username: string
  ) {}
}
