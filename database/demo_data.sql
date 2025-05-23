-- Insert data into Subjects table
INSERT INTO Subjects (name) VALUES
('Toán'),
('Lý'),
('Hóa'),
('Văn'),
('Anh'),
('Sử'),
('Địa'),
('Sinh'),
('Tin Học');

-- Insert data into Grades table
INSERT INTO Grades (name) VALUES
('Lớp 1'),
('Lớp 2'),
('Lớp 3'),
('Lớp 4'),
('Lớp 5'),
('Lớp 6'),
('Lớp 7'),
('Lớp 8'),
('Lớp 9'),
('Lớp 10'),
('Lớp 11'),
('Lớp 12'),
('Đại học');

-- Insert data into Users table
INSERT INTO Users (username, password, email, display_name, role) VALUES
('admin','$2b$10$E/T1h9phSvEoREjYUY3F/uZGAXvj7BZeAtvksnY9AXoOaRqLdBRQC','nvuthanh4@gmail.com','Vũ Thành Nam','admin'), -- tài khoản và mật khẩu là admin
('user1','$2b$10$RWLZ8gSU5FXM3MU0cJriZeUb6T/gJ80CUVKuefxKbMweogfiFztx2','user1@gmail.com','Trần Thanh An','user'), -- tài khoản và mật khẩu là user1    
('user2','$2b$10$uYfeq4l5CajJxLMHv3z0QeBpj3550.xJ4tM0.uu7pg27TwVCPhILa','user2@gmail.com','Nguyễn Văn B','user'), -- tài khoản và mật khẩu là user2
('user3','$2b$10$i1qbn6ERe2BqPzEDWkzA0OUFuGz8XimZ5CmzNdX0gTU.U/InCir6G','user3@gmail.com','Lê Văn C','user'), -- tài khoản và mật khẩu là user3
('nguyenvana_parent', '$2a$10$...hashed_password_1...', 'nguyenvana.parent@example.com', 'Nguyễn Văn A', 'user'), -- tài khoản demo
('phamthib_parent', '$2a$10$...hashed_password_2...', 'phamthib.parent@example.com', 'Phạm Thị B', 'user'),
('lehoangc_parent', '$2a$10$...hashed_password_3...', 'lehoangc.parent@example.com', 'Lê Hoàng C', 'user'),
('tranvud_parent', '$2a$10$...hashed_password_4...', 'tranvud.parent@example.com', 'Trần Vũ D', 'user'),
('buituane_tutor', '$2a$10$...hashed_password_5...', 'buituane.tutor@example.com', 'Bùi Tuấn E)', 'user'),
('dochif_tutor', '$2a$10$...hashed_password_6...', 'dochif.tutor@example.com', 'Đỗ Chí F', 'user'),
('vuminhg_tutor', '$2a$10$...hashed_password_7...', 'vuminhg.tutor@example.com', 'Vũ Minh G', 'user'),
('nguyenha_admin', '$2a$10$...hashed_password_8...', 'nguyenha.admin@example.com', 'Nguyễn Hà', 'admin'),
('phamtuan_parent', '$2a$10$...hashed_password_9...', 'phamtuan.parent@example.com', 'Phạm Tuấn', 'user'),
('lelan_tutor', '$2a$10$...hashed_password_10...', 'lelan.tutor@example.com', 'Lê Lan', 'user'),
('trandat_tutor', '$2a$10$...hashed_password_11...', 'trandat.tutor@example.com', 'Trần Đạt', 'user');

-- Insert data into Tutors table
INSERT INTO Tutors (user_id, full_name, birth_year, gender, address, district, province, education_level, introduction, photo, phone) VALUES
(5, 'Bùi Tuấn E', 1998, 'male', 'Số 10, Ngõ 20', 'Quận Cầu Giấy', 'Hà Nội', 'Đại học Sư phạm Hà Nội', 'Sinh viên năm cuối, chuyên Toán. Có kinh nghiệm 2 năm dạy kèm.', 'photos/tutor_e.jpg', '0901234567'),
(6, 'Đỗ Chí F', 1995, 'male', 'Số 35, Đường Lê Lợi', 'Quận 1', 'TP. Hồ Chí Minh', 'Tốt nghiệp Đại học Khoa học Xã hội và Nhân văn', 'Giáo viên ngữ văn cấp 3. Nhiệt tình, có phương pháp dạy hiệu quả.', 'photos/tutor_f.jpg', '0912345678'),
(7, 'Vũ Minh G', 2000, 'female', 'Số 12, Đường Trần Phú', 'Thành phố Huế', 'Thừa Thiên Huế', 'Sinh viên Đại học Ngoại ngữ', 'Chuyên dạy tiếng Anh giao tiếp và ngữ pháp cho học sinh cấp 2, 3.', 'photos/tutor_g.jpg', '0334567890'),
(10, 'Lê Lan', 1999, 'female', 'Số 45, Đường Nguyễn Trãi', 'Quận Thanh Xuân', 'Hà Nội', 'Sinh viên Đại học Kinh tế Quốc dân', 'Dạy kèm Toán, Lý, Hóa cho học sinh THPT. Phương pháp dễ hiểu, bám sát chương trình.', 'photos/tutor_lan.jpg', '0868765432'),
(11, 'Trần Đạt', 1997, 'male', 'Số 78, Đường Hai Bà Trưng', 'Quận Hải Châu', 'Đà Nẵng', 'Tốt nghiệp Đại học Bách khoa Đà Nẵng', 'Giỏi Tin học, có thể dạy lập trình cơ bản và các kiến thức tin học văn phòng.', 'photos/tutor_dat.jpg', '0978123456');


-- Insert data into Classes table
INSERT INTO Classes (user_id, parent_name, phone, district, province, specific_address, tutor_gender, sessions_per_week, fee_per_session, subject_id, grade_id, description, status, learning_mode) VALUES
(1, 'Nguyễn Văn A', '0987654321', 'Quận Ba Đình', 'Hà Nội', 'Ngõ 158, Phố Ngọc Hà', 'female', 3, 200000.00, 1, 9, 'Cần gia sư dạy Toán cho con trai lớp 9, mất gốc. Yêu cầu giáo viên nữ, kiên nhẫn.', 'open', 'offline'), -- Toán Lớp 9
(2, 'Phạm Thị B', '0919876543', 'Quận 3', 'TP. Hồ Chí Minh', 'Hẻm 123, Đường Nam Kỳ Khởi Nghĩa', 'any', 2, 250000.00, 5, 12, 'Tìm gia sư tiếng Anh cho con chuẩn bị thi đại học. Ôn luyện ngữ pháp và luyện đề.', 'open', 'online'), -- Anh Lớp 12
(3, 'Lê Hoàng C', '0345678901', 'Thành phố Huế', 'Thừa Thiên Huế', 'Kiệt 45, Đường Vạn Xuân', 'male', 3, 180000.00, 2, 10, 'Cần gia sư dạy Lý lớp 10. Yêu cầu có phương pháp giảng dạy dễ hiểu.', 'open', 'offline'), -- Lý Lớp 10
(4, 'Trần Vũ D', '0778899001', 'Quận Cẩm Lệ', 'Đà Nẵng', 'Đường Lê Đại Hành', 'any', 2, 150000.00, 4, 7, 'Gia sư Văn cho con gái lớp 7. Giúp con cải thiện kỹ năng viết và cảm thụ văn học.', 'open', 'all'), -- Văn Lớp 7
(9, 'Phạm Tuấn', '0889900112', 'Quận Đống Đa', 'Hà Nội', 'Số 7, Ngõ 100', 'female', 4, 220000.00, 3, 11, 'Tìm gia sư Hóa cho con lớp 11. Cần ôn tập kiến thức cơ bản và nâng cao.', 'open', 'offline'); -- Hóa Lớp 11

-- Insert data into Tutor_Subjects table
INSERT INTO Tutor_Subjects (tutor_id, subject_id) VALUES
(1, 1), -- Bùi Tuấn E dạy Toán
(1, 2), -- Bùi Tuấn E dạy Lý
(2, 4), -- Đỗ Chí F dạy Văn
(2, 6), -- Đỗ Chí F dạy Sử
(3, 5), -- Vũ Minh G dạy Anh
(4, 1), -- Lê Lan dạy Toán
(4, 2), -- Lê Lan dạy Lý
(4, 3), -- Lê Lan dạy Hóa
(5, 9); -- Trần Đạt dạy Tin Học

-- Insert data into Tutor_Grades table
INSERT INTO Tutor_Grades (tutor_id, grade_id) VALUES
(1, 9), -- Bùi Tuấn E dạy Lớp 9
(1, 10), -- Bùi Tuấn E dạy Lớp 10
(1, 11), -- Bùi Tuấn E dạy Lớp 11
(1, 12), -- Bùi Tuấn E dạy Lớp 12
(2, 10), -- Đỗ Chí F dạy Lớp 10
(2, 11), -- Đỗ Chí F dạy Lớp 11
(2, 12), -- Đỗ Chí F dạy Lớp 12
(3, 7), -- Vũ Minh G dạy Lớp 7
(3, 8), -- Vũ Minh G dạy Lớp 8
(3, 9), -- Vũ Minh G dạy Lớp 9
(3, 10), -- Vũ Minh G dạy Lớp 10
(3, 11), -- Vũ Minh G dạy Lớp 11
(3, 12), -- Vũ Minh G dạy Lớp 12
(4, 10), -- Lê Lan dạy Lớp 10
(4, 11), -- Lê Lan dạy Lớp 11
(4, 12), -- Lê Lan dạy Lớp 12
(5, 6), -- Trần Đạt dạy Lớp 6
(5, 7), -- Trần Đạt dạy Lớp 7
(5, 8), -- Trần Đạt dạy Lớp 8
(5, 9); -- Trần Đạt dạy Lớp 9


-- Insert data into Chats
INSERT INTO Chats (sender_id, receiver_id, message) VALUES
(1, 5, 'Chào bạn, mình cần gia sư Toán cho bé lớp 9.'),
(5, 1, 'Mình có thể dạy Toán, có 2 năm kinh nghiệm.'),
(2, 7, 'Bạn có thể dạy tiếng Anh lớp 12 online không?'),
(7, 2, 'Mình dạy được, có tài liệu luyện đề đầy đủ.'),
(3, 10, 'Anh có kinh nghiệm dạy Lý lớp 10 không?'),
(10, 3, 'Anh từng dạy 2 học sinh lớp 10 rồi.');


-- Insert data into Class_Register
INSERT INTO Class_Register (class_id, tutor_id, status, notes) VALUES
(1, 1, 'accepted', 'Đã liên hệ, thống nhất lịch học.'),
(2, 3, 'accepted', 'Gia sư phù hợp chuyên môn.'),
(3, 4, 'pending', 'Đang trao đổi thời gian.'),
(4, 2, 'rejected', 'Không phù hợp lịch học.'),
(5, 5, 'pending', 'Mới đăng ký, đang chờ duyệt.');



-- Insert data into Class_Schedule
INSERT INTO Class_Schedule (class_id, tutor_id, session_date, start_time, end_time, location, meeting_url, status, notes)
VALUES
(1, 1, '2025-06-01', '18:00:00', '19:30:00', 'Ngõ 158, Phố Ngọc Hà, Hà Nội', NULL, 'scheduled', 'Buổi đầu tiên'),
(2, 3, '2025-06-03', '20:00:00', '21:30:00', NULL, 'https://meet.example.com/anh12', 'scheduled', 'Lớp online - luyện đề'),
(3, 4, '2025-06-05', '17:00:00', '18:30:00', 'Thành phố Huế', NULL, 'scheduled', 'Lý thuyết chương 1'),
(4, 2, '2025-06-07', '15:00:00', '16:30:00', 'Đường Lê Đại Hành, Đà Nẵng', NULL, 'cancelled', 'Phụ huynh yêu cầu dời lịch'),
(5, 5, '2025-06-10', '19:00:00', '20:30:00', 'Quận Đống Đa, Hà Nội', NULL, 'scheduled', 'Ôn lại kiến thức cơ bản');


-- Insert data into Tutor_Ratings
INSERT INTO Tutor_Ratings (tutor_id, user_id, rating, comment) VALUES
(1, 1, 5, 'Gia sư rất tốt, bé nhà tôi học tiến bộ rõ rệt.'),
(2, 4, 4, 'Dạy ổn, nhưng cần tương tác nhiều hơn.'),
(3, 2, 5, 'Giọng nói truyền cảm, học sinh rất thích.'),
(4, 3, 3, 'Phương pháp chưa phù hợp với con tôi.'),
(5, 9, 5, 'Giáo viên có chuyên môn, biết cách khơi gợi hứng thú học.');