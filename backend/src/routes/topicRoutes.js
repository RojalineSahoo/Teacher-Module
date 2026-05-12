import express from 'express';
import { getTopics, createTopic, getTopicWithChapters, addChapter } from '../controllers/topicController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getTopics)
    .post(protect, authorize('teacher', 'institute_admin', 'super_admin'), createTopic);

router.route('/:id')
    .get(protect, getTopicWithChapters);

router.post('/:id/chapters', protect, authorize('teacher', 'institute_admin', 'super_admin'), addChapter);

export default router;
