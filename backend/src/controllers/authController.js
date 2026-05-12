// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import { query } from '../config/db.js';
// import asyncHandler from '../utils/asyncHandler.js';
// import APIError from '../utils/APIError.js';

// export const register = asyncHandler(async (req, res, next) => {
//     const { name, email, password, role } = req.body;

//     const userExists = await query('SELECT * FROM users WHERE email = $1', [email]);
//     if (userExists.rows.length > 0) {
//         return next(new APIError('User already exists', 400));
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const result = await query(
//         'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
//         [name, email, hashedPassword, role || 'student']
//     );

//     sendTokenResponse(result.rows[0], 201, res);
// });

// export const login = asyncHandler(async (req, res, next) => {
//     const { email, password } = req.body;

//     const result = await query('SELECT * FROM users WHERE email = $1', [email]);
//     const user = result.rows[0];

//     if (!user || !(await bcrypt.compare(password, user.password))) {
//         return next(new APIError('Invalid credentials', 401));
//     }

//     sendTokenResponse(user, 200, res);
// });

// export const getMe = asyncHandler(async (req, res, next) => {
//     res.status(200).json({ success: true, data: req.user });
// });

// export const logout = asyncHandler(async (req, res, next) => {
//     res.cookie('token', 'none', {
//         expires: new Date(Date.now() + 10 * 1000),
//         httpOnly: true
//     });
//     res.status(200).json({ success: true, data: {} });
// });

// const sendTokenResponse = (user, statusCode, res) => {
//     const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
//         expiresIn: process.env.JWT_EXPIRE
//     });

//     const options = {
//       expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production'
//     };

//     res.status(statusCode).cookie('token', token, options).json({
//         success: true,
//         token,
//         user
//     });
// };

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { query } from '../config/db.js';

import asyncHandler from '../utils/asyncHandler.js';
import APIError from '../utils/APIError.js';

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || '7d',
        }
    );
};

const sendTokenResponse = (user, statusCode, res, message) => {
    const token = generateToken(user.id);

    const cookieOptions = {
        expires: new Date(
            Date.now() +
            Number(process.env.COOKIE_EXPIRE || 7) *
            24 *
            60 *
            60 *
            1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    };

    res
        .status(statusCode)
        .cookie('token', token, cookieOptions)
        .json({
            success: true,
            message,
            token,
            data: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
};

// ===============================
// REGISTER
// ===============================
export const register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    const existingUser = await query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
        return next(
            new APIError('User already exists with this email', 409)
        );
    }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
        `
        INSERT INTO users
        (name, email, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING id, name, email, role
        `,
        [
            name.trim(),
            email.toLowerCase(),
            hashedPassword,
            role || 'student',
        ]
    );

    sendTokenResponse(
        result.rows[0],
        201,
        res,
        'Account created successfully'
    );
});

// ===============================
// LOGIN
// ===============================
export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const result = await query(
        `
        SELECT id, name, email, password, role
        FROM users
        WHERE email = $1
        `,
        [email.toLowerCase()]
    );

    const user = result.rows[0];

    if (!user) {
        return next(
            new APIError('Invalid email or password', 401)
        );
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatched) {
        return next(
            new APIError('Invalid email or password', 401)
        );
    }

    sendTokenResponse(
        user,
        200,
        res,
        'Login successful'
    );
});

// ===============================
// GET CURRENT USER
// ===============================
export const getMe = asyncHandler(async (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'User fetched successfully',
        data: req.user,
    });
});

// ===============================
// LOGOUT
// ===============================
export const logout = asyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie('token', '', {
            expires: new Date(0),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })
        .json({
            success: true,
            message: 'Logged out successfully',
        });
});