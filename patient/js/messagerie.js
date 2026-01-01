document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    const messageInput = document.getElementById('messageInput');
    const messagesDiv = document.getElementById('messages');

    // Clear messages for first use
    localStorage.removeItem('patientMessages');

    // Load messages from localStorage without JSON
    let messagesData = localStorage.getItem('patientMessages') || '';
    let messages = messagesData ? messagesData.split('\n').map(line => {
        let parts = line.split('|||');
        return { time: parts[0], msg: parts[1] };
    }) : [];

    function displayMessages() {
        messagesDiv.innerHTML = '';
        messages.forEach((msgObj, index) => {
            const messageItem = document.createElement('div');
            messageItem.className = 'message-item';
            messageItem.innerHTML = `
                <div class="message-header">
                    <span>Message ${index + 1}</span>
                    <span class="message-time">${new Date(msgObj.time).toLocaleString()}</span>
                </div>
                <div class="message-content">${msgObj.msg}</div>
            `;
            messagesDiv.appendChild(messageItem);
        });
    }

    displayMessages();

    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            messages.push({ time: new Date().toISOString(), msg: message });
            localStorage.setItem('patientMessages', messages.map(m => m.time + '|||' + m.msg).join('\n'));
            messageInput.value = '';
            displayMessages();
        }
    });
});
