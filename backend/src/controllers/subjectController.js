import { query } from '../config/db.js';

import asyncHandler from '../utils/asyncHandler.js';

// =======================================
// GET ALL SUBJECTS
// =======================================
export const getSubjects = asyncHandler(
  async (req, res, next) => {
    const result = await query(
      `
      SELECT
        id,
        name,
        created_at
      FROM subjects
      ORDER BY name ASC
      `
    );

    res.status(200).json({
      success: true,
      message: 'Subjects fetched successfully',
      count: result.rows.length,
      data: result.rows,
    });
  }
);