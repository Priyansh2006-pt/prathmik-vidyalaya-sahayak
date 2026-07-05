const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// GET - login page
router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/');
    res.render('auth/login');
});

// POST - handle login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (rows.length === 0) {
            req.flash('error', 'गलत यूज़रनेम या पासवर्ड।');
            return res.redirect('/auth/login');
        }

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            req.flash('error', 'गलत यूज़रनेम या पासवर्ड।');
            return res.redirect('/auth/login');
        }

        req.session.user = {
            user_id: user.user_id,
            full_name: user.full_name,
            username: user.username,
            role: user.role
        };

        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'लॉगिन में त्रुटि हुई।');
        res.redirect('/auth/login');
    }
});

// GET - logout
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
});

module.exports = router;
