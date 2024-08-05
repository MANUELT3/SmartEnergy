// scripts/utils/state-manager.js

const stateManager = {
    state: {
        user: null,
        isLoggedIn: false,
        cart: []
    },

    listeners: [],

    setState(newState) {
        this.state = { ...this.state, ...newState };
        if (newState.cart) {
            this.state.cart = this.validateCart(newState.cart);
        }
        this.notify();
    },

    validateCart(cart) {
        return cart.filter(item => 
            item && 
            typeof item.productId === 'string' && 
            typeof item.color === 'string' && 
            typeof item.quantity === 'number' && 
            typeof item.price === 'number'
        );
    },

    getState() {
        return this.state;
    },

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    },

    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
};

function initStateManager() {
    // Initialize with stored cart if available
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        stateManager.setState({ cart: JSON.parse(storedCart) });
    }

    // Subscribe to state changes to update localStorage
    stateManager.subscribe(state => {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    });
}