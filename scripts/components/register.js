// scripts/components/register.js

function initRegister() {
    const registerForm = document.getElementById('register-form');
    registerForm.addEventListener('submit', handleRegister);
}

async function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
        email: document.getElementById('email').value,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        secondLastName: document.getElementById('secondLastName').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        role: "cliente",
        status: "activo",
        address: {
            street: document.getElementById('street').value,
            number: document.getElementById('number').value,
            neighborhood: document.getElementById('neighborhood').value,
            zipCode: document.getElementById('zipCode').value
        }
    };

    try {
        const response = await api.createUser(userData);
        if (response.id) {
            alert('Registration successful! Please log in.');
            router.navigateTo('/login');
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}