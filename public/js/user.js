// Validation cho số điện thoại - chỉ cho phép nhập số
document.getElementById("phone").addEventListener("input", function (e) {
  // Loại bỏ tất cả ký tự không phải số
  this.value = this.value.replace(/[^0-9]/g, "");

  // Giới hạn 10 số
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
  }
});

// Validation cho năm sinh
document.getElementById("birth_year").addEventListener("input", function (e) {
  const year = parseInt(this.value);
  if (year < 1950 || year > 2025) {
    this.setCustomValidity("Năm sinh phải từ 1950 đến 2025");
  } else {
    this.setCustomValidity("");
  }
});

// Kích hoạt validation Bootstrap
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("tutorForm");

  // Kiểm tra xem có ít nhất một môn học và một lớp học được chọn
  function validateCheckboxGroups() {
    const subjectChecked =
      document.querySelectorAll('input[name="subjects[]"]:checked').length > 0;
    const gradeChecked =
      document.querySelectorAll('input[name="grades[]"]:checked').length > 0;

    if (!subjectChecked) {
      document.querySelectorAll('input[name="subjects[]"]').forEach((cb) => {
        cb.classList.add("is-invalid");
      });
    } else {
      document.querySelectorAll('input[name="subjects[]"]').forEach((cb) => {
        cb.classList.remove("is-invalid");
      });
    }

    if (!gradeChecked) {
      document.querySelectorAll('input[name="grades[]"]').forEach((cb) => {
        cb.classList.add("is-invalid");
      });
    } else {
      document.querySelectorAll('input[name="grades[]"]').forEach((cb) => {
        cb.classList.remove("is-invalid");
      });
    }

    return subjectChecked && gradeChecked;
  }

  form.addEventListener("submit", function (event) {
    const phone = document.getElementById("phone").value;
    const birthYear = document.getElementById("birth_year").value;

    // Kiểm tra số điện thoại
    if (!/^[0-9]{10}$/.test(phone)) {
      event.preventDefault();
      alert("Số điện thoại phải gồm đúng 10 chữ số");
      return false;
    }

    // Kiểm tra năm sinh
    const year = parseInt(birthYear);
    if (year < 1950 || year > 2025) {
      event.preventDefault();
      alert("Năm sinh phải từ 1950 đến 2025");
      return false;
    }

    const formValid = form.checkValidity();
    const checkboxesValid = validateCheckboxGroups();

    if (!formValid || !checkboxesValid) {
      event.preventDefault();
      event.stopPropagation();
    }

    form.classList.add("was-validated");
  });
});
