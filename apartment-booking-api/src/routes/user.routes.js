import express from 'express';
import { register, getUser, login } from '../controllers/users.contoller.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getUser);

export default router;