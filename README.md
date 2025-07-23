# Pica Game Timer

A precision timing game built with Node.js/TypeScript backend and vanilla JavaScript frontend. Players must stop a timer as close to exactly 10 seconds as possible to achieve the highest score.

## 🎯 Features

- **Precision Timer Game**: Stop the timer at exactly 10 seconds for maximum points
- **JWT Authentication**: Secure user registration and login system
- **Real-time Leaderboard**: Track top scores across all players
- **Hexagonal Architecture**: Clean, maintainable backend architecture
- **Docker Support**: Easy deployment with Docker Compose
- **Hot Reload**: Development environment with automatic code reloading

## 🏗️ Architecture

- **Backend**: Node.js with TypeScript, Express.js
- **Frontend**: Vanilla JavaScript (no frameworks)
- **Database**: MongoDB (via Docker)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Architecture Pattern**: Hexagonal (Ports & Adapters)

## 🚀 Quick Start with Docker

### Prerequisites

- Docker Desktop installed and running
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pica
   ```

2. **Start the application**
   ```bash
   docker compose up
   ```

3. **Access the application**
   - Open your browser and navigate to: `http://localhost:3000`
   - The application will be ready to use!

### What Docker Compose includes:

- **Application Server**: Node.js backend with hot-reload
- **MongoDB Database**: Persistent data storage
- **Automatic Dependencies**: All npm packages installed automatically
- **Development Environment**: Configured for easy development

## 🎮 How to Play

1. **Register/Login**: Create an account or login with existing credentials
2. **Start Timer**: Click "Start Game" to begin the 10-second challenge
3. **Stop Timer**: Click "Stop Game" as close to 10.00 seconds as possible
4. **View Score**: Your precision score will be calculated and displayed
5. **Check Leaderboard**: See how you rank against other players

## 🛠️ Development

### Local Development (without Docker)

If you prefer to run locally without Docker:

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create environment file**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```
   
   Then edit the `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=3001
   
   # JWT Configuration
   JWT_SECRET=supersecret
   JWT_EXPIRY=24h
   JWT_SESSION_EXPIRY=1h
   
   # MongoDB Configuration (if using local MongoDB)
   MONGO_URI=mongodb://localhost:27017/pica_db
   MONGO_DB_NAME=pica_db
   
   # Application Configuration
   APP_NAME=Pica Game Timer
   APP_URL=http://localhost:3001
   ```

   **Alternative: Set environment variables manually**
   ```bash
   # Windows
   set JWT_SECRET=supersecret
   set PORT=3001

   # Linux/Mac
   export JWT_SECRET=supersecret
   export PORT=3001
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open: `http://localhost:3001`

### Project Structure

```
src/
├── application/           # Business logic layer
│   ├── ports/            # Interface definitions
│   └── services/         # Application services
├── domain/               # Domain entities and logic
├── infrastructure/       # External adapters
│   ├── adapters/         # Database, API adapters
│   └── Application.ts    # Express app configuration
├── interfaces/           # TypeScript interfaces
└── types/               # Type definitions

public/                   # Frontend static files
├── js/                  # JavaScript modules
│   ├── auth.js          # Authentication logic
│   ├── game.js          # Game timer logic
│   ├── leaderboard.js   # Leaderboard display
│   └── api.js           # API communication
├── css/                 # Stylesheets
└── index.html           # Main HTML file
```

## 🔧 Configuration

### Environment Variables

The application uses environment variables for configuration. For local development, create a `.env` file:

```bash
# Copy the example file
cp .env.example .env
```

**Required Environment Variables:**

- `JWT_SECRET`: Secret key for JWT token signing (default: "supersecret")
- `JWT_EXPIRY`: Token expiration time (default: "24h")
- `JWT_SESSION_EXPIRY`: Session token expiration (default: "1h")
- `PORT`: Server port (default: 3000 in Docker, 3001 locally)
- `NODE_ENV`: Environment mode (development/production)
- `MONGO_URI`: MongoDB connection string
- `MONGO_DB_NAME`: Database name (default: "pica_db")
- `APP_NAME`: Application name for display
- `APP_URL`: Base URL for the application

**⚠️ Security Note:** Never commit your `.env` file to version control. The `.env.example` file is provided as a template.

### Docker Configuration

The `docker-compose.yml` includes:
- Application service with hot-reload
- MongoDB service with persistent storage
- Network configuration for service communication
- Volume mounts for development

## 🏆 Scoring System

- **Perfect Score (10.00s)**: Maximum points
- **Close Timing**: Points decrease based on deviation from 10.00s
- **Leaderboard**: Tracks best scores across all players
- **User History**: Each user can see their game attempts

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: API endpoints require valid tokens
- **Input Validation**: Server-side request validation

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Game
- `POST /api/game/start` - Start game timer (requires auth)
- `POST /api/game/stop` - Stop game timer (requires auth)

### Leaderboard
- `GET /api/leaderboard` - Get top scores (requires auth)

## 🐛 Troubleshooting

### Docker Issues

1. **Port conflicts**: Make sure ports 3000 and 27017 are available
2. **Docker not running**: Ensure Docker Desktop is started
3. **Build failures**: Try `docker compose down` then `docker compose up --build`

### Authentication Issues

1. **401 Unauthorized**: Clear browser localStorage and login again
2. **Token expired**: Login again to get a fresh token
3. **CORS errors**: Check that frontend and backend ports match

### Development Issues

1. **Hot reload not working**: Check volume mounts in docker-compose.yml
2. **TypeScript errors**: Ensure all dependencies are installed
3. **Database connection**: Verify MongoDB container is running

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Ready to test your timing skills? Start the game and see if you can hit exactly 10.00 seconds!** ⏱️
