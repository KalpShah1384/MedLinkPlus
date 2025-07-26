import express from 'express';
import { medicinesController } from '../controllers/medicineController.js';

const router = express.Router();

router.get('/', medicinesController.getMedicines);
router.get('/:id', medicinesController.getMedicineById);
router.get('/:id/online', medicinesController.getMedicineOnline);

export default router;
