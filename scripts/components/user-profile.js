// scripts/components/user-profile.js

function initUserProfile() {
    const profileForm = document.getElementById('profile-form');
    profileForm.addEventListener('submit', handleProfileUpdate);

    loadUserProfile();
    loadOrderHistory();
}

async function loadUserProfile() {
    const { user } = stateManager.getState();
    if (user) {
        document.getElementById('username').value = user.username;
        document.getElementById('email').value = user.email;
        document.getElementById('firstName').value = user.firstName;
        document.getElementById('lastName').value = user.lastName;
        document.getElementById('phoneNumber').value = user.phoneNumber || '';
    }
}

async function handleProfileUpdate(event) {
    event.preventDefault();
    
    const { user } = stateManager.getState();
    const updatedUserData = {
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phoneNumber: document.getElementById('phoneNumber').value
    };

    try {
        const response = await api.updateUser(user.id, updatedUserData);
        if (response.id) {
            alert('Profile updated successfully!');
            stateManager.setState({ user: { ...user, ...updatedUserData } });
        } else {
            throw new Error('Profile update failed');
        }
    } catch (error) {
        console.error('Profile update error:', error);
        alert('Failed to update profile. Please try again.');
    }
}

async function loadOrderHistory() {
    const { user } = stateManager.getState();
    const orderHistoryContainer = document.getElementById('order-history');

    try {
        const allOrders = await api.getOrders();
        const userOrders = allOrders.filter(order => order.usuarioId === user.id);

        orderHistoryContainer.innerHTML = userOrders.map(order => `
            <div class="order">
                <p>Order ID: ${order.id}</p>
                <p>Date: ${new Date(order.fecha).toLocaleDateString()}</p>
                <p>Status: ${order.estado}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading order history:', error);
        orderHistoryContainer.innerHTML = '<p>Failed to load order history.</p>';
    }
}