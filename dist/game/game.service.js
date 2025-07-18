"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.results = void 0;
exports.startGame = startGame;
exports.stopGame = stopGame;
exports.getAllResults = getAllResults;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.JWT_SECRET || 'supersecret';
const TARGET_TIME = 10000; // 10 seconds in milliseconds
const ACCEPTABLE_DEVIATION = 500; // ±500ms is considered a successful attempt
const gameSessions = new Map();
const results = new Map();
exports.results = results;
/**
 * Start a new game session for a user
 * @param userId The user's ID
 * @returns Object containing session token and start time
 */
function startGame(userId) {
    const now = Date.now();
    const expiresAt = now + 30 * 60 * 1000; // 30 minutes from now
    // Create a session token that expires in 30 minutes
    const sessionToken = jsonwebtoken_1.default.sign({ userId, action: 'game', startTime: now }, SECRET, { expiresIn: '30m' });
    // Store the session
    gameSessions.set(userId, {
        startTime: now,
        sessionToken,
        expiresAt
    });
    return {
        startTime: now,
        sessionToken,
        expiresAt,
        message: 'Game session started. You have 30 minutes to stop the timer.'
    };
}
/**
 * Stop a game session and calculate the score
 * @param userId The user's ID
 * @returns Object containing deviation from target time and score information
 */
function stopGame(userId) {
    const session = gameSessions.get(userId);
    if (!session)
        return { error: 'No active game session found for this user' };
    // Check if session has expired
    if (Date.now() > session.expiresAt) {
        gameSessions.delete(userId);
        return { error: 'Game session has expired' };
    }
    const stopTime = Date.now();
    const elapsedTime = stopTime - session.startTime;
    const deviation = Math.abs(elapsedTime - TARGET_TIME);
    // Calculate score - 1 point if within acceptable deviation
    const scored = deviation <= ACCEPTABLE_DEVIATION ? 1 : 0;
    // Initialize user results if not exists
    if (!results.has(userId)) {
        results.set(userId, {
            deviations: [],
            scores: [],
            bestDeviation: Number.MAX_VALUE
        });
    }
    const userResults = results.get(userId);
    // Update user results
    userResults.deviations.push(deviation);
    userResults.scores.push(scored);
    // Update best deviation if current is better
    if (deviation < userResults.bestDeviation) {
        userResults.bestDeviation = deviation;
    }
    // Clean up the session
    gameSessions.delete(userId);
    return {
        elapsedTime,
        targetTime: TARGET_TIME,
        deviation,
        scored,
        totalScore: userResults.scores.reduce((sum, score) => sum + score, 0),
        totalGames: userResults.deviations.length,
        averageDeviation: Math.round(userResults.deviations.reduce((sum, dev) => sum + dev, 0) / userResults.deviations.length),
        bestDeviation: userResults.bestDeviation
    };
}
/**
 * Get all game results for analytics purposes
 */
function getAllResults() {
    return results;
}
