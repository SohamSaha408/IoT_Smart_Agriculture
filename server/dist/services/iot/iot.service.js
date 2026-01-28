"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeviceStats = exports.getLatestReadings = exports.registerDevice = exports.updateDeviceStatus = exports.storeSensorReading = void 0;
const models_1 = require("../../models");
const notification_service_1 = require("../notification/notification.service");
// Store sensor reading from MQTT
const storeSensorReading = async (deviceId, data) => {
    try {
        // Find device by hardware ID
        const device = await models_1.IoTDevice.findOne({
            where: { deviceId },
            include: [{ model: models_1.Farm, as: 'farm' }]
        });
        if (!device) {
            console.warn(`Unknown device: ${deviceId}`);
            return null;
        }
        // Update device last seen
        await device.update({ lastSeenAt: new Date() });
        // Create sensor reading
        const reading = await models_1.SensorReading.create({
            deviceId: device.id,
            recordedAt: new Date(),
            soilMoisture: data.soilMoisture,
            soilTemperature: data.soilTemperature,
            soilPh: data.soilPh,
            nitrogenLevel: data.nitrogenLevel,
            phosphorusLevel: data.phosphorusLevel,
            potassiumLevel: data.potassiumLevel,
            airTemperature: data.airTemperature,
            airHumidity: data.airHumidity,
            lightIntensity: data.lightIntensity,
            rawData: data
        });
        // Check for critical conditions
        await checkCriticalConditions(device, data);
        return reading;
    }
    catch (error) {
        console.error('Store sensor reading error:', error);
        return null;
    }
};
exports.storeSensorReading = storeSensorReading;
// Check for critical conditions and alert
const checkCriticalConditions = async (device, data) => {
    const farm = device.farm;
    if (!farm)
        return;
    // Critical soil moisture (too low or too high)
    if (data.soilMoisture !== undefined) {
        if (data.soilMoisture < 15) {
            await (0, notification_service_1.createCriticalAlert)(farm.farmerId, farm.id, 'irrigation', 'Critical: Very Low Soil Moisture', `Soil moisture at ${device.name} has dropped to ${data.soilMoisture}%. Immediate irrigation recommended.`, { deviceId: device.id, soilMoisture: data.soilMoisture });
        }
        else if (data.soilMoisture > 90) {
            await (0, notification_service_1.createCriticalAlert)(farm.farmerId, farm.id, 'irrigation', 'Warning: Waterlogging Risk', `Soil moisture at ${device.name} is at ${data.soilMoisture}%. Risk of waterlogging.`, { deviceId: device.id, soilMoisture: data.soilMoisture });
        }
    }
    // Critical temperature
    if (data.airTemperature !== undefined) {
        if (data.airTemperature > 42) {
            await (0, notification_service_1.createNotification)({
                farmerId: farm.farmerId,
                farmId: farm.id,
                type: 'weather',
                priority: 'high',
                title: 'Heat Wave Alert',
                message: `Temperature at ${device.name} has reached ${data.airTemperature}°C. Protect crops from heat stress.`,
                channels: ['in_app', 'sms'],
                metadata: { deviceId: device.id, temperature: data.airTemperature }
            });
        }
        else if (data.airTemperature < 5) {
            await (0, notification_service_1.createNotification)({
                farmerId: farm.farmerId,
                farmId: farm.id,
                type: 'weather',
                priority: 'high',
                title: 'Frost Alert',
                message: `Temperature at ${device.name} has dropped to ${data.airTemperature}°C. Risk of frost damage.`,
                channels: ['in_app', 'sms'],
                metadata: { deviceId: device.id, temperature: data.airTemperature }
            });
        }
    }
    // Critical pH
    if (data.soilPh !== undefined) {
        if (data.soilPh < 4.5 || data.soilPh > 8.5) {
            await (0, notification_service_1.createNotification)({
                farmerId: farm.farmerId,
                farmId: farm.id,
                type: 'health_alert',
                priority: 'high',
                title: 'Soil pH Alert',
                message: `Soil pH at ${device.name} is ${data.soilPh}. This may affect crop growth.`,
                channels: ['in_app'],
                metadata: { deviceId: device.id, soilPh: data.soilPh }
            });
        }
    }
};
// Update device status
const updateDeviceStatus = async (deviceId, status) => {
    try {
        const device = await models_1.IoTDevice.findOne({
            where: { deviceId },
            include: [{ model: models_1.Farm, as: 'farm' }]
        });
        if (!device) {
            return false;
        }
        const previousStatus = device.status;
        await device.update({ status, lastSeenAt: new Date() });
        // Notify if device went offline
        if (status === 'offline' && previousStatus !== 'offline') {
            const farm = device.farm;
            if (farm) {
                await (0, notification_service_1.createNotification)({
                    farmerId: farm.farmerId,
                    farmId: farm.id,
                    type: 'device',
                    priority: 'medium',
                    title: 'Device Offline',
                    message: `${device.name} (${device.deviceType}) has gone offline.`,
                    channels: ['in_app'],
                    metadata: { deviceId: device.id }
                });
            }
        }
        return true;
    }
    catch (error) {
        console.error('Update device status error:', error);
        return false;
    }
};
exports.updateDeviceStatus = updateDeviceStatus;
// Register new device
const registerDevice = async (farmId, deviceId, deviceType, name, latitude, longitude) => {
    try {
        // Check if device already exists
        const existing = await models_1.IoTDevice.findOne({ where: { deviceId } });
        if (existing) {
            return null;
        }
        const device = await models_1.IoTDevice.create({
            farmId,
            deviceId,
            deviceType,
            name: name || `${deviceType}-${deviceId.substring(0, 8)}`,
            latitude,
            longitude,
            status: 'active',
            lastSeenAt: new Date()
        });
        return device;
    }
    catch (error) {
        console.error('Register device error:', error);
        return null;
    }
};
exports.registerDevice = registerDevice;
// Get latest readings for a device
const getLatestReadings = async (deviceId, limit = 10) => {
    const readings = await models_1.SensorReading.findAll({
        where: { deviceId },
        order: [['recordedAt', 'DESC']],
        limit
    });
    return readings;
};
exports.getLatestReadings = getLatestReadings;
// Get device statistics
const getDeviceStats = async (deviceId, hours = 24) => {
    const cutoffDate = new Date();
    cutoffDate.setHours(cutoffDate.getHours() - hours);
    const readings = await models_1.SensorReading.findAll({
        where: {
            deviceId,
            recordedAt: { $gte: cutoffDate }
        }
    });
    if (readings.length === 0) {
        return {
            avgSoilMoisture: null,
            avgTemperature: null,
            readingCount: 0,
            lastReading: null
        };
    }
    const moistureReadings = readings
        .filter(r => r.soilMoisture !== null)
        .map(r => parseFloat(r.soilMoisture.toString()));
    const tempReadings = readings
        .filter(r => r.airTemperature !== null)
        .map(r => parseFloat(r.airTemperature.toString()));
    return {
        avgSoilMoisture: moistureReadings.length > 0
            ? Math.round(moistureReadings.reduce((a, b) => a + b, 0) / moistureReadings.length * 10) / 10
            : null,
        avgTemperature: tempReadings.length > 0
            ? Math.round(tempReadings.reduce((a, b) => a + b, 0) / tempReadings.length * 10) / 10
            : null,
        readingCount: readings.length,
        lastReading: readings[0]?.recordedAt || null
    };
};
exports.getDeviceStats = getDeviceStats;
//# sourceMappingURL=iot.service.js.map