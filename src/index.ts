import { Application } from './infrastructure/Application';
import dotenv from 'dotenv';

/**
 * Main entry point for the application
 * Creates and starts the application using hexagonal architecture
 */
try {
  // Load environment variables
  dotenv.config();
  
  // Create and start the application
  const app = new Application();
  app.start();
  
  console.log('Application started successfully');
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1);
}
