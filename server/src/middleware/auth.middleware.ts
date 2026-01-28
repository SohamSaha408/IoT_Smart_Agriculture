import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Farmer } from '../models';

export interface AuthRequest extends Request {
  farmer?: {
    id: string;
    phone: string;
  };
}

export interface JWTPayload {
  id: string;
  phone: string;
  iat: number;
  exp: number;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access token required' });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'default-secret';

    try {
      const decoded = jwt.verify(token, secret) as JWTPayload;
      
      // Verify farmer still exists
      const farmer = await Farmer.findByPk(decoded.id);
      if (!farmer) {
        res.status(401).json({ error: 'Farmer not found' });
        return;
      }

      req.farmer = {
        id: decoded.id,
        phone: decoded.phone
      };

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ error: 'Token expired' });
        return;
      }
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'default-secret';

    try {
      const decoded = jwt.verify(token, secret) as JWTPayload;
      req.farmer = {
        id: decoded.id,
        phone: decoded.phone
      };
    } catch {
      // Token invalid but continue without auth
    }

    next();
  } catch (error) {
    next();
  }
};

export const generateToken = (farmer: { id: string; phone: string }): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  // jsonwebtoken v9 uses a stricter type for expiresIn; env vars are plain strings.
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

  return jwt.sign(
    { id: farmer.id, phone: farmer.phone },
    secret,
    { expiresIn }
  );
};

export const generateRefreshToken = (farmer: { id: string; phone: string }): string => {
  const secret = process.env.JWT_SECRET || 'default-secret';
  const expiresIn = (process.env.JWT_REFRESH_EXPIRES_IN || '30d') as jwt.SignOptions['expiresIn'];

  return jwt.sign(
    { id: farmer.id, phone: farmer.phone, type: 'refresh' },
    secret,
    { expiresIn }
  );
};

export const verifyRefreshToken = (token: string): JWTPayload | null => {
  try {
    const secret = process.env.JWT_SECRET || 'default-secret';
    const decoded = jwt.verify(token, secret) as JWTPayload & { type?: string };
    
    if (decoded.type !== 'refresh') {
      return null;
    }
    
    return decoded;
  } catch {
    return null;
  }
};
