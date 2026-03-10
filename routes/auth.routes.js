import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../index.js'; 

const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role',
            [username, email, hashedPassword, 'user'] 
        );
        
        res.status(201).json({ 
            message: 'User registered successfully',
            user: newUser.rows[0]
        });
    } catch (err) {

        if (err.code === '23505') { 
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        console.error("Registration Error:", err.message);
        res.status(500).json({ error: 'Internal Server Error: Registration failed' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials: User not found' });
        }

        const user = userResult.rows[0];

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials: Password incorrect' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_key_123',
            { expiresIn: '2h' }
        );

        res.json({ 
            token, 
            user: { 
                id: user.id,
                username: user.username, 
                email: user.email,
                role: user.role 
            } 
        });
    } catch (err) {
        console.error("Login Error:", err.message);
        res.status(500).json({ error: 'Internal Server Error: Login process failed' });
    }
});

export default router;