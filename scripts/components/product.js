// scripts/components/product.js

function initProduct() {
    const addToCartButton = document.getElementById('add-to-cart');
    addToCartButton.addEventListener('click', handleAddToCart);
}

async function handleAddToCart() {
    const { isLoggedIn } = stateManager.getState();
    
    if (!isLoggedIn) {
        alert('Please log in to add items to your cart.');
        router.navigateTo('/login');
        return;
    }

    const color = document.getElementById('product-color').value;
    const quantity = parseInt(document.getElementById('product-quantity').value);

    try {
        const productResponse = await api.getProducts();
        console.log('Product response:', productResponse);

        if (!Array.isArray(productResponse) || productResponse.length === 0) {
            throw new Error('No products returned from API');
        }

        const product = productResponse[0]; // Assuming we only have one product
        console.log('Selected product:', product);

        if (!product || !product.id) {
            throw new Error('Product is missing id');
        }

        if (typeof product.price !== 'number') {
            throw new Error('Product price is not a number');
        }

        const cartItem = {
            productId: product.id,
            color: color,
            quantity: quantity,
            price: product.price
        };

        console.log('Cart item to be added:', cartItem);

        const currentCart = stateManager.getState().cart;
        const updatedCart = [...currentCart, cartItem];
        
        stateManager.setState({ cart: updatedCart });
        alert('Product added to cart successfully!');
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert(`Failed to add product to cart: ${error.message}`);
    }
}
