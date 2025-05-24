// Xử lý dropdown menu trong header khi DOM đã tải xong
document.addEventListener("DOMContentLoaded", function () {
    // Tham chiếu đến các phần tử dropdown
    const dropdownToggle = document.getElementById("userDropdown");
    if (!dropdownToggle) return; // Thoát nếu không tìm thấy button dropdown

    const dropdownMenu = document.querySelector(".dropdown-menu-topbar");
    if (!dropdownMenu) return; // Thoát nếu không tìm thấy menu dropdown

    const dropdownContainer = document.querySelector(".dropdown-topbar");
    if (!dropdownContainer) return; // Thoát nếu không tìm thấy container dropdown

    // Biến để theo dõi trạng thái dropdown
    let isHovering = false; // Theo dõi trạng thái hover
    let isMenuOpen = false; // Theo dõi trạng thái menu có đang mở không

    // Thiết lập CSS positioning cho dropdown menu
    dropdownMenu.style.position = "absolute";
    dropdownMenu.style.top = "100%"; // Hiển thị ngay dưới button
    dropdownMenu.style.right = "0"; // Căn phải
    dropdownMenu.style.zIndex = "1500"; // Đảm bảo hiển thị trên các element khác
    dropdownMenu.style.minWidth = "200px"; // Độ rộng tối thiểu

    // Xử lý sự kiện hover trên desktop (màn hình >= 768px)
    if (window.innerWidth >= 768) {
      // Sự kiện khi chuột di chuyển vào dropdown container
      dropdownContainer.addEventListener("mouseenter", function () {
        isHovering = true;
        dropdownMenu.classList.add("show"); // Hiển thị menu
      });

      // Sự kiện khi chuột rời khỏi dropdown container
      dropdownContainer.addEventListener("mouseleave", function () {
        isHovering = false;
        // Chỉ ẩn menu nếu menu không được mở bằng click
        if (!isMenuOpen) {
          dropdownMenu.classList.remove("show");
        }
      });
    }

    // Xử lý sự kiện click trên button toggle (áp dụng cho cả desktop và mobile)
    dropdownToggle.addEventListener("click", function (e) {
      e.preventDefault(); // Ngăn hành vi mặc định
      e.stopPropagation(); // Ngăn sự kiện lan truyền

      // Chuyển đổi trạng thái menu
      isMenuOpen = !isMenuOpen;

      // Hiển thị hoặc ẩn menu dựa trên trạng thái
      if (isMenuOpen) {
        dropdownMenu.classList.add("show");
      } else {
        // Chỉ ẩn nếu không đang hover
        if (!isHovering) {
          dropdownMenu.classList.remove("show");
        }
      }
    });

    // Đóng dropdown khi click ra ngoài vùng dropdown
    document.addEventListener("click", function (e) {
      // Kiểm tra nếu click không nằm trong dropdown container
      if (!dropdownContainer.contains(e.target)) {
        dropdownMenu.classList.remove("show");
        isMenuOpen = false; // Reset trạng thái
      }
    });

    // Đóng dropdown khi nhấn phím ESC
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        dropdownMenu.classList.remove("show");
        isMenuOpen = false; // Reset trạng thái
      }
    });

    // Reset dropdown khi thay đổi kích thước màn hình
    window.addEventListener("resize", function () {
      dropdownMenu.classList.remove("show");
      isHovering = false; // Reset trạng thái hover
      isMenuOpen = false; // Reset trạng thái menu
    });
  });

  // Xử lý dropdown positioning trên mobile
  document.addEventListener("DOMContentLoaded", function () {
    // Thêm xử lý vị trí dropdown cho mobile (màn hình < 768px)
    if (window.innerWidth < 768) {
      // Lặp qua tất cả các dropdown toggle buttons
      document.querySelectorAll(".dropdown-toggle").forEach((toggle) => {
        toggle.addEventListener("click", function () {
          // Tìm menu dropdown tương ứng
          const menu = this.nextElementSibling;
          if (menu && menu.classList.contains("show")) {
            // Tính toán vị trí dựa trên button toggle
            const rect = this.getBoundingClientRect();
            const topPosition = rect.bottom + window.scrollY;

            // Đặt vị trí cố định cho dropdown trên mobile
            menu.style.top = topPosition + "px";
          }
        });
      });
    }
  });
