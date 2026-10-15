// ==========================================================================
// Inquiry Controller (3D VIP Landing Page Pre-Orders)
// ==========================================================================

const { readJson, writeJson } = require('../config/db');
const INQUIRIES_FILE = 'inquiries.json';

// POST /api/inquiries
exports.createInquiry = (req, res) => {
  const { name, email, deviceInterest, quantity, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: "Name and email are required." });
  }

  const inquiries = readJson(INQUIRIES_FILE);
  const newInquiry = {
    id: `INQ-${Date.now().toString().slice(-6)}`,
    name: name.trim(),
    email: email.trim(),
    deviceInterest: deviceInterest || "Nexus Pro 16 Ultra 3D",
    quantity: parseInt(quantity) || 1,
    message: message || "General VIP reservation inquiry.",
    createdAt: new Date().toISOString()
  };

  inquiries.unshift(newInquiry);
  writeJson(INQUIRIES_FILE, inquiries);

  console.log(`📱 [3D VIP Inquiry]: ${newInquiry.name} (${newInquiry.email}) -> ${newInquiry.deviceInterest}`);

  res.status(201).json({
    success: true,
    message: "Thank you! Your 3D VIP Inquiry has been registered. Our team will contact you.",
    inquiry: newInquiry
  });
};

// GET /api/inquiries
exports.getInquiries = (req, res) => {
  const inquiries = readJson(INQUIRIES_FILE);
  res.json({ success: true, count: inquiries.length, data: inquiries });
};

