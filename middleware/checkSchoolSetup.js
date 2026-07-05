// On first-ever run, the school_profile table is empty.
// This middleware redirects every page to the setup form until
// the headmaster fills in the school's details once.

const pool = require('../config/db');

module.exports = async function checkSchoolSetup(req, res, next) {
    // Don't block the setup page itself, or static files
    if (req.path.startsWith('/school/setup') || req.path.startsWith('/public')) {
        return next();
    }

    try {
        const [rows] = await pool.query('SELECT * FROM school_profile LIMIT 1');

        if (rows.length === 0) {
            return res.redirect('/school/setup');
        }

        // Make school info available in every view without re-querying each time
        res.locals.school = rows[0];
        next();
    } catch (err) {
        console.error('Error checking school setup:', err.message);
        res.status(500).send('डेटाबेस से कनेक्ट नहीं हो पाया। कृपया MySQL सेटिंग जाँचें। (Database connection failed - check your .env settings)');
    }
};
