# Pica Game Timer - Postman Collection

This folder contains a complete Postman collection for testing the Pica Game Timer API endpoints.

## 📁 Files Included

- **`Pica Game Timer API.postman_collection.json`** - Main API collection with all endpoints
- **`Pica Game Timer - Local.postman_environment.json`** - Environment variables for local development
- **`README.md`** - This documentation file

## 🚀 Quick Setup

### 1. Import Collection and Environment

1. Open Postman
2. Click **Import** button
3. Drag and drop both JSON files or click **Upload Files**
4. Select both files:
   - `Pica Game Timer API.postman_collection.json`
   - `Pica Game Timer - Local.postman_environment.json`

### 2. Select Environment

1. In the top-right corner of Postman, select **"Pica Game Timer - Local"** from the environment dropdown
2. Verify the `baseUrl` is set to `http://localhost:3000` (or your server URL)

### 3. Start Your Server

Make sure your Pica Game Timer server is running:

```bash
# Using Docker
docker compose up

# Or locally
npm run dev
```

## 🎯 Testing Workflow

### Step 1: Authentication
1. **Register User** - Create a new test account
   - Or use **Login User** if account already exists
   - The JWT token will be automatically saved for subsequent requests

### Step 2: Game Flow
1. **Start Game** - Begin a new game timer
   - Game ID and start time are automatically saved
2. **Stop Game** - End the game timer
   - Score is calculated based on timing precision
   - Try to stop as close to 10.00 seconds as possible!

### Step 3: View Results
1. **Get Leaderboard** - View top scores from all players
   - Results are sorted by score (highest first)

### Step 4: Health Check
1. **Server Health** - Verify server is running properly

## 📋 Collection Features

### 🔐 **Authentication Endpoints**
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login

### 🎮 **Game Management**
- **POST** `/api/game/start` - Start game timer
- **POST** `/api/game/stop` - Stop game timer

### 🏆 **Leaderboard**
- **GET** `/api/leaderboard` - Get top scores

### ❤️ **Health Check**
- **GET** `/` - Server health status

## 🧪 Automated Tests

Each request includes automated tests that verify:

- ✅ **Response Status Codes** - Correct HTTP status
- ✅ **Response Structure** - Required fields present
- ✅ **Data Types** - Proper data validation
- ✅ **Business Logic** - Score calculations, sorting, etc.
- ✅ **Token Management** - Automatic JWT handling

## 🔧 Environment Variables

The collection uses these variables (automatically managed):

| Variable | Description | Example |
|----------|-------------|---------|
| `baseUrl` | API server URL | `http://localhost:3000` |
| `authToken` | JWT token | `eyJhbGciOiJIUzI1NiIs...` |
| `gameId` | Current game ID | `game_123456789` |
| `startTime` | Game start timestamp | `1642781234567` |
| `testUsername` | Test username | `testuser` |
| `testPassword` | Test password | `testpassword123` |

## 🎯 Game Scoring Logic

The game calculates scores based on timing precision:

- **Perfect Score (10.00s)**: Maximum points
- **Close Timing**: Points decrease with deviation from 10.00s
- **Formula**: Score = max(0, 1000 - (deviation_in_ms * penalty_factor))

## 🚨 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Run Register or Login request first
   - Check that `authToken` variable is set

2. **Connection Refused**
   - Verify server is running (`docker compose up`)
   - Check `baseUrl` matches your server port

3. **Invalid Token**
   - Token may have expired, login again
   - Clear `authToken` variable and re-authenticate

4. **Game Start/Stop Issues**
   - Ensure you run Start Game before Stop Game
   - Check that `gameId` is properly set

### Debug Tips

- Check the **Console** tab in Postman for detailed logs
- Use **Tests** tab to see automated test results
- Verify **Environment** variables are set correctly
- Check server logs for backend errors

## 📊 Test Results

After running requests, check the **Test Results** tab to see:

- ✅ Passed tests (green)
- ❌ Failed tests (red)
- 📊 Response times
- 📝 Console logs

## 🔄 Continuous Testing

You can run the entire collection automatically:

1. Click **Runner** in Postman
2. Select **Pica Game Timer API** collection
3. Select **Pica Game Timer - Local** environment
4. Click **Run Pica Game Timer API**

This will execute all requests in sequence and provide a comprehensive test report.

---

**Happy Testing! 🎮⏱️**

Try to achieve the perfect 10.00 second timing and top the leaderboard!
