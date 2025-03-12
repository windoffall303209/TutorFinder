// Để trống hoặc thêm logic phía client nếu cần
console.log("Client-side script loaded");
// Lắng nghe sự kiện cuộn trang
document.addEventListener("DOMContentLoaded", function () {
  const topBar = document.querySelector(".cus-top-bar");
  const navbar = document.querySelector(".navbar");
  const body = document.body;
  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        let currentScrollTop =
          window.pageYOffset || document.documentElement.scrollTop;

        if (currentScrollTop > 50) {
          // Cuộn xuống
          topBar.classList.add("hidden");
          navbar.classList.add("compact");
          body.classList.add("compact");
        } else {
          // Cuộn lên
          topBar.classList.remove("hidden");
          navbar.classList.remove("compact");
          body.classList.remove("compact");
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
        ticking = false;
      });

      ticking = true;
    }
  });

  // Đảm bảo các nút trong navbar vẫn hoạt động
  document.querySelectorAll(".navbar .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const href = link.getAttribute("href");
      window.location.href = href;
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  // Lấy các phần tử
  const tutorRegisterBtn = document.getElementById("tutorRegisterBtn");
  const classRegisterBtn = document.getElementById("classRegisterBtn");
  const tutorForm = document.getElementById("tutorForm");
  const classForm = document.getElementById("classForm");
  const closeButtons = document.querySelectorAll(".close-form-btn");

  // Hiển thị form đăng ký làm gia sư
  tutorRegisterBtn.addEventListener("click", () => {
    tutorForm.classList.remove("d-none"); // Hiển thị form
    classForm.classList.add("d-none"); // Ẩn form khác
  });

  // Hiển thị form đăng ký tìm gia sư
  classRegisterBtn.addEventListener("click", () => {
    classForm.classList.remove("d-none"); // Hiển thị form
    tutorForm.classList.add("d-none"); // Ẩn form khác
  });

  // Đóng form khi nhấp vào nút "X"
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const formId = button.getAttribute("data-form"); // Lấy ID form cần đóng
      const form = document.getElementById(formId);
      form.classList.add("d-none"); // Ẩn form
    });
  });
});

// Dữ liệu các thành phố và quận tại Việt Nam
const locations = {
  "Hà Nội": [
    "Hoàn Kiếm",
    "Ba Đình",
    "Tây Hồ",
    "Cầu Giấy",
    "Đống Đa",
    "Hai Bà Trưng",
  ],
  "TP.HCM": [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 7",
    "Bình Thạnh",
  ],
  "Đà Nẵng": ["Hải Châu", "Thanh Khê", "Cẩm Lệ", "Liên Chiểu", "Sơn Trà"],
  "Hải Phòng": ["Lê Chân", "Ngô Quyền", "Hồng Bàng", "Kiến An", "Dương Kinh"],
  "Cần Thơ": ["Ninh Kiều", "Cái Răng", "Phong Điền", "Bình Thủy", "Ô Môn"],
  // Thêm nhiều thành phố và quận khác nếu cần
};

// Hàm tạo danh sách thành phố
function populateProvinces() {
  const provinceSelect = document.getElementById("province");
  for (const province in locations) {
    const option = document.createElement("option");
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  }
}

// Hàm tạo danh sách quận theo thành phố đã chọn
function populateDistricts(province) {
  const districtSelect = document.getElementById("district");
  districtSelect.innerHTML = ""; // Xóa các quận cũ

  if (province && locations[province]) {
    const districts = locations[province];
    districts.forEach((district) => {
      const option = document.createElement("option");
      option.value = district;
      option.textContent = district;
      districtSelect.appendChild(option);
    });
  }
}

// Lắng nghe sự thay đổi của thành phố
document.getElementById("province").addEventListener("change", function () {
  const selectedProvince = this.value;
  populateDistricts(selectedProvince);
});

// Khởi tạo thành phố và quận mặc định
window.onload = function () {
  populateProvinces();
  populateDistricts(document.getElementById("province").value); // Khởi tạo quận cho thành phố mặc định
};
