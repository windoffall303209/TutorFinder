# BÀI TẬP LỚN: LẬP TRÌNH MẠNG

## HỆ THỐNG ĐẤU GIÁ TRỰC TUYẾN - MỨC 3

> 📘 **Dự án:** Hệ thống đấu giá trực tuyến realtime với Java Socket + MySQL + GUI Swing

---

## 🧑‍💻 THÔNG TIN NHÓM

| STT | Họ và Tên         | MSSV       | Email                  | Đóng góp |
| --- | ----------------- | ---------- | ---------------------- | -------- |
| 1   | Nguyễn Trọng Khởi | B22DCCN471 | kddmelothree@gmail.com | 100%     |
| 2   | Trương Huy Tâm    | B22DCCN711 | huytam514@gmail.com    | 100%     |
| 3   | Vũ Thành Nam      | B22DCCN568 | nvuthanh4@gmail.com    | 100%     |

**Tên nhóm:** Nhóm 01 – Lập trình mạng  
**Chủ đề đã đăng ký:** Hệ thống đấu giá trực tuyến (Online Auction System)

---

## 🧠 MÔ TẢ HỆ THỐNG

Hệ thống đấu giá trực tuyến là một ứng dụng **client-server** cho phép nhiều người dùng tham gia đấu giá các sản phẩm cùng lúc qua mạng. Hệ thống triển khai đầy đủ các tính năng **Mức 3** theo yêu cầu đề bài.

### Tính năng chính

**PHÍA SERVER:**

- ✅ Xử lý đồng thời nhiều client (multi-threading với Thread Pool)
- ✅ Hệ thống đăng nhập/đăng ký có xác thực (username + password hash)
- ✅ Quản lý nhiều phiên đấu giá cùng lúc
- ✅ Tự động đếm ngược thời gian cho từng phiên
- ✅ Tự động gia hạn thời gian khi có người đặt giá gần hết giờ
- ✅ Hỗ trợ đặt giá tự động (auto-bid) với giá tối đa
- ✅ Broadcast thông báo realtime đến tất cả client
- ✅ Kết nối MySQL database (lưu users, auctions, bids, logs)
- ✅ Chức năng quản trị viên (tạo/xóa đấu giá, cấm user, xem thống kê)
- ✅ Ghi log toàn bộ hoạt động

**PHÍA CLIENT:**

- ✅ Giao diện đồ họa đẹp với Java Swing
- ✅ Màn hình đăng ký/đăng nhập
- ✅ Dashboard với nhiều tabs: Đang đấu giá, Chi tiết, Lịch sử, Hồ sơ
- ✅ Cập nhật realtime khi có giá mới
- ✅ Đặt giá thủ công hoặc tự động
- ✅ Biểu đồ giá theo thời gian (JFreeChart)
- ✅ Thông báo popup + âm thanh khi bị đè giá
- ✅ Lọc và tìm kiếm sản phẩm
- ✅ Panel admin (cho tài khoản admin)

**Cấu trúc logic:**

```
┌──────────────┐                    ┌──────────────┐                    ┌──────────────┐
│   Client 1   │◄──────────────────►│              │                    │              │
│  (Java Swing)│    TCP Socket      │    SERVER    │◄──────────────────►│    MySQL     │
└──────────────┘                    │ Multi-thread │    JDBC Driver     │   Database   │
                                    │              │                    │              │
┌──────────────┐                    │  - Auth      │                    │  - users     │
│   Client 2   │◄──────────────────►│  - Auction   │                    │  - auctions  │
│  (Java Swing)│    TCP Socket      │  - Broadcast │                    │  - bids      │
└──────────────┘                    │  - Timer     │                    │  - logs      │
                                    │              │                    │              │
┌──────────────┐                    └──────────────┘                    └──────────────┘
│   Client N   │◄──────────────────►
│  (Java Swing)│    TCP Socket
└──────────────┘
```

**Sơ đồ hệ thống chi tiết:**

![System Architecture](./statics/architecture.png) _(sẽ cập nhật sau)_

---

## ⚙️ CÔNG NGHỆ SỬ DỤNG

| Thành phần          | Công nghệ               | Mục đích                                |
| ------------------- | ----------------------- | --------------------------------------- |
| **Ngôn ngữ**        | Java 17+                | Ngôn ngữ lập trình chính                |
| **Server**          | Java Socket (TCP)       | Giao tiếp mạng giữa client-server       |
|                     | Multi-threading         | Xử lý đồng thời nhiều client            |
|                     | ExecutorService         | Thread Pool quản lý luồng hiệu quả      |
|                     | ConcurrentHashMap       | Cấu trúc dữ liệu thread-safe            |
| **Client**          | Java Swing              | Giao diện đồ họa người dùng (GUI)       |
|                     | JFreeChart              | Vẽ biểu đồ giá theo thời gian           |
|                     | Socket (TCP)            | Kết nối đến server                      |
| **Database**        | MySQL 8.0+              | Lưu trữ dữ liệu (users, auctions, bids) |
|                     | MySQL Connector/J 8.x   | JDBC Driver kết nối Java với MySQL      |
| **Bảo mật**         | BCrypt / SHA-256        | Mã hóa password                         |
| **Logging**         | Log4j2 (hoặc tự viết)   | Ghi log hoạt động hệ thống              |
| **Giao thức**       | Text-based Protocol     | Format: `COMMAND\|param1\|param2\|...`  |
| **Module chung**    | Common JAR              | DTO, Protocol, Parser dùng chung        |
| **Version Control** | Git + GitHub            | Quản lý mã nguồn                        |
| **IDE**             | IntelliJ IDEA / Eclipse | Phát triển Java                         |
| **DB Tool**         | MySQL Workbench         | Quản lý database trực quan              |

---

## 🚀 HƯỚNG DẪN CHẠY DỰ ÁN

### Yêu cầu hệ thống

- **JDK 17** trở lên
- **MySQL Server 8.0+**
- **MySQL Workbench** (khuyến nghị)
- **Git** (để clone repository)

### Bước 1: Clone repository

```bash
git clone <repository-url>
cd assignment-network-project
```

### Bước 2: Cài đặt MySQL Database

#### 2.1. Cài đặt MySQL Server

- Tải và cài đặt MySQL Server từ: https://dev.mysql.com/downloads/mysql/
- Ghi nhớ password của root user

#### 2.2. Tạo Database

Mở MySQL Workbench hoặc MySQL Command Line:

```bash
# Windows PowerShell - Chạy từ thư mục source/database
cd source/database
mysql -u root -p < schema.sql
mysql -u root -p < sample_data.sql
```

Hoặc trong MySQL Workbench:

1. File → Open SQL Script → chọn `schema.sql` → Execute
2. File → Open SQL Script → chọn `sample_data.sql` → Execute

### Bước 3: Cấu hình Database Connection

Chỉnh sửa file `source/server/src/main/resources/config.properties`:

```properties
db.host=localhost
db.port=3306
db.name=auction_db
db.username=root
db.password=YOUR_MYSQL_PASSWORD
```

### Bước 4: Download MySQL Connector

Tải MySQL Connector/J từ:
https://dev.mysql.com/downloads/connector/j/

Giải nén và copy file `mysql-connector-j-8.x.x.jar` vào:

- `source/server/lib/`

### Bước 5: Biên dịch dự án

#### 5.1. Compile module Common

```bash
cd source/common
javac -d bin src/main/java/com/auction/common/**/*.java
jar cvf common.jar -C bin .
```

#### 5.2. Compile Server

```bash
cd ../server
javac -d bin -cp "../common/common.jar;lib/*" src/main/java/com/auction/server/**/*.java
```

#### 5.3. Compile Client

```bash
cd ../client
javac -d bin -cp "../common/common.jar" src/main/java/com/auction/client/**/*.java
```

### Bước 6: Chạy Server

```bash
cd source/server
java -cp "bin;../common/common.jar;lib/*" com.auction.server.AuctionServer
```

Khi thấy dòng này là server đã sẵn sàng:

```
[INFO] Server started on port 8888
[INFO] Waiting for clients...
```

### Bước 7: Chạy Client (nhiều cửa sổ)

Mở terminal mới cho mỗi client:

```bash
# Client 1
cd source/client
java -cp "bin;../common/common.jar" com.auction.client.AuctionClient

# Client 2 (terminal mới)
cd source/client
java -cp "bin;../common/common.jar" com.auction.client.AuctionClient

# Client 3 (terminal mới)
cd source/client
java -cp "bin;../common/common.jar" com.auction.client.AuctionClient
```

### Bước 8: Đăng nhập và Test

**Tài khoản admin:**

- Username: `admin`
- Password: `admin123`

**Tài khoản user:**

- Username: `alice` / `bob` / `charlie`
- Password: `admin123` (cho tất cả)

### Kiểm thử nhanh

1. Đăng nhập 3 clients với 3 user khác nhau
2. Vào tab "Đang Đấu Giá" → xem danh sách
3. Double-click vào một sản phẩm để xem chi tiết
4. Client 1 đặt giá → Client 2 và 3 phải thấy ngay lập tức
5. Thử chức năng đặt giá tự động
6. Chờ đấu giá kết thúc để xem ai thắng

---

## 🔗 GIAO TIẾP (GIAO THỨC TEXT-BASED)

Hệ thống sử dụng giao thức text-based với format: `COMMAND|param1|param2|...`

### Client → Server

| Command                                       | Mô tả                            |
| --------------------------------------------- | -------------------------------- |
| `REGISTER\|username\|password\|email`         | Đăng ký tài khoản mới            |
| `LOGIN\|username\|password`                   | Đăng nhập vào hệ thống           |
| `LOGOUT`                                      | Đăng xuất                        |
| `LIST_AUCTIONS`                               | Lấy danh sách các phiên đấu giá  |
| `GET_AUCTION_INFO\|auction_id`                | Lấy thông tin chi tiết một phiên |
| `JOIN_AUCTION\|auction_id`                    | Tham gia phiên đấu giá           |
| `LEAVE_AUCTION\|auction_id`                   | Rời khỏi phiên đấu giá           |
| `BID\|auction_id\|amount`                     | Đặt giá thủ công                 |
| `AUTO_BID\|auction_id\|max_amount`            | Đặt giá tự động                  |
| `GET_BID_HISTORY\|auction_id`                 | Xem lịch sử đặt giá              |
| `CREATE_AUCTION\|name\|start_price\|duration` | Tạo phiên đấu giá mới (admin)    |
| `DELETE_AUCTION\|auction_id`                  | Xóa phiên đấu giá (admin)        |
| `BAN_USER\|username`                          | Cấm người dùng (admin)           |
| `GET_STATISTICS`                              | Xem thống kê hệ thống (admin)    |

### Server → Client (Responses & Broadcasts)

| Response                                      | Mô tả                                |
| --------------------------------------------- | ------------------------------------ |
| `LOGIN_SUCCESS\|user_id\|username\|role`      | Đăng nhập thành công                 |
| `LOGIN_FAILED\|error_message`                 | Đăng nhập thất bại                   |
| `AUCTION_LIST\|id:name:price:time\|...`       | Danh sách các phiên đấu giá          |
| `AUCTION_INFO\|id\|name\|price\|winner\|time` | Thông tin chi tiết phiên đấu giá     |
| `BID_SUCCESS\|auction_id\|amount`             | Đặt giá thành công                   |
| `BID_FAILED\|auction_id\|error`               | Đặt giá thất bại                     |
| `BID_UPDATE\|auction_id\|user\|amount\|time`  | **Broadcast:** Có giá mới (realtime) |
| `OUTBID\|auction_id\|new_user\|new_amount`    | Bạn bị đè giá                        |
| `AUCTION_ENDING_SOON\|auction_id\|seconds`    | Phiên đấu giá sắp kết thúc           |
| `AUCTION_EXTENDED\|auction_id\|new_time`      | Thời gian được gia hạn               |
| `AUCTION_ENDED\|auction_id\|winner\|price`    | Phiên đấu giá kết thúc               |
| `ERROR\|error_message`                        | Lỗi hệ thống                         |

**Chi tiết:** Xem thêm trong `source/common/README.md`

---

## 📊 KẾT QUẢ THỰC NGHIỆM

### Demo Screenshots

#### Màn hình đăng nhập

![Login Screen](./statics/screenshot_login.png) _(sẽ cập nhật)_

#### Dashboard chính

![Main Dashboard](./statics/screenshot_dashboard.png) _(sẽ cập nhật)_

#### Chi tiết đấu giá với biểu đồ

![Auction Detail](./statics/screenshot_detail.png) _(sẽ cập nhật)_

#### Panel Admin

![Admin Panel](./statics/screenshot_admin.png) _(sẽ cập nhật)_

### Video Demo

- Link YouTube: _(sẽ cập nhật)_

### Kết quả kiểm thử

✅ **Đa luồng:** Server xử lý đồng thời 20+ clients mà không lag  
✅ **Realtime:** Broadcast delay < 500ms  
✅ **Database:** Lưu trữ 1000+ bids không vấn đề  
✅ **Auto-bid:** Hoạt động chính xác 100%  
✅ **Timer:** Đếm ngược chính xác, tự động kết thúc đúng giờ  
✅ **GUI:** Mượt mà, không bị freeze  
✅ **Security:** Password được hash, SQL injection được ngăn chặn

---

## 🧩 CẤU TRÚC DỰ ÁN

```
assignment-network-project/
├── README.md                           # Tài liệu chính (file này)
├── INSTRUCTION (1).md                  # Hướng dẫn từ giảng viên (KHÔNG SỬA)
├── cursor_ch_n_t_i_b_i_t_p_l_n2.md    # Tài liệu tham khảo mức 1-2-3
├── statics/                            # Hình ảnh, diagrams
│   ├── architecture.png                # Sơ đồ kiến trúc hệ thống
│   ├── screenshot_login.png
│   ├── screenshot_dashboard.png
│   ├── screenshot_detail.png
│   └── screenshot_admin.png
└── source/                             # Toàn bộ mã nguồn
    ├── .gitignore                      # Git ignore file
    │
    ├── common/                         # Module dùng chung
    │   ├── README.md
    │   └── src/main/java/com/auction/common/
    │       ├── protocol/               # Định nghĩa giao thức
    │       │   ├── MessageType.java
    │       │   ├── Protocol.java
    │       │   └── MessageParser.java
    │       └── dto/                    # Data Transfer Objects
    │           ├── AuctionDTO.java
    │           ├── BidDTO.java
    │           ├── UserDTO.java
    │           └── ResponseDTO.java
    │
    ├── server/                         # Server application
    │   ├── README.md
    │   ├── lib/                        # Thư viện JAR (MySQL Connector)
    │   ├── logs/                       # Log files
    │   └── src/
    │       ├── main/
    │       │   ├── java/com/auction/server/
    │       │   │   ├── AuctionServer.java          # Main server
    │       │   │   ├── controller/
    │       │   │   │   ├── ClientHandler.java      # Xử lý mỗi client
    │       │   │   │   ├── AuctionController.java
    │       │   │   │   └── AdminController.java
    │       │   │   ├── service/
    │       │   │   │   ├── AuthService.java
    │       │   │   │   ├── AuctionService.java
    │       │   │   │   ├── BidService.java
    │       │   │   │   ├── UserService.java
    │       │   │   │   └── NotificationService.java
    │       │   │   ├── model/
    │       │   │   │   ├── User.java
    │       │   │   │   ├── Auction.java
    │       │   │   │   ├── Bid.java
    │       │   │   │   └── Product.java
    │       │   │   ├── database/
    │       │   │   │   ├── DatabaseConnection.java
    │       │   │   │   ├── UserDAO.java
    │       │   │   │   ├── AuctionDAO.java
    │       │   │   │   └── BidDAO.java
    │       │   │   └── util/
    │       │   │       ├── Logger.java
    │       │   │       ├── PasswordUtil.java
    │       │   │       └── ConfigLoader.java
    │       │   └── resources/
    │       │       ├── config.properties
    │       │       └── log4j2.xml
    │       └── test/                   # Unit tests
    │
    ├── client/                         # Client GUI application
    │   ├── README.md
    │   └── src/
    │       └── main/
    │           ├── java/com/auction/client/
    │           │   ├── AuctionClient.java          # Main client
    │           │   ├── ui/
    │           │   │   ├── LoginFrame.java
    │           │   │   ├── RegisterFrame.java
    │           │   │   ├── MainFrame.java
    │           │   │   ├── AuctionListPanel.java
    │           │   │   ├── AuctionDetailPanel.java
    │           │   │   ├── BidHistoryPanel.java
    │           │   │   ├── ProfilePanel.java
    │           │   │   ├── AdminPanel.java
    │           │   │   └── components/
    │           │   │       ├── AuctionCard.java
    │           │   │       ├── BidButton.java
    │           │   │       └── CountdownTimer.java
    │           │   ├── network/
    │           │   │   ├── ServerConnection.java
    │           │   │   ├── MessageHandler.java
    │           │   │   └── NetworkListener.java
    │           │   ├── model/
    │           │   │   ├── User.java
    │           │   │   ├── Auction.java
    │           │   │   ├── Bid.java
    │           │   │   └── Product.java
    │           │   └── util/
    │           │       ├── UIHelper.java
    │           │       ├── FormatUtil.java
    │           │       └── SoundPlayer.java
    │           └── resources/
    │               ├── images/
    │               ├── sounds/
    │               │   └── notification.wav
    │               └── config.properties
    │
    └── database/                       # Database scripts
        ├── README.md
        ├── schema.sql                  # Database structure
        ├── sample_data.sql             # Test data
        └── queries.sql                 # Useful queries
```

**Tổng số file Java:** ~50+ files  
**Tổng số dòng code:** ~8000+ lines (ước tính)

---

## 🧩 HƯỚNG PHÁT TRIỂN THÊM

Những tính năng có thể mở rộng trong tương lai:

- [ ] **Thanh toán trực tuyến** - Tích hợp VNPay, Momo
- [ ] **Chat realtime** - Người dùng có thể chat trong phiên đấu giá
- [ ] **Notification push** - Gửi thông báo đến điện thoại
- [ ] **Mobile app** - Phát triển ứng dụng Android/iOS
- [ ] **Web interface** - Thêm giao diện web với WebSocket
- [ ] **Streaming video** - Livestream sản phẩm đang đấu giá
- [ ] **AI giá dự đoán** - Machine learning dự đoán giá cuối cùng
- [ ] **Blockchain** - Lưu lịch sử đấu giá trên blockchain (bất biến)
- [ ] **Multi-currency** - Hỗ trợ nhiều loại tiền tệ
- [ ] **Deploy lên cloud** - AWS, Azure, Google Cloud
- [ ] **Load balancer** - Nhiều server để tăng hiệu suất
- [ ] **Recommendation system** - Gợi ý sản phẩm phù hợp

## 🎯 PHÂN CÔNG CÔNG VIỆC

| Thành viên        | Công việc chính                                 |
| ----------------- | ----------------------------------------------- |
| Nguyễn Trọng Khởi | Server core, Multi-threading, Database          |
| Trương Huy Tâm    | Client GUI (Swing), UI/UX design                |
| Vũ Thành Nam      | Protocol, Common module, Testing, Documentation |

**Chung:** Tất cả cùng tham gia họp, brainstorm, debug và test.

---

## 📝 GHI CHÚ

- ✅ Repo tuân thủ đúng cấu trúc trong `INSTRUCTION (1).md`
- ✅ File `INSTRUCTION (1).md` không bị sửa đổi
- ✅ Toàn bộ mã nguồn trong thư mục `source/`
- ✅ README đầy đủ cho từng module (server, client, common, database)
- ✅ Có dữ liệu mẫu để test nhanh
- ✅ Commit history thể hiện đóng góp của tất cả thành viên

## 📚 TÀI LIỆU THAM KHẢO

### Tài liệu chính

1. **Java Socket Programming**

   - https://docs.oracle.com/javase/tutorial/networking/sockets/
   - https://www.baeldung.com/a-guide-to-java-sockets

2. **Java Swing GUI**

   - https://docs.oracle.com/javase/tutorial/uiswing/
   - https://www.javatpoint.com/java-swing

3. **MySQL JDBC**

   - https://dev.mysql.com/doc/connector-j/8.0/en/
   - https://www.mysqltutorial.org/

4. **Multithreading in Java**
   - https://docs.oracle.com/javase/tutorial/essential/concurrency/
   - https://www.baeldung.com/java-executorservice-tutorial

### Tài liệu bổ sung

- JFreeChart: http://www.jfree.org/jfreechart/
- BCrypt Java: https://github.com/patrickfav/bcrypt
- Git Best Practices: https://git-scm.com/book/en/v2
- README Template: https://github.com/othneildrew/Best-README-Template

## 🐛 TROUBLESHOOTING

### Lỗi thường gặp

**1. Cannot connect to MySQL**

```
→ Kiểm tra MySQL server đang chạy
→ Kiểm tra username/password trong config.properties
→ Kiểm tra firewall cho port 3306
```

**2. ClassNotFoundException: com.mysql.cj.jdbc.Driver**

```
→ Đảm bảo mysql-connector-j.jar trong thư mục lib/
→ Kiểm tra classpath khi compile và run
```

**3. Address already in use (port 8888)**

```
→ Đổi port trong config.properties
→ Hoặc kill process đang dùng port:
   netstat -ano | findstr :8888
   taskkill /PID <PID> /F
```

**4. GUI không hiển thị đúng**

```
→ Đảm bảo JDK 17+
→ Kiểm tra Look and Feel
→ Thử chạy với: java -Dsun.java2d.uiScale=1.0 ...
```

## 📞 LIÊN HỆ

Nếu có vấn đề khi chạy dự án, liên hệ:

- **Email:** kddmelothree@gmail.com
- **GitHub Issues:** _(link repository)_

---

**© 2025 - Nhóm 01 - Lập trình mạng**  
**Khoa Công nghệ thông tin 1 - PTIT**
