# प्राथमिक विद्यालय सहायक (Prathmik Vidyalaya Sahayak)

A free, Hindi-first digital record management system built for **Uttar Pradesh Government Hindi-medium Primary Schools**. Replaces paper registers (student, attendance, MDM, distribution, results) with one simple web app any Prathmik Vidyalaya can set up for itself.

> Built as a first-year B.Tech CSE project. No fee-management module (not needed for government schools). Fully customizable — one codebase, any school.

---

## ✨ Features / Modules

1. **School Profile Management** – one-time setup (name, village, block, district, UDISE code, headmaster, mobile)
2. **Student Management** – add/edit/delete/search, class-wise listing
3. **Teacher Management** – add/edit/delete/search staff directory
4. **Attendance Management** – daily class-wise marking, monthly % report, low-attendance list
5. **Mid-Day Meal (MDM) Management** – daily entry, monthly summary report
6. **Books/Uniform/Bag/Shoes Distribution** – per-student status, auto pending list
7. **Result / Progress Report** – marks entry, auto grade, printable report card
8. **Notice / Announcement Board**
9. Simple login (Headmaster / Teacher roles)

---

## 🛠 Tech Stack

- **Backend:** Node.js + Express
- **Views:** EJS (server-rendered HTML, beginner-friendly, no separate frontend build step)
- **Database:** MySQL (`utf8mb4` throughout — full Hindi/Devanagari support)
- **Auth:** express-session + bcryptjs
- **Styling:** Plain CSS (no framework) — see `public/css/style.css`

---

## 📁 Folder Structure

```
prathmik-vidyalaya-sahayak/
├── server.js                  # App entry point
├── config/db.js               # MySQL connection pool
├── middleware/                # requireLogin, checkSchoolSetup
├── routes/                    # One file per module (students, teachers, ...)
├── views/                     # EJS templates, organized by module
├── public/css, public/js      # Static assets
├── database/schema.sql        # Run once to create DB + tables
├── database/seed.sql          # Optional sample data
├── database/createAdmin.js    # Run once to create the first login
├── .env.example                # Copy to .env and fill in your values
└── package.json
```

---

## 🚀 Local Setup (Step by Step)

### 1. Prerequisites
- [Node.js](https://nodejs.org) (v18 or higher)
- [MySQL](https://dev.mysql.com/downloads/mysql/) (v8 recommended) running locally
- Git

### 2. Clone and install
```bash
git clone https://github.com/<your-username>/prathmik-vidyalaya-sahayak.git
cd prathmik-vidyalaya-sahayak
npm install
```

### 3. Create the database
Log in to MySQL and run the schema file:
```bash
mysql -u root -p < database/schema.sql
```
(Optional) load sample demo data:
```bash
mysql -u root -p < database/seed.sql
```

### 4. Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in your MySQL username/password:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=prathmik_vidyalaya_sahayak
PORT=3000
SESSION_SECRET=any_random_long_string
```

### 5. Create your first login
```bash
node database/createAdmin.js
```
This creates:
- username: `admin`
- password: `admin123`

(Change this password later — for v1, the classroom project doesn't need a "change password" screen, but you can add one as an extension.)

### 6. Run the app
```bash
npm start
```
Visit **http://localhost:3000** — you'll land on the login page, then (on first run) the School Profile setup form, then the dashboard.

For development with auto-restart on file changes:
```bash
npm run dev
```

---

## 🌐 Getting a Live/Workable Link (Deployment)

Since this is a full Node.js + MySQL app (not a static site), you need a host that runs a Node server **and** gives you a MySQL database. Good beginner-friendly free/cheap options in 2026:

| Option | Notes |
|---|---|
| **Railway** (railway.app) | Easiest: one-click Node.js deploy + built-in MySQL plugin. Good free tier for student projects. |
| **Render** (render.com) | Free Node.js web service; pair with a free MySQL DB from a provider like Aiven or PlanetScale (MySQL-compatible). |
| **PlanetScale / Aiven** | Free-tier hosted MySQL if your host doesn't provide one. |

**General deployment steps (works similarly on Railway/Render):**
1. Push this project to a GitHub repository (see below).
2. Create a new "Web Service" on the host, connect it to your GitHub repo.
3. Add a MySQL database add-on/plugin on the same platform.
4. Set the environment variables (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `SESSION_SECRET`, `PORT`) in the host's dashboard using the credentials it gives you for the MySQL database.
5. Run `database/schema.sql` against that live database once (most hosts let you open a MySQL console, or you can connect locally with a MySQL client using the host's connection details).
6. Run `node database/createAdmin.js` once (most hosts let you run a one-off command/shell).
7. Deploy — the host will give you a public URL like `https://prathmik-vidyalaya-sahayak.up.railway.app`. That's your "workable link."

> Tip for your project demo/viva: even a quick tunnel like `ngrok http 3000` while running locally on your laptop gives you a temporary public link — handy for a live demo without full deployment.

---

## 📤 Pushing to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Prathmik Vidyalaya Sahayak"
git branch -M main
git remote add origin https://github.com/<your-username>/prathmik-vidyalaya-sahayak.git
git push -u origin main
```

`.env` is already excluded via `.gitignore` — never commit real database passwords.

---

## 🗄 Database Design (Summary)

| Table | Purpose |
|---|---|
| `school_profile` | Single row holding this installation's school details |
| `users` | Login accounts (Headmaster/Teacher) |
| `students` | Master student records |
| `teachers` | Staff directory |
| `attendance` | One row per student per day |
| `mdm_record` | One row per school day (school-wide meal totals) |
| `distribution_record` | One row per student, updated as items are given |
| `results` | One row per student per exam term |
| `notices` | Announcements |

Full column-level definitions are in `database/schema.sql`.

---

## 🔮 Future Scope

- Web → also expose as a simple mobile-friendly PWA
- SMS alerts to parents for low attendance
- PDF export of report cards
- Multi-school / Block-level admin dashboard
- Photo upload for student records
- Biometric/app-based attendance

---

## 📄 License

MIT — free to use, modify, and reuse for your own school or college project.
