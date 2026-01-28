import { Request, Response, NextFunction } from 'express';
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
export declare const authenticate: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const optionalAuth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const generateToken: (farmer: {
    id: string;
    phone: string;
}) => string;
export declare const generateRefreshToken: (farmer: {
    id: string;
    phone: string;
}) => string;
export declare const verifyRefreshToken: (token: string) => JWTPayload | null;
//# sourceMappingURL=auth.middleware.d.ts.map