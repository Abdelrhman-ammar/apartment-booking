import { Response } from 'express'; // Make sure to import Express types

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

export const sendGeneralErrorResponse = (res: Response): void => {
  const status = 500; // HTTP statusCodes.INTERNAL_SERVER_ERROR
  res.status(status).json(
    generateResponse({
      status,
      error: "General Error"
    })
  );
};
