import { Request, Response, NextFunction } from 'express';
import { generateResponse } from '../utils/response';
import { statusCodes } from '../utils/status-responses';

// Middleware for handling 404 errors (Not Found)
export const notFoundEndpoint = (req: Request, res: Response, next: NextFunction) => {
    const response = generateResponse({
        status: statusCodes.NOT_FOUND,
        error: 'Not Found',
        message: `The requested endpoint ${req.originalUrl} does not exist.`
    });
    res.status(response.status).json(response);
};
