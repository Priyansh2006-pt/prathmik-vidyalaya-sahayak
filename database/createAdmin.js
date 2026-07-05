// Run this ONCE after schema.sql to create the first login (Headmaster account).
// Usage:  node database/createAdmin.js
//
// Default login created:
//   username: admin
//   password: admin123
// (Please change the password after first login in a real deployment.)

const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function createAdmin() {
    try {
        const [existing] = await pool.query('SELECT * FROM users WHERE username = ?', ['admin']);
        if (existing.length > 0) {
            console.log('⚠️  Admin user already exists. Nothing to do.');
            process.exit(0);
        }

        const passwordHash = await bcrypt.hash('admin123', 10);

        await pool.query(
            'INSERT INTO users (full_name, username, password_hash, role) VALUES (?, ?, ?, ?)',
            ['प्रधानाध्यापक', 'admin', passwordHash, 'Headmaster']
        );

        console.log('✅  Default admin created successfully!');
        console.log('    username: admin');
        console.log('    password: admin123');
        console.log('    (Change this password after logging in for the first time.)');
        process.exit(0);
    } catch (err) {
        console.error('❌  Failed to create admin:', err.message);
        process.exit(1);
    }
}

createAdmin();
