import express from 'express';
import { pool } from '../index.js';
import { protect } from '../middleware/auth.middleware.js'; 

const router = express.Router();


router.get('/', protect, async (req, res) => {
    try {
        const myvault = await pool.query(
            `SELECT m.movie_id, m.title, m.poster_path 
             FROM myvault w 
             JOIN movies m ON w.movie_id_ref = m.id 
             WHERE w.user_id = $1`,
            [req.user.id]
        );
        res.json(myvault.rows);
    } catch (err) {
        console.error("Myvault Fetch Error:", err.message);
        res.status(500).json({ error: 'Internal Server Error: Could not load myvault' });
    }
});


router.post('/add', protect, async (req, res) => {
    const { movieId, title, poster_path } = req.body; 
    const userId = req.user.id;

    if (!title || !movieId) {
        return res.status(400).json({ error: "Validation Error: Title and Movie ID are required" });
    }

    try {
        await pool.query(
            `INSERT INTO movies (movie_id, title, poster_path) 
             VALUES ($1, $2, $3) 
             ON CONFLICT (movie_id) DO NOTHING`,
            [movieId, title, poster_path]
        );

        const movieResult = await pool.query(
            'SELECT id FROM movies WHERE movie_id = $1',
            [movieId]
        );
        
        if (movieResult.rows.length === 0) {
            return res.status(404).json({ error: "Not Found: Movie reference failed" });
        }

        const dbMovieInternalId = movieResult.rows[0].id;

        await pool.query(
            `INSERT INTO myvault (user_id, movie_id_ref) 
             VALUES ($1, $2) 
             ON CONFLICT DO NOTHING`,
            [userId, dbMovieInternalId]
        );

        res.status(201).json({ message: 'Success: Added to myvault' });
    } catch (err) {
        console.error("Myvault Add Error:", err.message);
        res.status(500).json({ error: 'Internal Server Error: Database operation failed' });
    }
});


router.delete('/:movieId', protect, async (req, res) => {
    try {
        const result = await pool.query(
            `DELETE FROM myvault 
             WHERE user_id = $1 AND movie_id_ref = (SELECT id FROM movies WHERE movie_id = $2)`,
            [req.user.id, req.params.movieId]
        );
        
        res.json({ message: 'Success: Movie removed from myvault' });
    } catch (err) {
        console.error("Myvault Delete Error:", err.message);
        res.status(500).json({ error: 'Internal Server Error: Removal failed' });
    }
});

export default router;