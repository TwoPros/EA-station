const UI = {
  renderHomeDashboard() {
    const activeUsers = getActiveUsers();
    const todayOrders = getTodayOrders();
    const fuelLeft = StationData.station.litersLeft;

    document.getElementById('user-count').textContent = activeUsers.length;
    document.getElementById('order-count').textContent = todayOrders.length;
    document.getElementById('fuel-left').textContent = `${fuelLeft}L`;

    this.renderChart('week');
  },

  renderChart(period) {
    const canvas = document.getElementById('analytics-chart');
    const ctx = canvas.getContext('2d');

    canvas.width = canvas.offsetWidth;
    canvas.height = 300;

    const data = StationData.analytics[period];
    const maxValue = Math.max(...data.map(d => d.orders));
    const barWidth = canvas.width / (data.length * 2);
    const barSpacing = barWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data.forEach((item, index) => {
      const barHeight = (item.orders / maxValue) * (canvas.height - 60);
      const x = (index * (barWidth + barSpacing)) + barSpacing;
      const y = canvas.height - barHeight - 40;

      const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
      gradient.addColorStop(0, '#4CAF50');
      gradient.addColorStop(1, '#2E7D32');

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      const label = item.day || item.week || item.month;
      ctx.fillText(label, x + barWidth / 2, canvas.height - 20);

      ctx.fillStyle = '#333';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(item.orders, x + barWidth / 2, y - 5);
    });
  },

  renderInputsPage() {
    document.getElementById('company-name').value = StationData.station.name;
    document.getElementById('gas-price').value = StationData.station.fuelPrice;
    document.getElementById('fuel-stock').value = StationData.station.litersLeft;
  },

  renderMessages() {
    const messageList = document.getElementById('message-list');
    messageList.innerHTML = '';

    if (StationData.messages.length === 0) {
      messageList.innerHTML = '<div class="empty-state">No messages yet</div>';
      return;
    }

    StationData.messages.forEach(msg => {
      const messageEl = document.createElement('div');
      messageEl.className = `message-item ${msg.read ? 'read' : 'unread'}`;
      messageEl.innerHTML = `
        <div class="message-header">
          <span class="message-user">${msg.userName}</span>
          <span class="message-time">${this.formatTime(msg.timestamp)}</span>
        </div>
        <div class="message-text">${msg.message}</div>
        ${!msg.read ? '<span class="unread-badge">New</span>' : ''}
      `;
      messageList.appendChild(messageEl);
    });
  },

  renderOrders() {
    const pendingList = document.getElementById('orders-pending');
    const doneList = document.getElementById('orders-done');
    const cancelledList = document.getElementById('orders-cancelled');

    pendingList.innerHTML = '';
    doneList.innerHTML = '';
    cancelledList.innerHTML = '';

    const pendingOrders = getOrdersByStatus('pending');
    const doneOrders = getOrdersByStatus('done');
    const cancelledOrders = getOrdersByStatus('cancelled');

    this.renderOrderList(pendingOrders, pendingList, 'pending');
    this.renderOrderList(doneOrders, doneList, 'done');
    this.renderOrderList(cancelledOrders, cancelledList, 'cancelled');
  },

  renderOrderList(orders, container, status) {
    if (orders.length === 0) {
      container.innerHTML = '<div class="empty-column">No orders</div>';
      return;
    }

    orders.forEach(order => {
      const orderCard = document.createElement('div');
      orderCard.className = 'order-card';
      orderCard.innerHTML = `
        <div class="order-header">
          <strong>${order.userName}</strong>
          <span class="order-time">${this.formatTime(order.createdAt)}</span>
        </div>
        <div class="order-details">
          <div class="order-liters">${order.litersRequested}L</div>
          <div class="order-price">$${(order.litersRequested * StationData.station.fuelPrice).toFixed(2)}</div>
        </div>
        ${status === 'pending' ? `
          <div class="order-actions">
            <button class="btn-done" data-order-id="${order.id}">Mark Done</button>
            <button class="btn-cancel" data-order-id="${order.id}">Cancel</button>
          </div>
        ` : ''}
      `;
      container.appendChild(orderCard);
    });
  },

  renderManagement() {
    const activeUsersList = document.getElementById('active-users-list');
    const mostActiveUsers = getMostActiveUsers();

    activeUsersList.innerHTML = '';

    if (mostActiveUsers.length === 0) {
      activeUsersList.innerHTML = '<div class="empty-state">No user data yet</div>';
    } else {
      mostActiveUsers.forEach((user, index) => {
        const userItem = document.createElement('div');
        userItem.className = 'active-user-item';
        userItem.innerHTML = `
          <div class="user-rank">#${index + 1}</div>
          <div class="user-details">
            <div class="user-name">${user.userName}</div>
            <div class="user-stats">${user.orderCount} orders · ${user.totalLiters}L</div>
          </div>
        `;
        activeUsersList.appendChild(userItem);
      });
    }

    const revenue = calculateRevenue();
    document.getElementById('total-orders').textContent = revenue.totalOrders;
    document.getElementById('total-liters').textContent = revenue.totalLiters;
    document.getElementById('total-revenue').textContent = `$${revenue.totalRevenue.toFixed(2)}`;
  },

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString();
  },

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 10);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
};
