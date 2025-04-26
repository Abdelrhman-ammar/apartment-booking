import { Request } from 'express';
import fs from 'fs';
import path from 'path';
import prisma from '../prisma/client';
import { generateResponse, ResponseObject } from '../utils/response';
import { statusCodes } from '../utils/status-responses';

const supportedModels = ['apartment'];

export class ImageService {
  async addImageToModel(req: Request, modelName: string, modelId: number, file: Express.Multer.File): Promise<ResponseObject> {
    if (!supportedModels.includes(modelName)) {
      return generateResponse({
        status: statusCodes.BAD_REQUEST,
        message: 'Invalid model name',
      });
    }

    const model = await this.getById(modelName, modelId);
    if (!model) {
      return generateResponse({
        status: statusCodes.NOT_FOUND,
        message: `${modelName} with id ${modelId} not found`,
      });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'images', modelName, modelId.toString());
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, file.buffer);

    const relativePath = path.join('uploads', 'images', modelName, modelId.toString(), fileName);
    const updatedModel = await this.updateImages(modelName, modelId, relativePath);

    return generateResponse({
      status: statusCodes.OK,
      data: updatedModel,
      message: 'Image uploaded successfully',
    });
  }

  private async getById(modelName: string, modelId: number) {
    const model = (prisma as any)[modelName.toLowerCase()];
    if (!model) return null;
  
    return model.findUnique({
      where: { id: modelId },
    });
  }

  private async updateImages(modelName: string, modelId: number, imagePath: string) {
    const model = (prisma as any)[modelName.toLowerCase()];
    if (!model) return null;
  
    const existingRecord = await model.findUnique({
      where: { id: modelId },
      include: { owner: true },
    });
  
    if (!existingRecord) return null;
  
    const updatedImages = [...(existingRecord.images || []), imagePath];
  
    const updated = await model.update({
      where: { id: modelId },
      data: { images: updatedImages },
      include: { owner: true },
    });
  
    return updated;
  }
}
