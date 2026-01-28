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
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const fertilizationService = __importStar(require("../services/fertilization/fertilization.service"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Get fertilization recommendations
router.get('/recommendations', (0, validation_middleware_1.validate)([
    (0, express_validator_1.query)('farmId').isUUID().withMessage('Farm ID is required')
]), async (req, res) => {
    try {
        const recommendations = await fertilizationService.getFertilizationRecommendations(req.query.farmId, req.farmer.id);
        res.json({ recommendations });
    }
    catch (error) {
        console.error('Get recommendations error:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});
// Get fertilization history
router.get('/history', (0, validation_middleware_1.validate)([
    (0, express_validator_1.query)('farmId').optional().isUUID(),
    (0, express_validator_1.query)('cropId').optional().isUUID(),
    (0, express_validator_1.query)('status').optional().isIn(['recommended', 'scheduled', 'applied', 'skipped']),
    (0, express_validator_1.query)('days').optional().isInt({ min: 1, max: 365 }).toInt()
]), async (req, res) => {
    try {
        // Get farms owned by this farmer
        const farms = await models_1.Farm.findAll({
            where: { farmerId: req.farmer.id },
            attributes: ['id']
        });
        const farmIds = farms.map(f => f.id);
        // Build where clause
        let cropWhere = {};
        if (req.query.farmId) {
            cropWhere.farmId = req.query.farmId;
        }
        else {
            cropWhere.farmId = { [sequelize_1.Op.in]: farmIds };
        }
        const crops = await models_1.Crop.findAll({
            where: cropWhere,
            attributes: ['id']
        });
        const cropIds = crops.map(c => c.id);
        const recordWhere = {
            cropId: req.query.cropId
                ? req.query.cropId
                : { [sequelize_1.Op.in]: cropIds }
        };
        if (req.query.status) {
            recordWhere.status = req.query.status;
        }
        const days = req.query.days || 90;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        recordWhere.createdAt = { [sequelize_1.Op.gte]: startDate };
        const records = await models_1.FertilizationRecord.findAll({
            where: recordWhere,
            include: [
                {
                    model: models_1.Crop,
                    as: 'crop',
                    attributes: ['cropType', 'farmId'],
                    include: [
                        { model: models_1.Farm, as: 'farm', attributes: ['name'] }
                    ]
                }
            ],
            order: [['recommendedDate', 'DESC']]
        });
        // Calculate statistics
        const applied = records.filter(r => r.status === 'applied');
        const totalCost = applied.reduce((sum, r) => sum + (parseFloat(r.actualCost?.toString() || '0')), 0);
        const totalQuantity = applied.reduce((sum, r) => sum + (parseFloat(r.actualQuantityKg?.toString() || '0')), 0);
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
    }
    catch (error) {
        console.error('Get history error:', error);
        res.status(500).json({ error: 'Failed to get history' });
    }
});
// Create fertilization schedule from recommendation
router.post('/schedule', (0, validation_middleware_1.validate)([
    (0, express_validator_1.body)('cropId').isUUID().withMessage('Crop ID is required'),
    (0, express_validator_1.body)('fertilizerType').notEmpty().withMessage('Fertilizer type is required'),
    (0, express_validator_1.body)('quantityKg')
        .isFloat({ min: 0.1 })
        .withMessage('Quantity must be greater than 0'),
    (0, express_validator_1.body)('npkRatio').optional().matches(/^\d+:\d+:\d+$/),
    (0, express_validator_1.body)('recommendedDate').isISO8601().withMessage('Recommended date is required'),
    (0, express_validator_1.body)('costEstimate').optional().isFloat({ min: 0 })
]), async (req, res) => {
    try {
        // Verify crop ownership
        const crop = await models_1.Crop.findByPk(req.body.cropId, {
            include: [
                {
                    model: models_1.Farm,
                    as: 'farm',
                    where: { farmerId: req.farmer.id }
                }
            ]
        });
        if (!crop) {
            res.status(404).json({ error: 'Crop not found' });
            return;
        }
        const record = await fertilizationService.createFertilizationRecord(req.body.cropId, req.body.fertilizerType, req.body.quantityKg, req.body.npkRatio || '', new Date(req.body.recommendedDate), req.body.costEstimate || 0);
        res.status(201).json({
            message: 'Fertilization scheduled successfully',
            record
        });
    }
    catch (error) {
        console.error('Create schedule error:', error);
        res.status(500).json({ error: 'Failed to schedule fertilization' });
    }
});
// Mark fertilization as applied
router.post('/:id/apply', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid record ID'),
    (0, express_validator_1.body)('actualQuantityKg')
        .isFloat({ min: 0 })
        .withMessage('Actual quantity is required'),
    (0, express_validator_1.body)('actualCost')
        .optional()
        .isFloat({ min: 0 }),
    (0, express_validator_1.body)('applicationMethod')
        .optional()
        .isIn(['broadcasting', 'foliar', 'drip', 'band', 'spot']),
    (0, express_validator_1.body)('notes').optional().isLength({ max: 500 })
]), async (req, res) => {
    try {
        // Verify ownership
        const existingRecord = await models_1.FertilizationRecord.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Crop,
                    as: 'crop',
                    include: [
                        {
                            model: models_1.Farm,
                            as: 'farm',
                            where: { farmerId: req.farmer.id }
                        }
                    ]
                }
            ]
        });
        if (!existingRecord) {
            res.status(404).json({ error: 'Record not found' });
            return;
        }
        const record = await fertilizationService.markAsApplied(req.params.id, req.body.actualQuantityKg, req.body.actualCost || 0, req.body.applicationMethod || 'broadcasting', req.body.notes);
        res.json({
            message: 'Fertilization marked as applied',
            record
        });
    }
    catch (error) {
        console.error('Apply fertilization error:', error);
        res.status(500).json({ error: 'Failed to mark as applied' });
    }
});
// Skip fertilization
router.post('/:id/skip', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid record ID'),
    (0, express_validator_1.body)('reason').optional().isLength({ max: 500 })
]), async (req, res) => {
    try {
        const record = await models_1.FertilizationRecord.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Crop,
                    as: 'crop',
                    include: [
                        {
                            model: models_1.Farm,
                            as: 'farm',
                            where: { farmerId: req.farmer.id }
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
    }
    catch (error) {
        console.error('Skip fertilization error:', error);
        res.status(500).json({ error: 'Failed to skip fertilization' });
    }
});
exports.default = router;
//# sourceMappingURL=fertilization.routes.js.map