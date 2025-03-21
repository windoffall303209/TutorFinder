function initializeChat(userId, receiverId, receiverUsername) {
    const socket = io();

    // Tham gia phòng chat
    socket.emit('joinChat', { senderId: userId, receiverId: receiverId });

    const sendMessage = () => {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('sendMessage', { senderId: userId, receiverId: receiverId, message });
            messageInput.value = ''; // Xóa nội dung ô nhập
        }
    };

    // Sự kiện khi click vào nút gửi
    document.getElementById('send-button').addEventListener('click', sendMessage);

    // Sự kiện khi nhấn phím Enter trong ô nhập tin nhắn
    document.getElementById('message-input').addEventListener('keydown', (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Ngăn form gửi mặc định
            sendMessage();
        }
    });

    // Nhận tin nhắn
    socket.on('receiveMessage', (data) => {
        const chatBox = document.getElementById('chat-box');
        const newMessage = document.createElement('p');
        newMessage.textContent = `${data.senderId === userId ? 'Bạn' : receiverUsername}: ${data.message}`;
        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight; // Cuộn xuống tin nhắn mới nhất
    });

    // Cuộn xuống tin nhắn cuối cùng khi tải trang
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}
