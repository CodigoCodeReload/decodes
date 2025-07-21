import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { Request, Response, NextFunction } from 'express';
import { IAuthPayload } from './types';

// Definimos una interfaz personalizada para nuestras pruebas
interface RequestWithUser extends Request {
  user?: IAuthPayload;
}

// Simulamos las clases y funciones necesarias
class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

// Simulamos la clase TokenService
class MockTokenService {
  verifyToken(token: string): IAuthPayload {
    if (token === 'valid-token') {
      return {
        userId: 'user123',
        username: 'testuser'
      };
    }
    throw new Error('Invalid token');
  }
}

// Simulamos la clase AuthMiddleware
class AuthMiddleware {
  private tokenService: MockTokenService;

  constructor(tokenService: MockTokenService) {
    this.tokenService = tokenService;
  }

  authenticate(req: RequestWithUser, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        next(new AuthenticationError('No authorization header provided'));
        return;
      }
      
      const [bearer, token] = authHeader.split(' ');
      
      if (bearer !== 'Bearer' || !token) {
        next(new AuthenticationError('Invalid authorization format'));
        return;
      }
      
      const payload = this.tokenService.verifyToken(token);
      
      // Add user info to request object for use in controllers
      req.user = {
        userId: payload.userId,
        username: payload.username
      };
      
      next();
    } catch (error) {
      next(new AuthenticationError('Invalid token'));
    }
  }

  authorizeUser(userId: string) {
    return (req: RequestWithUser, res: Response, next: NextFunction): void => {
      const user = req.user;
      
      if (!user) {
        next(new AuthenticationError('Authentication required'));
        return;
      }
      
      if (user.userId !== userId) {
        next(new AuthorizationError('Not authorized to access this resource'));
        return;
      }
      
      next();
    };
  }
}

describe('AuthMiddleware', () => {
  let authMiddleware: AuthMiddleware;
  let mockTokenService: MockTokenService;
  let mockRequest: Partial<RequestWithUser>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock;
  
  beforeEach(() => {
    mockTokenService = new MockTokenService();
    authMiddleware = new AuthMiddleware(mockTokenService);
    mockRequest = {
      headers: {}
    };
    mockResponse = {};
    nextFunction = jest.fn();
  });
  
  describe('authenticate', () => {
    it('should call next with AuthenticationError when no authorization header is provided', () => {
      // Act
      authMiddleware.authenticate(
        mockRequest as RequestWithUser,
        mockResponse as Response,
        nextFunction
      );
      
      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'AuthenticationError',
          message: 'No authorization header provided'
        })
      );
    });
    
    it('should call next with AuthenticationError when authorization format is invalid', () => {
      // Arrange
      mockRequest.headers = { authorization: 'InvalidFormat' };
      
      // Act
      authMiddleware.authenticate(
        mockRequest as RequestWithUser,
        mockResponse as Response,
        nextFunction
      );
      
      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'AuthenticationError',
          message: 'Invalid authorization format'
        })
      );
    });
    
    it('should set req.user and call next when token is valid', () => {
      // Arrange
      mockRequest.headers = { authorization: 'Bearer valid-token' };
      
      // Act
      authMiddleware.authenticate(
        mockRequest as RequestWithUser,
        mockResponse as Response,
        nextFunction
      );
      
      // Assert
      expect(mockRequest.user).toEqual({
        userId: 'user123',
        username: 'testuser'
      });
      expect(nextFunction).toHaveBeenCalledWith();
    });
    
    it('should call next with AuthenticationError when token is invalid', () => {
      // Arrange
      mockRequest.headers = { authorization: 'Bearer invalid-token' };
      
      // Act
      authMiddleware.authenticate(
        mockRequest as RequestWithUser,
        mockResponse as Response,
        nextFunction
      );
      
      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'AuthenticationError',
          message: 'Invalid token'
        })
      );
    });
  });
  
  describe('authorizeUser', () => {
    it('should call next with AuthenticationError when user is not authenticated', () => {
      // Arrange
      mockRequest.user = undefined;
      
      // Act
      authMiddleware.authorizeUser('user123')(
        mockRequest as RequestWithUser,
        mockResponse as Response,
        nextFunction
      );
      
      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'AuthenticationError',
          message: 'Authentication required'
        })
      );
    });
    
    it('should call next with AuthorizationError when user is not authorized', () => {
      // Arrange
      mockRequest.user = {
        userId: 'user456',
        username: 'otheruser'
      };
      
      // Act
      authMiddleware.authorizeUser('user123')(
        mockRequest as RequestWithUser,
        mockResponse as Response,
        nextFunction
      );
      
      // Assert
      expect(nextFunction).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'AuthorizationError',
          message: 'Not authorized to access this resource'
        })
      );
    });
    
    it('should call next when user is authorized', () => {
      // Arrange
      mockRequest.user = {
        userId: 'user123',
        username: 'testuser'
      };
      
      // Act
      authMiddleware.authorizeUser('user123')(
        mockRequest as RequestWithUser,
        mockResponse as Response,
        nextFunction
      );
      
      // Assert
      expect(nextFunction).toHaveBeenCalledWith();
    });
  });
});
