import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from 'pg';

import authRoutes from './routes/auth.routes.js';
import adminRoutes from './routes/admin.routes.js';
import movieRoutes from './routes/movie.routes.js';
import reviewRoutes from './routes/review.routes.js';
import myvaultRoutes from './routes/myvault.routes.js';

const { Pool } = pkg;
dotenv.config();

const app = express();

// 1. Middleware Configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default URL
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

export const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'movievault', 
    password: process.env.DB_PASSWORD || '0000', 
    port: process.env.DB_PORT || 5432,
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Critical Error: Could not connect to database', err.stack);
    }
    console.log('Database Connection: Established Successfully (movievault)');
    release();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/myvault', myvaultRoutes);

app.get('/', (req, res) => {
    res.json({ status: "Online", message: "MovieVault API is running smoothly" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server Status: Running on http://localhost:${PORT}`);
});