// Definiciones de tipos para las pruebas

export interface TokenPayload {
  sub: string;          // Subject (user ID)
  username: string;     // Username
  iat?: number;         // Issued at timestamp
  exp?: number;         // Expiration timestamp
  [key: string]: any;   // Allow additional properties
}

export interface IAuthPayload {
  userId: string;
  username: string;
  [key: string]: any;
}

export interface AppConfig {
  auth: {
    jwtSecret: string;
    tokenExpiry: string;
  }
}
