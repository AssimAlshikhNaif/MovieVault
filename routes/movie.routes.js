import express from 'express';
import { pool } from '../index.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/all', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM movies ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error("Fetch Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Failed to load movies" });
    }
});


router.post('/add', protect, admin, async (req, res) => {
    const { tmdbId, title, posterPath } = req.body;

    if (!tmdbId || !title || !posterPath) {
        return res.status(400).json({ error: "Validation Error: All fields are required" });
    }

    try {
        const result = await pool.query(
            'INSERT INTO movies (movie_id, title, poster_path) VALUES ($1, $2, $3) RETURNING *',
            [tmdbId, title, posterPath]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Conflict: Movie already exists in your records" });
        }
        console.error("Insert Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Failed to save movie" });
    }
});


router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const result = await pool.query('DELETE FROM movies WHERE id = $1 RETURNING *', [req.params.id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not Found: Movie does not exist" });
        }
        
        res.json({ message: "Success: Movie deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Deletion failed" });
    }
});


router.put('/:id', protect, admin, async (req, res) => {
    const { id } = req.params;
    const { tmdbId, title, posterPath } = req.body;

    if (!tmdbId || !title || !posterPath) {
        return res.status(400).json({ error: "Validation Error: All fields must be provided" });
    }

    try {
        const result = await pool.query(
            'UPDATE movies SET movie_id = $1, title = $2, poster_path = $3 WHERE id = $4 RETURNING *',
            [tmdbId, title, posterPath, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Not Found: Movie not found in database" });
        }

        res.json({
            message: "Success: Movie details updated",
            movie: result.rows[0]
        });
    } catch (err) {
        console.error("Update Error:", err.message);
        res.status(500).json({ error: "Internal Server Error: Update failed" });
    }
});

export default router;