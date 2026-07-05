-- ============================================================
-- Prathmik Vidyalaya Sahayak - Database Schema
-- प्राथमिक विद्यालय सहायक - डेटाबेस स्कीमा
-- Run this once to create the database and all tables.
-- Uses utf8mb4 everywhere so Hindi/Devanagari text works correctly.
-- ============================================================

CREATE DATABASE IF NOT EXISTS prathmik_vidyalaya_sahayak
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE prathmik_vidyalaya_sahayak;

-- ------------------------------------------------------------
-- 1. School Profile (only ever holds ONE row - the school itself)
-- ------------------------------------------------------------
CREATE TABLE school_profile (
    school_id        INT AUTO_INCREMENT PRIMARY KEY,
    school_name       VARCHAR(150) NOT NULL,   -- विद्यालय का नाम
    village_area      VARCHAR(100),             -- गाँव / क्षेत्र
    block_name        VARCHAR(100),             -- ब्लॉक
    district_name     VARCHAR(100),             -- जिला
    state_name        VARCHAR(100) DEFAULT 'उत्तर प्रदेश', -- राज्य
    udise_code        VARCHAR(20),              -- UDISE कोड
    headmaster_name   VARCHAR(100),             -- प्रधानाध्यापक का नाम
    mobile_number     VARCHAR(15),              -- मोबाइल नंबर
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. Users (simple login - Headmaster / Teacher roles)
-- ------------------------------------------------------------
CREATE TABLE users (
    user_id       INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(100) NOT NULL,
    username      VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          ENUM('Headmaster','Teacher') NOT NULL DEFAULT 'Teacher',
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. Students
-- ------------------------------------------------------------
CREATE TABLE students (
    student_id       INT AUTO_INCREMENT PRIMARY KEY,
    student_name     VARCHAR(100) NOT NULL,    -- छात्र का नाम
    class_name       VARCHAR(20) NOT NULL,     -- कक्षा
    roll_number      VARCHAR(20),              -- रोल नंबर
    father_name      VARCHAR(100),             -- पिता का नाम
    mother_name      VARCHAR(100),             -- माता का नाम
    dob              DATE,                      -- जन्म तिथि
    gender           ENUM('पुरुष','महिला','अन्य'), -- लिंग
    address           VARCHAR(200),              -- गाँव / पता
    guardian_mobile   VARCHAR(15),               -- अभिभावक मोबाइल नंबर
    admission_date    DATE,                      -- प्रवेश तिथि
    is_active         TINYINT(1) DEFAULT 1,      -- 0 = removed / transferred out
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_class (class_name),
    INDEX idx_name (student_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. Teachers
-- ------------------------------------------------------------
CREATE TABLE teachers (
    teacher_id      INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name    VARCHAR(100) NOT NULL,   -- शिक्षक का नाम
    designation     VARCHAR(50),              -- पद
    mobile_number   VARCHAR(15),              -- मोबाइल नंबर
    qualification   VARCHAR(100),             -- योग्यता
    class_subject   VARCHAR(100),             -- कक्षा / विषय
    joining_date    DATE,                     -- जॉइनिंग डेट
    is_active       TINYINT(1) DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. Attendance (one row per student per day)
-- ------------------------------------------------------------
CREATE TABLE attendance (
    attendance_id     INT AUTO_INCREMENT PRIMARY KEY,
    student_id        INT NOT NULL,
    attendance_date   DATE NOT NULL,
    status            ENUM('Present','Absent') NOT NULL DEFAULT 'Present',
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_attendance_per_day (student_id, attendance_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. Mid-Day Meal (MDM) Record (one row per school day, school-wide)
-- ------------------------------------------------------------
CREATE TABLE mdm_record (
    mdm_id            INT AUTO_INCREMENT PRIMARY KEY,
    mdm_date          DATE NOT NULL UNIQUE,     -- तारीख
    total_present     INT DEFAULT 0,             -- कुल उपस्थित विद्यार्थी
    meal_taken_count  INT DEFAULT 0,             -- भोजन प्राप्त करने वाले विद्यार्थी
    menu              VARCHAR(150),              -- मेनू
    meal_cooked       ENUM('Yes','No') DEFAULT 'Yes', -- भोजन बना या नहीं
    remarks           VARCHAR(200),              -- Remarks
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. Books / Uniform / Bag / Shoes Distribution Record
-- ------------------------------------------------------------
CREATE TABLE distribution_record (
    distribution_id     INT AUTO_INCREMENT PRIMARY KEY,
    student_id           INT NOT NULL UNIQUE,   -- one running record per student, updated as items arrive
    books_received       ENUM('Yes','No') DEFAULT 'No',   -- किताब मिली या नहीं
    uniform_received     ENUM('Yes','No') DEFAULT 'No',   -- यूनिफॉर्म मिली या नहीं
    bag_received         ENUM('Yes','No') DEFAULT 'No',   -- बैग मिला या नहीं
    shoes_received       ENUM('Yes','No') DEFAULT 'No',   -- जूते मिले या नहीं
    distribution_date    DATE,                              -- वितरण तिथि (last updated date)
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. Results / Progress Report
-- ------------------------------------------------------------
CREATE TABLE results (
    result_id        INT AUTO_INCREMENT PRIMARY KEY,
    student_id        INT NOT NULL,
    term              VARCHAR(30) NOT NULL,      -- e.g. 'अर्धवार्षिक', 'वार्षिक'
    hindi_marks       VARCHAR(10),
    english_marks     VARCHAR(10),
    maths_marks       VARCHAR(10),
    evs_marks         VARCHAR(10),
    overall_grade     VARCHAR(10),
    teacher_remark    VARCHAR(200),
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_result_per_term (student_id, term)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 9. Notices / Announcements
-- ------------------------------------------------------------
CREATE TABLE notices (
    notice_id     INT AUTO_INCREMENT PRIMARY KEY,
    notice_text   VARCHAR(300) NOT NULL,
    notice_date   DATE NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Done. Next: run database/seed.sql for a default login + sample data (optional).
-- ============================================================
