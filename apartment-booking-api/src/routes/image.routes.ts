import { Router } from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/image.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const maxImageSize = Number(process.env.MAX_IMAGE_SIZE) || 5 * 1024 * 1024;
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: maxImageSize,
  }
});

const router = Router();
router.post('/', authenticateUser, upload.single('image'), uploadImage);

export default router;