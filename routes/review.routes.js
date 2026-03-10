import express from 'express';
import { pool } from '../index.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/:movieId', async (req, res) => {
    const { movieId } = req.params;
    try {
        const result = await pool.query(
            'SELECT id, username, comment, created_at FROM reviews WHERE movie_id = $1 ORDER BY created_at DESC',
            [movieId]
        );
        
        // Return results to be displayed in the UI
        res.json(result.rows); 
    } catch (err) {
        console.error("Fetch Reviews Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Unable to fetch reviews" });
    }
});


router.post('/add', protect, async (req, res) => {
    const { movieId, comment } = req.body;
    
    // Basic validation to ensure comment is not empty
    if (!comment || comment.trim() === "") {
        return res.status(400).json({ error: "Validation Error: Comment cannot be empty" });
    }

    const userId = req.user.id;
    const username = req.user.username;

    try {
        const result = await pool.query(
            'INSERT INTO reviews (movie_id, user_id, username, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [movieId, userId, username, comment]
        );
        
        res.status(201).json({
            message: "Success: Review posted successfully",
            review: result.rows[0]
        });
    } catch (err) {
        console.error("Add Review Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Failed to save your review" });
    }
});

export default router;