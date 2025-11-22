import { Router } from 'express';
import * as providersController from '../controllers/providers.js';

const router = Router();

router.get('/', providersController.getProviders);
router.post('/', providersController.createProvider);
router.put('/:id', providersController.updateProvider);
router.delete('/:id', providersController.deleteProvider);

export default router;
