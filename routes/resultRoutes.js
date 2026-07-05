const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const TERMS = ['अर्धवार्षिक', 'वार्षिक'];

// Simple helper: turns average marks into a grade letter (used only when marks are numeric)
function calculateGrade(marks) {
    const nums = marks.map(m => parseFloat(m)).filter(n => !isNaN(n));
    if (nums.length === 0) return '-';
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    if (avg >= 90) return 'A+';
    if (avg >= 75) return 'A';
    if (avg >= 60) return 'B+';
    if (avg >= 45) return 'B';
    if (avg >= 33) return 'C';
    return 'D';
}

// GET - class + term selector, then list of students with entry links
router.get('/', async (req, res) => {
    const [classes] = await pool.query(
        'SELECT DISTINCT class_name FROM students WHERE is_active = 1 ORDER BY class_name'
    );
    const selectedClass = req.query.class_name || (classes[0] ? classes[0].class_name : '');
    const selectedTerm = req.query.term || TERMS[0];

    let students = [];
    if (selectedClass) {
        const [rows] = await pool.query(
            `SELECT s.student_id, s.student_name, s.roll_number, r.overall_grade
             FROM students s
             LEFT JOIN results r ON r.student_id = s.student_id AND r.term = ?
             WHERE s.class_name = ? AND s.is_active = 1
             ORDER BY CAST(s.roll_number AS UNSIGNED)`,
            [selectedTerm, selectedClass]
        );
        students = rows;
    }

    res.render('results/select', {
        classes: classes.map(c => c.class_name),
        terms: TERMS,
        selectedClass,
        selectedTerm,
        students
    });
});

// GET - marks entry form for one student
router.get('/entry/:studentId/:term', async (req, res) => {
    const { studentId, term } = req.params;

    const [studentRows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
    if (studentRows.length === 0) {
        req.flash('error', 'छात्र नहीं मिला।');
        return res.redirect('/results');
    }

    const [resultRows] = await pool.query(
        'SELECT * FROM results WHERE student_id = ? AND term = ?', [studentId, term]
    );

    res.render('results/entry', {
        student: studentRows[0],
        term,
        result: resultRows[0] || null
    });
});

// POST - save marks for one student/term
router.post('/entry/:studentId/:term', async (req, res) => {
    const { studentId, term } = req.params;
    const { hindi_marks, english_marks, maths_marks, evs_marks, teacher_remark } = req.body;

    const overall_grade = calculateGrade([hindi_marks, english_marks, maths_marks, evs_marks]);

    try {
        await pool.query(
            `INSERT INTO results (student_id, term, hindi_marks, english_marks, maths_marks, evs_marks, overall_grade, teacher_remark)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
                hindi_marks = VALUES(hindi_marks),
                english_marks = VALUES(english_marks),
                maths_marks = VALUES(maths_marks),
                evs_marks = VALUES(evs_marks),
                overall_grade = VALUES(overall_grade),
                teacher_remark = VALUES(teacher_remark)`,
            [studentId, term, hindi_marks, english_marks, maths_marks, evs_marks, overall_grade, teacher_remark]
        );
        req.flash('success', 'परिणाम सेव हो गया।');
        res.redirect(`/results/report-card/${studentId}/${encodeURIComponent(term)}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'सेव करने में त्रुटि हुई।');
        res.redirect(`/results/entry/${studentId}/${term}`);
    }
});

// GET - printable report card
router.get('/report-card/:studentId/:term', async (req, res) => {
    const { studentId, term } = req.params;

    const [studentRows] = await pool.query('SELECT * FROM students WHERE student_id = ?', [studentId]);
    const [resultRows] = await pool.query(
        'SELECT * FROM results WHERE student_id = ? AND term = ?', [studentId, term]
    );

    if (studentRows.length === 0 || resultRows.length === 0) {
        req.flash('error', 'परिणाम अभी दर्ज नहीं किया गया है।');
        return res.redirect('/results');
    }

    res.render('results/report-card', { student: studentRows[0], result: resultRows[0], term });
});

module.exports = router;
