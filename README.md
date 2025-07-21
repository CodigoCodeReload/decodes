# Game Timer System

A precision-based game timer system where users try to stop a timer exactly 10 seconds after starting it.

## Hexagonal Architecture

This project implements the Hexagonal Architecture (Ports and Adapters) pattern to achieve a clean separation of concerns:

```
┌─────────────────────────────────────────────────────────────────┐
│                      REST API Controllers                       │
└───────────────────────────────┬───────────────────────────────┬─┘
                                │                               │
                                ▼                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Input Ports (Use Cases)                  │
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐│
│  │                 │     │                 │     │             ││
│  │  Authentication │     │  Game Session   │     │ Leaderboard ││
│  │     Service     │◄────►     Service     │◄────►   Service   ││
│  │                 │     │                 │     │             ││
│  └────────┬────────┘     └────────┬────────┘     └──────┬──────┘│
└───────────┼────────────────────────┼────────────────────┼───────┘
            │                        │                    │
            ▼                        ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Output Ports                             │
│                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────┐│
│  │                 │     │                 │     │             ││
│  │     User        │     │  Game Session   │     │ Game Result ││
│  │   Repository    │     │   Repository    │     │ Repository  ││
│  │                 │     │                 │     │             ││
│  └────────┬────────┘     └────────┬────────┘     └──────┬──────┘│
└───────────┼────────────────────────┼────────────────────┼───────┘
            │                        │                    │
            ▼                        ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Infrastructure Adapters                    │
│                                                                 │
│                       In-Memory Data Store                      │
└─────────────────────────────────────────────────────────────────┘
```

### Hexagonal Architecture Layers

1. **Domain Layer**:
   - Core business entities: `User`, `GameSession`, `GameResult`, `LeaderboardEntry`
   - Domain services: `GameService` for core game logic and scoring
   - Pure business logic with no dependencies on external frameworks

2. **Application Layer**:
   - Input Ports (Use Cases):
     - `AuthUseCase`: Authentication operations
     - `GameUseCase`: Game session management
     - `LeaderboardUseCase`: Leaderboard operations
   - Output Ports (Repositories):
     - `UserRepository`: User persistence operations
     - `GameSessionRepository`: Game session persistence
     - `GameResultRepository`: Game result persistence
     - `TokenService`: Token generation and verification
   - Application Services:
     - `AuthService`: Implements authentication use cases
     - `GameApplicationService`: Implements game use cases
     - `LeaderboardService`: Implements leaderboard use cases

3. **Infrastructure Layer**:
   - Input Adapters:
     - REST API Controllers for authentication, game, and leaderboard
     - Middleware for authentication and authorization
   - Output Adapters:
     - In-memory repositories for users, sessions, and results
     - JWT token service implementation
   - Configuration:
     - `AppConfig` for centralized configuration management
   - Utilities:
     - ID generation, error handling, validation

## Technical Stack

- **Backend**: Node.js, TypeScript, Express
- **Architecture**: Hexagonal (Ports and Adapters)
- **Authentication**: JWT tokens
- **Data Storage**: In-memory (Maps) - easily replaceable with database adapters
- **API Documentation**: Postman collection (included)

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create a .env file** in the project root with the following variables:
   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

3. **Build the project**:
   ```bash
   npm run build
   ```

4. **Run the application**:
   ```bash
   npm start
   ```
   
   Or for development with hot-reloading:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── domain/                 # Domain layer (core business logic)
│   ├── entities/           # Business entities
│   └── services/           # Domain services
├── application/            # Application layer
│   ├── ports/              # Interfaces
│   │   ├── in/             # Input ports (use cases)
│   │   └── out/            # Output ports (repositories, services)
│   └── services/           # Application services implementing use cases
├── infrastructure/         # Infrastructure layer
│   ├── adapters/           # Adapters implementing ports
│   │   ├── in/             # Input adapters (controllers, API)
│   │   └── out/            # Output adapters (repositories, services)
│   ├── config/             # Configuration
│   └── utils/              # Utilities
└── index.ts                # Application entry point
```

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pica
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following content:
   ```
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

4. Build the application:
   ```bash
   npm run build
   ```

5. Start the server:
   ```bash
   npm start
   ```

   For development with hot reload:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- **Register a new user**:
  ```
  POST /auth/register
  Body: { "username": "user1" }
  ```

- **Login**:
  ```
  POST /auth/login
  Body: { "username": "user1" }
  ```

### Game Sessions

- **Start a game timer**:
  ```
  POST /games/:userId/start
  Headers: Authorization: Bearer <token>
  ```

- **Stop a game timer**:
  ```
  POST /games/:userId/stop
  Headers: Authorization: Bearer <token>
  ```

- **Get user's game history**:
  ```
  GET /games/:userId
  Headers: Authorization: Bearer <token>
  ```

### Leaderboard

- **Get top 10 players**:
  ```
  GET /leaderboard
  ```

- **Get detailed leaderboard with pagination**:
  ```
  GET /leaderboard/detailed?limit=10&offset=0
  Headers: Authorization: Bearer <token>
  ```

## Game Logic

1. **Objective**: Stop the timer as close as possible to 10 seconds after starting it.
2. **Scoring**:
   - If the user stops within 10 seconds ±500ms (9.5-10.5 seconds), they get 1 point.
   - The leaderboard ranks users by their average deviation from 10 seconds.
3. **Session Management**:
   - Game sessions expire after 30 minutes.
   - Each user can have only one active game session at a time.

## Scalability & Improvement Plan

### Scaling to 10,000+ Users

To scale this system to handle 10,000+ concurrent users:

1. **Replace In-Memory Store with Database**:
   - Implement Redis for session management and caching
   - Use a relational database (PostgreSQL) for user data and game results

2. **Horizontal Scaling**:
   - Deploy multiple instances behind a load balancer
   - Implement stateless authentication to allow request distribution

3. **Rate Limiting**:
   - Add rate limiting to prevent abuse and ensure fair usage
   - Implement request queuing for high-traffic periods

4. **Caching Strategy**:
   - Cache leaderboard results with time-based invalidation
   - Implement read replicas for database queries

### Priority Improvements for Production

1. **Metrics and Monitoring**:
   - Add comprehensive logging with Winston/Pino
   - Implement Prometheus metrics for system health
   - Set up alerts for system anomalies

2. **Security Enhancements**:
   - Add input validation with a library like Joi or Zod
   - Implement proper password hashing (currently simplified)
   - Add CSRF protection and rate limiting

3. **Code Quality**:
   - Increase test coverage with unit and integration tests
   - Implement CI/CD pipeline for automated testing and deployment
   - Add proper error handling and graceful degradation

4. **Performance Optimization**:
   - Optimize database queries with proper indexing
   - Implement connection pooling
   - Add caching layers for frequently accessed data

## Testing with Postman

A Postman collection is included in the `postman` directory. Import this collection to test all API endpoints.

The collection includes:
- Authentication flow
- Game session management
- Leaderboard retrieval
- Edge case testing

## License

MIT
