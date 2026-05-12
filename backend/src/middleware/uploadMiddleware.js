import multer from 'multer';
import fs from 'fs';
import path from 'path';

// ======================================
// CREATE UPLOAD DIRECTORY
// ======================================
const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, {
    recursive: true,
  });
}

// ======================================
// STORAGE
// ======================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// ======================================
// FILE FILTER
// ======================================
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    '.pdf',
    '.doc',
    '.docx',
    '.ppt',
    '.pptx',
    '.png',
    '.jpg',
    '.jpeg',
  ];

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(ext)) {
    return cb(
      new Error('Unsupported file type'),
      false
    );
  }

  cb(null, true);
};

// ======================================
// UPLOAD
// ======================================
const upload = multer({
  storage,

  fileFilter,

  limits: {
    fileSize: 50 * 1024 * 1024,
  },
});

export default upload;