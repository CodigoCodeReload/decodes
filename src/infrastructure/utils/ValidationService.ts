import { ValidationError } from './ErrorHandler';

/**
 * ValidationService
 * Utility service for validating input data
 */
export class ValidationService {
  /**
   * Validate that a field is not empty
   * @param value - Value to validate
   * @param fieldName - Name of the field for error message
   * @throws ValidationError if validation fails
   */
  static validateNotEmpty(value: any, fieldName: string): void {
    if (value === undefined || value === null || value === '') {
      throw new ValidationError(`${fieldName} is required`);
    }
  }

  /**
   * Validate that a value is a number
   * @param value - Value to validate
   * @param fieldName - Name of the field for error message
   * @throws ValidationError if validation fails
   */
  static validateNumber(value: any, fieldName: string): void {
    if (isNaN(Number(value))) {
      throw new ValidationError(`${fieldName} must be a number`);
    }
  }

  /**
   * Validate that a number is within a range
   * @param value - Value to validate
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @param fieldName - Name of the field for error message
   * @throws ValidationError if validation fails
   */
  static validateRange(value: number, min: number, max: number, fieldName: string): void {
    if (value < min || value > max) {
      throw new ValidationError(`${fieldName} must be between ${min} and ${max}`);
    }
  }

  /**
   * Validate that a string has a minimum length
   * @param value - Value to validate
   * @param minLength - Minimum length
   * @param fieldName - Name of the field for error message
   * @throws ValidationError if validation fails
   */
  static validateMinLength(value: string, minLength: number, fieldName: string): void {
    if (value.length < minLength) {
      throw new ValidationError(`${fieldName} must be at least ${minLength} characters long`);
    }
  }

  /**
   * Validate that a string has a maximum length
   * @param value - Value to validate
   * @param maxLength - Maximum length
   * @param fieldName - Name of the field for error message
   * @throws ValidationError if validation fails
   */
  static validateMaxLength(value: string, maxLength: number, fieldName: string): void {
    if (value.length > maxLength) {
      throw new ValidationError(`${fieldName} must be at most ${maxLength} characters long`);
    }
  }
}
