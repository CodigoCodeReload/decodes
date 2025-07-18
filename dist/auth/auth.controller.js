"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const SECRET = process.env.JWT_SECRET || 'supersecret';
// In-memory user store
const users = new Map();
exports.users = users;
// Register a new user
router.post('/register', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    // Check if username already exists
    for (const user of users.values()) {
        if (user.username === username) {
            return res.status(409).json({ error: 'Username already exists' });
        }
    }
    const userId = (0, uuid_1.v4)();
    users.set(userId, { username, userId });
    const token = jsonwebtoken_1.default.sign({ username, userId }, SECRET, { expiresIn: '1h' });
    res.status(201).json({
        message: 'User registered successfully',
        userId,
        username,
        token
    });
});
// Login an existing user
router.post('/login', (req, res) => {
    const { username } = req.body;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }
    // Find user by username
    let foundUser = false;
    let userId = '';
    for (const [id, user] of users.entries()) {
        if (user.username === username) {
            userId = id;
            foundUser = true;
            break;
        }
    }
    if (!foundUser) {
        // Auto-register if user doesn't exist
        userId = (0, uuid_1.v4)();
        users.set(userId, { username, userId });
    }
    const token = jsonwebtoken_1.default.sign({ username, userId }, SECRET, { expiresIn: '1h' });
    res.json({
        message: 'Login successful',
        userId,
        username,
        token
    });
});
// Get all users (for testing purposes)
router.get('/users', (req, res) => {
    const userList = Array.from(users.values());
    res.json(userList);
});
exports.default = router;
