import { Router } from 'express';
import * as usersController from '../controllers/users.js';

const router = Router();

router.get('/', usersController.getUsers);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

export default router;
