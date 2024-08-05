// scripts/components/login.js

function initLogin() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const users = await api.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
            stateManager.setState({ user: user, isLoggedIn: true });
            router.navigateTo('/');
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials and try again.');
    }
}