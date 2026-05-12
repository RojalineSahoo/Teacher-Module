import express from 'express';
import { createAssessment, getAssessments, submitResult, getLeaderboard } from '../controllers/assessmentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validationMiddleware.js';
import { assessmentValidation, resultValidation } from '../validations/assessmentValidation.js';

const router = express.Router();

router.route('/')
    .get(protect, getAssessments)
    .post(protect, authorize('teacher', 'institute_admin', 'super_admin'), assessmentValidation, validate, createAssessment);

router.post('/results', protect, authorize('teacher', 'institute_admin', 'super_admin'), resultValidation, validate, submitResult);
router.get('/:id/leaderboard', protect, getLeaderboard);

export default router;
