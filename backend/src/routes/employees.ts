import { Router } from 'express';
import * as employeesController from '../controllers/employees.js';

const router = Router();

router.get('/', employeesController.getEmployees);
router.post('/', employeesController.createEmployee);
router.put('/:id', employeesController.updateEmployee);
router.delete('/:id', employeesController.deleteEmployee);

export default router;
