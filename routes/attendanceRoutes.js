const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET - attendance marking screen: pick date + class, see student list with existing status
router.get('/mark', async (req, res) => {
    const [classes] = await pool.query(
        'SELECT DISTINCT class_name FROM students WHERE is_active = 1 ORDER BY class_name'
    );

    const selectedClass = req.query.class_name || (classes[0] ? classes[0].class_name : '');
    const selectedDate = req.query.date || new Date().toISOString().slice(0, 10);

    let students = [];
    if (selectedClass) {
        const [rows] = await pool.query(
            `SELECT s.student_id, s.student_name, s.roll_number, a.status
             FROM students s
             LEFT JOIN attendance a ON a.student_id = s.student_id AND a.attendance_date = ?
             WHERE s.class_name = ? AND s.is_active = 1
             ORDER BY CAST(s.roll_number AS UNSIGNED)`,
            [selectedDate, selectedClass]
        );
        students = rows;
    }

    res.render('attendance/mark', {
        classes: classes.map(c => c.class_name),
        selectedClass,
        selectedDate,
        students
    });
});

// POST - save attendance for the selected date + class
router.post('/mark', async (req, res) => {
    const { attendance_date, class_name, student_ids, statuses } = req.body;

    try {
        // student_ids and statuses arrive as arrays (or single values if only 1 student)
        const ids = Array.isArray(student_ids) ? student_ids : [student_ids];
        const stats = Array.isArray(statuses) ? statuses : [statuses];

        for (let i = 0; i < ids.length; i++) {
            await pool.query(
                `INSERT INTO attendance (student_id, attendance_date, status)
                 VALUES (?, ?, ?)
                 ON DUPLICATE KEY UPDATE status = VALUES(status)`,
                [ids[i], attendance_date, stats[i]]
            );
        }

        req.flash('success', `${class_name} की ${attendance_date} की उपस्थिति सेव हो गई।`);
        res.redirect(`/attendance/mark?class_name=${encodeURIComponent(class_name)}&date=${attendance_date}`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'उपस्थिति सेव करने में त्रुटि हुई।');
        res.redirect('/attendance/mark');
    }
});

// GET - monthly attendance report per class
router.get('/monthly', async (req, res) => {
    const [classes] = await pool.query(
        'SELECT DISTINCT class_name FROM students WHERE is_active = 1 ORDER BY class_name'
    );

    const selectedClass = req.query.class_name || (classes[0] ? classes[0].class_name : '');
    const selectedMonth = req.query.month || new Date().toISOString().slice(0, 7); // YYYY-MM

    let report = [];
    if (selectedClass) {
        const [rows] = await pool.query(
            `SELECT s.student_id, s.student_name, s.roll_number,
                    COUNT(a.attendance_id) AS total_marked,
                    SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_days
             FROM students s
             LEFT JOIN attendance a ON a.student_id = s.student_id
                    AND DATE_FORMAT(a.attendance_date, '%Y-%m') = ?
             WHERE s.class_name = ? AND s.is_active = 1
             GROUP BY s.student_id, s.student_name, s.roll_number
             ORDER BY CAST(s.roll_number AS UNSIGNED)`,
            [selectedMonth, selectedClass]
        );

        report = rows.map(r => {
            const total = r.total_marked || 0;
            const present = r.present_days || 0;
            const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : '0.0';
            return { ...r, total_marked: total, present_days: present, percentage };
        });
    }

    res.render('attendance/monthly-report', {
        classes: classes.map(c => c.class_name),
        selectedClass,
        selectedMonth,
        report
    });
});

// GET - low attendance list (below threshold %, default 75%)
router.get('/low', async (req, res) => {
    const threshold = parseFloat(req.query.threshold) || 75;
    const selectedMonth = req.query.month || new Date().toISOString().slice(0, 7);

    const [rows] = await pool.query(
        `SELECT s.student_id, s.student_name, s.class_name, s.roll_number, s.guardian_mobile,
                COUNT(a.attendance_id) AS total_marked,
                SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present_days
         FROM students s
         LEFT JOIN attendance a ON a.student_id = s.student_id
                AND DATE_FORMAT(a.attendance_date, '%Y-%m') = ?
         WHERE s.is_active = 1
         GROUP BY s.student_id, s.student_name, s.class_name, s.roll_number, s.guardian_mobile
         HAVING total_marked > 0
         ORDER BY s.class_name, CAST(s.roll_number AS UNSIGNED)`,
        [selectedMonth]
    );

    const lowList = rows
        .map(r => ({ ...r, percentage: ((r.present_days / r.total_marked) * 100).toFixed(1) }))
        .filter(r => parseFloat(r.percentage) < threshold);

    res.render('attendance/low-attendance', { lowList, threshold, selectedMonth });
});

module.exports = router;
