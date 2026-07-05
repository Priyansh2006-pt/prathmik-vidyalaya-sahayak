const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - list recent MDM entries + the add form
router.get('/', async (req, res) => {
    const [entries] = await pool.query('SELECT * FROM mdm_record ORDER BY mdm_date DESC LIMIT 31');
    res.render('mdm/entry', { entries, today: new Date().toISOString().slice(0, 10) });
});

// POST - add / update today's (or any date's) MDM entry
router.post('/add', async (req, res) => {
    const { mdm_date, total_present, meal_taken_count, menu, meal_cooked, remarks } = req.body;

    try {
        await pool.query(
            `INSERT INTO mdm_record (mdm_date, total_present, meal_taken_count, menu, meal_cooked, remarks)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                total_present = VALUES(total_present),
                meal_taken_count = VALUES(meal_taken_count),
                menu = VALUES(menu),
                meal_cooked = VALUES(meal_cooked),
                remarks = VALUES(remarks)`,
            [mdm_date, total_present || 0, meal_taken_count || 0, menu, meal_cooked, remarks]
        );
        req.flash('success', `${mdm_date} की मध्याह्न भोजन जानकारी सेव हो गई।`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'सेव करने में त्रुटि हुई।');
    }
    res.redirect('/mdm');
});

// GET - monthly MDM summary report
router.get('/monthly', async (req, res) => {
    const selectedMonth = req.query.month || new Date().toISOString().slice(0, 7);

    const [rows] = await pool.query(
        `SELECT * FROM mdm_record WHERE DATE_FORMAT(mdm_date, '%Y-%m') = ? ORDER BY mdm_date`,
        [selectedMonth]
    );

    const totals = rows.reduce((acc, r) => {
        acc.totalDays += 1;
        acc.daysCooked += (r.meal_cooked === 'Yes' ? 1 : 0);
        acc.totalMealsServed += r.meal_taken_count || 0;
        return acc;
    }, { totalDays: 0, daysCooked: 0, totalMealsServed: 0 });

    res.render('mdm/monthly-report', { rows, totals, selectedMonth });
});

module.exports = router;
