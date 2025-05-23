//JavaScript for Schedule Management

document.addEventListener("DOMContentLoaded", () => {
  // Xử lý sự kiện đóng modal để tránh backdrop bị stuck

  function cleanupModal(modalId) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', function() {
        // Đảm bảo xóa hết backdrop và reset body class
        document.body.classList.remove('modal-open');
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        
        // Reset form nếu có
        const form = modalElement.querySelector('form');
        if (form) {
          form.reset();
        }
        
        // Reset textarea nếu có
        const textareas = modalElement.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          textarea.value = '';
        });
      });
      
      // Xử lý khi click vào backdrop hoặc nhấn ESC
      modalElement.addEventListener('hide.bs.modal', function() {
        // Reset form/textarea ngay khi bắt đầu đóng
        const textareas = modalElement.querySelectorAll('textarea');
        textareas.forEach(textarea => {
          textarea.value = '';
        });
      });
    }
  }
  
  // Khởi tạo cleanup cho các modal
  cleanupModal('statusModal');
  cleanupModal('scheduleDetailModal');
  
  // Xử lý nút Hủy trong modal để đảm bảo đóng modal đúng cách
  const cancelButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
  cancelButtons.forEach(button => {
    button.addEventListener('click', function() {
      const modal = this.closest('.modal');
      if (modal) {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
        // Force cleanup nếu cần
        setTimeout(() => {
          document.body.classList.remove('modal-open');
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => backdrop.remove());
        }, 300);
      }
    });
  });
  // Khởi tạo flatpickr cho chọn ngày
  if (typeof flatpickr !== 'undefined') {
    const datePicker = document.getElementById('session-date');
    if (datePicker) {
      flatpickr(datePicker, {
        dateFormat: "Y-m-d",
        minDate: "today",
        locale: {
          firstDayOfWeek: 1,
          weekdays: {
            shorthand: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            longhand: ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'],
          },
          months: {
            shorthand: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
            longhand: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
          },
        }
      });
    }

    // Khởi tạo flatpickr cho chọn giờ
    const timeInputs = document.querySelectorAll('.time-picker');
    if (timeInputs.length > 0) {
      timeInputs.forEach(input => {
        flatpickr(input, {
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          time_24hr: true,
          minuteIncrement: 15
        });
      });
    }
  }

  // Xử lý form tạo lịch học mới
  const scheduleForm = document.getElementById('schedule-form');
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Lấy dữ liệu từ form
      const formData = new FormData(this);
      const scheduleData = {
        classId: formData.get('classId'),
        tutorId: formData.get('tutorId'),
        sessionDate: formData.get('sessionDate'),
        startTime: formData.get('startTime'),
        endTime: formData.get('endTime'),
        location: formData.get('location'),
        meetingUrl: formData.get('meetingUrl'),
        notes: formData.get('notes')
      };
      
      createSchedule(scheduleData);
    });
  }

  // Gửi request tạo lịch học mới

  function createSchedule(scheduleData) {
    fetch('/schedules/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scheduleData),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification('success', data.message);
        
        // Reset form
        if (scheduleForm) {
          scheduleForm.reset();
        }
        
        // Cập nhật danh sách lịch học
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification('error', data.message);
      }
    })
    .catch(error => {
      console.error('Lỗi khi tạo lịch học:', error);
      showNotification('error', 'Đã xảy ra lỗi khi tạo lịch học.');
    });
  }

  // Xử lý cập nhật trạng thái lịch học

  const confirmStatusBtn = document.getElementById('confirm-status-btn');
  if (confirmStatusBtn) {
    confirmStatusBtn.addEventListener('click', function() {
      const scheduleId = this.dataset.scheduleId;
      const status = this.dataset.status;
      
      // Lấy ghi chú từ form modal
      const notesElement = document.getElementById('schedule-status-notes');
      const notes = notesElement ? notesElement.value : '';
      
      updateScheduleStatus(scheduleId, status, notes);
    });
  }

  // Gửi request cập nhật trạng thái lịch học
   
  function updateScheduleStatus(scheduleId, status, notes) {
    fetch('/schedules/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        scheduleId: scheduleId,
        status: status,
        notes: notes
      }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification('success', data.message);
        
        // Đóng modal nếu đang mở
        const modal = document.getElementById('statusModal');
        if (modal) {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) {
            modalInstance.hide();
          }
          // Đảm bảo xóa backdrop và tất cả side effects
          setTimeout(() => {
            document.body.classList.remove('modal-open');
            const backdrops = document.querySelectorAll('.modal-backdrop');
            backdrops.forEach(backdrop => backdrop.remove());
          }, 300);
        }
        
        // Cập nhật giao diện
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showNotification('error', data.message);
      }
    })
    .catch(error => {
      console.error('Lỗi khi cập nhật trạng thái:', error);
      showNotification('error', 'Đã xảy ra lỗi khi cập nhật trạng thái.');
    });
  }

  // Hiển thị modal cập nhật trạng thái

  const statusModalTriggers = document.querySelectorAll('.open-status-modal');
  if (statusModalTriggers.length > 0) {
    statusModalTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        
        const scheduleId = this.dataset.scheduleId;
        const status = this.dataset.status;
        const title = this.dataset.title;
        
        // Cập nhật modal
        const modalTitle = document.getElementById('statusModalLabel');
        const actionButton = document.getElementById('confirm-status-btn');
        
        if (modalTitle && actionButton) {
          // Đặt tiêu đề modal
          let statusText = '';
          switch (status) {
            case 'completed':
              statusText = 'Hoàn thành';
              break;
            case 'cancelled':
              statusText = 'Hủy bỏ';
              break;
            case 'rescheduled':
              statusText = 'Dời lịch';
              break;
            default:
              statusText = 'Cập nhật';
          }
          
          modalTitle.textContent = `${statusText} buổi học: ${title}`;
          
          // Thiết lập button
          actionButton.textContent = statusText;
          actionButton.className = `btn update-schedule-status`;
          
          switch (status) {
            case 'completed':
              actionButton.classList.add('btn-success');
              break;
            case 'cancelled':
              actionButton.classList.add('btn-danger');
              break;
            case 'rescheduled':
              actionButton.classList.add('btn-warning');
              break;
            default:
              actionButton.classList.add('btn-primary');
          }
          
          actionButton.dataset.scheduleId = scheduleId;
          actionButton.dataset.status = status;
        }
        
        // Hiển thị modal - sử dụng getInstance hoặc tạo mới nếu chưa có
        const modalElement = document.getElementById('statusModal');
        let statusModal = bootstrap.Modal.getInstance(modalElement);
        if (!statusModal) {
          statusModal = new bootstrap.Modal(modalElement);
        }
        statusModal.show();
      });
    });
  }

  // Force close tất cả modal nếu có lỗi

  function forceCloseAllModals() {
    // Tìm tất cả modal đang mở
    const openModals = document.querySelectorAll('.modal.show');
    openModals.forEach(modal => {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      if (modalInstance) {
        modalInstance.hide();
      }
    });
    
    // Force cleanup
    setTimeout(() => {
      document.body.classList.remove('modal-open');
      const backdrops = document.querySelectorAll('.modal-backdrop');
      backdrops.forEach(backdrop => backdrop.remove());
      
      // Reset body style nếu cần
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }, 500);
  }
  
  // Thêm global function để có thể gọi từ console nếu cần debug
  window.forceCloseAllModals = forceCloseAllModals;

  // Hiển thị thông báo

  function showNotification(type, message) {
    // Kiểm tra nếu có thư viện Toastr
    if (typeof toastr !== 'undefined') {
      toastr[type](message);
      return;
    }
    
    // Fallback nếu không có Toastr
    alert(message);
  }

  // Hiển thị chi tiết lịch học trong modal

  const scheduleDetailTriggers = document.querySelectorAll('.show-schedule-details');
  if (scheduleDetailTriggers.length > 0) {
    scheduleDetailTriggers.forEach(trigger => {
      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Lấy thông tin từ data attributes
        const details = {
          id: this.dataset.scheduleId,
          className: this.dataset.className,
          subjectName: this.dataset.subject,
          gradeName: this.dataset.grade,
          tutorName: this.dataset.tutorName,
          date: this.dataset.date,
          startTime: this.dataset.startTime,
          endTime: this.dataset.endTime,
          location: this.dataset.location || 'Không có',
          meetingUrl: this.dataset.meetingUrl || 'Không có',
          status: this.dataset.status,
          notes: this.dataset.notes || 'Không có ghi chú',
        };
        
        // Cập nhật nội dung modal
        document.getElementById('detail-title').textContent = `${details.subjectName} - ${details.gradeName}`;
        document.getElementById('detail-date').textContent = details.date;
        document.getElementById('detail-time').textContent = `${details.startTime} - ${details.endTime}`;
        document.getElementById('detail-tutor').textContent = details.tutorName || 'Chưa có gia sư';
        document.getElementById('detail-location').textContent = details.location;
        
        // Cập nhật meeting URL nếu có
        const meetingElement = document.getElementById('detail-meeting');
        if (meetingElement) {
          if (details.meetingUrl && details.meetingUrl !== 'Không có') {
            meetingElement.innerHTML = `<a href="${details.meetingUrl}" target="_blank">${details.meetingUrl}</a>`;
          } else {
            meetingElement.textContent = 'Không có';
          }
        }
        
        // Cập nhật trạng thái
        const statusElement = document.getElementById('detail-status');
        if (statusElement) {
          statusElement.className = 'badge';
          switch (details.status) {
            case 'scheduled':
              statusElement.classList.add('bg-primary');
              statusElement.textContent = 'Đã lên lịch';
              break;
            case 'completed':
              statusElement.classList.add('bg-success');
              statusElement.textContent = 'Đã hoàn thành';
              break;
            case 'cancelled':
              statusElement.classList.add('bg-danger');
              statusElement.textContent = 'Đã hủy';
              break;
            case 'rescheduled':
              statusElement.classList.add('bg-warning');
              statusElement.textContent = 'Đã dời lịch';
              break;
          }
        }
        
        // Cập nhật ghi chú
        document.getElementById('detail-notes').textContent = details.notes;
        
        // Hiển thị modal - sử dụng getInstance hoặc tạo mới nếu chưa có
        const detailModalElement = document.getElementById('scheduleDetailModal');
        let detailModal = bootstrap.Modal.getInstance(detailModalElement);
        if (!detailModal) {
          detailModal = new bootstrap.Modal(detailModalElement);
        }
        detailModal.show();
      });
    });
  }
}); 
document.addEventListener('DOMContentLoaded', function() {
  // Xử lý hiển thị modal chi tiết lịch học
  const scheduleDetailModal = document.getElementById('scheduleDetailModal');
  
  if (scheduleDetailModal) {
    scheduleDetailModal.addEventListener('show.bs.modal', function(event) {
      const button = event.relatedTarget;
      
      // Lấy dữ liệu từ button
      const subject = button.getAttribute('data-subject');
      const grade = button.getAttribute('data-grade');
      const tutorName = button.getAttribute('data-tutor-name');
      const parentName = button.getAttribute('data-parent-name');
      const date = button.getAttribute('data-date');
      const startTime = button.getAttribute('data-start-time');
      const endTime = button.getAttribute('data-end-time');
      const location = button.getAttribute('data-location');
      const meetingUrl = button.getAttribute('data-meeting-url');
      const status = button.getAttribute('data-status');
      const notes = button.getAttribute('data-notes');
      
      // Cập nhật nội dung modal
      document.getElementById('detail-title').textContent = `${subject} - ${grade}`;
      
      const statusBadge = document.getElementById('detail-status');
      statusBadge.textContent = status === 'scheduled' ? 'Đã lên lịch' : 
                                status === 'completed' ? 'Đã hoàn thành' : 
                                status === 'cancelled' ? 'Đã hủy' : 'Đã dời lịch';
                                
      statusBadge.className = `badge ${status === 'scheduled' ? 'bg-primary' : 
                                       status === 'completed' ? 'bg-success' : 
                                       status === 'cancelled' ? 'bg-danger' : 'bg-warning'}`;
      
      document.getElementById('detail-date').textContent = date;
      document.getElementById('detail-time').textContent = `${startTime} - ${endTime}`;
      document.getElementById('detail-subject').textContent = `${subject} - ${grade}`;
      document.getElementById('detail-tutor').textContent = tutorName;
      document.getElementById('detail-parent').textContent = parentName || 'Không có thông tin';
      
      document.getElementById('detail-location').textContent = location || 'Không có thông tin';
      
      const detailMeeting = document.getElementById('detail-meeting');
      if (meetingUrl) {
        detailMeeting.innerHTML = `<a href="${meetingUrl}" target="_blank">${meetingUrl}</a>`;
      } else {
        detailMeeting.textContent = 'Không có thông tin';
      }
      
      document.getElementById('detail-notes').textContent = notes || 'Không có ghi chú';
    });
  }
});