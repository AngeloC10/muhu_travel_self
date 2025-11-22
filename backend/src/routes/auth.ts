import { Router } from 'express';
import * as authController from '../controllers/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.getProfile);

export default router;
