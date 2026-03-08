const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  buyerEmail: { type: String, required: true },
  buyerName: { type: String, required: true },
  buyerPhone: String,
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ngo' },
    title: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  totalAmount: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  pointsRedeemed: { type: Number, default: 0 },
  finalAmount: { type: Number, required: true },
  shippingAddress: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String
  },
  payment: {
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    status: { type: String, enum: ['PENDING', 'PAID', 'FAILED', 'REFUNDED'], default: 'PENDING' },
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
    default: 'PLACED'
  },
  trackingNumber: String,
  shippedAt: Date,
  deliveredAt: Date
}, { timestamps: true });

orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ 'items.ngoId': 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);
