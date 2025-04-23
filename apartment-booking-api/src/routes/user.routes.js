import express from 'express';
import { register, getUser } from '../controllers/users.contoller.js';

const router = express.Router();

router.post('/register', register);
router.get('/:id', getUser);

export default router;