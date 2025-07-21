/**
 * AppConfig
 * Application configuration class
 */
export class AppConfig {
  server: {
    port: number;
    nodeEnv: string;
  };
  
  jwt: {
    secret: string;
    expiresIn: string;
  };
  
  game: {
    sessionExpirySeconds: number;
  };
  
  constructor() {
    this.server = {
      port: parseInt(process.env.PORT || '3000', 10),
      nodeEnv: process.env.NODE_ENV || 'development'
    };
    
    this.jwt = {
      secret: process.env.JWT_SECRET || 'supersecret',
      expiresIn: '1h' // 1 hour
    };
    
    this.game = {
      sessionExpirySeconds: 30 * 60 // 30 minutes
    };
  }
}
