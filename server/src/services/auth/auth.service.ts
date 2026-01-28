import bcrypt from 'bcryptjs';
import { Farmer } from '../../models';
import { generateToken, generateRefreshToken } from '../../middleware/auth.middleware';

interface RegisterResult {
  success: boolean;
  message: string;
  farmer?: any;
  accessToken?: string;
  refreshToken?: string;
}

interface LoginResult {
  success: boolean;
  message: string;
  farmer?: any;
  accessToken?: string;
  refreshToken?: string;
}

// Normalize phone number to include country code
const normalizePhone = (phone: string): string => {
  // Remove all non-digit characters except +
  let normalized = phone.replace(/[^\d+]/g, '');
  
  // Add India country code if not present
  if (!normalized.startsWith('+')) {
    if (normalized.startsWith('91') && normalized.length === 12) {
      normalized = '+' + normalized;
    } else if (normalized.length === 10) {
      normalized = '+91' + normalized;
    }
  }
  
  return normalized;
};

// Register new farmer
export const register = async (
  phone: string,
  password: string,
  name?: string
): Promise<RegisterResult> => {
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
    const existingFarmer = await Farmer.findOne({ where: { phone: normalizedPhone } });
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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create farmer
    const farmer = await Farmer.create({
      phone: normalizedPhone,
      password: hashedPassword,
      name: name || null,
      isVerified: true
    });

    // Generate tokens
    const accessToken = generateToken({ id: farmer.id, phone: farmer.phone });
    const refreshToken = generateRefreshToken({ id: farmer.id, phone: farmer.phone });

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
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'Registration failed. Please try again.'
    };
  }
};

// Login farmer
export const login = async (phone: string, password: string): Promise<LoginResult> => {
  try {
    const normalizedPhone = normalizePhone(phone);

    // Find farmer
    const farmer = await Farmer.findOne({ where: { phone: normalizedPhone } });
    if (!farmer) {
      return {
        success: false,
        message: 'Invalid phone number or password.'
      };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, farmer.password);
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid phone number or password.'
      };
    }

    // Update last login
    await farmer.update({ lastLoginAt: new Date() });

    // Generate tokens
    const accessToken = generateToken({ id: farmer.id, phone: farmer.phone });
    const refreshToken = generateRefreshToken({ id: farmer.id, phone: farmer.phone });

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
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.'
    };
  }
};

// Get farmer profile
export const getFarmerProfile = async (farmerId: string) => {
  const farmer = await Farmer.findByPk(farmerId, {
    attributes: ['id', 'phone', 'name', 'email', 'address', 'profileImage', 'isVerified', 'createdAt']
  });
  
  return farmer;
};

// Update farmer profile
export const updateFarmerProfile = async (
  farmerId: string,
  data: { name?: string; email?: string; address?: string; profileImage?: string }
) => {
  const farmer = await Farmer.findByPk(farmerId);
  
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

// Change password
export const changePassword = async (
  farmerId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const farmer = await Farmer.findByPk(farmerId);
    
    if (!farmer) {
      return { success: false, message: 'Farmer not found' };
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, farmer.password);
    if (!isValidPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters long' };
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await farmer.update({ password: hashedPassword });

    return { success: true, message: 'Password changed successfully' };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, message: 'Failed to change password' };
  }
};
