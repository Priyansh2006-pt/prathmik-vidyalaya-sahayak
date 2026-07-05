const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - list all students (with optional class filter and name/roll search)
router.get('/', async (req, res) => {
    const { class_filter, search } = req.query;

    let sql = 'SELECT * FROM students WHERE is_active = 1';
    const params = [];

    if (class_filter) {
        sql += ' AND class_name = ?';
        params.push(class_filter);
    }
    if (search) {
        sql += ' AND (student_name LIKE ? OR roll_number LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
    }
    sql += ' ORDER BY class_name, CAST(roll_number AS UNSIGNED)';

    const [students] = await pool.query(sql, params);
    const [classes] = await pool.query(
        'SELECT DISTINCT class_name FROM students WHERE is_active = 1 ORDER BY class_name'
    );

    res.render('students/list', {
        students,
        classes: classes.map(c => c.class_name),
        class_filter: class_filter || '',
        search: search || ''
    });
});

// GET - add student form
router.get('/add', (req, res) => {
    res.render('students/form', { student: null, formAction: '/students/add' });
});

// POST - save new student
router.post('/add', async (req, res) => {
    const {
        student_name, class_name, roll_number, father_name, mother_name,
        dob, gender, address, guardian_mobile, admission_date
    } = req.body;

    try {
        await pool.query(
            `INSERT INTO students
             (student_name, class_name, roll_number, father_name, mother_name, dob, gender, address, guardian_mobile, admission_date)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [student_name, class_name, roll_number, father_name, mother_name, dob || null, gender, address, guardian_mobile, admission_date || null]
        );
        req.flash('success', 'छात्र सफलतापूर्वक जोड़ा गया।');
        res.redirect('/students');
    } catch (err) {
        console.error(err);
        req.flash('error', 'छात्र जोड़ने में त्रुटि हुई।');
        res.redirect('/students/add');
    }
});

// GET - edit student form
router.get('/edit/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [req.params.id]);
    if (rows.length === 0) {
        req.flash('error', 'छात्र नहीं मिला।');
        return res.redirect('/students');
    }
    res.render('students/form', { student: rows[0], formAction: `/students/edit/${req.params.id}` });
});

// POST - update student
router.post('/edit/:id', async (req, res) => {
    const {
        student_name, class_name, roll_number, father_name, mother_name,
        dob, gender, address, guardian_mobile, admission_date
    } = req.body;

    try {
        await pool.query(
            `UPDATE students SET
             student_name = ?, class_name = ?, roll_number = ?, father_name = ?, mother_name = ?,
             dob = ?, gender = ?, address = ?, guardian_mobile = ?, admission_date = ?
             WHERE student_id = ?`,
            [student_name, class_name, roll_number, father_name, mother_name, dob || null, gender, address, guardian_mobile, admission_date || null, req.params.id]
        );
        req.flash('success', 'छात्र की जानकारी अपडेट हो गई।');
        res.redirect('/students');
    } catch (err) {
        console.error(err);
        req.flash('error', 'अपडेट करने में त्रुटि हुई।');
        res.redirect(`/students/edit/${req.params.id}`);
    }
});

// POST - delete (soft delete - marks inactive so history/reports stay intact)
router.post('/delete/:id', async (req, res) => {
    try {
        await pool.query('UPDATE students SET is_active = 0 WHERE student_id = ?', [req.params.id]);
        req.flash('success', 'छात्र हटा दिया गया।');
    } catch (err) {
        console.error(err);
        req.flash('error', 'हटाने में त्रुटि हुई।');
    }
    res.redirect('/students');
});

module.exports = router;
