console.log('chat.js loaded');
function initializeChat(userId, receiverId, receiverDisplayName, currentReceiverId) { // Thêm currentReceiverId làm tham số
    console.log('Initializing chat with userId:', userId, 'receiverId:', receiverId);
    const socket = io();

    // Tham gia phòng chat
    socket.emit('joinChat', { senderId: userId, receiverId: receiverId });
    console.log('Joined chat room:', `chat-${userId}-${receiverId}`);

    const sendButton = document.getElementById('send-button');
    const messageInput = document.getElementById('message-input');

    if (!sendButton || !messageInput) {
        console.error('Send button or message input not found');
        return;
    }

    // Xóa sự kiện cũ nếu có
    sendButton.removeEventListener('click', sendMessage);
    messageInput.removeEventListener('keydown', sendMessageOnEnter);

    // Hàm gửi tin nhắn
    function sendMessage() {
        const message = messageInput.value;
        console.log('Send triggered');
        if (message.trim()) {
            console.log('Sending message:', message);
            socket.emit('sendMessage', { senderId: userId, receiverId: receiverId, message });
            messageInput.value = '';
        }
    }

    // Hàm gửi tin nhắn khi nhấn Enter
    function sendMessageOnEnter(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    }

    // Sự kiện click nút "Gửi"
    sendButton.addEventListener('click', sendMessage);

    // Sự kiện nhấn phím Enter
    messageInput.addEventListener('keydown', sendMessageOnEnter);

    // Nhận tin nhắn realtime
    socket.on('receiveMessage', (data) => {
        console.log('Received message:', data);
        if (data.senderId == receiverId || data.receiverId == receiverId) {
            const chatBox = document.getElementById('chat-box');
            const newMessage = document.createElement('p');
            newMessage.className = `mb-2 ${data.senderId === userId ? 'text-end' : 'text-start'}`;
            newMessage.innerHTML = `
                <span class="chat-message bg-primary text-white p-2 rounded d-inline-block" style="max-width: 45%; word-break: break-word;">
                   ${data.message}
                </span>
            `;
            chatBox.appendChild(newMessage);
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });

    // Cập nhật danh sách chat realtime
    socket.on('updateChatList', (chatUsers) => {
        console.log('Updating chat list:', chatUsers);
        const userList = document.querySelector('.col-md-4 .list-group');
        if (userList) {
            userList.innerHTML = ''; // Xóa nội dung cũ
            if (chatUsers && chatUsers.length > 0) { // Kiểm tra chatUsers có dữ liệu không
                chatUsers.forEach(user => {
                    const li = document.createElement('li');
                    li.className = `list-group-item d-flex justify-content-between align-items-center ${user.id === currentReceiverId ? 'active' : ''}`;
                    li.innerHTML = `
                        <a href="#" class="text-decoration-none ${user.id === currentReceiverId ? 'text-white' : 'text-dark'}" onclick="selectUser('${user.id}', '${user.display_name}', event)">
                            ${user.display_name}
                        </a>
                        <span class="badge bg-primary rounded-pill">Chat</span>
                    `;
                    userList.appendChild(li);
                });
            } else {
                userList.innerHTML = '<li class="list-group-item">Chưa có cuộc trò chuyện nào.</li>'; // Hiển thị thông báo nếu không có dữ liệu
            }
        }
    });

    // Cuộn xuống tin nhắn cuối cùng
    const chatBox = document.getElementById('chat-box');
    if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}