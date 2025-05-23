# Ứng dụng Quản lý Gia sư - Tutor Web

Ứng dụng web quản lý gia sư và kết nối gia sư với học sinh được phát triển bằng Node.js, Express và MySQL.

## Giới thiệu

Tutor Web là một nền tảng trực tuyến giúp kết nối gia sư với học sinh/phụ huynh. Ứng dụng cho phép:

- Học sinh/phụ huynh tìm kiếm gia sư phù hợp
- Gia sư đăng ký hồ sơ và tìm kiếm lớp dạy
- Quản lý lịch học, đăng ký lớp
- Tương tác trực tiếp qua hệ thống chat
- Đánh giá chất lượng giảng dạy

## Yêu cầu hệ thống

- Node.js (v14 trở lên)
https://nodejs.org/download/release/v14.17.0/
- MySQL (v5.7 trở lên)
https://dev.mysql.com/downloads/workbench/

## Cài đặt

### 1. Clone dự án
Bước 1:
git clone https://github.com/windoffall303209/TutorFinder.git
Bước 2: cd TutorFinder

### 2. Cài đặt các thư viện

npm install

### 3. Thiết lập cơ sở dữ liệu

- Tạo cơ sở dữ liệu MySQL mới với tên `tutor`
- Mở thư mục database tìm tới file database.sql để tạo các bảng table
- Mở file demo_data.sql để insert data demo vào các table

### 4. Cấu hình môi trường

Trong file `.env` tại thư mục gốc đang có nội dung:

```
# Cổng server
PORT=3000  // cổng chạy localhost

# Thông tin kết nối MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password // password đã đặt khi cài đặt MySQL
DB_NAME=tutor // tên của database đã tạo trong MySQL

# Khóa bí mật cho session
SESSION_SECRET=your_secret_key
```

Thay đổi `your_mysql_password` thành mật khẩu MySQL của bạn và `your_secret_key` thành một chuỗi ngẫu nhiên

Thay đổi `tutor` thành tên database của bạn tạo

### 5. Khởi động ứng dụng

```bash
npm start
```

Truy cập ứng dụng tại: http://localhost:3000

## Cấu trúc dự án

```
app.js                  # Điểm khởi đầu ứng dụng
config/                 # Cấu hình ứng dụng và database
controllers/            # Xử lý logic nghiệp vụ
database/               # Script SQL và dữ liệu mẫu
middleware/             # Middleware xác thực và phân quyền
models/                 # Mô hình dữ liệu
public/                 # Tài nguyên tĩnh (CSS, JS, images)
routes/                 # Định nghĩa các routes
views/                  # Templates EJS
```

## Sử dụng ứng dụng

### Tài khoản demo

Ứng dụng đã được cài đặt sẵn với các tài khoản demo:

#### Tài khoản Admin

- Tên đăng nhập: `admin`
- Mật khẩu: `admin`

Để thêm tài khoản admin thì sẽ insert vào table Users trong database, trước khi insert cần hash mật khẩu bằng file hash_pass.js trong thư mục database
#### Tài khoản Người dùng

- Tên đăng nhập: `user1`, `user2`, `user3`
- Mật khẩu: (tên đăng nhập)

### Đăng ký tài khoản mới

1. Truy cập trang đăng ký tại `/auth/register`
2. Điền thông tin cá nhân

### Dành cho Người dùng

1. **Tìm kiếm Gia sư**

   - Truy cập menu "Gia sư"
   - Sử dụng bộ lọc để tìm gia sư phù hợp

2. **Tìm kiếm Lớp học**

   - Truy cập menu "Lớp học"
   - Sử dụng bộ lọc để tìm lớp học phù hợp
   - Truy cập vào Lớp học phù hợp
   - Click vào "Đăng ký nhận dạy lớp" - cần phải đã đăng kí làm gia sư thì mới có thể thực hiện được việc đăng ký nhận dạy lớp
   - Trên thanh dropdown truy cập vào "Quản lý đăng ký nhận lớp" để xem các lớp đã đăng ký dạy

3. **Đăng ký làm gia sư**

   - Truy cập vào trang Liên Hệ
   - Kéo xuống dưới tìm với ô "Đăng ký làm gia sư"
   - Điền thông tin cần thiết
   - Nhấn nút "Đăng ký"
   - Lưu ý mỗi User chỉ đăng ký được 1 lần Gia Sư

4. **Đăng ký lớp học**

   - Truy cập vào trang Liên Hệ
   - Kéo xuống dưới tìm với ô "Đăng ký tìm gia sư"
   - Điền thông tin cần thiết
   - Nhấn nút "Đăng ký"
   - Có thể đăng ký được nhiều lớp học

5. **Tương tác giữa các người dùng**

   - Tính năng "Chat" dùng để tương tác giữa các người dùng
   - Trong các trang chi tiết về gia sư và chi tiết lớp học sẽ có nút "Chat"
   - Click vào nút "Chat" để có thể chat với user đã tạo ra profile của Gia sư/ Lớp học đó
   - Lần sau có thể truy cập vào "Chat" để có thể chat với các user đã từng chat

6. **Đánh giá Gia sư**

   - Truy cập trang chi tiết gia sư
   - Thêm đánh giá và xếp hạng

7. **Quản lý lịch học**

   - Xem lịch dạy tại "Lịch dạy"
   - Tạo lịch học:

     - Truy cập vào trang "chi tiết lớp học"
     - Vào trang "quản lý lịch học"
     - Kéo xuống dưới để tạo lịch học mới

   - Xác nhận hoặc báo cáo các buổi học
     - Truy cập vào trang "chi tiết lớp học"
     - Vào trang "quản lý lịch học"
     - Tùy chọn chỉnh sửa lịch học ở "danh sách lịch học đã tạo"

8. **Chỉnh sửa User**

   - Trên thanh dropdown của topbar sẽ hiện ra chức năng "Tài khoản"
   - Truy cập "Tài khoản" để có thể chỉnh sửa các thông tin cần thiết

### Dành cho Admin

1. **Quản lý người dùng**

   - Xem danh sách tài khoản
   - Kích hoạt/vô hiệu hóa tài khoản

2. **Quản lý gia sư**

   - Xem các danh sách gia sư hiện có
   - Xóa / Chỉnh sửa các thông tin của gia sư
   - Kích hoạt/vô hiệu hóa gia sư

3. **Quản lý lớp học**

   - Xem các danh sách lớp học hiện có
   - Xóa / Chỉnh sửa các thông tin của lớp học
   - Kích hoạt/vô hiệu hóa gia sư
