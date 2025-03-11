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
