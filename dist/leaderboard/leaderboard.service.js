"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboard = getLeaderboard;
const game_service_1 = require("../game/game.service");
const auth_controller_1 = require("../auth/auth.controller");
/**
 * Get the top 10 users with the smallest average time difference
 * @returns Array of leaderboard entries sorted by average deviation
 */
function getLeaderboard() {
    const leaderboard = [];
    for (const [userId, userResults] of game_service_1.results.entries()) {
        // Skip users with no games
        if (userResults.deviations.length === 0)
            continue;
        // Calculate average deviation
        const totalGames = userResults.deviations.length;
        const totalScore = userResults.scores.reduce((sum, score) => sum + score, 0);
        const averageDeviation = Math.round(userResults.deviations.reduce((sum, dev) => sum + dev, 0) / totalGames);
        // Get username from users map
        const user = auth_controller_1.users.get(userId);
        const username = user ? user.username : 'Unknown';
        leaderboard.push({
            userId,
            username,
            totalGames,
            averageDeviation,
            bestDeviation: userResults.bestDeviation,
            totalScore
        });
    }
    // Sort by average deviation (lowest to highest) and take top 10
    return leaderboard
        .sort((a, b) => a.averageDeviation - b.averageDeviation)
        .slice(0, 10);
}
