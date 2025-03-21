document.addEventListener('DOMContentLoaded', () => {
    const chatContainer = document.getElementById('chat-container');
    const userId = chatContainer.dataset.userId;
    let currentReceiverId = chatContainer.dataset.receiverId;
    let currentReceiverDisplayName = chatContainer.dataset.receiverName;

    if (currentReceiverId) {
        initializeChat(userId, currentReceiverId, currentReceiverDisplayName, currentReceiverId); // Truyền currentReceiverId
    }

    window.selectUser = function(receiverId, receiverDisplayName, event) {
        event.preventDefault();
        if (receiverId !== currentReceiverId) {
            currentReceiverId = receiverId;
            currentReceiverDisplayName = receiverDisplayName;

            window.history.pushState({}, '', `/chat?receiverId=${receiverId}`);

            fetch(`/chat/messages?senderId=${userId}&receiverId=${receiverId}`)
                .then(response => response.json())
                .then(data => {
                    chatContainer.innerHTML = `
                        <h2><span id="receiver-name">${receiverDisplayName}</span></h2>
                        <div id="chat-box" class="border rounded p-3 mb-3" style="height: 330px; overflow-y: auto;">
                            ${data.messages.map(msg => `
                                <p class="mb-2 ${msg.sender_id === userId ? 'text-end' : 'text-start'}">
                                    <span class="chat-message bg-primary text-white p-2 rounded d-inline-block" style="max-width: 45%;">
                                        ${msg.message}
                                    </span>
                                </p>
                            `).join('')}
                        </div>
                        <div class="input-group">
                            <textarea id="message-input" class="form-control" placeholder="Nhập tin nhắn" rows="2" style="resize: vertical;"></textarea>
                            <button id="send-button" class="btn btn-primary">Gửi</button>
                        </div>
                    `;
                    initializeChat(userId, receiverId, receiverDisplayName, currentReceiverId); // Truyền currentReceiverId
                })
                .catch(err => console.error('Error fetching messages:', err));
        }
    };
});