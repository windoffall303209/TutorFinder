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

// Validation cho số buổi/tuần
document.getElementById('sessions_per_week').addEventListener('input', function(e) {
  const value = parseInt(this.value);
  if (this.value !== '' && (isNaN(value) || value < 1 || value > 20)) {
    this.setCustomValidity('Số buổi/tuần phải từ 1 đến 20');
  } else {
    this.setCustomValidity('');
  }
});

// Validation cho học phí
document.getElementById('fee_per_session').addEventListener('input', function(e) {
  const value = parseInt(this.value);
  if (this.value !== '' && (isNaN(value) || value < 10000 || value > 10000000)) {
    this.setCustomValidity('Học phí phải từ 10,000 đến 10,000,000 VNĐ');
  } else {
    this.setCustomValidity('');
  }
});

// Form validation khi submit
document.querySelector('form[action="/classes/create"]').addEventListener('submit', function(e) {
  const phone = document.getElementById('phone').value;
  const sessionsPerWeek = document.getElementById('sessions_per_week').value;
  const feePerSession = document.getElementById('fee_per_session').value;
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
  
  // Kiểm tra số buổi/tuần
  const sessions = parseInt(sessionsPerWeek);
  if (isNaN(sessions) || sessions < 1 || sessions > 20) {
    e.preventDefault();
    alert('Số buổi/tuần phải từ 1 đến 20');
    return false;
  }
  
  // Kiểm tra học phí
  const fee = parseInt(feePerSession);
  if (isNaN(fee) || fee < 10000 || fee > 10000000) {
    e.preventDefault();
    alert('Học phí phải từ 10,000 đến 10,000,000 VNĐ');
    return false;
  }
});