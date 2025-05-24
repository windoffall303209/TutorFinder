// Script xử lý đăng ký nhận dạy lớp
function registerForClass(classId) {
  if (!classId) {
    alert("Không tìm thấy ID lớp học. Vui lòng tải lại trang và thử lại.");
    return;
  }
  if (confirm("Bạn có chắc chắn muốn đăng ký nhận dạy lớp học này không?")) {
    // Hiển thị trạng thái đang đăng ký
    const registerBtn = document.getElementById("register-class-btn");
    registerBtn.disabled = true;
    registerBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...';

    // Log dữ liệu trước khi gửi
    console.log("Kiểu của ID:", typeof classId);
    console.log("Giá trị ID:", classId);

    // Chuyển classId sang dạng số nếu là chuỗi
    const classIdNumber = parseInt(classId, 10);

    // Gửi request với ID dạng số
    fetch("/classes/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ classId: classIdNumber }),
    })
      .then((response) => {
        console.log("Mã phản hồi:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("Phản hồi từ server:", data);
        if (data.success) {
          // Đăng ký thành công
          alert(data.message);
          registerBtn.innerHTML =
            '<i class="fas fa-check-circle me-2"></i>Đã đăng ký';
          registerBtn.classList.remove("btn-warning");
          registerBtn.classList.add("btn-secondary");
        } else {
          // Đăng ký thất bại, hiển thị lỗi và khôi phục nút
          alert(data.message || "Có lỗi xảy ra khi đăng ký nhận lớp");
          registerBtn.disabled = false;
          registerBtn.innerHTML =
            '<i class="fas fa-chalkboard-teacher me-2"></i>Đăng ký nhận dạy lớp';
        }
      })
      .catch((error) => {
        console.error("Lỗi khi đăng ký nhận lớp:", error);
        alert("Đã xảy ra lỗi khi đăng ký nhận lớp.");
        registerBtn.disabled = false;
        registerBtn.innerHTML =
          '<i class="fas fa-chalkboard-teacher me-2"></i>Đăng ký nhận dạy lớp';
      });
  }
}

// Tự động gắn sự kiện khi trang load
document.addEventListener("DOMContentLoaded", function () {
  const registerBtn = document.getElementById("register-class-btn");

  if (registerBtn) {
    console.log("Đã tìm thấy nút đăng ký");
    // Lưu trữ ID lớp học vào biến để sử dụng sau này
    const classId = registerBtn.getAttribute("data-class-id");
    console.log("ID lớp học từ thuộc tính data:", classId);
  }
});
