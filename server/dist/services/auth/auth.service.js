"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.updateFarmerProfile = exports.getFarmerProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const models_1 = require("../../models");
const auth_middleware_1 = require("../../middleware/auth.middleware");
// Normalize phone number to include country code
const normalizePhone = (phone) => {
    // Remove all non-digit characters except +
    let normalized = phone.replace(/[^\d+]/g, '');
    // Add India country code if not present
    if (!normalized.startsWith('+')) {
        if (normalized.startsWith('91') && normalized.length === 12) {
            normalized = '+' + normalized;
        }
        else if (normalized.length === 10) {
            normalized = '+91' + normalized;
        }
    }
    return normalized;
};
// Register new farmer
const register = async (phone, password, name) => {
    try {
        const normalizedPhone = normalizePhone(phone);
        // Validate phone number format
        if (!/^\+91[0-9]{10}$/.test(normalizedPhone)) {
            return {
                success: false,
                message: 'Invalid phone number format. Please provide a valid 10-digit Indian mobile number.'
            };
        }
        // Check if farmer already exists
        const existingFarmer = await models_1.Farmer.findOne({ where: { phone: normalizedPhone } });
        if (existingFarmer) {
            return {
                success: false,
                message: 'Phone number already registered. Please login instead.'
            };
        }
        // Validate password
        if (!password || password.length < 6) {
            return {
                success: false,
                message: 'Password must be at least 6 characters long.'
            };
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create farmer
        const farmer = await models_1.Farmer.create({
            phone: normalizedPhone,
            password: hashedPassword,
            name: name || null,
            isVerified: true
        });
        // Generate tokens
        const accessToken = (0, auth_middleware_1.generateToken)({ id: farmer.id, phone: farmer.phone });
        const refreshToken = (0, auth_middleware_1.generateRefreshToken)({ id: farmer.id, phone: farmer.phone });
        return {
            success: true,
            message: 'Registration successful',
            farmer: {
                id: farmer.id,
                phone: farmer.phone,
                name: farmer.name,
                email: farmer.email,
                isVerified: farmer.isVerified
            },
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        console.error('Registration error:', error);
        return {
            success: false,
            message: 'Registration failed. Please try again.'
        };
    }
};
exports.register = register;
// Login farmer
const login = async (phone, password) => {
    try {
        const normalizedPhone = normalizePhone(phone);
        // Find farmer
        const farmer = await models_1.Farmer.findOne({ where: { phone: normalizedPhone } });
        if (!farmer) {
            return {
                success: false,
                message: 'Invalid phone number or password.'
            };
        }
        // Verify password
        const isValidPassword = await bcryptjs_1.default.compare(password, farmer.password);
        if (!isValidPassword) {
            return {
                success: false,
                message: 'Invalid phone number or password.'
            };
        }
        // Update last login
        await farmer.update({ lastLoginAt: new Date() });
        // Generate tokens
        const accessToken = (0, auth_middleware_1.generateToken)({ id: farmer.id, phone: farmer.phone });
        const refreshToken = (0, auth_middleware_1.generateRefreshToken)({ id: farmer.id, phone: farmer.phone });
        return {
            success: true,
            message: 'Login successful',
            farmer: {
                id: farmer.id,
                phone: farmer.phone,
                name: farmer.name,
                email: farmer.email,
                isVerified: farmer.isVerified
            },
            accessToken,
            refreshToken
        };
    }
    catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            message: 'Login failed. Please try again.'
        };
    }
};
exports.login = login;
// Get farmer profile
const getFarmerProfile = async (farmerId) => {
    const farmer = await models_1.Farmer.findByPk(farmerId, {
        attributes: ['id', 'phone', 'name', 'email', 'address', 'profileImage', 'isVerified', 'createdAt']
    });
    return farmer;
};
exports.getFarmerProfile = getFarmerProfile;
// Update farmer profile
const updateFarmerProfile = async (farmerId, data) => {
    const farmer = await models_1.Farmer.findByPk(farmerId);
    if (!farmer) {
        return null;
    }
    await farmer.update(data);
    return {
        id: farmer.id,
        phone: farmer.phone,
        name: farmer.name,
        email: farmer.email,
        address: farmer.address,
        profileImage: farmer.profileImage,
        isVerified: farmer.isVerified
    };
};
exports.updateFarmerProfile = updateFarmerProfile;
// Change password
const changePassword = async (farmerId, currentPassword, newPassword) => {
    try {
        const farmer = await models_1.Farmer.findByPk(farmerId);
        if (!farmer) {
            return { success: false, message: 'Farmer not found' };
        }
        // Verify current password
        const isValidPassword = await bcryptjs_1.default.compare(currentPassword, farmer.password);
        if (!isValidPassword) {
            return { success: false, message: 'Current password is incorrect' };
        }
        // Validate new password
        if (!newPassword || newPassword.length < 6) {
            return { success: false, message: 'New password must be at least 6 characters long' };
        }
        // Hash and update password
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await farmer.update({ password: hashedPassword });
        return { success: true, message: 'Password changed successfully' };
    }
    catch (error) {
        console.error('Change password error:', error);
        return { success: false, message: 'Failed to change password' };
    }
};
exports.changePassword = changePassword;
//# sourceMappingURL=auth.service.js.map