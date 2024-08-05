// scripts/auth.js

const auth = {
    async login(username, password) {
        try {
            const users = await api.getUsers();
            const user = users.find(u => u.username === username && u.password === password);
            
            if (user) {
                stateManager.setState({ user: user, isLoggedIn: true });
                return { success: true, user: user };
            } else {
                return { success: false, message: 'Invalid credentials' };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: 'An error occurred during login' };
        }
    },

    logout() {
        stateManager.setState({ user: null, isLoggedIn: false });
    },

    async register(userData) {
        try {
            const newUser = await api.createUser(userData);
            return { success: true, user: newUser };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, message: 'An error occurred during registration' };
        }
    },

    isAuthenticated() {
        const { isLoggedIn } = stateManager.getState();
        return isLoggedIn;
    }
};