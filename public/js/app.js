document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Login successful');
                localStorage.setItem('token', data.token);
                window.location.href = '/';
            } else {
                alert('Login failed: ' + data.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                alert('Registration successful');
                window.location.href = '/login';
            } else {
                alert('Registration failed: ' + data.message);
            }
        });
    }

    const messagesDiv = document.getElementById('messages');
    const questionsList = document.getElementById('questions-list');
    
    // Display initial message
    const initialMessage = document.createElement('div');
    initialMessage.className = 'system';
    initialMessage.innerHTML = `<p><strong>System:</strong> You can start asking questions now.</p>`;
    if (messagesDiv) {
        messagesDiv.appendChild(initialMessage);
        // Add a line break after the initial message
        const lineBreak = document.createElement('br');
        messagesDiv.appendChild(lineBreak);
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
            userMessage.className = 'user';
            userMessage.innerHTML = `<p><strong>You:</strong> ${userQuestion}</p>`;
            messagesDiv.appendChild(userMessage);

            console.log('Submitting question:', userQuestion); // Debug log

            const response = await fetch('/questions/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ question: userQuestion })
            });

            const data = await response.json();
            if (response.ok) {
                console.log('Received answer:', data.answer); // Debug log
                const answerMessage = document.createElement('div');
                answerMessage.className = 'answer';
                answerMessage.innerHTML = `<p><strong>Answer:</strong> ${data.answer}</p>`;
                if (data.urls && data.urls.length > 0) {
                    const urlsDiv = document.createElement('div');
                    urlsDiv.innerHTML = `<p>For more detailed information, you can visit the following websites:</p>`;
                    data.urls.forEach(urlObj => {
                        const urlLink = document.createElement('a');
                        urlLink.href = urlObj.url;
                        urlLink.textContent = urlObj.text;
                        urlsDiv.appendChild(urlLink);
                        urlsDiv.appendChild(document.createElement('br'));
                    });
                    answerMessage.appendChild(urlsDiv);
                }
                messagesDiv.appendChild(answerMessage);
            } else {
                console.error('Error response:', data.error); // Debug log
                const errorMessage = document.createElement('div');
                errorMessage.className = 'system';
                errorMessage.innerHTML = `<p><strong>Error:</strong> ${data.error}</p>`;
                messagesDiv.appendChild(errorMessage);
            }

            // Scroll to the bottom of the chatbox
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });
    }

    // Fetch questions for tips
    if (questionsList) {
        fetch('/questions')
            .then(response => response.json())
            .then(data => {
                data.forEach(item => {
                    const questionItem = document.createElement('li');
                    questionItem.textContent = item.question;
                    questionItem.addEventListener('click', () => {
                        document.getElementById('user-question').value = item.question;
                    });
                    questionsList.appendChild(questionItem);
                });
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
                const errorMessage = document.createElement('li');
                errorMessage.textContent = 'Error loading questions. Please try again later.';
                questionsList.appendChild(errorMessage);
            });
    }

    // New functionality for program selection and navigation
    const programSelectButton = document.getElementById('program-select-button');
    const programOptions = document.getElementById('program-options');
    const startButton = document.getElementById('start-button');
    let selectedProgram = '';

    if (programSelectButton && programOptions && startButton) {
        programSelectButton.addEventListener('click', () => {
            console.log("Program select button clicked");
            programOptions.classList.toggle('hidden');
        });

        programOptions.addEventListener('click', (event) => {
            const target = event.target;
            if (target && target.matches('div[data-program]')) {
                selectedProgram = target.dataset.program;
                programSelectButton.textContent = selectedProgram;
                programOptions.classList.add('hidden');
                startButton.classList.remove('hidden');
                console.log("Program selected:", selectedProgram);
            }
        });

        startButton.addEventListener('click', () => {
            if (selectedProgram) {
                console.log("Navigating to /file-qa with program:", selectedProgram);
                window.location.href = '/file-qa';
            }
        });
    } else {
        console.error("Program selection elements not found");
    }
});

function yetAnotherFunction() {
    // |--202407-MacOS--|
    // |--Another:Shuaijun Liu--|
    console.log("Another:Shuaijun Liu");
}