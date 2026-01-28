"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Notification extends sequelize_1.Model {
}
Notification.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    farmerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'farmers',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    farmId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'farms',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    cropId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'crops',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    type: {
        type: sequelize_1.DataTypes.ENUM('irrigation', 'fertilization', 'health_alert', 'weather', 'device', 'system'),
        allowNull: false,
    },
    priority: {
        type: sequelize_1.DataTypes.ENUM('low', 'medium', 'high', 'critical'),
        defaultValue: 'medium',
    },
    title: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    message: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    channels: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: ['in_app'],
        comment: 'Requested notification channels'
    },
    sentVia: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: [],
        comment: 'Channels through which notification was sent'
    },
    readAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    actionUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        comment: 'URL to navigate when notification is clicked'
    },
    metadata: {
        type: sequelize_1.DataTypes.JSONB,
        allowNull: true,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'notifications',
    modelName: 'Notification',
    indexes: [
        {
            fields: ['farmer_id']
        },
        {
            fields: ['type']
        },
        {
            fields: ['priority']
        },
        {
            fields: ['read_at']
        },
        {
            fields: ['created_at']
        }
    ]
});
exports.default = Notification;
//# sourceMappingURL=Notification.model.js.map