document.addEventListener("DOMContentLoaded", function () {
  const tutorId = document.getElementById("tutorId").value;
  const reviewForm = document.getElementById("reviewForm");
  const reviewList = document.getElementById("reviewList");
  const ratingInput = document.getElementById("rating");
  const commentInput = document.getElementById("comment");
  const submitBtn = document.getElementById("submitReview");
  const updateBtn = document.getElementById("updateReview");
  const cancelBtn = document.getElementById("cancelUpdate");
  let currentReviewId = null;

  // Khởi tạo rating stars
  initRatingStars();

  // Tải đánh giá của gia sư
  loadTutorReviews();

  // Kiểm tra xem user hiện tại đã đánh giá chưa
  checkUserReview();

  // Xử lý submit form đánh giá
  reviewForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const rating = ratingInput.value;
    const comment = commentInput.value;

    if (rating < 1 || rating > 5) {
      showAlert("Vui lòng chọn số sao đánh giá", "danger");
      return;
    }

    if (currentReviewId) {
      // Cập nhật đánh giá
      updateReview(currentReviewId, rating, comment);
    } else {
      // Tạo đánh giá mới
      createReview(rating, comment);
    }
  });

  // Xử lý nút hủy cập nhật
  if (cancelBtn) {
    cancelBtn.addEventListener("click", function () {
      resetForm();
    });
  }

  // Hàm tải đánh giá của gia sư
  function loadTutorReviews() {
    fetch(`/reviews/tutor/${tutorId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          displayReviews(data.reviews);
        } else {
          showAlert("Không thể tải đánh giá", "danger");
        }
      })
      .catch((error) => {
        console.error("Error loading reviews:", error);
        showAlert("Đã xảy ra lỗi khi tải đánh giá", "danger");
      });
  }

  // Hàm kiểm tra xem user hiện tại đã đánh giá chưa
  function checkUserReview() {
    const userId = document.getElementById("userId")?.value;
    if (!userId) return; // Không đăng nhập

    fetch(`/reviews/check/${tutorId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success && data.hasReviewed) {
          // User đã đánh giá, hiển thị nút cập nhật
          prepareUpdateForm(data.review);
        }
      })
      .catch((error) => {
        console.error("Error checking user review:", error);
      });
  }

  // Hàm tạo đánh giá mới
  function createReview(rating, comment) {
    fetch(`/reviews/create/${tutorId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, comment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showAlert("Đánh giá thành công", "success");
          resetForm();
          loadTutorReviews();
          checkUserReview();
        } else {
          showAlert(data.message || "Không thể tạo đánh giá", "danger");
        }
      })
      .catch((error) => {
        console.error("Error creating review:", error);
        showAlert("Đã xảy ra lỗi khi tạo đánh giá", "danger");
      });
  }

  // Hàm cập nhật đánh giá
  function updateReview(reviewId, rating, comment) {
    fetch(`/reviews/update/${reviewId}/${tutorId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rating, comment }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showAlert("Cập nhật đánh giá thành công", "success");
          resetForm();
          loadTutorReviews();
        } else {
          showAlert(data.message || "Không thể cập nhật đánh giá", "danger");
        }
      })
      .catch((error) => {
        console.error("Error updating review:", error);
        showAlert("Đã xảy ra lỗi khi cập nhật đánh giá", "danger");
      });
  }

  // Hàm xóa đánh giá
  function deleteReview(reviewId) {
    if (!confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) {
      return;
    }

    fetch(`/reviews/delete/${reviewId}/${tutorId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          showAlert("Xóa đánh giá thành công", "success");
          loadTutorReviews();
          resetForm();
        } else {
          showAlert(data.message || "Không thể xóa đánh giá", "danger");
        }
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
        showAlert("Đã xảy ra lỗi khi xóa đánh giá", "danger");
      });
  }

  // Hiển thị danh sách đánh giá
  function displayReviews(reviews) {
    if (!reviewList) return;

    reviewList.innerHTML = "";

    if (reviews.length === 0) {
      reviewList.innerHTML =
        '<div class="text-center p-3">Chưa có đánh giá nào</div>';
      return;
    }

    const currentUserId = document.getElementById("userId")?.value;

    reviews.forEach((review) => {
      const reviewElement = document.createElement("div");
      reviewElement.className = "card mb-3";

      // Tạo HTML cho đánh giá
      let reviewHtml = `
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
              <h5 class="card-title mb-0">${
                review.display_name || review.username
              }</h5>
              <div class="rating-stars">`;

      // Hiển thị số sao
      for (let i = 1; i <= 5; i++) {
        if (i <= review.rating) {
          reviewHtml += '<i class="fas fa-star text-warning"></i>';
        } else {
          reviewHtml += '<i class="far fa-star text-warning"></i>';
        }
      }

      reviewHtml += `
              </div>
            </div>
            <div class="text-muted small">
              ${new Date(review.created_at).toLocaleDateString("vi-VN")}
            </div>
          </div>
          <p class="card-text">${review.comment || ""}</p>`;

      // Nếu đây là đánh giá của người dùng hiện tại, hiển thị nút sửa/xóa
      if (currentUserId && parseInt(currentUserId) === review.user_id) {
        reviewHtml += `
          <div class="text-end">
            <button class="btn btn-sm btn-outline-primary edit-review" data-id="${
              review.id
            }" data-rating="${review.rating}" data-comment="${
          review.comment || ""
        }">
              <i class="fas fa-edit"></i> Sửa
            </button>
            <button class="btn btn-sm btn-outline-danger delete-review" data-id="${
              review.id
            }">
              <i class="fas fa-trash"></i> Xóa
            </button>
          </div>`;
      }

      reviewHtml += `
        </div>`;

      reviewElement.innerHTML = reviewHtml;
      reviewList.appendChild(reviewElement);
    });

    // Thêm event listener cho các nút sửa/xóa
    document.querySelectorAll(".edit-review").forEach((btn) => {
      btn.addEventListener("click", function () {
        const reviewId = this.getAttribute("data-id");
        const rating = this.getAttribute("data-rating");
        const comment = this.getAttribute("data-comment");

        prepareUpdateForm({
          id: reviewId,
          rating: rating,
          comment: comment,
        });
      });
    });

    document.querySelectorAll(".delete-review").forEach((btn) => {
      btn.addEventListener("click", function () {
        const reviewId = this.getAttribute("data-id");
        deleteReview(reviewId);
      });
    });
  }

  // Chuẩn bị form để cập nhật đánh giá
  function prepareUpdateForm(review) {
    if (!reviewForm) return;

    currentReviewId = review.id;
    ratingInput.value = review.rating;
    commentInput.value = review.comment || "";

    // Cập nhật hiển thị sao
    updateRatingStars(review.rating);

    // Hiển thị nút cập nhật và ẩn nút gửi
    if (submitBtn) submitBtn.style.display = "none";
    if (updateBtn) updateBtn.style.display = "inline-block";
    if (cancelBtn) cancelBtn.style.display = "inline-block";
  }

  // Reset form
  function resetForm() {
    if (!reviewForm) return;

    currentReviewId = null;
    reviewForm.reset();
    updateRatingStars(0);

    // Hiển thị nút gửi và ẩn nút cập nhật
    if (submitBtn) submitBtn.style.display = "inline-block";
    if (updateBtn) updateBtn.style.display = "none";
    if (cancelBtn) cancelBtn.style.display = "none";
  }

  // Khởi tạo star rating
  function initRatingStars() {
    const starContainer = document.querySelector(".rating-container");
    if (!starContainer) return;

    const stars = starContainer.querySelectorAll(".rating-star");

    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        const rating = index + 1;
        ratingInput.value = rating;
        updateRatingStars(rating);
      });

      star.addEventListener("mouseover", () => {
        const rating = index + 1;
        highlightStars(rating);
      });

      star.addEventListener("mouseout", () => {
        const currentRating = ratingInput.value || 0;
        highlightStars(currentRating);
      });
    });
  }

  // Cập nhật hiển thị sao đánh giá
  function updateRatingStars(rating) {
    ratingInput.value = rating;
    highlightStars(rating);
  }

  // Highlight sao đánh giá
  function highlightStars(rating) {
    const stars = document.querySelectorAll(".rating-star");

    stars.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("active");
        star.querySelector("i").className = "fas fa-star";
      } else {
        star.classList.remove("active");
        star.querySelector("i").className = "far fa-star";
      }
    });
  }

  // Hiển thị thông báo
  function showAlert(message, type) {
    const alertPlaceholder = document.getElementById("alertPlaceholder");
    if (!alertPlaceholder) return;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

    alertPlaceholder.appendChild(wrapper);

    // Tự động xóa thông báo sau 3 giây
    setTimeout(() => {
      const alert = wrapper.querySelector(".alert");
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 3000);
  }
});
