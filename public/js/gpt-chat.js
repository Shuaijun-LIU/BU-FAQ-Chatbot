document.addEventListener('DOMContentLoaded', () => {
    const messagesDiv = document.getElementById('chatbox');

    // Display initial message
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message bot';
    initialMessage.innerHTML = `
        <div class="avatar">
            <img src="images/bot-icon.png" alt="Bot">
        </div>
        <div class="text">
            <strong>System:</strong> Hi, how can I help? Choose from a topic below or type a specific question.
            (Programs, Admissions, Prerequisites, Registration, Program Requirements, Program Completion, International Students, Other)
        </div>
    `;
    if (messagesDiv) {
        messagesDiv.appendChild(initialMessage);
    }

    // Add event listener for question submission
    const submitQuestionButton = document.getElementById('submit-question');
    if (submitQuestionButton) {
        submitQuestionButton.addEventListener('click', async () => {
            const userQuestion = document.getElementById('user-question').value;
            if (userQuestion.trim() === '') {
                alert('Please enter a question');
                return;
            }

            // Display user question
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.innerHTML = `
                <div class="text user-text"><strong>You:</strong> ${userQuestion}</div>
                <div class="avatar user-avatar">
                    <img src="images/user-icon.png" alt="User">
                </div>
            `;
            messagesDiv.appendChild(userMessage);

            const response = await fetch('/openai/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: userQuestion })
            });

            const data = await response.json();
            if (response.ok) {
                const answerMessage = document.createElement('div');
                answerMessage.className = 'message bot';
                answerMessage.innerHTML = `
                    <div class="avatar">
                        <img src="images/bot-icon.png" alt="Bot">
                    </div>
                    <div class="text">
                        <strong>Answer:</strong> ${data.answer}
                        ${data.urls && data.urls.length > 0 ? `
                            <div>
                                <p>For more detailed information, you can visit the following websites:</p>
                                ${data.urls.map(urlObj => `<a href="${urlObj.url}" target="_blank">${urlObj.text}</a><br>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `;
                messagesDiv.appendChild(answerMessage);
            } else {
                const errorMessage = document.createElement('div');
                errorMessage.className = 'message bot';
                errorMessage.innerHTML = `
                    <div class="avatar">
                        <img src="images/bot-icon.png" alt="Bot">
                    </div>
                    <div class="text">
                        <strong>Error:</strong> ${data.error}
                    </div>
                `;
                messagesDiv.appendChild(errorMessage);
            }

            // Scroll to the bottom of the chatbox
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });
    }
});