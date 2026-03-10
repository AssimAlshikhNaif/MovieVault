import jwt from 'jsonwebtoken';
import { pool } from '../index.js';

/**
 * Middleware to protect routes - ensures user is authenticated
 */
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

            // Fetch user from database and exclude password for security
            const userResult = await pool.query(
                'SELECT id, username, email, role FROM users WHERE id = $1', 
                [decoded.id]
            );
            
            if (userResult.rows.length === 0) {
                return res.status(401).json({ error: "Unauthorized: User not found" });
            }

            // Attach user object to the request
            req.user = userResult.rows[0];
            next();
        } catch (error) {
            return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
        }
    }

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
};

/**
 * Middleware to restrict access to admin users only
 */
export const admin = (req, res, next) => {
    // Check for different possible formats of the admin role
    const isAdmin = req.user && (
        req.user.role === 'admin' || 
        req.user.role === 1 || 
        req.user.role === true
    );
    
    if (isAdmin) {
        next();
    } else {
        res.status(403).json({ error: "Forbidden: Admin access required" });
    }
};