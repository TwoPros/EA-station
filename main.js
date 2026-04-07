const App = {
  currentPage: 'home',

  init() {
    this.setupNavigation();
    this.setupInputHandlers();
    this.renderCurrentPage();

    OrderManager.init();
    Analytics.init();
  },

  setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-item');

    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = e.currentTarget.getAttribute('data-page');
        this.navigateTo(page);
      });
    });
  },

  navigateTo(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    document.getElementById(`page-${page}`).classList.add('active');
    document.querySelector(`.nav-item[data-page="${page}"]`).classList.add('active');

    this.currentPage = page;
    this.renderCurrentPage();
  },

  renderCurrentPage() {
    switch (this.currentPage) {
      case 'home':
        UI.renderHomeDashboard();
        break;
      case 'inputs':
        UI.renderInputsPage();
        break;
      case 'messaging':
        UI.renderMessages();
        break;
      case 'orders':
        UI.renderOrders();
        break;
      case 'management':
        UI.renderManagement();
        break;
    }
  },

  setupInputHandlers() {
    document.getElementById('save-company-name').addEventListener('click', () => {
      const value = document.getElementById('company-name').value;
      if (value.trim()) {
        updateStationInfo('name', value);
        UI.showNotification('Company name updated');
      } else {
        UI.showNotification('Please enter a valid name', 'error');
      }
    });

    document.getElementById('save-gas-price').addEventListener('click', () => {
      const value = parseFloat(document.getElementById('gas-price').value);
      if (value > 0) {
        updateStationInfo('fuelPrice', value);
        UI.showNotification('Gas price updated');
        UI.renderOrders();
        UI.renderManagement();
      } else {
        UI.showNotification('Please enter a valid price', 'error');
      }
    });

    document.getElementById('save-fuel-stock').addEventListener('click', () => {
      const value = parseInt(document.getElementById('fuel-stock').value);
      if (value >= 0) {
        updateStationInfo('litersLeft', value);
        UI.showNotification('Fuel stock updated');
        UI.renderHomeDashboard();
      } else {
        UI.showNotification('Please enter a valid amount', 'error');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
