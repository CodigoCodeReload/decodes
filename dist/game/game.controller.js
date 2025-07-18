"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const game_service_1 = require("./game.service");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = express_1.default.Router();
/**
 * Start a game session for a user
 * POST /games/:userId/start
 */
router.post('/:userId/start', auth_middleware_1.authMiddleware, (req, res) => {
    var _a;
    // Verify that the authenticated user matches the requested userId
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== req.params.userId) {
        return res.status(403).json({
            error: 'You can only start a game for your own user ID'
        });
    }
    const { userId } = req.params;
    const gameSession = (0, game_service_1.startGame)(userId);
    res.json(gameSession);
});
/**
 * Stop a game session for a user
 * POST /games/:userId/stop
 */
router.post('/:userId/stop', auth_middleware_1.authMiddleware, (req, res) => {
    var _a;
    // Verify that the authenticated user matches the requested userId
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== req.params.userId) {
        return res.status(403).json({
            error: 'You can only stop a game for your own user ID'
        });
    }
    const { userId } = req.params;
    const result = (0, game_service_1.stopGame)(userId);
    if ('error' in result) {
        return res.status(400).json(result);
    }
    res.json(result);
});
/**
 * Get all games for a specific user
 * GET /games/:userId
 */
router.get('/:userId', auth_middleware_1.authMiddleware, (req, res) => {
    var _a;
    // Verify that the authenticated user matches the requested userId
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.userId) !== req.params.userId) {
        return res.status(403).json({
            error: 'You can only view games for your own user ID'
        });
    }
    const { userId } = req.params;
    const allResults = (0, game_service_1.getAllResults)();
    const userResults = allResults.get(userId);
    if (!userResults) {
        return res.json({
            userId,
            totalGames: 0,
            averageDeviation: 0,
            bestDeviation: 0,
            totalScore: 0,
            message: 'No games played yet'
        });
    }
    const totalGames = userResults.deviations.length;
    const totalScore = userResults.scores.reduce((sum, score) => sum + score, 0);
    const averageDeviation = Math.round(userResults.deviations.reduce((sum, dev) => sum + dev, 0) / totalGames);
    res.json({
        userId,
        totalGames,
        averageDeviation,
        bestDeviation: userResults.bestDeviation,
        totalScore,
        deviations: userResults.deviations,
        scores: userResults.scores
    });
});
exports.default = router;
