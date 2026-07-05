const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - list all active students with their current distribution status
router.get('/', async (req, res) => {
    const { class_filter } = req.query;

    let sql = `
        SELECT s.student_id, s.student_name, s.class_name, s.roll_number,
               d.books_received, d.uniform_received, d.bag_received, d.shoes_received, d.distribution_date
        FROM students s
        LEFT JOIN distribution_record d ON d.student_id = s.student_id
        WHERE s.is_active = 1`;
    const params = [];

    if (class_filter) {
        sql += ' AND s.class_name = ?';
        params.push(class_filter);
    }
    sql += ' ORDER BY s.class_name, CAST(s.roll_number AS UNSIGNED)';

    const [rows] = await pool.query(sql, params);
    const [classes] = await pool.query(
        'SELECT DISTINCT class_name FROM students WHERE is_active = 1 ORDER BY class_name'
    );

    res.render('distribution/list', {
        rows,
        classes: classes.map(c => c.class_name),
        class_filter: class_filter || ''
    });
});

// POST - update a single student's distribution status
router.post('/update/:studentId', async (req, res) => {
    const { books_received, uniform_received, bag_received, shoes_received, distribution_date } = req.body;
    const studentId = req.params.studentId;

    try {
        await pool.query(
            `INSERT INTO distribution_record
             (student_id, books_received, uniform_received, bag_received, shoes_received, distribution_date)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                books_received = VALUES(books_received),
                uniform_received = VALUES(uniform_received),
                bag_received = VALUES(bag_received),
                shoes_received = VALUES(shoes_received),
                distribution_date = VALUES(distribution_date)`,
            [studentId, books_received || 'No', uniform_received || 'No', bag_received || 'No', shoes_received || 'No', distribution_date || null]
        );
        req.flash('success', 'वितरण की जानकारी अपडेट हो गई।');
    } catch (err) {
        console.error(err);
        req.flash('error', 'अपडेट करने में त्रुटि हुई।');
    }
    res.redirect('/distribution');
});

// GET - pending students list (any item still 'No' or no record at all)
router.get('/pending', async (req, res) => {
    const [rows] = await pool.query(
        `SELECT s.student_id, s.student_name, s.class_name, s.roll_number,
                COALESCE(d.books_received, 'No') AS books_received,
                COALESCE(d.uniform_received, 'No') AS uniform_received,
                COALESCE(d.bag_received, 'No') AS bag_received,
                COALESCE(d.shoes_received, 'No') AS shoes_received
         FROM students s
         LEFT JOIN distribution_record d ON d.student_id = s.student_id
         WHERE s.is_active = 1
           AND (COALESCE(d.books_received,'No') = 'No'
             OR COALESCE(d.uniform_received,'No') = 'No'
             OR COALESCE(d.bag_received,'No') = 'No'
             OR COALESCE(d.shoes_received,'No') = 'No')
         ORDER BY s.class_name, CAST(s.roll_number AS UNSIGNED)`
    );

    res.render('distribution/pending', { rows });
});

module.exports = router;
