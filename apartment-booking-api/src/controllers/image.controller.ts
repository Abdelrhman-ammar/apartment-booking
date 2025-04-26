import { Request, Response } from 'express';
import { ImageService } from '../services/image.service';
import { sendGeneralErrorResponse, generateResponse } from '../utils/response';
import { statusCodes } from '../utils/status-responses';

const imageService = new ImageService();
const generalErrorHint = 'Image';

export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      const response = generateResponse({status: 400, error: 'No file uploaded'});
      res.status(response.status).json(response);
      return;
    }

    const modelId = Number(req.body.modelId);
    const { modelName } = req.body;

    const result = await imageService.addImageToModel(req, modelName, modelId, req.file);
    res.status(result.status).json(result);
  } catch (error) {
    sendGeneralErrorResponse(res, generalErrorHint);
    console.error(error);
  }
};
