import { Response } from 'express';
import { statusCodes } from './status-responses';

export interface ResponseObject {
  success: boolean;
  status: number;
  message?: string;
  error?: string;
  data?: unknown;
}

export interface ResponseParams {
  status: number;
  message?: string;
  error?: string;
  data?: unknown;
}

export const generateResponse = ({ status, message, error, data }: ResponseParams): ResponseObject => {
  const response: ResponseObject = {
    success: status < 300,
    status
  };

  if (message) response.message = message;
  if (error) response.error = error;
  if (data) response.data = data;

  return response;
};

export const sendGeneralErrorResponse = (res: Response, hint: string = ''): void => {
  const status = statusCodes.INTERNAL_SERVER_ERROR;
  res.status(status).json(
    generateResponse({
      status,
      error: "General Error " + hint
    })
  );
};

export const jwtExpiredResponse = (res: Response): void => {
  const status = statusCodes.UNAUTHORIZED;
  res.status(status).json(
    generateResponse({
      status,
      error: "Token expired"
    })
  );
};
