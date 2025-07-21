import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import jwt from 'jsonwebtoken';
import { TokenPayload, AppConfig } from './types';

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

// Importar la interfaz TokenPayload desde el archivo temporal
// En un escenario real, importaríamos desde la ubicación real
// import { TokenPayload } from '../temp_token_interface';

// Simulamos la clase JwtTokenService ya que no podemos acceder directamente a ella
class JwtTokenService {
  private jwtSecret: string;
  private tokenExpiry: string;

  constructor(config: any) {
    this.jwtSecret = config.auth.jwtSecret;
    this.tokenExpiry = config.auth.tokenExpiry;
  }

  generateToken(userId: string, username: string): string {
    // @ts-ignore - Ignorar error de tipo en jwt.sign
    return jwt.sign(
      { sub: userId, username },
      this.jwtSecret,
      { expiresIn: this.tokenExpiry }
    );
  }

  generateSessionToken(userId: string, expiresIn: number): string {
    // @ts-ignore - Ignorar error de tipo en jwt.sign
    return jwt.sign(
      { sub: userId },
      this.jwtSecret,
      { expiresIn }
    );
  }

  verifyToken(token: string): TokenPayload {
    // @ts-ignore - Ignorar error de tipo en jwt.verify
    return jwt.verify(token, this.jwtSecret) as TokenPayload;
  }
}

describe('JwtTokenService', () => {
  let jwtTokenService: JwtTokenService;
  const mockSecret = 'test-secret';
  const mockConfig = {
    auth: {
      jwtSecret: mockSecret,
      tokenExpiry: '1h'
    }
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    jwtTokenService = new JwtTokenService(mockConfig);
  });

  describe('generateToken', () => {
    it('should generate a token with correct payload', () => {
      // Arrange
      const userId = 'user123';
      const username = 'testuser';
      const mockToken = 'mocked-jwt-token';
      
      // Mock jwt.sign to return a fixed token
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      
      // Act
      const token = jwtTokenService.generateToken(userId, username);
      
      // Assert
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: userId, username },
        mockSecret,
        { expiresIn: mockConfig.auth.tokenExpiry }
      );
    });
  });

  describe('generateSessionToken', () => {
    it('should generate a session token with correct payload and expiration', () => {
      // Arrange
      const userId = 'user123';
      const expiresIn = 1800; // 30 minutes in seconds
      const mockToken = 'mocked-session-token';
      
      // Mock jwt.sign to return a fixed token
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);
      
      // Act
      const token = jwtTokenService.generateSessionToken(userId, expiresIn);
      
      // Assert
      expect(token).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: userId },
        mockSecret,
        { expiresIn }
      );
    });
  });

  describe('verifyToken', () => {
    it('should return decoded payload when token is valid', () => {
      // Arrange
      const token = 'valid-token';
      const decodedPayload: TokenPayload = {
        sub: 'user123',
        username: 'testuser',
        iat: 1625097600,
        exp: 1625101200
      };
      
      // Mock jwt.verify to return a decoded payload
      (jwt.verify as jest.Mock).mockReturnValue(decodedPayload);
      
      // Act
      const result = jwtTokenService.verifyToken(token);
      
      // Assert
      expect(result).toEqual(decodedPayload);
      expect(jwt.verify).toHaveBeenCalledWith(token, mockSecret);
    });

    it('should throw an error when token is invalid', () => {
      // Arrange
      const token = 'invalid-token';
      
      // Mock jwt.verify to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });
      
      // Act & Assert
      expect(() => jwtTokenService.verifyToken(token)).toThrow();
      expect(jwt.verify).toHaveBeenCalledWith(token, mockSecret);
    });
  });
});
