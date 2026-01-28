"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class Farmer extends sequelize_1.Model {
}
Farmer.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
            is: /^[+]?[0-9]{10,15}$/
        }
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    name: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    profileImage: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
    },
    isVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    lastLoginAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'farmers',
    modelName: 'Farmer',
});
exports.default = Farmer;
//# sourceMappingURL=Farmer.model.js.map