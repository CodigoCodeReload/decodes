/**
 * Base application error class
 * All specific error types extend from this base class
 */
export class ApplicationError extends Error {
  public statusCode: number;
  public originalError?: Error;

  constructor(message: string, statusCode: number = 500, originalError?: Error) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.originalError = originalError;
    
    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication error - thrown when user authentication fails
 */
export class AuthenticationError extends ApplicationError {
  constructor(message: string = 'Authentication failed', originalError?: Error) {
    super(message, 401, originalError);
  }
}

/**
 * Authorization error - thrown when user is not authorized to access a resource
 */
export class AuthorizationError extends ApplicationError {
  constructor(message: string = 'Not authorized to access this resource', originalError?: Error) {
    super(message, 403, originalError);
  }
}

/**
 * Not found error - thrown when a requested resource is not found
 */
export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Resource not found', originalError?: Error) {
    super(message, 404, originalError);
  }
}

/**
 * Validation error - thrown when input validation fails
 */
export class ValidationError extends ApplicationError {
  constructor(message: string = 'Validation failed', originalError?: Error) {
    super(message, 400, originalError);
  }
}

/**
 * Game session error - thrown when there's an issue with game sessions
 */
export class GameSessionError extends ApplicationError {
  constructor(message: string = 'Game session error', originalError?: Error) {
    super(message, 400, originalError);
  }
}

/**
 * Conflict error - thrown when there's a conflict with existing resources
 */
export class ConflictError extends ApplicationError {
  constructor(message: string = 'Resource conflict', originalError?: Error) {
    super(message, 409, originalError);
  }
}
