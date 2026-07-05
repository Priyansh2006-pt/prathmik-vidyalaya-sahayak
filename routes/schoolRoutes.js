const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - show setup form (only really needed on first run, but reachable anytime to edit)
router.get('/setup', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM school_profile LIMIT 1');
    res.render('school/setup', { school: rows[0] || null });
});

// POST - save school profile (insert if none exists, else update the single row)
router.post('/setup', async (req, res) => {
    const {
        school_name, village_area, block_name, district_name,
        state_name, udise_code, headmaster_name, mobile_number
    } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM school_profile LIMIT 1');

        if (rows.length === 0) {
            await pool.query(
                `INSERT INTO school_profile
                 (school_name, village_area, block_name, district_name, state_name, udise_code, headmaster_name, mobile_number)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [school_name, village_area, block_name, district_name, state_name, udise_code, headmaster_name, mobile_number]
            );
            req.flash('success', 'विद्यालय की जानकारी सफलतापूर्वक सेव हो गई!');
        } else {
            await pool.query(
                `UPDATE school_profile SET
                 school_name = ?, village_area = ?, block_name = ?, district_name = ?,
                 state_name = ?, udise_code = ?, headmaster_name = ?, mobile_number = ?
                 WHERE school_id = ?`,
                [school_name, village_area, block_name, district_name, state_name, udise_code, headmaster_name, mobile_number, rows[0].school_id]
            );
            req.flash('success', 'विद्यालय की जानकारी अपडेट हो गई!');
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'सेव करने में त्रुटि हुई। (Error saving school profile)');
        res.redirect('/school/setup');
    }
});

module.exports = router;
