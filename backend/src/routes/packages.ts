import { Router } from 'express';
import * as packagesController from '../controllers/packages.js';

const router = Router();

router.get('/', packagesController.getPackages);
router.post('/', packagesController.createPackage);
router.put('/:id', packagesController.updatePackage);
router.delete('/:id', packagesController.deletePackage);

export default router;
