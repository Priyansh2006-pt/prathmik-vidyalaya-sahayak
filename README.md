# 🏫 प्राथमिक विद्यालय सहायक  
## Prathmik Vidyalaya Sahayak

> **A Hindi-first digital record management system for Government Primary Schools** 🇮🇳  
> Simple, clean, and practical web app to help schools move from paper registers to digital records.

---

## 🌟 About the Project

**Prathmik Vidyalaya Sahayak** is a web-based school record management system specially designed for **Hindi-medium government primary schools**.  

Many schools still manage important records using paper registers 📚, which can be time-consuming and difficult to maintain. This project helps teachers and headmasters manage school data digitally in a simple and organized way.

The main goal is to make school administration:

✅ Faster  
✅ Easier  
✅ More organized  
✅ Less paper-dependent  
✅ Hindi-friendly  

---

## 🎯 Project Objective

The objective of this project is to provide a **simple digital platform** where school staff can manage day-to-day records such as:

- 👨‍🎓 Student records  
- 👩‍🏫 Teacher records  
- 📅 Attendance  
- 🍛 Mid-Day Meal records  
- 🎒 Distribution records  
- 📝 Results  
- 📢 Notices  

This system is built keeping in mind teachers/headmasters who may not be very technical, so the interface is simple and easy to use.

---

## 🚀 Key Features

### 🏫 1. School Profile Management
- One-time school setup  
- Store school name, village/area, block, district, state, UDISE code, headmaster name, and mobile number  
- Useful for customizing the system for a specific school  

### 👨‍🎓 2. Student Management
- Add, edit, delete, and view student records  
- Store class, gender, guardian details, address, and contact information  
- Easy class-wise student organization  

### 👩‍🏫 3. Teacher Management
- Manage teacher/staff details  
- Maintain a simple teacher directory  
- Useful for school administration  

### 📅 4. Attendance Management
- Mark daily attendance  
- Track attendance class-wise  
- Generate monthly attendance reports  
- Identify low-attendance students easily  

### 🍛 5. Mid-Day Meal Management
- Record daily MDM details  
- Track number of students served  
- Maintain monthly food distribution records  
- Helps in government reporting  

### 🎒 6. Distribution Record Management
- Track distribution of books, uniforms, bags, shoes, etc.  
- Student-wise distribution status  
- Pending distribution list for follow-up  

### 📝 7. Result Management
- Enter student marks  
- Generate result records  
- Support for printable progress/report cards  

### 📢 8. Notice Board
- Add school notices and announcements  
- Display important updates in one place  

### 🔐 9. Login System
- Basic authentication system  
- Admin/headmaster login  
- Session-based secure access  

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| ⚙️ Backend | Node.js, Express.js |
| 🎨 Frontend | HTML, CSS, JavaScript, EJS |
| 🗄️ Database | MySQL |
| 🔐 Authentication | express-session, bcryptjs |
| 🌱 Environment Variables | dotenv |
| 🚀 Deployment | Railway |

---

## 📁 Project Structure

```text
pvs/
├── config/              # Database configuration
├── database/            # Schema, seed, and admin creation scripts
├── middleware/          # Authentication and helper middleware
├── public/              # Static files like CSS, JS, images
├── routes/              # Express routes
├── views/               # EJS templates
├── server.js            # Main server file
├── package.json         # Project dependencies and scripts
└── README.md            # Project documentation
```

---

## ⚙️ Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Priyansh2006-pt/prathmik-vidyalaya-sahayak.git
cd prathmik-vidyalaya-sahayak
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create `.env` File

Create a `.env` file in the root folder and add:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=prathmik_vidyalaya_sahayak
PORT=3000
SESSION_SECRET=pvs_secret_123456
```

### 4. Setup MySQL Database

Import these files in MySQL/phpMyAdmin:

```text
database/schema.sql
database/seed.sql
```

### 5. Create Admin User

```bash
node database/createAdmin.js
```

Default login:

```text
Username: admin
Password: admin123
```

### 6. Start the Project

```bash
npm start
```

Open in browser:

```text
http://localhost:3000
```

---

## 🌍 Deployment

This project can be deployed on **Railway** using:

- GitHub repository deployment  
- Railway MySQL database  
- Environment variables  
- Public Railway domain  

---

## 🔮 Future Scope

### 📲 1. WhatsApp/SMS Alerts
Automatic alerts to parents for attendance, results, notices, and important school updates.

### 📄 2. PDF Report Generation
Downloadable PDF reports for attendance, results, MDM records, and distribution records.

### 📱 3. Mobile App / PWA
Convert the web app into a Progressive Web App so teachers can use it like a mobile app.

### 🏢 4. Multi-School Support
Support multiple schools with school-level, block-level, and district-level dashboards.

### 📊 5. Analytics Dashboard
Charts for attendance trends, student count, academic performance, and MDM summaries.

### 👥 6. Role-Based Access Control
Different access levels for Headmaster, Teacher, Clerk, and Block Education Officer.

### 🖼️ 7. Student Photo Upload
Add student profile photos for better identification.

### ☁️ 8. Cloud Backup
Automatic cloud backup to prevent data loss.

### 🌐 9. Offline Mode
Allow teachers to enter data without internet and sync later.

### 🔳 10. QR-Based Student ID
Generate QR codes for students to access records quickly.

### 📤 11. Excel/PDF Export
Export official school reports in Excel or PDF format.

### 🤖 12. AI-Based Insights
AI-generated summaries for low attendance, weak performance, and monthly school reports.

---

## 💡 Why This Project Matters

This project is not just a normal school management system. It is focused on solving a real ground-level problem faced by many primary schools: **manual record management**.

By digitizing records, the system can help schools save time, reduce paperwork, and make data easier to manage.

---

## 👨‍💻 Author

**Priyansh Tiwari**  
B.Tech CSE Student  
GitHub: `Priyansh2006-pt`

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Final Note

**Prathmik Vidyalaya Sahayak** is a small step toward making government primary school management more digital, simple, and accessible.  

> Made with ❤️ for digital education and better school administration.
