import express from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validationMiddleware.js';
import { registerValidation, loginValidation } from '../validations/authValidation.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: {type: string}
 *               email: {type: string}
 *               password: {type: string}
 *               role: {type: string, enum: [super_admin, institute_admin, teacher, student, parent]}
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', registerValidation, validate, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: {type: string}
 *               password: {type: string}
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.get('/logout', logout);

export default router;