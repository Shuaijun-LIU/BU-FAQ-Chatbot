// common.js

document.addEventListener('DOMContentLoaded', () => {
    updateNavbarAndLoginInfo();
});

function updateNavbarAndLoginInfo() {
    const navLinks = document.querySelector('.header-container nav');
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    const loginTime = localStorage.getItem('loginTime');

    if (role === 'admin' && username && loginTime) {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="chat.html">Chat</a>
            <a href="admin.html">BU-admin</a>
            <a href="faq-management.html">FAQ-management</a>
            <a href="upload.html">Upload</a>
        `;
        console.log(`Logged in as ${username} at ${new Date(loginTime).toLocaleString()}`);
    } else if (role === 'user') {
        navLinks.innerHTML = `
            <a href="index.html">Home</a>
            <a href="chat.html">Chat</a>
        `;
    }
}