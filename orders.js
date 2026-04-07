const OrderManager = {
  init() {
    this.attachEventListeners();
  },

  attachEventListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-done')) {
        const orderId = e.target.getAttribute('data-order-id');
        this.markOrderDone(orderId);
      }

      if (e.target.classList.contains('btn-cancel')) {
        const orderId = e.target.getAttribute('data-order-id');
        this.cancelOrder(orderId);
      }
    });
  },

  markOrderDone(orderId) {
    const success = updateOrderStatus(orderId, 'done');

    if (success) {
      UI.showNotification('Order marked as done');
      UI.renderOrders();
      UI.renderHomeDashboard();
      UI.renderManagement();
    } else {
      UI.showNotification('Failed to update order', 'error');
    }
  },

  cancelOrder(orderId) {
    const success = updateOrderStatus(orderId, 'cancelled');

    if (success) {
      UI.showNotification('Order cancelled');
      UI.renderOrders();
      UI.renderHomeDashboard();
    } else {
      UI.showNotification('Failed to cancel order', 'error');
    }
  }
};
