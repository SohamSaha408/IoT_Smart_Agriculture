"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const notificationService = __importStar(require("../services/notification/notification.service"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Get notifications
router.get('/', (0, validation_middleware_1.validate)([
    (0, express_validator_1.query)('unreadOnly').optional().isBoolean().toBoolean(),
    (0, express_validator_1.query)('type')
        .optional()
        .isIn(['irrigation', 'fertilization', 'health_alert', 'weather', 'device', 'system']),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    (0, express_validator_1.query)('offset').optional().isInt({ min: 0 }).toInt()
]), async (req, res) => {
    try {
        const result = await notificationService.getNotifications(req.farmer.id, {
            unreadOnly: req.query.unreadOnly,
            type: req.query.type,
            limit: req.query.limit || 20,
            offset: req.query.offset || 0
        });
        res.json(result);
    }
    catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});
// Get unread count
router.get('/unread-count', async (req, res) => {
    try {
        const result = await notificationService.getNotifications(req.farmer.id, { limit: 0 });
        res.json({ unreadCount: result.unreadCount });
    }
    catch (error) {
        console.error('Get unread count error:', error);
        res.status(500).json({ error: 'Failed to fetch unread count' });
    }
});
// Mark notification as read
router.put('/:id/read', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid notification ID')
]), async (req, res) => {
    try {
        const success = await notificationService.markAsRead(req.params.id, req.farmer.id);
        if (!success) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }
        res.json({ message: 'Notification marked as read' });
    }
    catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: 'Failed to mark as read' });
    }
});
// Mark all notifications as read
router.put('/read-all', async (req, res) => {
    try {
        const count = await notificationService.markAllAsRead(req.farmer.id);
        res.json({
            message: 'All notifications marked as read',
            count
        });
    }
    catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ error: 'Failed to mark all as read' });
    }
});
exports.default = router;
//# sourceMappingURL=notification.routes.js.map