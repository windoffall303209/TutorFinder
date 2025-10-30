# 📊 CÁC MỨC ĐỘ & CHỨC NĂNG - HỆ THỐNG ĐẤU GIÁ TRỰC TUYẾN

---

## 🟢 MỨC 1: CƠ BẢN - ĐỦ ĐỂ QUA MÔN (2-3 ngày)

**⏰ Thời gian làm:** 2-3 ngày  
**💯 Điểm ước tính:** 6.5-7.5/10  
**🎯 Phù hợp cho:** Bạn không có nhiều thời gian, chưa có kinh nghiệm lắm

### **PHÍA SERVER (Máy chủ):**

1. ✅ **Khởi động server** - Mở server trên cổng 8888
2. ✅ **Cho nhiều người kết nối cùng lúc** - Dùng đa luồng (multi-threading)
3. ✅ **Quản lý 1 món đồ đấu giá** - Ví dụ: iPhone 15 Pro Max, giá khởi điểm 20 triệu, thời gian đấu giá 3 phút
4. ✅ **Nhận giá đặt từ người dùng** - Client gửi giá lên server
5. ✅ **Kiểm tra giá hợp lệ** - Giá mới phải cao hơn giá hiện tại
6. ✅ **Cập nhật giá cao nhất** - Lưu người đặt giá và số tiền
7. ✅ **Gửi thông báo cho tất cả mọi người** - Khi có giá mới, tất cả clients đều nhận được
8. ✅ **Đếm ngược thời gian** - Timer tự động chạy
9. ✅ **Kết thúc đấu giá** - Hết giờ thì thông báo ai thắng

### **PHÍA CLIENT (Người dùng):**

1. ✅ **Kết nối vào server** - Nhập địa chỉ IP và cổng 8888
2. ✅ **Đăng nhập đơn giản** - Chỉ cần nhập tên (không cần mật khẩu)
3. ✅ **Giao diện dạng text** - Không có giao diện đồ họa, chỉ hiển thị chữ:

   ```
   ========== HỆ THỐNG ĐẤU GIÁ ==========
   Sản phẩm: iPhone 15 Pro Max
   Giá hiện tại: 25,000,000 VNĐ
   Người đang thắng: Alice
   Thời gian còn lại: 01:45

   Tên của bạn: Bob
   Nhập giá muốn đặt (hoặc gõ 'exit' để thoát): _
   ```

4. ✅ **Đặt giá** - Gõ số tiền muốn đặt
5. ✅ **Nhận thông báo ngay lập tức** - Khi có người khác đặt giá, bạn thấy luôn
6. ✅ **Xem kết quả** - Hết giờ thì biết ai thắng

### **ĐIỂM MẠNH VỀ LẬP TRÌNH MẠNG:**

- ✅ Dùng Socket TCP để kết nối giữa máy khách và máy chủ
- ✅ Đa luồng - mỗi người dùng 1 luồng riêng
- ✅ Giao thức text đơn giản
- ✅ Cơ chế phát sóng (broadcast) - gửi tin cho tất cả mọi người
- ✅ Đồng bộ hóa dữ liệu - dùng từ khóa synchronized

### **CÁCH DEMO:**

```
Bước 1: Chạy chương trình Server (1 cửa sổ)
Bước 2: Chạy chương trình Client 3 lần (3 cửa sổ khác nhau)
Bước 3: 3 người Alice, Bob, Charlie lần lượt đặt giá
Bước 4: Tất cả đều thấy giá cập nhật ngay lập tức
Bước 5: Hết giờ → Server thông báo ai thắng
```

---

## 🟡 MỨC 2: TRUNG BÌNH - ĐIỂM TỐT (4-5 ngày)

**⏰ Thời gian làm:** 4-5 ngày  
**💯 Điểm ước tính:** 7.5-8.5/10  
**🎯 Phù hợp cho:** Bạn có thời gian vừa phải, muốn được điểm tốt

### **PHÍA SERVER (Thêm vào những chức năng của Mức 1):**

10. ✅ **Nhiều món đồ để đấu giá** - Không chỉ 1 món, có thể 5-10 món
11. ✅ **Người dùng chọn món muốn đấu** - Như vào các phòng khác nhau
12. ✅ **Mỗi món có đồng hồ riêng** - Món này đấu 3 phút, món kia đấu 5 phút
13. ✅ **Lưu lịch sử đặt giá** - Ai đặt giá bao nhiêu, lúc nào
14. ✅ **Hiển thị danh sách các phiên đấu giá** - Người dùng xem có những món gì
15. ✅ **Tự động gia hạn thời gian** - Nếu có người đặt giá trong 10 giây cuối, tự động thêm 1 phút (chống "giật giây cuối")
16. ✅ **Xử lý khi người dùng thoát đột ngột** - Không bị crash
17. ✅ **Ghi log** - Lưu tất cả hoạt động vào file để kiểm tra sau

### **PHÍA CLIENT (Thêm vào những chức năng của Mức 1):**

7. ✅ **Có giao diện đồ họa** - Dùng Java Swing, đẹp hơn:
   - Bảng (Table) hiển thị danh sách các món đang đấu giá
   - Nhãn (Label) hiển thị thông tin món đang xem
   - Ô nhập liệu (TextField) để gõ giá
   - Nút bấm (Button) "Đặt giá"
   - Thanh tiến trình (ProgressBar) hiển thị thời gian còn lại
   - Đổi màu: Xanh = bạn đang thắng, Đỏ = bạn đang thua
8. ✅ **Xem tất cả các món đang đấu giá**
9. ✅ **Vào/ra phòng đấu giá** - Tự do chọn món muốn đấu
10. ✅ **Xem 10 lần đặt giá gần nhất**
11. ✅ **Thông báo khi bị đè giá** - Có người đặt giá cao hơn bạn
12. ✅ **Âm thanh cảnh báo** (tùy chọn) - Tiếng "ting" khi có giá mới

### **ĐIỂM MẠNH VỀ LẬP TRÌNH MẠNG (Thêm vào Mức 1):**

- ✅ Quản lý nhiều phòng (room management)
- ✅ Quản lý vòng đời kết nối
- ✅ Cấu trúc dữ liệu đồng thời (ConcurrentHashMap)
- ✅ Bộ quản lý luồng (Thread Pool)
- ✅ Xử lý lỗi và phục hồi

### **GIAO THỨC MỞ RỘNG:**

```
Client gửi đến Server:
- JOIN|Bob                    → Bob tham gia hệ thống
- LIST_AUCTIONS              → Xem danh sách đấu giá
- JOIN_AUCTION|1             → Vào phòng đấu giá số 1
- BID|1|25000000            → Đặt giá 25 triệu cho món số 1
- LEAVE_AUCTION|1            → Rời khỏi phòng số 1

Server gửi đến Client:
- AUCTION_LIST|1:iPhone:20tr|2:Laptop:15tr  → Danh sách các món
- AUCTION_INFO|1|iPhone|25tr|Alice|02:30    → Thông tin chi tiết
- BID_UPDATE|1|Bob|26tr                      → Có giá mới
- AUCTION_END|1|Alice|30tr                   → Kết thúc, Alice thắng
- ERROR|Giá quá thấp                         → Báo lỗi
```

### **CÁCH DEMO:**

```
Bước 1: Server quản lý 3 món đồ cùng lúc
Bước 2: 5 người kết nối vào
Bước 3: Người này đấu iPhone, người kia đấu Laptop
Bước 4: Demo tự động gia hạn thời gian
Bước 5: Nhiều món kết thúc ở thời điểm khác nhau
Bước 6: Giao diện đẹp, có màu sắc
```

---

## 🟠 MỨC 3: KHÁ - ĐIỂM CAO (6-7 ngày)

**⏰ Thời gian làm:** 6-7 ngày  
**💯 Điểm ước tính:** 8.5-9.0/10  
**🎯 Phù hợp cho:** Muốn điểm cao, có kinh nghiệm Java khá

### **PHÍA SERVER (Thêm vào những chức năng của Mức 2):**

18. ✅ **Hệ thống đăng nhập thật** - Có tên đăng nhập và mật khẩu
19. ✅ **Kết nối cơ sở dữ liệu** - Dùng SQLite hoặc MySQL để lưu:
    - Tài khoản người dùng
    - Các món đồ đấu giá
    - Lịch sử đặt giá
    - Nhật ký giao dịch
20. ✅ **Chức năng quản trị viên**:
    - Tạo phiên đấu giá mới
    - Xóa/sửa đấu giá
    - Cấm người dùng vi phạm
    - Xem thống kê
21. ✅ **Quy tắc tăng giá** - Mỗi lần đặt phải tăng tối thiểu 5% hoặc 1 triệu
22. ✅ **Giá dự trữ** - Giá bí mật, dưới mức này chủ hàng không bán
23. ✅ **Đặt giá tự động** - Bạn đặt giá tối đa 50 triệu, hệ thống tự đấu giá giúp bạn
24. ✅ **Chống giật giây cuối** - Có người đặt giá gần hết giờ thì tự động gia hạn
25. ✅ **Cân bằng tải** - Dùng Thread Pool để xử lý hiệu quả
26. ✅ **Theo dõi hiệu suất** - Số người online, tốc độ xử lý

### **PHÍA CLIENT (Thêm vào những chức năng của Mức 2):**

13. ✅ **Form đăng ký/đăng nhập đẹp**
14. ✅ **Nhiều tab khác nhau**:
    - Tab "Đang đấu giá" - Các món đang diễn ra
    - Tab "Tôi đã đấu" - Các món bạn đã tham gia
    - Tab "Tôi đã thắng" - Các món bạn thắng
    - Tab "Lịch sử" - Tất cả hoạt động
15. ✅ **Đấu giá nâng cao**:
    - Đặt giá tối đa để hệ thống tự đấu
    - Nút tăng nhanh (+500k, +1tr, +5tr)
16. ✅ **Biểu đồ theo thời gian thực** - Đồ thị giá tăng như thế nào
17. ✅ **Hồ sơ người dùng**:
    - Tỷ lệ thắng
    - Tổng tiền đã chi
    - Số món đã thắng
18. ✅ **Lọc và tìm kiếm**:
    - Lọc theo danh mục (Điện tử, Thời trang, Xe...)
    - Tìm kiếm theo tên
    - Sắp xếp theo giá/thời gian
19. ✅ **Danh sách theo dõi** - Đánh dấu món quan tâm để xem sau
20. ✅ **Thông báo trên màn hình** - Cửa sổ popup khi bị đè giá

### **ĐIỂM MẠNH VỀ LẬP TRÌNH MẠNG (Thêm vào Mức 2):**

- ✅ Kết nối có trạng thái (session)
- ✅ Mã hóa cơ bản (SSL/TLS)
- ✅ Phiên bản giao thức
- ✅ Cơ chế nhịp tim (heartbeat) - Phát hiện kết nối chết
- ✅ Hàng đợi tin nhắn (message queue)
- ✅ Giới hạn tốc độ (chống spam)

### **CÁCH DEMO:**

```
Bước 1: Demo đăng ký/đăng nhập
Bước 2: Quản trị viên tạo món đấu giá mới trong lúc hệ thống đang chạy
Bước 3: 10+ người cùng lúc
Bước 4: Demo đặt giá tự động (Alice đặt tối đa 50tr, hệ thống tự đấu giúp)
Bước 5: Demo chống giật giây cuối (đặt giá trong 10s cuối → gia hạn thêm)
Bước 6: Hiển thị thống kê hiệu suất (bao nhiêu giao dịch/giây)
Bước 7: Tắt server rồi bật lại, dữ liệu vẫn còn (nhờ database)
```

--
