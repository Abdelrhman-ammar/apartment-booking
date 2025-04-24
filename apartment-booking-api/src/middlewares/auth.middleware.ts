import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt'
import { statusCodes } from '../utils/status-responses';
import { generateResponse, sendGeneralErrorResponse } from '../utils/response';
import { UserParams } from "../models/user";

export interface AuthRequest extends Request {
    user?: UserParams;
}

const invalidToken = (res: Response) => {
    const response = generateResponse({
        status: statusCodes.UNAUTHORIZED,
        error: 'No token provided',
        message: 'Try To Login Please'
    });
    res.status(response.status).json(response);
};

export const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        invalidToken(res);
        return;
    }

    const token = authHeader?.split(' ')[1];
    if (!token) {
        invalidToken(res);
        return;
    }

    try {
        const decoded = verifyToken(token) as UserParams;
        if (!decoded.id) {
            invalidToken(res);
            return;
        }
        // handle requests not contain body like delete or (get if need auth)
        if (!req.body) {
            req.body = {};
        }
        req.body.user = decoded;
        next();
    } catch (error) {
        sendGeneralErrorResponse(res);
        return;
    }
};