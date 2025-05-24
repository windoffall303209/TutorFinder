// File xử lý các chức năng trên trang danh sách đăng ký gia sư

// ===== PHẦN 1: XỬ LÝ PHẢN HỒI ĐĂNG KÝ (CHẤP NHẬN/TỪ CHỐI) =====
document.addEventListener('DOMContentLoaded', function() {
    // Xử lý click vào nút mở modal (Chấp nhận hoặc Từ chối)
    const responseModalTriggers = document.querySelectorAll('.open-response-modal');
    
    if (responseModalTriggers.length > 0) {
      responseModalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
          console.log('Modal trigger clicked');
          
          // Lấy thông tin từ data attributes
          const registrationId = this.dataset.registrationId;
          const action = this.dataset.action;
          const tutorName = this.dataset.tutorName;
          
          console.log('Registration ID:', registrationId);
          console.log('Action:', action);
          console.log('Tutor Name:', tutorName);
          
          // Cập nhật nội dung modal
          const modalTitle = document.getElementById('responseModalLabel');
          const actionButton = document.getElementById('confirm-response-btn');
          
          if (modalTitle && actionButton) {
            if (action === 'accept') {
              // Thiết lập modal cho chấp nhận
              modalTitle.textContent = `Chấp nhận gia sư ${tutorName}`;
              actionButton.textContent = 'Chấp nhận';
              actionButton.className = 'btn btn-success';
            } else {
              // Thiết lập modal cho từ chối
              modalTitle.textContent = `Từ chối gia sư ${tutorName}`;
              actionButton.textContent = 'Từ chối';
              actionButton.className = 'btn btn-danger';
            }
            
            // Lưu thông tin vào button để sử dụng sau
            actionButton.dataset.registrationId = registrationId;
            actionButton.dataset.action = action;
          }
        });
      });
    }
    
    // Xử lý click vào nút xác nhận trong modal
    const confirmResponseBtn = document.getElementById('confirm-response-btn');
    if (confirmResponseBtn) {
      confirmResponseBtn.addEventListener('click', function() {
        console.log('Confirm button clicked');
        
        // Lấy thông tin từ button
        const registrationId = this.dataset.registrationId;
        const action = this.dataset.action;
        const status = action === 'accept' ? 'accepted' : 'rejected';
        
        console.log('Confirming Registration ID:', registrationId);
        console.log('Status to set:', status);
        
        // Lấy ghi chú từ form
        const notesElement = document.getElementById('registration-notes');
        const notes = notesElement ? notesElement.value : '';
        
        // Gửi request đến server để xử lý phản hồi
        fetch('/classes/registrations/respond', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            registrationId: registrationId,
            status: status,
            notes: notes
          }),
        })
        .then(response => {
          console.log('Response status:', response.status);
          return response.json();
        })
        .then(data => {
          console.log('Response data:', data);
          if (data.success) {
            alert(data.message);
            
            // Đóng modal
            const modal = document.getElementById('responseModal');
            if (modal) {
              try {
                const bootstrapModal = bootstrap.Modal.getInstance(modal);
                if (bootstrapModal) {
                  bootstrapModal.hide();
                } else {
                  // Fallback nếu không có Bootstrap Modal API
                  modal.style.display = 'none';
                  document.body.classList.remove('modal-open');
                  const backdrop = document.querySelector('.modal-backdrop');
                  if (backdrop) backdrop.remove();
                }
              } catch (err) {
                console.error('Lỗi khi đóng modal:', err);
                // Fallback cơ bản
                modal.style.display = 'none';
              }
            }
            
            // Reload trang sau 1.5s để cập nhật trạng thái
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          } else {
            alert(data.message || 'Đã xảy ra lỗi khi xử lý đăng ký.');
          }
        })
        .catch(error => {
          console.error('Lỗi khi xử lý đăng ký:', error);
          alert('Đã xảy ra lỗi khi xử lý đăng ký.');
        });
      });
    }
});

// ===== PHẦN 2: XỬ LÝ LỌC VÀ TÌM KIẾM ĐĂNG KÝ =====
document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử điều khiển lọc
    const statusFilter = document.getElementById('status-filter');
    const genderFilter = document.getElementById('gender-filter');
    const searchInput = document.getElementById('search-input');
    const registrationCards = document.querySelectorAll('.registration-card');
    
    // Gắn sự kiện cho bộ lọc trạng thái
    if (statusFilter) {
      statusFilter.addEventListener('change', filterRegistrations);
    }
    
    // Gắn sự kiện cho bộ lọc giới tính
    if (genderFilter) {
      genderFilter.addEventListener('change', filterRegistrations);
    }
    
    // Gắn sự kiện cho ô tìm kiếm
    if (searchInput) {
      searchInput.addEventListener('input', filterRegistrations);
    }
    
    // Hàm lọc các card đăng ký theo nhiều tiêu chí
    function filterRegistrations() {
      const statusValue = statusFilter ? statusFilter.value : 'all';
      const genderValue = genderFilter ? genderFilter.value : 'all';
      const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
      
      // Duyệt qua từng card để kiểm tra điều kiện
      registrationCards.forEach(card => {
        const status = card.dataset.status;
        const gender = card.dataset.gender;
        const content = card.textContent.toLowerCase();
        
        // Kiểm tra điều kiện lọc
        const statusMatch = statusValue === 'all' || status === statusValue;
        const genderMatch = genderValue === 'all' || gender === genderValue;
        const searchMatch = searchValue === '' || content.includes(searchValue);
        
        // Hiển thị hoặc ẩn card dựa trên kết quả
        if (statusMatch && genderMatch && searchMatch) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
      
      // Hiển thị thông báo "không tìm thấy kết quả" nếu cần
      showNoResultsMessage();
    }
    
    // Hàm hiển thị thông báo không có kết quả
    function showNoResultsMessage() {
      const visibleCards = [...registrationCards].filter(card => card.style.display !== 'none');
      const registrationList = document.getElementById('registration-list');
      
      if (visibleCards.length === 0 && registrationList) {
        // Kiểm tra xem thông báo đã tồn tại chưa
        let noResults = document.getElementById('no-results-message');
        
        if (!noResults) {
          // Tạo thông báo mới
          noResults = document.createElement('div');
          noResults.id = 'no-results-message';
          noResults.className = 'no-results-message text-center py-4';
          noResults.innerHTML = `
            <i class="fas fa-search fa-2x text-muted mb-3"></i>
            <h5>Không tìm thấy kết quả</h5>
            <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          `;
          
          registrationList.appendChild(noResults);
        }
      } else {
        // Xóa thông báo nếu có kết quả hiển thị
        const noResults = document.getElementById('no-results-message');
        if (noResults) {
          noResults.remove();
        }
      }
    }
});

// ===== PHẦN 3: XỬ LÝ HỦY ĐĂNG KÝ =====
document.addEventListener('DOMContentLoaded', function() {
    // Lắng nghe sự kiện click trên các nút hủy đăng ký
    const cancelButtons = document.querySelectorAll('.cancel-registration');
    
    cancelButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Lấy ID đăng ký từ data attribute
        const registrationId = this.dataset.id;
        
        // Xác nhận trước khi hủy
        if (confirm('Bạn có chắc chắn muốn hủy đăng ký nhận lớp này?')) {
          // Gửi request hủy đăng ký
          fetch(`/classes/registrations/${registrationId}/cancel`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(response => response.json())
          .then(data => {
            if (data.success) {
              alert(data.message);
              // Reload trang để cập nhật danh sách
              location.reload();
            } else {
              alert(data.message || 'Có lỗi xảy ra khi hủy đăng ký.');
            }
          })
          .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi hủy đăng ký.');
          });
        }
      });
    });
});