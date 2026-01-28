"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateToken = exports.optionalAuth = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access token required' });
            return;
        }
        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET || 'default-secret';
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            // Verify farmer still exists
            const farmer = await models_1.Farmer.findByPk(decoded.id);
            if (!farmer) {
                res.status(401).json({ error: 'Farmer not found' });
                return;
            }
            req.farmer = {
                id: decoded.id,
                phone: decoded.phone
            };
            next();
        }
        catch (jwtError) {
            if (jwtError instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.status(401).json({ error: 'Token expired' });
                return;
            }
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            next();
            return;
        }
        const token = authHeader.substring(7);
        const secret = process.env.JWT_SECRET || 'default-secret';
        try {
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            req.farmer = {
                id: decoded.id,
                phone: decoded.phone
            };
        }
        catch {
            // Token invalid but continue without auth
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
const generateToken = (farmer) => {
    const secret = process.env.JWT_SECRET || 'default-secret';
    // jsonwebtoken v9 uses a stricter type for expiresIn; env vars are plain strings.
    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d');
    return jsonwebtoken_1.default.sign({ id: farmer.id, phone: farmer.phone }, secret, { expiresIn });
};
exports.generateToken = generateToken;
const generateRefreshToken = (farmer) => {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d');
    return jsonwebtoken_1.default.sign({ id: farmer.id, phone: farmer.phone, type: 'refresh' }, secret, { expiresIn });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token) => {
    try {
        const secret = process.env.JWT_SECRET || 'default-secret';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (decoded.type !== 'refresh') {
            return null;
        }
        return decoded;
    }
    catch {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=auth.middleware.js.map