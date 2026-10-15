// ==========================================================================
// Analytics Controller (SaaS Dashboard KPI Metrics & Charts Data)
// ==========================================================================

const { readJson } = require('../config/db');

// GET /api/analytics/dashboard
exports.getDashboardMetrics = (req, res) => {
  try {
    const products = readJson('products.json');
    const orders = readJson('orders.json');
    const users = readJson('users.json');

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + (i.qty || 1), 0), 0);

    const categoryCounts = {};
    products.forEach(p => {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    });

    const monthlyRevenue = [
      { month: "Jan", revenue: 42500 },
      { month: "Feb", revenue: 58200 },
      { month: "Mar", revenue: 71000 },
      { month: "Apr", revenue: 84300 },
      { month: "May", revenue: 99100 },
      { month: "Jun", revenue: 115400 },
      { month: "Jul", revenue: 132000 },
      { month: "Aug", revenue: 148900 },
      { month: "Sep", revenue: 165000 },
      { month: "Oct", revenue: Math.round(180000 + totalRevenue) }
    ];

    res.json({
      success: true,
      data: {
        metrics: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          totalOrders: orders.length,
          totalProducts: products.length,
          totalCustomers: users.length,
          itemsSold: totalItemsSold,
          conversionRate: "4.82%",
          avgOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0
        },
        categoryDistribution: categoryCounts,
        monthlyRevenue,
        recentOrders: orders.slice(0, 5),
        lowStockProducts: products.filter(p => p.stock <= 15)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error calculating analytics", error: err.message });
  }
};

