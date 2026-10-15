// ==========================================================================
// Payment Controller (Stripe & PayPal Sandbox Gateway)
// ==========================================================================

const { readJson, writeJson } = require('../config/db');

// POST /api/payment/stripe-charge
exports.stripeCharge = (req, res) => {
  try {
    const { amount, cardNumber, cardExpiry, cardCvc, currency = 'USD' } = req.body;

    if (!cardNumber || cardNumber.replace(/\s+/g, '').length < 15) {
      return res.status(400).json({
        success: false,
        message: "Invalid card details. Please verify your Stripe test card (e.g. 4242 4242...)."
      });
    }

    const cleanCard = cardNumber.replace(/\s+/g, '');
    const last4 = cleanCard.slice(-4);
    const brand = cleanCard.startsWith('4') ? 'Visa' : (cleanCard.startsWith('5') ? 'Mastercard' : 'Amex');

    // Simulate Stripe Charge Object
    const charge = {
      id: `ch_stripe_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      object: "charge",
      amount: parseFloat(amount),
      currency: currency.toUpperCase(),
      paid: true,
      status: "succeeded",
      receipt_url: `https://stripe.com/receipts/sandbox/${Date.now()}`,
      payment_method_details: {
        type: "card",
        card: {
          brand,
          last4,
          exp_month: cardExpiry ? cardExpiry.split('/')[0] : "12",
          exp_year: cardExpiry ? cardExpiry.split('/')[1] : "28",
          funding: "credit"
        }
      },
      created: Math.floor(Date.now() / 1000)
    };

    console.log(`💳 [Stripe Sandbox]: Charge Authorized -> ID: ${charge.id} | Amount: $${charge.amount}`);

    return res.status(200).json({
      success: true,
      message: "Stripe sandbox payment authorized successfully!",
      charge
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Stripe gateway error", error: error.message });
  }
};

// POST /api/payment/paypal-capture
exports.paypalCapture = (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const paypalTransaction = {
      captureId: `CAPTURE-PAYPAL-${Date.now()}`,
      status: "COMPLETED",
      orderId: orderId || `PAYPAL-ORD-${Date.now()}`,
      payer: {
        email: "buyer.sandbox@electrosphere.com",
        payerId: "PAYER_SANDBOX_9981"
      },
      amount: { value: parseFloat(amount || 0).toFixed(2), currency: "USD" },
      capturedAt: new Date().toISOString()
    };

    console.log(`🅿️ [PayPal Sandbox]: Captured Payment -> ID: ${paypalTransaction.captureId}`);

    return res.status(200).json({
      success: true,
      message: "PayPal sandbox payment captured successfully!",
      paypalTransaction
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "PayPal gateway error", error: error.message });
  }
};

// GET /api/payment/config - Return client config / public keys
exports.getPaymentConfig = (req, res) => {
  return res.json({
    success: true,
    gateways: {
      stripe: {
        enabled: true,
        publicKey: process.env.STRIPE_PUBLIC_KEY || "pk_test_51MockStripePublicKey2026",
        mode: "sandbox_simulation"
      },
      paypal: {
        enabled: true,
        clientId: process.env.PAYPAL_CLIENT_ID || "sb_client_id_paypal_sandbox_2026",
        mode: "sandbox"
      },
      cod: {
        enabled: true
      }
    }
  });
};

