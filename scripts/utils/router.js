// scripts/utils/router.js

const router = {
    base: '/SmartEnergy',
    routes: {
        '/': { component: 'home', requiresAuth: false },
        '/login': { component: 'login', requiresAuth: false },
        '/register': { component: 'register', requiresAuth: false },
        '/product': { component: 'product', requiresAuth: false },
        '/about': { component: 'about', requiresAuth: false },
        '/cart': { component: 'cart', requiresAuth: true },
        '/profile': { component: 'user-profile', requiresAuth: true },
        '/dashboard': { component: 'dashboard', requiresAuth: true }
    },

    init() {
        window.addEventListener('popstate', this.handleLocation.bind(this));
        document.body.addEventListener('click', e => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigateTo(e.target.href);
            }
        });
        this.handleLocation();
    },

    getPath() {
        return window.location.pathname.replace(this.base, '') || '/';
    },

    handleLocation() {
        const path = this.getPath();
        const route = this.routes[path] || this.routes['/'];
        
        if (route.requiresAuth && !auth.isAuthenticated()) {
            this.navigateTo('/login');
            return;
        }

        this.loadRoute(route.component);
    },

    navigateTo(url) {
        window.history.pushState(null, null, this.base + url);
        this.handleLocation();
    },

    loadRoute(componentName) {
        const appContainer = document.getElementById('app-container');
        fetch(`${this.base}/components/${componentName}.html`)
            .then(response => response.text())
            .then(html => {
                appContainer.innerHTML = html;
                if (window[`init${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`]) {
                    window[`init${componentName.charAt(0).toUpperCase() + componentName.slice(1)}`]();
                }
            })
            .catch(error => {
                console.error('Error loading route:', error);
                appContainer.innerHTML = '<p>Error loading content. Please try again.</p>';
            });
    }
};
