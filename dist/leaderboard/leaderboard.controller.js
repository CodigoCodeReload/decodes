"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const leaderboard_service_1 = require("./leaderboard.service");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = express_1.default.Router();
/**
 * Get the top 10 users with the smallest average time difference
 * GET /leaderboard
 */
router.get('/', (req, res) => {
    const top10 = (0, leaderboard_service_1.getLeaderboard)();
    res.json({
        leaderboard: top10,
        timestamp: new Date().toISOString(),
        totalPlayers: top10.length
    });
});
/**
 * Get detailed leaderboard with pagination
 * GET /leaderboard/detailed?limit=10&offset=0
 */
router.get('/detailed', auth_middleware_1.authMiddleware, (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    const allEntries = (0, leaderboard_service_1.getLeaderboard)();
    const paginatedEntries = allEntries.slice(offset, offset + limit);
    res.json({
        leaderboard: paginatedEntries,
        timestamp: new Date().toISOString(),
        totalPlayers: allEntries.length,
        limit,
        offset,
        hasMore: offset + limit < allEntries.length
    });
});
exports.default = router;
