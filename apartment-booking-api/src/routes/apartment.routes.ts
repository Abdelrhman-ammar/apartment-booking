import { Router } from 'express';
import {
  createApartment,
  getApartments,
  getApartment,
  filterApartments,
  updateApartment,
  deleteApartment,
} from '../controllers/apartment.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', getApartments);
router.post('/filter', filterApartments);
router.get('/:id', getApartment);
// need auth
router.post('/', authenticateUser, createApartment);
router.put('/:id', authenticateUser, updateApartment);
router.delete('/:id', authenticateUser, deleteApartment);

export default router;