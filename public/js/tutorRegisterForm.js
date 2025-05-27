// Validation cho số điện thoại - chỉ cho phép nhập số
document.getElementById('phone').addEventListener('input', function(e) {
  // Loại bỏ tất cả ký tự không phải số
  this.value = this.value.replace(/[^0-9]/g, '');
  
  // Giới hạn 10 số
  if (this.value.length > 10) {
    this.value = this.value.slice(0, 10);
  }
});

// Validation cho họ và tên
document.getElementById('fullname').addEventListener('input', function(e) {
  // Chỉ cho phép chữ cái, dấu cách và dấu tiếng Việt
  this.value = this.value.replace(/[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]/g, '');
  
  // Kiểm tra độ dài
  if (this.value.length < 5) {
    this.setCustomValidity('Họ và tên phải có ít nhất 5 ký tự');
  } else {
    this.setCustomValidity('');
  }
});

// Validation cho năm sinh
document.getElementById('birth_year').addEventListener('input', function(e) {
  const year = parseInt(this.value);
  if (year < 1950 || year > 2025) {
    this.setCustomValidity('Năm sinh phải từ 1950 đến 2025');
  } else {
    this.setCustomValidity('');
  }
});

// Form validation
document.getElementById('tutorForm').addEventListener('submit', function(e) {
  const phone = document.getElementById('phone').value;
  const birthYear = document.getElementById('birth_year').value;
  const fullname = document.getElementById('fullname').value;
  
  // Kiểm tra họ và tên
  if (fullname.length < 5) {
    e.preventDefault();
    alert('Họ và tên phải có ít nhất 5 ký tự');
    return false;
  }
  
  if (!/^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]{5,}$/.test(fullname)) {
    e.preventDefault();
    alert('Họ và tên không được chứa ký tự đặc biệt');
    return false;
  }
  
  // Kiểm tra số điện thoại
  if (!/^[0-9]{10}$/.test(phone)) {
    e.preventDefault();
    alert('Số điện thoại phải gồm đúng 10 chữ số');
    return false;
  }
  
  // Kiểm tra năm sinh
  const year = parseInt(birthYear);
  if (year < 1950 || year > 2025) {
    e.preventDefault();
    alert('Năm sinh phải từ 1950 đến 2025');
    return false;
  }
});
