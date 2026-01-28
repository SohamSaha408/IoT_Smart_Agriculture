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
const iotService = __importStar(require("../services/iot/iot.service"));
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
// Get all devices for farmer's farms
router.get('/', async (req, res) => {
    try {
        const farms = await models_1.Farm.findAll({
            where: { farmerId: req.farmer.id },
            attributes: ['id']
        });
        const farmIds = farms.map(f => f.id);
        const devices = await models_1.IoTDevice.findAll({
            where: { farmId: { [sequelize_1.Op.in]: farmIds } },
            include: [
                { model: models_1.Farm, as: 'farm', attributes: ['name'] }
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json({ devices });
    }
    catch (error) {
        console.error('Get devices error:', error);
        res.status(500).json({ error: 'Failed to fetch devices' });
    }
});
// Register new device
router.post('/register', (0, validation_middleware_1.validate)([
    (0, express_validator_1.body)('farmId').isUUID().withMessage('Farm ID is required'),
    (0, express_validator_1.body)('deviceId')
        .notEmpty()
        .withMessage('Device ID is required')
        .isLength({ min: 8, max: 100 }),
    (0, express_validator_1.body)('deviceType')
        .isIn(['soil_sensor', 'water_pump', 'valve', 'weather_station', 'npk_sensor'])
        .withMessage('Invalid device type'),
    (0, express_validator_1.body)('name').optional().isLength({ max: 100 }),
    (0, express_validator_1.body)('latitude').optional().isFloat({ min: -90, max: 90 }),
    (0, express_validator_1.body)('longitude').optional().isFloat({ min: -180, max: 180 })
]), async (req, res) => {
    try {
        // Verify farm ownership
        const farm = await models_1.Farm.findOne({
            where: {
                id: req.body.farmId,
                farmerId: req.farmer.id
            }
        });
        if (!farm) {
            res.status(404).json({ error: 'Farm not found' });
            return;
        }
        const device = await iotService.registerDevice(req.body.farmId, req.body.deviceId, req.body.deviceType, req.body.name, req.body.latitude, req.body.longitude);
        if (!device) {
            res.status(400).json({ error: 'Device already registered' });
            return;
        }
        res.status(201).json({
            message: 'Device registered successfully',
            device
        });
    }
    catch (error) {
        console.error('Register device error:', error);
        res.status(500).json({ error: 'Failed to register device' });
    }
});
// Get device details
router.get('/:id', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid device ID')
]), async (req, res) => {
    try {
        const device = await models_1.IoTDevice.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Farm,
                    as: 'farm',
                    where: { farmerId: req.farmer.id }
                }
            ]
        });
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        // Get latest readings
        const latestReadings = await iotService.getLatestReadings(device.id, 5);
        // Get stats
        const stats = await iotService.getDeviceStats(device.id, 24);
        res.json({
            device,
            latestReadings,
            stats
        });
    }
    catch (error) {
        console.error('Get device error:', error);
        res.status(500).json({ error: 'Failed to fetch device' });
    }
});
// Get device readings
router.get('/:id/readings', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid device ID'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 1000 }).toInt(),
    (0, express_validator_1.query)('startDate').optional().isISO8601(),
    (0, express_validator_1.query)('endDate').optional().isISO8601()
]), async (req, res) => {
    try {
        const device = await models_1.IoTDevice.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Farm,
                    as: 'farm',
                    where: { farmerId: req.farmer.id }
                }
            ]
        });
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        const whereClause = { deviceId: device.id };
        if (req.query.startDate || req.query.endDate) {
            whereClause.recordedAt = {};
            if (req.query.startDate) {
                whereClause.recordedAt[sequelize_1.Op.gte] = new Date(req.query.startDate);
            }
            if (req.query.endDate) {
                whereClause.recordedAt[sequelize_1.Op.lte] = new Date(req.query.endDate);
            }
        }
        const limit = req.query.limit || 100;
        const readings = await models_1.SensorReading.findAll({
            where: whereClause,
            order: [['recordedAt', 'DESC']],
            limit
        });
        res.json({ readings });
    }
    catch (error) {
        console.error('Get readings error:', error);
        res.status(500).json({ error: 'Failed to fetch readings' });
    }
});
// Update device
router.put('/:id', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid device ID'),
    (0, express_validator_1.body)('name').optional().isLength({ max: 100 }),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'maintenance']),
    (0, express_validator_1.body)('latitude').optional().isFloat({ min: -90, max: 90 }),
    (0, express_validator_1.body)('longitude').optional().isFloat({ min: -180, max: 180 })
]), async (req, res) => {
    try {
        const device = await models_1.IoTDevice.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Farm,
                    as: 'farm',
                    where: { farmerId: req.farmer.id }
                }
            ]
        });
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        await device.update(req.body);
        res.json({
            message: 'Device updated successfully',
            device
        });
    }
    catch (error) {
        console.error('Update device error:', error);
        res.status(500).json({ error: 'Failed to update device' });
    }
});
// Delete device
router.delete('/:id', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid device ID')
]), async (req, res) => {
    try {
        const device = await models_1.IoTDevice.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Farm,
                    as: 'farm',
                    where: { farmerId: req.farmer.id }
                }
            ]
        });
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        await device.destroy();
        res.json({ message: 'Device deleted successfully' });
    }
    catch (error) {
        console.error('Delete device error:', error);
        res.status(500).json({ error: 'Failed to delete device' });
    }
});
// Send command to device
router.post('/:id/command', (0, validation_middleware_1.validate)([
    (0, express_validator_1.param)('id').isUUID().withMessage('Invalid device ID'),
    (0, express_validator_1.body)('action')
        .notEmpty()
        .withMessage('Action is required')
        .isIn(['start', 'stop', 'restart', 'calibrate']),
    (0, express_validator_1.body)('params').optional().isObject()
]), async (req, res) => {
    try {
        const device = await models_1.IoTDevice.findByPk(req.params.id, {
            include: [
                {
                    model: models_1.Farm,
                    as: 'farm',
                    where: { farmerId: req.farmer.id }
                }
            ]
        });
        if (!device) {
            res.status(404).json({ error: 'Device not found' });
            return;
        }
        // Import MQTT function
        const { publishMessage } = await Promise.resolve().then(() => __importStar(require('../config/mqtt')));
        const topic = `smart-agri/devices/${device.deviceId}/command`;
        const success = publishMessage(topic, {
            action: req.body.action,
            params: req.body.params || {},
            timestamp: Date.now()
        });
        if (!success) {
            res.status(500).json({ error: 'Failed to send command' });
            return;
        }
        res.json({ message: 'Command sent successfully' });
    }
    catch (error) {
        console.error('Send command error:', error);
        res.status(500).json({ error: 'Failed to send command' });
    }
});
exports.default = router;
//# sourceMappingURL=device.routes.js.map