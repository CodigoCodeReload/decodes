# Game Timer System

A precision-based game timer system where users try to stop a timer exactly 10 seconds after starting it.

## Main Features

- **Hexagonal Architecture**: Clear separation between domain, application, and infrastructure
- **JWT Authentication**: Authentication system based on JWT tokens
- **Unit Testing**: Test coverage for critical services and middleware
- **Dockerization**: Complete configuration for development and deployment with Docker

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
   - Implements the fundamental business rules of the system

2. **Application Layer**:
   - Use cases and application services: `AuthService`, `GameApplicationService`, `LeaderboardService`
   - Orchestrates domain objects to fulfill business requirements
   - Depends on the domain layer and ports (interfaces)
   - Implements application logic while maintaining domain independence

3. **Ports Layer**:
   - Input ports (primary): Interfaces for use cases (what the application does)
     - Examples: `TokenService`, controller interfaces
   - Output ports (secondary): Interfaces for infrastructure services (what the application needs)
     - Examples: Repository interfaces for `User`, `GameSession`, `GameResult`
   - Defines clear contracts between different layers

4. **Adapters Layer**:
   - Primary adapters: REST controllers, API endpoints
     - Examples: `ExpressAuthController`, `ExpressGameController`, `AuthMiddleware`
   - Secondary adapters: Repositories, external services
     - Examples: `InMemoryUserRepository`, `JwtTokenService`
   - Implements port interfaces to connect with external systems
   - Allows replacing implementations without affecting the application core

5. **Infrastructure Layer**:
   - Configuration, bootstrapping, dependency injection
   - Framework-specific code (Express)
   - Utilities:
     - Error handling (`ErrorTypes`, `ErrorMiddleware`)
     - Validation (`ValidationService`)
     - Configuration (`AppConfig`)
   - Provides technical services to the rest of the application

## Unit Testing

The project includes unit tests for critical components, following the principles of hexagonal architecture to ensure that each layer is tested in isolation.

### Test Structure

Tests are organized in the `src/__tests__` folder and follow a structure that reflects the hexagonal architecture:

```
src/
└── __tests__/
    ├── JwtTokenService.test.ts  # Tests for the JWT token adapter
    ├── AuthMiddleware.test.ts    # Tests for the authentication middleware
    └── types.ts                  # Shared types for tests
```

### Tested Components

1. **JwtTokenService**
   - Tests for `generateToken`: Verifies correct JWT token generation
   - Tests for `generateSessionToken`: Verifies session token generation
   - Tests for `verifyToken`: Verifies token validation and decoding

2. **AuthMiddleware**
   - Tests for `authenticate`: Verifies the authentication process with tokens
   - Tests for `authorizeUser`: Verifies role and permission-based authorization

### Running Tests

To run unit tests:

```bash
npm test
```

To run tests with coverage:

```bash
npm run test:coverage
```

## Dockerization

The project is fully dockerized to facilitate development and deployment, maintaining consistency across environments.

### Docker Structure

- **Dockerfile**: Defines the base image for the application
- **docker-compose.yml**: Configures the necessary services (application and MongoDB)
- **docker-start.sh/bat**: Scripts to easily start the containers

### Configured Services

1. **Application (app)**
   - Based on Node.js 18 Alpine for reduced size
   - Configured for development with hot-reload
   - Exposes port 3000 for web access

2. **Database (mongodb)**
   - MongoDB for data persistence
   - Volume to maintain data between restarts
   - Initial database configuration

### Environment Variables

Environment variables are managed through the `.env` file (generated from `.env.example`):

- JWT variables (secret, expiration time)
- MongoDB configuration (URI, database name)
- Server configuration (port, environment)

### Networks and Volumes

- `pica-network` network for communication between containers
- `mongodb_data` volume for data persistence

## Technical Stack

### Core Technologies
- **Backend**: Node.js, TypeScript, Express
- **Architecture**: Hexagonal (Ports and Adapters)
- **Authentication**: JWT tokens
- **Data Storage**: In-memory (Maps) with MongoDB option

### Development and Testing
- **Testing**: Jest, ts-jest for unit testing
- **Mocking**: Jest mocks to simulate external dependencies
- **Validation**: Custom validation system

### Infrastructure and Deployment
- **Containers**: Docker, Docker Compose
- **Database**: MongoDB (configured in Docker)
- **Environment**: Configuration through environment variables

### Documentation
- **API**: Postman collection (included)
- **Code**: Comments and TypeScript types
- **Architecture**: Hexagonal architecture diagram

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

- Node.js (v14 or higher) and npm (v6 or higher) **OR**
- Docker and Docker Compose (for containerized setup)

### Installation

#### Option 1: Standard Installation

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

#### Option 2: Docker Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pica
   ```

2. Start the application using Docker Compose:
   
   **On Windows:**
   ```bash
   docker-start.bat
   ```
   
   **On Linux/Mac:**
   ```bash
   chmod +x docker-start.sh
   ./docker-start.sh
   ```

   This will:
   - Create a `.env` file if it doesn't exist
   - Build and start the application container
   - Start a MongoDB container for data persistence
   - Connect the containers via a Docker network

3. Access the application at http://localhost:3000

4. To stop the containers:
   ```bash
   docker-compose down
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

## Implemented Improvements and Future Plan

### Already Implemented Improvements

1. **Hexagonal Architecture**:
   - Clear separation between domain, application, and infrastructure
   - Well-defined interfaces between layers (ports)
   - Interchangeable implementations (adapters)

2. **Enhanced JWT Authentication**:
   - Fixed type errors in token generation and verification
   - Unified JWT payload handling using `sub` for user ID
   - Correct implementation of the `TokenService` interface

3. **Unit Testing**:
   - Tests for `JwtTokenService` (token generation and verification)
   - Tests for `AuthMiddleware` (authentication and authorization)
   - Jest configuration with TypeScript

4. **Dockerization**:
   - Docker and Docker Compose configuration
   - MongoDB integration for persistence
   - Startup scripts to facilitate deployment

### Scalability Plan (10,000+ Users)

1. **Data Persistence**:
   - Implement adapters for MongoDB (already configured in Docker)
   - Consider Redis for caching and session management
   - Design efficient indexes for frequent queries

2. **Horizontal Scaling**:
   - Deploy multiple instances behind a load balancer
   - Leverage hexagonal architecture to facilitate distribution
   - Implement stateless authentication to allow request distribution

3. **Performance Optimization**:
   - Implement caching for leaderboard results
   - Optimize database queries
   - Consider pagination strategies for large datasets

### Priority Next Steps

1. **Test Expansion**:
   - Add integration tests for complete flows
   - Increase unit test coverage
   - Implement e2e tests to validate user flows

2. **Security Improvements**:
   - Implement robust input validation
   - Add CSRF protection and rate limiting
   - Consider refresh tokens to enhance security

3. **Observability**:
   - Implement structured logging
   - Add metrics for health monitoring
   - Configure alerts for system anomalies

4. **CI/CD**:
   - Configure continuous integration pipeline
   - Automate testing and deployment
   - Implement static code analysis

## Testing with Postman

A Postman collection is included in the `postman` directory. Import this collection to test all API endpoints.

The collection includes:
- Authentication flow
- Game session management
- Leaderboard retrieval
- Edge case testing

## License

Dante Panella
panella.dante@gmail.com
