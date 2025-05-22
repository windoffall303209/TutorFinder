-- Bảng đăng ký nhận lớp
CREATE TABLE Class_Registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    tutor_id INT NOT NULL,
    message TEXT,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES Tutors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_class_tutor (class_id, tutor_id)
);

-- Bảng lịch học
CREATE TABLE Schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    tutor_id INT NOT NULL,
    start_date DATE NOT NULL,
    status ENUM('active', 'completed', 'canceled') NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (class_id) REFERENCES Classes(id) ON DELETE CASCADE,
    FOREIGN KEY (tutor_id) REFERENCES Tutors(id) ON DELETE CASCADE
);

-- Bảng chi tiết lịch học
CREATE TABLE Schedule_Details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    day_of_week TINYINT NOT NULL COMMENT '0: Chủ nhật, 1-6: Thứ 2 đến thứ 7',
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES Schedules(id) ON DELETE CASCADE
);

-- Bảng lưu thông tin buổi học thực tế
CREATE TABLE Schedule_Sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_id INT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('scheduled', 'completed', 'canceled', 'rescheduled') NOT NULL DEFAULT 'scheduled',
    attendance BOOLEAN DEFAULT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (schedule_id) REFERENCES Schedules(id) ON DELETE CASCADE
);

-- Bảng đánh giá gia sư
CREATE TABLE Tutor_Reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tutor_id INT NOT NULL,
    user_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tutor_id) REFERENCES Tutors(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_tutor_review (user_id, tutor_id)
);

-- Thêm trường avg_rating vào bảng Tutors để lưu điểm đánh giá trung bình
ALTER TABLE Tutors
ADD COLUMN avg_rating DECIMAL(3,2) DEFAULT NULL,
ADD COLUMN review_count INT DEFAULT 0;

-- Thêm cột để lưu trạng thái của lớp học (có gia sư đăng ký hay chưa)
-- và lưu id của gia sư dạy lớp đó khi được chấp nhận
ALTER TABLE Classes
ADD COLUMN assigned_tutor_id INT NULL,
ADD FOREIGN KEY (assigned_tutor_id) REFERENCES Tutors(id) ON DELETE SET NULL;
