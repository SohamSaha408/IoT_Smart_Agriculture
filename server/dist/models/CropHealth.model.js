"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class CropHealth extends sequelize_1.Model {
}
CropHealth.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    cropId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'crops',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    recordedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    ndviValue: {
        type: sequelize_1.DataTypes.DECIMAL(4, 3),
        allowNull: true,
        validate: {
            min: -1,
            max: 1
        },
        comment: 'Normalized Difference Vegetation Index (-1 to 1)'
    },
    healthScore: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        },
        comment: 'Overall health score (0-100)'
    },
    healthStatus: {
        type: sequelize_1.DataTypes.ENUM('excellent', 'healthy', 'moderate', 'stressed', 'critical'),
        allowNull: false,
    },
    moistureLevel: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Percentage moisture level'
    },
    temperature: {
        type: sequelize_1.DataTypes.DECIMAL(4, 1),
        allowNull: true,
        comment: 'Temperature in Celsius'
    },
    rainfallMm: {
        type: sequelize_1.DataTypes.DECIMAL(6, 2),
        allowNull: true,
        comment: 'Rainfall in millimeters'
    },
    humidity: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Relative humidity percentage'
    },
    soilMoisture: {
        type: sequelize_1.DataTypes.DECIMAL(5, 2),
        allowNull: true,
        comment: 'Soil moisture from sensors'
    },
    recommendations: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.TEXT),
        defaultValue: [],
        comment: 'AI-generated recommendations'
    },
    satelliteImageUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    dataSource: {
        type: sequelize_1.DataTypes.STRING(50),
        defaultValue: 'agromonitoring',
        comment: 'Source of satellite data'
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'crop_health',
    modelName: 'CropHealth',
    indexes: [
        {
            fields: ['crop_id']
        },
        {
            fields: ['recorded_at']
        },
        {
            fields: ['health_status']
        }
    ]
});
exports.default = CropHealth;
//# sourceMappingURL=CropHealth.model.js.map