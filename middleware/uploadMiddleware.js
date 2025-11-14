/*
MIT License

Copyright (c) 2025 Christian I. Cabrera || XianFire Framework
Mindoro State University - Philippines
*/

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directories exist
const paymentsDir = path.join(__dirname, '../public/uploads/payments');
const profilesDir = path.join(__dirname, '../public/uploads/profiles');

[paymentsDir, profilesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Sanitize filename
const sanitizeFilename = (filename) => {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// Configure storage for payment proofs
const paymentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, paymentsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitized = sanitizeFilename(path.parse(file.originalname).name);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `payment-${uniqueSuffix}-${sanitized}${ext}`);
  }
});

// Configure storage for profile pictures
const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, profilesDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const sanitized = sanitizeFilename(path.parse(file.originalname).name);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `profile-${uniqueSuffix}-${sanitized}${ext}`);
  }
});

// Enhanced file filter for images
const imageFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed!'));
  }
};

// Export upload middleware with error handling
export const uploadPaymentProof = (req, res, next) => {
  const upload = multer({
    storage: paymentStorage,
    limits: { 
      fileSize: 5 * 1024 * 1024, // 5MB limit
      files: 1
    },
    fileFilter: imageFilter
  }).single('paymentProof');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error_msg', 'File size too large. Maximum size is 5MB.');
      } else if (err.code === 'LIMIT_FILE_COUNT') {
        req.flash('error_msg', 'Too many files. Only one file allowed.');
      } else {
        req.flash('error_msg', `Upload error: ${err.message}`);
      }
      return res.redirect('/bookings');
    } else if (err) {
      req.flash('error_msg', err.message);
      return res.redirect('/bookings');
    }
    next();
  });
};

export const uploadProfilePicture = (req, res, next) => {
  const upload = multer({
    storage: profileStorage,
    limits: { 
      fileSize: 2 * 1024 * 1024, // 2MB limit
      files: 1
    },
    fileFilter: imageFilter
  }).single('profilePicture');

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        req.flash('error_msg', 'File size too large. Maximum size is 2MB.');
      } else {
        req.flash('error_msg', `Upload error: ${err.message}`);
      }
      return res.redirect('/profile');
    } else if (err) {
      req.flash('error_msg', err.message);
      return res.redirect('/profile');
    }
    next();
  });
};
