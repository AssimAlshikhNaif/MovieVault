import express from 'express';
import { pool } from '../index.js'; 
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/stats', protect, admin, async (req, res) => {
    try {
        const [movieRes, userRes] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM movies'),
            pool.query('SELECT COUNT(*) FROM users')
        ]);

        let totalReviews = 0;
        try {
            const reviewRes = await pool.query('SELECT COUNT(*) FROM reviews');
            totalReviews = parseInt(reviewRes.rows[0].count);
        } catch (e) {
            totalReviews = 0;
        }

        res.json({
            totalMovies: parseInt(movieRes.rows[0].count) || 0,
            totalUsers: parseInt(userRes.rows[0].count) || 0,
            totalReviews: totalReviews,
            serverStatus: "Healthy",
            timestamp: new Date().toISOString()
        });
    } catch (err) {
        console.error("Dashboard Stats Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Failed to fetch dashboard metrics" });
    }
});


router.get('/users', protect, admin, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, username, email, role, created_at FROM users ORDER BY created_at DESC'
        );
        res.json(result.rows);
    } catch (err) {
        console.error("User List Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Unable to retrieve user database" });
    }
});

export default router;