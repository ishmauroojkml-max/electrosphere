// ==========================================================================
// Order Controller (Checkout, Orders Tracking & Status Updates)
// ==========================================================================

const { readJson, writeJson } = require('../config/db');
const ORDERS_FILE = 'orders.json';
const PRODUCTS_FILE = 'products.json';

// GET /api/orders
exports.getOrders = (req, res) => {
  const orders = readJson(ORDERS_FILE);
  res.json({ success: true, count: orders.length, data: orders });
};

// POST /api/orders
exports.createOrder = (req, res) => {
  const { customer, items, paymentMethod, paymentDetails, promoCode } = req.body;

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    return res.status(400).json({ success: false, message: "Complete customer details are required." });
  }

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Cart cannot be empty." });
  }

  const products = readJson(PRODUCTS_FILE);
  const orders = readJson(ORDERS_FILE);

  let subtotal = 0;
  const verifiedItems = items.map(cartItem => {
    const prod = products.find(p => p.id === cartItem.id);
    const price = prod ? prod.price : cartItem.price;
    const name = prod ? prod.name : cartItem.name;
    const qty = parseInt(cartItem.qty) || 1;

    subtotal += price * qty;

    // Deduct stock
    if (prod && prod.stock !== undefined) {
      prod.stock = Math.max(0, prod.stock - qty);
    }

    return { id: cartItem.id, name, price, qty };
  });

  writeJson(PRODUCTS_FILE, products);

  // Promo code calculation
  let discount = 0;
  if (promoCode && promoCode.toUpperCase() === 'TECH2026') {
    discount = parseFloat((subtotal * 0.15).toFixed(2));
  }

  const shipping = subtotal >= 500 ? 0 : 25.00;
  const total = parseFloat((subtotal - discount + shipping).toFixed(2));

  const newOrder = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    customer: {
      name: customer.name.trim(),
      email: customer.email ? customer.email.trim() : "",
      phone: customer.phone.trim(),
      address: customer.address.trim()
    },
    items: verifiedItems,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount,
    shipping,
    total,
    paymentMethod: paymentMethod || "Stripe Card (Simulated)",
    paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
    paymentDetails: paymentDetails || null,
    status: "Processing",
    trackingNumber: `TRK-EXPRESS-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  writeJson(ORDERS_FILE, orders);

  console.log(`📦 [New Order Created]: ${newOrder.id} | Total: $${newOrder.total} | Method: ${newOrder.paymentMethod}`);

  res.status(201).json({
    success: true,
    message: "Order placed and confirmed successfully!",
    order: newOrder
  });
};

// PATCH /api/orders/:id/status
exports.updateOrderStatus = (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;
  const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid order status value." });
  }

  const orders = readJson(ORDERS_FILE);
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found." });
  }

  order.status = status;
  writeJson(ORDERS_FILE, orders);
  res.json({ success: true, message: `Order ${orderId} status changed to ${status}.`, order });
};

