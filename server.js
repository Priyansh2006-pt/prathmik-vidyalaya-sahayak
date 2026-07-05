require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const pool = require('./config/db');
const checkSchoolSetup = require('./middleware/checkSchoolSetup');
const requireLogin = require('./middleware/requireLogin');

const authRoutes = require('./routes/authRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const mdmRoutes = require('./routes/mdmRoutes');
const distributionRoutes = require('./routes/distributionRoutes');
const resultRoutes = require('./routes/resultRoutes');
const noticeRoutes = require('./routes/noticeRoutes');

const app = express();

// ---------- View engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Core middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));
app.use(flash());

// Make flash messages + logged-in user available in every view automatically
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.session.user || null;
    next();
});

// ---------- Auth routes (login/logout) are open, everything else needs login ----------
app.use('/auth', authRoutes);

// School setup must exist before using the rest of the app
app.use(checkSchoolSetup);

// Require login for every route below this line, except /auth (already mounted above)
app.use((req, res, next) => {
    if (req.path.startsWith('/school/setup')) return next(); // allow first-time setup without login
    return requireLogin(req, res, next);
});

app.use('/school', schoolRoutes);
app.use('/students', studentRoutes);
app.use('/teachers', teacherRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/mdm', mdmRoutes);
app.use('/distribution', distributionRoutes);
app.use('/results', resultRoutes);
app.use('/notices', noticeRoutes);

// ---------- Dashboard (home page) ----------
app.get('/', async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        const [[{ totalStudents }]] = await pool.query(
            'SELECT COUNT(*) AS totalStudents FROM students WHERE is_active = 1'
        );
        const [[{ totalTeachers }]] = await pool.query(
            'SELECT COUNT(*) AS totalTeachers FROM teachers WHERE is_active = 1'
        );
        const [[{ presentToday }]] = await pool.query(
            `SELECT COUNT(*) AS presentToday FROM attendance WHERE attendance_date = ? AND status = 'Present'`,
            [today]
        );
        const [[{ markedToday }]] = await pool.query(
            'SELECT COUNT(*) AS markedToday FROM attendance WHERE attendance_date = ?',
            [today]
        );
        const [mdmToday] = await pool.query('SELECT * FROM mdm_record WHERE mdm_date = ?', [today]);
        const [[{ pendingCount }]] = await pool.query(
            `SELECT COUNT(*) AS pendingCount FROM students s
             LEFT JOIN distribution_record d ON d.student_id = s.student_id
             WHERE s.is_active = 1
               AND (COALESCE(d.books_received,'No')='No' OR COALESCE(d.uniform_received,'No')='No'
                 OR COALESCE(d.bag_received,'No')='No' OR COALESCE(d.shoes_received,'No')='No')`
        );
        const [recentNotices] = await pool.query(
            'SELECT * FROM notices ORDER BY notice_date DESC, notice_id DESC LIMIT 5'
        );

        res.render('dashboard', {
            totalStudents,
            totalTeachers,
            presentToday,
            markedToday,
            mdmToday: mdmToday[0] || null,
            pendingCount,
            recentNotices,
            today
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('डैशबोर्ड लोड करने में त्रुटि हुई। (Error loading dashboard)');
    }
});

// ---------- 404 ----------
app.use((req, res) => {
    res.status(404).send('पृष्ठ नहीं मिला (404 - Page Not Found)');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Prathmik Vidyalaya Sahayak server running at http://localhost:${PORT}`);
});
