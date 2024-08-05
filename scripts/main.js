// scripts/main.js

document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
    // Initialize the state manager
    initStateManager();

    // Load the header and footer
    loadComponent('header', 'main-header');
    loadComponent('footer', 'main-footer');

    // Check if user is logged in (you might want to implement a more secure method)
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        stateManager.setState({ user: user, isLoggedIn: true });
    }

    // Initialize the router
    router.init();
}

function loadComponent(componentName, containerId) {
    fetch(`/components/${componentName}.html`)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            if (window[`init${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`]) {
                window[`init${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`]();
            }
        })
        .catch(error => console.error(`Error loading ${componentName} component:`, error));
}