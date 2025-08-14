import express from 'express';
import { checkSymptoms, checkSymptomsImage } from '../controllers/symptomCheckerController.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// POST /api/symptom-checker
router.post('/', checkSymptoms);
// POST /api/symptom-checker/image
router.post('/image', upload.single('image'), checkSymptomsImage);

export default router;
