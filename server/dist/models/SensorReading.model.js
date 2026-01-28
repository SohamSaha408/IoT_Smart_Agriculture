"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class SensorReading extends sequelize_1.Model {
}
SensorReading.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    deviceId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'iot_devices',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    recordedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    soilMoisture: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Soil moisture percentage (0-100)'
    },
    soilTemperature: {
        type: sequelize_1.DataTypes.DECIMAL(4, 1),
        allowNull: true,
        comment: 'Soil temperature in Celsius'
    },
    soilPh: {
        type: sequelize_1.DataTypes.DECIMAL(3, 1),
        allowNull: true,
        validate: {
            min: 0,
            max: 14
        }
    },
    nitrogenLevel: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: true,
        comment: 'Nitrogen (N) level in mg/kg'
    },
    phosphorusLevel: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: true,
        comment: 'Phosphorus (P) level in mg/kg'
    },
    potassiumLevel: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: true,
        comment: 'Potassium (K) level in mg/kg'
    },
    airTemperature: {
        type: sequelize_1.DataTypes.DECIMAL(4, 1),
        allowNull: true,
        comment: 'Air temperature in Celsius'
    },
    airHumidity: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Air humidity percentage'
    },
    lightIntensity: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        comment: 'Light intensity in lux'
    },
    rawData: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
        comment: 'Raw sensor data from device'
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'sensor_readings',
    modelName: 'SensorReading',
    indexes: [
        {
            fields: ['device_id']
        },
        {
            fields: ['recorded_at']
        }
    ]
});
exports.default = SensorReading;
//# sourceMappingURL=SensorReading.model.js.map