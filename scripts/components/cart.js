// scripts/components/cart.js

function initCart() {
    renderCart();
    stateManager.subscribe(renderCart);

    // Agregamos los event listeners solo si los elementos existen
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', showCheckoutModal);
    }

    const confirmOrderButton = document.getElementById('confirm-order-button');
    if (confirmOrderButton) {
        confirmOrderButton.addEventListener('click', handleCheckout);
    }

    const cancelOrderButton = document.getElementById('cancel-order-button');
    if (cancelOrderButton) {
        cancelOrderButton.addEventListener('click', hideCheckoutModal);
    }
}

function renderCart() {
    const { cart } = stateManager.getState();
    const cartContainer = document.querySelector('.cart-page');

    if (!cartContainer) return; // Si no estamos en la página del carrito, no hacemos nada

    const cartItemsContainer = document.getElementById('cart-items');
    const cartSubtotalElement = document.getElementById('cart-subtotal');
    const cartShippingElement = document.getElementById('cart-shipping');
    const cartTotalElement = document.getElementById('cart-total');

    if (!cartItemsContainer || !cartSubtotalElement || !cartShippingElement || !cartTotalElement) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        cartSubtotalElement.textContent = '$0.00';
        cartShippingElement.textContent = '$0.00';
        cartTotalElement.textContent = '$0.00';
        return;
    }

    let subtotal = 0;
    const shipping = 10; // Asumimos un costo de envío fijo de $10

    cartItemsContainer.innerHTML = cart.map((item, index) => {
        subtotal += item.price * item.quantity;
        return `
            <div class="cart-item">
                <img src="/assets/images/EcoWatt.png" alt="EcoWatt Device" class="item-image">
                <div class="item-details">
                    <h3 class="item-name">EcoWatt Device - ${item.color}</h3>
                    <p class="item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" onclick="updateQuantity(${index}, -1)">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                    <button class="quantity-btn plus" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    }).join('');

    const total = subtotal + shipping;

    cartSubtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    cartShippingElement.textContent = `$${shipping.toFixed(2)}`;
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

window.removeFromCart = function(index) {
    const { cart } = stateManager.getState();
    const newCart = [...cart.slice(0, index), ...cart.slice(index + 1)];
    stateManager.setState({ cart: newCart });
}

window.updateQuantity = function(index, change) {
    const { cart } = stateManager.getState();
    const newCart = [...cart];
    if (typeof change === 'number') {
        newCart[index].quantity = Math.max(1, newCart[index].quantity + change);
    } else {
        newCart[index].quantity = Math.max(1, parseInt(change) || 1);
    }
    stateManager.setState({ cart: newCart });
}

function showCheckoutModal() {
    const { cart } = stateManager.getState();
    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    const orderSummary = document.getElementById('order-summary');
    if (!orderSummary) return;

    let total = 0;
    orderSummary.innerHTML = cart.map(item => {
        const itemPrice = item.price || 0;
        const itemTotal = itemPrice * item.quantity;
        total += itemTotal;
        return `
            <p>EcoWatt Device - ${item.color}: ${item.quantity} x $${itemPrice.toFixed(2)} = $${itemTotal.toFixed(2)}</p>
        `;
    }).join('') + `<h4>Total: $${total.toFixed(2)}</h4>`;

    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'block';
    }
}

function hideCheckoutModal() {
    const checkoutModal = document.getElementById('checkout-modal');
    if (checkoutModal) {
        checkoutModal.style.display = 'none';
    }
}

async function handleCheckout() {
    const { user, cart } = stateManager.getState();

    if (!user) {
        alert('Please log in to complete your order.');
        router.navigateTo('/login');
        return;
    }

    if (cart.length === 0) {
        alert('Your cart is empty.');
        return;
    }

    try {
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        const IVA = subtotal * 0.16;
        const total = subtotal + IVA;

        const orderData = {
            UserId: user.id,
            Date: new Date().toISOString(),
            Status: "pendiente",
            ProductId: cart[0].productId,
            Color: cart[0].color,
            Quantity: cart.reduce((total, item) => total + item.quantity, 0),
            Subtotal: subtotal,
            IVA: IVA,
            Total: total
        };

        console.log('Order data being sent:', orderData);

        const response = await api.createOrder(orderData);
        if (response.id) {
            alert('Order placed successfully!');
            stateManager.setState({ cart: [] });
            hideCheckoutModal();
            router.navigateTo('/profile');
        } else {
            throw new Error('Order placement failed');
        }
    } catch (error) {
        console.error('Checkout error:', error);
        alert('Failed to place order. Please try again.');
    }
}