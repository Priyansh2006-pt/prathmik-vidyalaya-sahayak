const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - list all teachers (with optional search)
router.get('/', async (req, res) => {
    const { search } = req.query;
    let sql = 'SELECT * FROM teachers WHERE is_active = 1';
    const params = [];

    if (search) {
        sql += ' AND teacher_name LIKE ?';
        params.push(`%${search}%`);
    }
    sql += ' ORDER BY teacher_name';

    const [teachers] = await pool.query(sql, params);
    res.render('teachers/list', { teachers, search: search || '' });
});

// GET - add teacher form
router.get('/add', (req, res) => {
    res.render('teachers/form', { teacher: null, formAction: '/teachers/add' });
});

// POST - save new teacher
router.post('/add', async (req, res) => {
    const { teacher_name, designation, mobile_number, qualification, class_subject, joining_date } = req.body;
    try {
        await pool.query(
            `INSERT INTO teachers (teacher_name, designation, mobile_number, qualification, class_subject, joining_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [teacher_name, designation, mobile_number, qualification, class_subject, joining_date || null]
        );
        req.flash('success', 'शिक्षक सफलतापूर्वक जोड़े गए।');
        res.redirect('/teachers');
    } catch (err) {
        console.error(err);
        req.flash('error', 'जोड़ने में त्रुटि हुई।');
        res.redirect('/teachers/add');
    }
});

// GET - edit teacher form
router.get('/edit/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM teachers WHERE teacher_id = ?', [req.params.id]);
    if (rows.length === 0) {
        req.flash('error', 'शिक्षक नहीं मिले।');
        return res.redirect('/teachers');
    }
    res.render('teachers/form', { teacher: rows[0], formAction: `/teachers/edit/${req.params.id}` });
});

// POST - update teacher
router.post('/edit/:id', async (req, res) => {
    const { teacher_name, designation, mobile_number, qualification, class_subject, joining_date } = req.body;
    try {
        await pool.query(
            `UPDATE teachers SET teacher_name = ?, designation = ?, mobile_number = ?,
             qualification = ?, class_subject = ?, joining_date = ? WHERE teacher_id = ?`,
            [teacher_name, designation, mobile_number, qualification, class_subject, joining_date || null, req.params.id]
        );
        req.flash('success', 'जानकारी अपडेट हो गई।');
        res.redirect('/teachers');
    } catch (err) {
        console.error(err);
        req.flash('error', 'अपडेट करने में त्रुटि हुई।');
        res.redirect(`/teachers/edit/${req.params.id}`);
    }
});

// POST - delete (soft delete)
router.post('/delete/:id', async (req, res) => {
    try {
        await pool.query('UPDATE teachers SET is_active = 0 WHERE teacher_id = ?', [req.params.id]);
        req.flash('success', 'शिक्षक हटा दिए गए।');
    } catch (err) {
        console.error(err);
        req.flash('error', 'हटाने में त्रुटि हुई।');
    }
    res.redirect('/teachers');
});

module.exports = router;
