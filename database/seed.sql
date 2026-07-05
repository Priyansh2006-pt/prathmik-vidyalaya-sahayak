-- ============================================================
-- OPTIONAL sample/demo data.
-- Run this AFTER schema.sql if you want some sample records
-- to test the app with, instead of typing everything by hand.
-- (School profile and login user are created from the app itself
--  on first run - see README.md - so they are NOT included here.)
-- ============================================================

USE prathmik_vidyalaya_sahayak;

INSERT INTO students
(student_name, class_name, roll_number, father_name, mother_name, dob, gender, address, guardian_mobile, admission_date)
VALUES
('राम कुमार',   'कक्षा 3', '1', 'सुरेश कुमार', 'सीता देवी',  '2017-05-12', 'पुरुष', 'रामपुर',  '9876543210', '2023-04-01'),
('सीमा देवी',   'कक्षा 3', '2', 'रमेश चंद्र',  'गीता देवी',  '2017-08-20', 'महिला', 'रामपुर',  '9876543211', '2023-04-01'),
('मोहन लाल',    'कक्षा 3', '3', 'श्याम लाल',   'राधा देवी',  '2017-02-15', 'पुरुष', 'सुल्तानपुर','9876543212', '2023-04-01'),
('अंजलि यादव',  'कक्षा 2', '1', 'विनोद यादव',  'सुनीता यादव', '2018-11-02', 'महिला', 'रामपुर',  '9876543213', '2024-04-01'),
('अर्जुन सिंह',  'कक्षा 2', '2', 'बलराम सिंह',  'कमला सिंह',  '2018-06-18', 'पुरुष', 'सुल्तानपुर','9876543214', '2024-04-01');

INSERT INTO teachers
(teacher_name, designation, mobile_number, qualification, class_subject, joining_date)
VALUES
('श्रीमती अनीता शर्मा', 'सहायक अध्यापिका', '9998887771', 'बी.एड., बी.ए.', 'कक्षा 1-2 / हिंदी', '2018-07-01'),
('श्री राजेश वर्मा',    'सहायक अध्यापक',   '9998887772', 'बी.एड., बी.एससी.', 'कक्षा 3-5 / गणित', '2015-06-15');

INSERT INTO notices (notice_text, notice_date) VALUES
('15 अगस्त स्वतंत्रता दिवस के उपलक्ष्य में विद्यालय में ध्वजारोहण प्रातः 8 बजे होगा।', CURDATE()),
('अभिभावक-शिक्षक बैठक आगामी शनिवार को प्रातः 10 बजे आयोजित की जाएगी।', CURDATE());
