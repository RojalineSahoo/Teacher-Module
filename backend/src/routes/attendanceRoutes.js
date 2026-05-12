import express from 'express';
import { markAttendance, getAttendanceReport, getStudentsByClass } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validationMiddleware.js';
import { markAttendanceValidation } from '../validations/attendanceValidation.js';

const router = express.Router();

router.post('/mark', protect, authorize('teacher', 'institute_admin', 'super_admin'), markAttendanceValidation, validate, markAttendance);
router.get('/report', protect, getAttendanceReport);
router.get('/students/:class_id',
    getStudentsByClass
);

export default router;
