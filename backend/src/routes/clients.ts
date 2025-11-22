import { Router } from 'express';
import * as clientsController from '../controllers/clients.js';

const router = Router();

router.get('/', clientsController.getClients);
router.post('/', clientsController.createClient);
router.post('/upsert', clientsController.upsertClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);

export default router;
