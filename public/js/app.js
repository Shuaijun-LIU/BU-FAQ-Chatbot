document.addEventListener('DOMContentLoaded', () => {
    const toggleSidebarButton = document.getElementById('toggle-sidebar');
    const sidebar = document.getElementById('sidebar');

    if (toggleSidebarButton && sidebar) {
        toggleSidebarButton.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    const messagesDiv = document.getElementById('chatbox');
    const questionsList = document.getElementById('questions-list');

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
                answerMessage.className = 'message bot';
                answerMessage.innerHTML = `
                    <div class="avatar">
                        <img src="images/bot-icon.png" alt="Bot">
                    </div>
                    <div class="text">
                        <strong>Answer:</strong> ${data.answer}
                    </div>
                `;
                messagesDiv.appendChild(answerMessage);
            } else {
                console.error('Error response:', data.error); // Debug log
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
                console.log("Navigating to /chat with program:", selectedProgram);
                window.location.href = '/chat';
            }
        });
    } else {
        console.error("Program selection elements not found");
    }

    // Role selection and admin login functionality
    const userButton = document.getElementById('user-button');
    const adminButton = document.getElementById('admin-button');
    const roleSelectionModal = document.getElementById('role-selection-modal');
    const loginModal = document.getElementById('login-modal');
    const content = document.getElementById('content');
    const navLinks = document.querySelector('.header-container nav');

    if (userButton) {
        userButton.addEventListener('click', () => {
            localStorage.setItem('role', 'user');
            roleSelectionModal.classList.remove('active');
            document.body.classList.remove('modal-open');
            content.classList.remove('hidden');
            navLinks.innerHTML = `
                <a href="index.html">Home</a>
                <a href="chat.html">NLP Chat</a>
                <a href="gpt-chat.html">GPT Chat</a>
            `;
        });
    }

    if (adminButton) {
        adminButton.addEventListener('click', () => {
            roleSelectionModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }

    const loginButton = document.getElementById('login-button');
    if (loginButton) {
        loginButton.addEventListener('click', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();
                if (response.ok) {
                    const loginTime = new Date().toISOString();
                    localStorage.setItem('role', 'admin');
                    localStorage.setItem('username', username);
                    localStorage.setItem('loginTime', loginTime);

                    // Store the token in localStorage
                    localStorage.setItem('token', data.token);

                    loginModal.classList.remove('active');
                    document.body.classList.remove('modal-open');
                    content.classList.remove('hidden');
                    navLinks.innerHTML = `
                        <a href="index.html">Home</a>
                        <a href="chat.html">NLP Chat</a>
                        <a href="gpt-chat.html">GPT Chat</a>
                        <a href="admin.html">BU Admin</a>
                        <a href="faq-management.html">FAQ Management</a>
                        <a href="upload.html">Upload</a>
                    `;
                } else {
                    document.getElementById('error-message').textContent = data.message;
                }
            } catch (error) {
                console.error('Error during login:', error);
                document.getElementById('error-message').textContent = 'An unexpected error occurred during login.';
            }
        });
    }

    const registerButton = document.getElementById('register-button');
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = 'register.html';
        });
    }

    // Open role selection modal on page load
    roleSelectionModal.classList.add('active');
    document.body.classList.add('modal-open');

    // Display login info in console
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const loginTime = localStorage.getItem('loginTime');

    if (role === 'admin' && username && loginTime) {
        console.log(`Logged in as ${username} at ${new Date(loginTime).toLocaleString()}`);
    }
});