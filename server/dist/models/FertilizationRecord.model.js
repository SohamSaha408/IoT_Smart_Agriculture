"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class FertilizationRecord extends sequelize_1.Model {
}
FertilizationRecord.init({
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
    recommendedDate: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    fertilzerType: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    quantityKg: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: false,
    },
    npkRatio: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        comment: 'NPK ratio e.g., 10:26:26'
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('recommended', 'scheduled', 'applied', 'skipped'),
        defaultValue: 'recommended',
    },
    appliedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    actualQuantityKg: {
        type: sequelize_1.DataTypes.DECIMAL(8, 2),
        allowNull: true,
    },
    applicationMethod: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
        comment: 'broadcasting, foliar, drip, etc.'
    },
    costEstimate: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Estimated cost in INR'
    },
    actualCost: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Actual cost in INR'
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    basedOnSoilAnalysis: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    soilAnalysisData: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'fertilization_records',
    modelName: 'FertilizationRecord',
    indexes: [
        {
            fields: ['crop_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['recommended_date']
        }
    ]
});
exports.default = FertilizationRecord;
//# sourceMappingURL=FertilizationRecord.model.js.map