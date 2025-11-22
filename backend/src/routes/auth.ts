import { Router } from 'express';
import * as authController from '../controllers/auth.js';

import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authMiddleware, authController.getProfile);

export default router;
