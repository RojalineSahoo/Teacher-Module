import { query } from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import APIError from '../utils/APIError.js';

export const createAssessment = asyncHandler(async (req, res, next) => {
  const { title, type, subject_id, class_id, total_marks, date } = req.body;

  const result = await query(
    `INSERT INTO assessments (title, type, subject_id, class_id, total_marks, date) 
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, type, subject_id, class_id, total_marks, date]
  );

  res.status(201).json({ success: true, data: result.rows[0] });
});

export const getAssessments = asyncHandler(async (req, res, next) => {
  const result = await query(`
    SELECT a.*, s.name as subject_name, c.name as class_name
    FROM assessments a
    JOIN subjects s ON a.subject_id = s.id
    JOIN classes c ON a.class_id = c.id
  `);
  res.status(200).json({ success: true, count: result.rows.length, data: result.rows });
});

export const submitResult = asyncHandler(async (req, res, next) => {
  const { assessment_id, student_id, marks_obtained } = req.body;

  // Verify total marks
  const assessment = await query('SELECT total_marks FROM assessments WHERE id = $1', [assessment_id]);
  if (assessment.rows.length === 0) return next(new APIError('Assessment not found', 404));

  if (marks_obtained > assessment.rows[0].total_marks) {
    return next(new APIError('Marks obtained cannot exceed total marks', 400));
  }

  const result = await query(
    `INSERT INTO results (assessment_id, student_id, marks_obtained) 
     VALUES ($1, $2, $3) 
     ON CONFLICT (assessment_id, student_id) DO UPDATE 
     SET marks_obtained = EXCLUDED.marks_obtained 
     RETURNING *`,
    [assessment_id, student_id, marks_obtained]
  );

  res.status(200).json({ success: true, data: result.rows[0] });
});

export const getLeaderboard = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const result = await query(
    `SELECT r.*, u.name as student_name
     FROM results r
     JOIN users u ON r.student_id = u.id
     WHERE r.assessment_id = $1
     ORDER BY r.marks_obtained DESC
     LIMIT 10`,
    [id]
  );
  res.status(200).json({ success: true, data: result.rows });
});
