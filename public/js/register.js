document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event fired");

    const registerForm = document.getElementById('register-form');

    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            // Create a FormData object to handle all form data including file upload
            const formData = new FormData(registerForm);

            // Validate passwords match
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm-password');
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    body: formData // Send formData which includes all fields and the file
                });

                const data = await response.json();
                if (response.ok) {
                    alert('Registration successful');
                    window.location.href = '/';
                } else {
                    alert('Registration failed: ' + data.message);
                }
            } catch (error) {
                console.error('Error during registration:', error);
                alert('An unexpected error occurred during registration.');
            }
        });
    }
});