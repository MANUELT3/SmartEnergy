// scripts/components/dashboard.js

function initDashboard() {
    loadDashboardData();
}

async function loadDashboardData() {
    try {
        const { user } = stateManager.getState();
        if (!user) {
            throw new Error('User not logged in');
        }

        const devices = await api.getUserDevices(user.id);
        if (devices.length === 0) {
            showNoDdevicesMessage();
            return;
        }

        const consumptionData = await api.getDeviceConsumption(devices[0].id);
        updateDashboardSummary(consumptionData);
        renderConsumptionChart(consumptionData);
        renderDistributionChart(devices);
        showEnergySavingTips();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showErrorMessage();
    }
}

function updateDashboardSummary(consumptionData) {
    const totalConsumption = consumptionData.reduce((sum, data) => sum + data.consumo, 0);
    const averageDaily = totalConsumption / consumptionData.length;
    const estimatedBill = totalConsumption * 0.12; // Assuming $0.12 per kWh

    document.getElementById('total-consumption').textContent = `${totalConsumption.toFixed(2)} kWh`;
    document.getElementById('average-daily').textContent = `${averageDaily.toFixed(2)} kWh`;
    document.getElementById('estimated-bill').textContent = `$${estimatedBill.toFixed(2)}`;
}

function renderConsumptionChart(consumptionData) {
    Highcharts.chart('consumption-chart', {
        chart: { type: 'line' },
        title: { text: 'Energy Consumption Over Time' },
        xAxis: {
            type: 'datetime',
            title: { text: 'Date' }
        },
        yAxis: {
            title: { text: 'Energy Consumption (kWh)' }
        },
        series: [{
            name: 'Energy Consumption',
            data: consumptionData.map(data => [new Date(data.fecha).getTime(), data.consumo])
        }]
    });
}

function renderDistributionChart(devices) {
    const deviceData = devices.map(device => ({
        name: device.habitacion,
        y: Math.random() * 100 // Replace with actual consumption data when available
    }));

    Highcharts.chart('distribution-chart', {
        chart: { type: 'pie' },
        title: { text: 'Energy Distribution by Device' },
        series: [{
            name: 'Energy Consumption',
            data: deviceData
        }]
    });
}

function showEnergySavingTips() {
    const tips = [
        "Turn off lights when not in use",
        "Use energy-efficient LED bulbs",
        "Unplug electronics when not in use",
        "Use natural light when possible",
        "Adjust your thermostat by a few degrees"
    ];

    const tipsListElement = document.getElementById('tips-list');
    tipsListElement.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
}

function showNoDdevicesMessage() {
    const dashboardContent = document.querySelector('.dashboard-content');
    dashboardContent.innerHTML = `
        <div class="no-devices-message">
            <h2>No devices found</h2>
            <p>It looks like you haven't set up any EcoWatt devices yet. To start monitoring your energy consumption, please add a device to your account.</p>
            <a href="/product" class="btn btn-primary" data-link>Get EcoWatt Device</a>
        </div>
    `;
}

function showErrorMessage() {
    const dashboardContent = document.querySelector('.dashboard-content');
    dashboardContent.innerHTML = `
        <div class="error-message">
            <h2>Oops! Something went wrong</h2>
            <p>We're having trouble loading your dashboard data. Please try again later or contact support if the problem persists.</p>
        </div>
    `;
}