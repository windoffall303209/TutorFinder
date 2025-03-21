console.log('chat.js loaded');
function initializeChat(userId, receiverId, receiverDisplayName) {
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

    // Hàm gửi tin nhắn
    const sendMessage = () => {
        const message = messageInput.value;
        console.log('Send triggered');
        if (message.trim()) {
            console.log('Sending message:', message);
            socket.emit('sendMessage', { senderId: userId, receiverId: receiverId, message });
            messageInput.value = '';
        }
    };

    // Sự kiện click nút "Gửi"
    sendButton.addEventListener('click', sendMessage);

    // Sự kiện nhấn phím Enter
    messageInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });

    // Nhận tin nhắn realtime
    socket.on('receiveMessage', (data) => {
        console.log('Received message:', data);
        const chatBox = document.getElementById('chat-box');
        const newMessage = document.createElement('p');
        newMessage.className = `mb-2 ${data.senderId === userId ? 'text-end' : 'text-start'}`;
        newMessage.innerHTML = `
            <span class="chat-message bg-primary text-white p-2 rounded">
                ${data.senderId === userId ? 'Bạn' : receiverDisplayName}: ${data.message}
            </span>
        `;
        chatBox.appendChild(newMessage);
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    // Cuộn xuống tin nhắn cuối cùng khi tải trang
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}