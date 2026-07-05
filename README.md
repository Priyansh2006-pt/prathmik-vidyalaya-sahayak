# प्राथमिक विद्यालय सहायक  
## Prathmik Vidyalaya Sahayak

A **Hindi-first digital record management system** designed for **Government Hindi-medium Primary Schools**, especially for schools in Uttar Pradesh. The project helps schools move from paper-based registers to a simple web-based system for managing students, teachers, attendance, mid-day meal records, distribution records, results, and notices.

This project is built with a practical goal: **make school record management simple, fast, organized, and accessible for teachers/headmasters who may not be very technical.**

---

## Project Objective

Many primary schools still maintain important records manually in registers. This can make searching, updating, reporting, and tracking information time-consuming. **Prathmik Vidyalaya Sahayak** solves this problem by providing a centralized digital platform where school staff can manage daily academic and administrative records easily.

The system focuses on:

- Reducing paperwork
- Saving teachers’ time
- Keeping records organized
- Supporting Hindi/Devanagari text
- Making reports easier to generate and review
- Providing a beginner-friendly web interface

---

## Key Features

### 1. School Profile Management
- One-time school setup
- Stores school name, village/area, block, district, state, UDISE code, headmaster name, and contact number
- Makes the app customizable for any primary school

### 2. Student Management
- Add, edit, delete, and view student records
- Store student details such as name, class, gender, guardian name, address, and contact details
- Class-wise student organization

### 3. Teacher Management
- Add and manage teacher/staff records
- Maintain a simple staff directory
- Useful for school-level administration

### 4. Attendance Management
- Mark daily attendance class-wise
- Generate monthly attendance reports
- Identify students with low attendance
- Helps teachers track regularity and follow up with parents/guardians

### 5. Mid-Day Meal Management
- Record daily MDM details
- Track number of students served
- Maintain monthly meal records
- Useful for government school reporting requirements

### 6. Distribution Record Management
- Track distribution of items like books, uniforms, bags, shoes, etc.
- Student-wise distribution status
- Pending distribution list for easy follow-up

### 7. Result / Progress Report
- Enter marks for students
- Generate result records
- Printable report card support
- Helps teachers maintain academic progress digitally

### 8. Notice Board
- Add and display school notices/announcements
- Useful for quick communication inside the school system

### 9. Login System
- Basic authentication system
- Headmaster/teacher role support
- Session-based login using Express session

---

## Tech Stack

| Part | Technology Used |
|---|---|
| Backend | Node.js, Express.js |
| Frontend Views | EJS Templates |
| Database | MySQL |
| Authentication | express-session, bcryptjs |
| Styling | HTML, CSS, JavaScript |
| Environment Config | dotenv |
| Deployment Target | Railway |

---

## Future Scope

The project can be improved further with the following features:

### 1. Parent SMS / WhatsApp Alerts
Send automatic messages to parents for low attendance, exam results, important notices, MDM updates, and distribution reminders.

### 2. PDF Report Generation
Add downloadable PDF reports for student report cards, monthly attendance, MDM reports, distribution status, and teacher records.

### 3. Mobile App / PWA Support
Convert the web app into a Progressive Web App so teachers can install it on mobile phones and use it like an app.

### 4. Multi-School Support
Add support for multiple schools under one system with school-level login, block-level dashboard, district-level reports, and analytics.

### 5. Advanced Dashboard and Analytics
Add charts and summaries for attendance trends, class-wise student count, MDM usage, result performance, and distribution completion.

### 6. Role-Based Access Control
Improve login system with roles such as Headmaster, Teacher, Clerk/Data Entry Operator, and Block Education Officer.

### 7. Student Photo Upload
Add student profile photos for better identification and digital records.

### 8. Cloud Backup
Automatically backup database records to cloud storage to prevent data loss.

### 9. Offline Mode
Allow teachers to enter data without internet and sync later when internet is available.

### 10. QR-Based Student ID
Generate QR codes for students to quickly access their records, attendance, and report cards.

### 11. Government Report Format Export
Export records in Excel/PDF formats useful for official school reporting.

### 12. AI-Based Insights
Use AI to generate simple insights like students with low attendance, class performance summary, monthly school summary, and suggested teacher follow-ups.

---

## Author

**Priyansh Tiwari**  
B.Tech CSE Student  
GitHub: `Priyansh2006-pt`

---

## License

This project is licensed under the **MIT License**.

---

## Final Note

**Prathmik Vidyalaya Sahayak** is not just a school management project. It is a small step toward making government primary school record management more digital, simple, and accessible.