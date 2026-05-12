import { query } from '../config/db.js';
import asyncHandler from '../utils/asyncHandler.js';
import APIError from '../utils/APIError.js';

export const markAttendance = asyncHandler(async (req, res, next) => {
  const { schedule_id, date, students } = req.body;

  // Insert multiple records using a transaction-like approach or batch
  const promises = students.map(s => 
    query(
      'INSERT INTO attendance (student_id, schedule_id, date, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [s.student_id, schedule_id, date, s.status]
    )
  );

  await Promise.all(promises);

  res.status(200).json({ success: true, message: 'Attendance marked successfully' });
});

export const getAttendanceReport = asyncHandler(async (req, res, next) => {
    const result = await query(`
      SELECT
        st.id AS "studentId",
        st.name,
        c.name AS class,

        COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS present,
        COUNT(CASE WHEN a.status = 'absent' THEN 1 END) AS absent,
        COUNT(CASE WHEN a.status = 'late' THEN 1 END) AS late,

        ROUND(
          (
            COUNT(CASE WHEN a.status = 'present' THEN 1 END)::decimal
            /
            NULLIF(COUNT(a.id), 0)
          ) * 100,
          0
        ) AS percentage

      FROM students st

      LEFT JOIN attendance a
        ON st.id = a.student_id

      LEFT JOIN classes c
        ON st.class_id = c.id

      GROUP BY st.id, st.name, c.name

      ORDER BY st.name ASC
    `);

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  });

export const getStudentsByClass = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  const { class_id } = req.params;

  const result = await query(
    `SELECT * FROM students WHERE class_id = $1 ORDER BY roll_number ASC`,
    [class_id]
  );

  res.status(200).json({
    success: true,
    count: result.rows.length,
    data: result.rows,
  });
});