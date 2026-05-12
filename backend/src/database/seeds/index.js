import bcrypt from 'bcryptjs';
import { query } from '../../config/db.js';

const seedData = async () => {
  try {
    console.log('Seeding data...');

    // Clear existing data
    await query('TRUNCATE users, institutes, classes, subjects, topics, chapters RESTART IDENTITY CASCADE');

    // 1. Create Institute
    const inst = await query("INSERT INTO institutes (name, address) VALUES ('Global Tech Institute', '123 Education Lane') RETURNING id");
    const instId = inst.rows[0].id;

    // 2. Create Subjects
    const sub = await query("INSERT INTO subjects (name) VALUES ('Mathematics'), ('Physics') RETURNING id, name");
    const mathId = sub.rows[0].id;

    // 3. Create Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      ['Dr. Sarah Mitchell', 'sarah@teacher.com', hashedPassword, 'teacher']
    );

    await query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
      ['Aarav Sharma', 'aarav@student.com', hashedPassword, 'student']
    );

    // 4. Create Topics
    const topic = await query(
      "INSERT INTO topics (name, subject_id, progress, status) VALUES ($1, $2, $3, $4) RETURNING id",
      ['Differential Calculus', mathId, 78, 'active']
    );
    const topicId = topic.rows[0].id;

    // 5. Create Chapters
    await query(
      "INSERT INTO chapters (topic_id, name, \"order\", progress, status) VALUES ($1, $2, $3, $4, $5)",
      [topicId, 'Limits and Continuity', 1, 100, 'completed']
    );

    console.log('Data seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
