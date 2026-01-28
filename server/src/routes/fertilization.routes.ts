import { Router, Response } from 'express';
import { body, param, query } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { Farm, Crop, FertilizationRecord } from '../models';
import { Op } from 'sequelize';
import * as fertilizationService from '../services/fertilization/fertilization.service';

const router = Router();

router.use(authenticate);

// Get fertilization recommendations
router.get(
  '/recommendations',
  validate([
    query('farmId').isUUID().withMessage('Farm ID is required')
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const recommendations = await fertilizationService.getFertilizationRecommendations(
        req.query.farmId as string,
        req.farmer!.id
      );

      res.json({ recommendations });
    } catch (error) {
      console.error('Get recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  }
);

// Get fertilization history
router.get(
  '/history',
  validate([
    query('farmId').optional().isUUID(),
    query('cropId').optional().isUUID(),
    query('status').optional().isIn(['recommended', 'scheduled', 'applied', 'skipped']),
    query('days').optional().isInt({ min: 1, max: 365 }).toInt()
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      // Get farms owned by this farmer
      const farms = await Farm.findAll({
        where: { farmerId: req.farmer!.id },
        attributes: ['id']
      });
      const farmIds = farms.map(f => f.id);

      // Build where clause
      let cropWhere: any = {};
      if (req.query.farmId) {
        cropWhere.farmId = req.query.farmId;
      } else {
        cropWhere.farmId = { [Op.in]: farmIds };
      }

      const crops = await Crop.findAll({
        where: cropWhere,
        attributes: ['id']
      });
      const cropIds = crops.map(c => c.id);

      const recordWhere: any = {
        cropId: req.query.cropId 
          ? req.query.cropId 
          : { [Op.in]: cropIds }
      };

      if (req.query.status) {
        recordWhere.status = req.query.status;
      }

      const days = (req.query.days as unknown as number) || 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      recordWhere.createdAt = { [Op.gte]: startDate };

      const records = await FertilizationRecord.findAll({
        where: recordWhere,
        include: [
          {
            model: Crop,
            as: 'crop',
            attributes: ['cropType', 'farmId'],
            include: [
              { model: Farm, as: 'farm', attributes: ['name'] }
            ]
          }
        ],
        order: [['recommendedDate', 'DESC']]
      });

      // Calculate statistics
      const applied = records.filter(r => r.status === 'applied');
      const totalCost = applied.reduce(
        (sum, r) => sum + (parseFloat(r.actualCost?.toString() || '0')), 0
      );
      const totalQuantity = applied.reduce(
        (sum, r) => sum + (parseFloat(r.actualQuantityKg?.toString() || '0')), 0
      );

      res.json({
        records,
        statistics: {
          totalRecords: records.length,
          applied: applied.length,
          pending: records.filter(r => r.status === 'recommended' || r.status === 'scheduled').length,
          totalQuantityKg: Math.round(totalQuantity),
          totalCostINR: Math.round(totalCost),
          periodDays: days
        }
      });
    } catch (error) {
      console.error('Get history error:', error);
      res.status(500).json({ error: 'Failed to get history' });
    }
  }
);

// Create fertilization schedule from recommendation
router.post(
  '/schedule',
  validate([
    body('cropId').isUUID().withMessage('Crop ID is required'),
    body('fertilizerType').notEmpty().withMessage('Fertilizer type is required'),
    body('quantityKg')
      .isFloat({ min: 0.1 })
      .withMessage('Quantity must be greater than 0'),
    body('npkRatio').optional().matches(/^\d+:\d+:\d+$/),
    body('recommendedDate').isISO8601().withMessage('Recommended date is required'),
    body('costEstimate').optional().isFloat({ min: 0 })
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      // Verify crop ownership
      const crop = await Crop.findByPk(req.body.cropId, {
        include: [
          {
            model: Farm,
            as: 'farm',
            where: { farmerId: req.farmer!.id }
          }
        ]
      });

      if (!crop) {
        res.status(404).json({ error: 'Crop not found' });
        return;
      }

      const record = await fertilizationService.createFertilizationRecord(
        req.body.cropId,
        req.body.fertilizerType,
        req.body.quantityKg,
        req.body.npkRatio || '',
        new Date(req.body.recommendedDate),
        req.body.costEstimate || 0
      );

      res.status(201).json({
        message: 'Fertilization scheduled successfully',
        record
      });
    } catch (error) {
      console.error('Create schedule error:', error);
      res.status(500).json({ error: 'Failed to schedule fertilization' });
    }
  }
);

// Mark fertilization as applied
router.post(
  '/:id/apply',
  validate([
    param('id').isUUID().withMessage('Invalid record ID'),
    body('actualQuantityKg')
      .isFloat({ min: 0 })
      .withMessage('Actual quantity is required'),
    body('actualCost')
      .optional()
      .isFloat({ min: 0 }),
    body('applicationMethod')
      .optional()
      .isIn(['broadcasting', 'foliar', 'drip', 'band', 'spot']),
    body('notes').optional().isLength({ max: 500 })
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      // Verify ownership
      const existingRecord = await FertilizationRecord.findByPk(req.params.id, {
        include: [
          {
            model: Crop,
            as: 'crop',
            include: [
              {
                model: Farm,
                as: 'farm',
                where: { farmerId: req.farmer!.id }
              }
            ]
          }
        ]
      });

      if (!existingRecord) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      const record = await fertilizationService.markAsApplied(
        req.params.id,
        req.body.actualQuantityKg,
        req.body.actualCost || 0,
        req.body.applicationMethod || 'broadcasting',
        req.body.notes
      );

      res.json({
        message: 'Fertilization marked as applied',
        record
      });
    } catch (error) {
      console.error('Apply fertilization error:', error);
      res.status(500).json({ error: 'Failed to mark as applied' });
    }
  }
);

// Skip fertilization
router.post(
  '/:id/skip',
  validate([
    param('id').isUUID().withMessage('Invalid record ID'),
    body('reason').optional().isLength({ max: 500 })
  ]),
  async (req: AuthRequest, res: Response) => {
    try {
      const record = await FertilizationRecord.findByPk(req.params.id, {
        include: [
          {
            model: Crop,
            as: 'crop',
            include: [
              {
                model: Farm,
                as: 'farm',
                where: { farmerId: req.farmer!.id }
              }
            ]
          }
        ]
      });

      if (!record) {
        res.status(404).json({ error: 'Record not found' });
        return;
      }

      await record.update({
        status: 'skipped',
        notes: req.body.reason || 'Skipped by farmer'
      });

      res.json({
        message: 'Fertilization skipped',
        record
      });
    } catch (error) {
      console.error('Skip fertilization error:', error);
      res.status(500).json({ error: 'Failed to skip fertilization' });
    }
  }
);

export default router;
