const StationData = {
  station: {
    id: "station_001",
    name: "EA Station Downtown",
    fuelPrice: 1.45,
    litersLeft: 5000
  },

  users: [
    { id: "user_001", name: "Ahmed Ali", phone: "+964770123456", activeOrderId: "order_001" },
    { id: "user_002", name: "Sara Mohammed", phone: "+964771234567", activeOrderId: null },
    { id: "user_003", name: "Omar Hassan", phone: "+964772345678", activeOrderId: "order_003" },
    { id: "user_004", name: "Layla Ibrahim", phone: "+964773456789", activeOrderId: null },
    { id: "user_005", name: "Kareem Jamal", phone: "+964774567890", activeOrderId: "order_005" }
  ],

  orders: [
    {
      id: "order_001",
      userId: "user_001",
      userName: "Ahmed Ali",
      litersRequested: 40,
      status: "pending",
      createdAt: "2026-04-07T08:30:00Z"
    },
    {
      id: "order_002",
      userId: "user_002",
      userName: "Sara Mohammed",
      litersRequested: 30,
      status: "done",
      createdAt: "2026-04-07T07:15:00Z",
      completedAt: "2026-04-07T07:25:00Z"
    },
    {
      id: "order_003",
      userId: "user_003",
      userName: "Omar Hassan",
      litersRequested: 50,
      status: "pending",
      createdAt: "2026-04-07T08:45:00Z"
    },
    {
      id: "order_004",
      userId: "user_004",
      userName: "Layla Ibrahim",
      litersRequested: 25,
      status: "done",
      createdAt: "2026-04-07T06:00:00Z",
      completedAt: "2026-04-07T06:08:00Z"
    },
    {
      id: "order_005",
      userId: "user_005",
      userName: "Kareem Jamal",
      litersRequested: 45,
      status: "pending",
      createdAt: "2026-04-07T09:00:00Z"
    },
    {
      id: "order_006",
      userId: "user_001",
      userName: "Ahmed Ali",
      litersRequested: 35,
      status: "cancelled",
      createdAt: "2026-04-06T14:00:00Z"
    },
    {
      id: "order_007",
      userId: "user_003",
      userName: "Omar Hassan",
      litersRequested: 40,
      status: "done",
      createdAt: "2026-04-06T10:30:00Z",
      completedAt: "2026-04-06T10:42:00Z"
    }
  ],

  messages: [
    {
      id: "msg_001",
      userId: "user_001",
      userName: "Ahmed Ali",
      message: "Is the station open today?",
      timestamp: "2026-04-07T08:25:00Z",
      read: true
    },
    {
      id: "msg_002",
      userId: "user_003",
      userName: "Omar Hassan",
      message: "How long is the wait time?",
      timestamp: "2026-04-07T08:40:00Z",
      read: false
    },
    {
      id: "msg_003",
      userId: "user_002",
      userName: "Sara Mohammed",
      message: "Thank you for the quick service!",
      timestamp: "2026-04-07T07:30:00Z",
      read: true
    }
  ],

  analytics: {
    week: [
      { day: "Mon", orders: 12, liters: 480 },
      { day: "Tue", orders: 15, liters: 590 },
      { day: "Wed", orders: 18, liters: 720 },
      { day: "Thu", orders: 14, liters: 560 },
      { day: "Fri", orders: 20, liters: 800 },
      { day: "Sat", orders: 25, liters: 1000 },
      { day: "Sun", orders: 22, liters: 880 }
    ],
    month: [
      { week: "Week 1", orders: 85, liters: 3400 },
      { week: "Week 2", orders: 92, liters: 3680 },
      { week: "Week 3", orders: 78, liters: 3120 },
      { week: "Week 4", orders: 95, liters: 3800 }
    ],
    year: [
      { month: "Jan", orders: 320, liters: 12800 },
      { month: "Feb", orders: 290, liters: 11600 },
      { month: "Mar", orders: 350, liters: 14000 },
      { month: "Apr", orders: 95, liters: 3800 }
    ]
  }
};

function getActiveUsers() {
  return StationData.users.filter(user => user.activeOrderId !== null);
}

function getTodayOrders() {
  const today = new Date().toISOString().split('T')[0];
  return StationData.orders.filter(order =>
    order.createdAt.startsWith(today)
  );
}

function getOrdersByStatus(status) {
  return StationData.orders.filter(order => order.status === status);
}

function getMostActiveUsers() {
  const userOrderCounts = {};

  StationData.orders.forEach(order => {
    if (order.status === 'done') {
      if (!userOrderCounts[order.userId]) {
        userOrderCounts[order.userId] = {
          userId: order.userId,
          userName: order.userName,
          orderCount: 0,
          totalLiters: 0
        };
      }
      userOrderCounts[order.userId].orderCount++;
      userOrderCounts[order.userId].totalLiters += order.litersRequested;
    }
  });

  return Object.values(userOrderCounts)
    .sort((a, b) => b.orderCount - a.orderCount)
    .slice(0, 5);
}

function calculateRevenue() {
  const completedOrders = StationData.orders.filter(order => order.status === 'done');
  const totalLiters = completedOrders.reduce((sum, order) => sum + order.litersRequested, 0);
  const totalRevenue = totalLiters * StationData.station.fuelPrice;

  return {
    totalOrders: completedOrders.length,
    totalLiters: totalLiters,
    totalRevenue: totalRevenue
  };
}

function updateOrderStatus(orderId, newStatus) {
  const order = StationData.orders.find(o => o.id === orderId);
  if (order) {
    order.status = newStatus;
    if (newStatus === 'done') {
      order.completedAt = new Date().toISOString();
    }
    return true;
  }
  return false;
}

function updateStationInfo(field, value) {
  if (StationData.station.hasOwnProperty(field)) {
    StationData.station[field] = value;
    return true;
  }
  return false;
}

function getUnreadMessagesCount() {
  return StationData.messages.filter(msg => !msg.read).length;
}
