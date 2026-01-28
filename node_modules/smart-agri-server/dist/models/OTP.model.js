"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../config/database");
class OTP extends sequelize_1.Model {
    isExpired() {
        return new Date() > this.expiresAt;
    }
    isValid(inputOtp) {
        return !this.isUsed && !this.isExpired() && this.otp === inputOtp;
    }
}
OTP.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(15),
        allowNull: false,
    },
    otp: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: false,
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    isUsed: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    attempts: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    sequelize: database_1.sequelize,
    tableName: 'otps',
    modelName: 'OTP',
    indexes: [
        {
            fields: ['phone', 'otp']
        }
    ]
});
exports.default = OTP;
//# sourceMappingURL=OTP.model.js.map