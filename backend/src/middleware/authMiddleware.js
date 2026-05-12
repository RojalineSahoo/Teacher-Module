import jwt from 'jsonwebtoken';

import { query } from '../config/db.js';

import asyncHandler from '../utils/asyncHandler.js';
import APIError from '../utils/APIError.js';

// ======================================
// PROTECT ROUTES
// ======================================
export const protect = asyncHandler(
  async (req, res, next) => {
    let token;

    // ==============================
    // GET TOKEN
    // ==============================
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        'Bearer'
      )
    ) {
      token =
        req.headers.authorization.split(
          ' '
        )[1];
    }

    // ==============================
    // COOKIE FALLBACK
    // ==============================
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ==============================
    // NO TOKEN
    // ==============================
    if (!token) {
      return next(
        new APIError(
          'Not authorized to access this route',
          401
        )
      );
    }

    try {
      // ==========================
      // VERIFY TOKEN
      // ==========================
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );

      // ==========================
      // FIND USER
      // ==========================
      const result = await query(
        `
        SELECT
          id,
          name,
          email,
          role
        FROM users
        WHERE id = $1
        `,
        [decoded.id]
      );

      const user = result.rows[0];

      // ==========================
      // USER NOT FOUND
      // ==========================
      if (!user) {
        return next(
          new APIError(
            'User no longer exists',
            401
          )
        );
      }

      // ==========================
      // ATTACH USER
      // ==========================
      req.user = user;

      next();
    } catch (error) {
      return next(
        new APIError(
          'Invalid or expired token',
          401
        )
      );
    }
  }
);

// ======================================
// ROLE AUTHORIZATION
// ======================================
export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(
        new APIError(
          'User authorization failed',
          401
        )
      );
    }

    if (
      !roles.includes(req.user.role)
    ) {
      return next(
        new APIError(
          `Role '${req.user.role}' is not authorized to access this resource`,
          403
        )
      );
    }

    next();
  };