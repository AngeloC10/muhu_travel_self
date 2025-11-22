import { Router } from 'express';
import * as reservationsController from '../controllers/reservations.js';

const router = Router();

router.get('/', reservationsController.getReservations);
router.post('/', reservationsController.createReservation);
router.put('/:id', reservationsController.updateReservation);
router.delete('/:id', reservationsController.deleteReservation);

export default router;
