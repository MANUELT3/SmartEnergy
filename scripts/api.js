// api.js

const api = {
    baseUrl: 'http://energyapi.somee.com/api',

    async request(endpoint, method = 'GET', data = null) {
        const url = `${this.baseUrl}${endpoint}`;
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        console.log(`Making ${method} request to ${url}`);
        const response = await fetch(url, options);
        console.log(`Received response with status: ${response.status}`);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('API error response:', errorBody);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const responseData = await response.json();
        console.log('API response data:', responseData);
        return responseData;
    },

    // Users endpoints
    async getUsers() {
        return this.request('/users');
    },

    async getUser(id) {
        return this.request(`/users/${id}`);
    },

    async createUser(userData) {
        return this.request('/users', 'POST', userData);
    },

    async updateUser(id, userData) {
        return this.request(`/users/${id}`, 'PUT', userData);
    },

    async deleteUser(id) {
        return this.request(`/users/${id}`, 'DELETE');
    },

    // Products endpoints
    async getProducts() {
        try {
            const response = await this.request('/products');
            console.log('API getProducts response:', response);
            return response;
        } catch (error) {
            console.error('Error in getProducts:', error);
            throw error;
        }
    },

    async getProduct(id) {
        return this.request(`/products/${id}`);
    },

    async createProduct(productData) {
        return this.request('/products', 'POST', productData);
    },

    async updateProduct(id, productData) {
        return this.request(`/products/${id}`, 'PUT', productData);
    },

    async deleteProduct(id) {
        return this.request(`/products/${id}`, 'DELETE');
    },

    // Orders endpoints
    async getOrders() {
        return this.request('/orders');
    },

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    },

    async createOrder(orderData) {
        return this.request('/orders', 'POST', orderData);
    },

    async updateOrder(id, orderData) {
        return this.request(`/orders/${id}`, 'PUT', orderData);
    },

    async deleteOrder(id) {
        return this.request(`/orders/${id}`, 'DELETE');
    },

    // Houses endpoints
    async getHouses() {
        return this.request('/houses');
    },

    async getHouse(id) {
        return this.request(`/houses/${id}`);
    },

    async createHouse(houseData) {
        return this.request('/houses', 'POST', houseData);
    },

    async updateHouse(id, houseData) {
        return this.request(`/houses/${id}`, 'PUT', houseData);
    },

    async deleteHouse(id) {
        return this.request(`/houses/${id}`, 'DELETE');
    },

    // Devices endpoints
    async getDevices() {
        return this.request('/devices');
    },

    async getDevice(id) {
        return this.request(`/devices/${id}`);
    },

    async createDevice(deviceData) {
        return this.request('/devices', 'POST', deviceData);
    },

    async updateDevice(id, deviceData) {
        return this.request(`/devices/${id}`, 'PUT', deviceData);
    },

    async deleteDevice(id) {
        return this.request(`/devices/${id}`, 'DELETE');
    },

    // Add consumption to a device
    async addConsumption(id, consumptionData) {
        return this.request(`/devices/${id}/consumptions`, 'POST', consumptionData);
    }
};