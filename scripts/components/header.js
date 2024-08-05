// scripts/components/header.js

function initHeader() {
    const logoutButton = document.getElementById('logout-button');
    logoutButton.addEventListener('click', handleLogout);

    updateHeaderState();
    stateManager.subscribe(updateHeaderState);
}

function updateHeaderState() {
    const { isLoggedIn } = stateManager.getState();
    
    document.getElementById('cart-link').style.display = isLoggedIn ? 'inline' : 'none';
    document.getElementById('dashboard-link').style.display = isLoggedIn ? 'inline' : 'none';
    document.getElementById('login-link').style.display = isLoggedIn ? 'none' : 'inline';
    document.getElementById('profile-link').style.display = isLoggedIn ? 'inline' : 'none';
    document.getElementById('logout-link').style.display = isLoggedIn ? 'inline' : 'none';
}

function handleLogout() {
    localStorage.removeItem('token');
    stateManager.setState({ user: null, isLoggedIn: false });
    router.navigateTo('/');
}