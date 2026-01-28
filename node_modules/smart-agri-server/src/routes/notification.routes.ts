import { Router, Response } from 'express';
import { param, query } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import * as notificationService from '../services/notification/notification.service';

const router = Router();

router.use(authenticate);

// Get notifications
router.get(
  '/',
  validate([
    query('unreadOnly').optional().isBoolean().toBoolean(),
    query('type')
      .optional()
      .isIn(['irrigation', 'fertilization', 'health_alert', 'weather', 'device', 'system']),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('offset').optional().isInt({ min: 0 }).toInt()
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const result = await notificationService.getNotifications(
        req.farmer!.id,
        {
          unreadOnly: req.query.unreadOnly as unknown as boolean,
          type: req.query.type as string,
          limit: (req.query.limit as unknown as number) || 20,
          offset: (req.query.offset as unknown as number) || 0
        }
      );

      res.json(result);
    } catch (error) {
      console.error('Get notifications error:', error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  }
);

// Get unread count
router.get('/unread-count', async (req: AuthRequest, res: Response) => {
  try {
    const result = await notificationService.getNotifications(
      req.farmer!.id,
      { limit: 0 }
    );

    res.json({ unreadCount: result.unreadCount });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

// Mark notification as read
router.put(
  '/:id/read',
  validate([
    param('id').isUUID().withMessage('Invalid notification ID')
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const success = await notificationService.markAsRead(
        req.params.id,
        req.farmer!.id
      );

      if (!success) {
        res.status(404).json({ error: 'Notification not found' });
        return;
      }

      res.json({ message: 'Notification marked as read' });
    } catch (error) {
      console.error('Mark as read error:', error);
      res.status(500).json({ error: 'Failed to mark as read' });
    }
  }
);

// Mark all notifications as read
router.put('/read-all', async (req: AuthRequest, res: Response) => {
  try {
    const count = await notificationService.markAllAsRead(req.farmer!.id);

    res.json({
      message: 'All notifications marked as read',
      count
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ error: 'Failed to mark all as read' });
  }
});

export default router;
