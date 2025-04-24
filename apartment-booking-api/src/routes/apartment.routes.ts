import { Router } from 'express';
import {
  createApartment,
  getApartments,
  getApartment,
  updateApartment,
  deleteApartment,
} from '../controllers/apartment.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getApartments);
router.get('/:id', getApartment);
router.post('/', authenticateUser, createApartment);
router.put('/:id', authenticateUser, updateApartment);
router.delete('/:id', authenticateUser, deleteApartment);

export default router;