const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - list all notices (newest first)
router.get('/', async (req, res) => {
    const [notices] = await pool.query('SELECT * FROM notices ORDER BY notice_date DESC, notice_id DESC');
    res.render('notices/list', { notices, today: new Date().toISOString().slice(0, 10) });
});

// POST - add a new notice
router.post('/add', async (req, res) => {
    const { notice_text, notice_date } = req.body;
    try {
        await pool.query('INSERT INTO notices (notice_text, notice_date) VALUES (?, ?)', [notice_text, notice_date]);
        req.flash('success', 'सूचना जोड़ी गई।');
    } catch (err) {
        console.error(err);
        req.flash('error', 'सूचना जोड़ने में त्रुटि हुई।');
    }
    res.redirect('/notices');
});

// POST - delete a notice
router.post('/delete/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM notices WHERE notice_id = ?', [req.params.id]);
        req.flash('success', 'सूचना हटाई गई।');
    } catch (err) {
        console.error(err);
        req.flash('error', 'हटाने में त्रुटि हुई।');
    }
    res.redirect('/notices');
});

module.exports = router;
