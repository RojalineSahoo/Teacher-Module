import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

// Utilities & Middleware
import errorHandler from './middleware/errorMiddleware.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import classRoutes from './routes/classRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import grievanceRoutes from './routes/grievanceRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import creatorStudioRoutes from './routes/creatorStudioRoutes.js';
import swaggerUi from 'swagger-ui-express';
import specs from './config/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
//app.use('/api', limiter);

// Standard Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  '/api/v1/creator-studio',
  creatorStudioRoutes
);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/topics', topicRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/classes', classRoutes);
app.use('/api/v1/assignments', assignmentRoutes);
app.use('/api/v1/assessments', assessmentRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/subjects', subjectRoutes);
app.use(
  '/api/v1/materials',
  materialRoutes
);
app.use(
  '/uploads',
  express.static('uploads')
);
app.use('/api/v1/grievances', grievanceRoutes);

// Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Root Route
app.get('/', (req, res) => {
    res.json({ message: 'Teacher Module API Rebuild v1' });
});

// 404 Handler
app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;