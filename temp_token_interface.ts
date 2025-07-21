/**
 * Este archivo es temporal para resolver los problemas de compilación
 * Contiene la definición de la interfaz TokenPayload
 */
export interface TokenPayload {
  sub: string;          // Subject (user ID)
  username: string;     // Username
  iat?: number;         // Issued at timestamp
  exp?: number;         // Expiration timestamp
  [key: string]: any;   // Allow additional properties
}
