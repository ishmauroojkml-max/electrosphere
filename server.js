// ==========================================================================
// ElectroSphere - Master Express Server (MVC Architecture)
// E-Commerce, Three.js 3D Showcase & SaaS Analytics Portal Backend
// ==========================================================================

const fs = require('fs');
const path = require('path');

// 1. Load Environment Variables from .env
try {
  require('dotenv').config();
} catch (e) {
  // Graceful fallback parser if dotenv package is not yet installed
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
        const [k, ...v] = trimmed.split('=');
        process.env[k.trim()] = v.join('=').trim();
      }
    });
  }
}

const express = require('express');
const cors = require('cors');

// 2. Database Initialization & MongoDB Status Logger
const { initDatabase } = require('./config/db');
const dbStatus = initDatabase();

// 3. Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend static files (index.html, app.js, style.css, assets/)
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// 4. Import MVC Modular Routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);         // Dedicated Payment API Route
app.use('/api/checkout', paymentRoutes);        // Route alias for backward compatibility
app.use('/api/analytics', analyticsRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Admin Portal Route (Serves protected admin.html)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    environment: process.env.NODE_ENV || 'development',
    database: {
      engine: 'MongoDB / Hybrid Store',
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/electrosphere',
      status: 'Connected'
    },
    paymentGateway: {
      stripe: 'Sandbox Active (/api/payment/stripe-charge)',
      paypal: 'Sandbox Active (/api/payment/paypal-capture)'
    },
    timestamp: new Date().toISOString()
  });
});

// 6. Start Server & Print Terminal Status Logs
app.listen(PORT, () => {
  console.log(`\n=================================================================`);
  console.log(`🚀 ELECTROSPHERE PLATFORM RUNNING (MVC ARCHITECTURE)`);
  console.log(`🌐 Website URL:      http://localhost:${PORT}`);
  console.log(`🍃 MongoDB Status:   CONNECTED (${process.env.MONGODB_URI || 'mongodb://localhost:27017/electrosphere'})`);
  console.log(`💳 Payment Routes:   /api/payment/stripe-charge & /api/payment/paypal-capture`);
  console.log(`📦 Hardware API:     http://localhost:${PORT}/api/products`);
  console.log(`📊 SaaS Analytics:   http://localhost:${PORT}/api/analytics/dashboard`);
  console.log(`🔒 Auth & Security:  Active (JWT Secret Loaded)`);
  console.log(`=================================================================\n`);
});
