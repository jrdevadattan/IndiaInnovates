const Product = require('../models/Product');
const Order = require('../models/Order');
const Reward = require('../models/Reward');
const Ngo = require('../models/Ngo');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { uploadToCloudinary } = require('../middleware/upload.middleware');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.getProducts = async (req, res) => {
  try {
    const { category, ngoId, page = 1, limit = 20, minPrice, maxPrice } = req.query;
    const query = { isActive: true, stock: { $gt: 0 } };

    if (category) query.category = category;
    if (ngoId) query.ngoId = ngoId;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('ngoId', 'name logo')
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({ success: true, products, total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('ngoId', 'name logo description');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, tags, stock, impactStory } = req.body;

    const ngo = await Ngo.findOne({ adminIds: req.user._id, isVerified: true });
    if (!ngo && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ success: false, message: 'Only verified NGO admins can create products.' });
    }

    const images = [];
    if (req.files?.length) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer, 'lifeline/products');
        images.push(result.secure_url);
      }
    }

    const product = await Product.create({
      ngoId: ngo?._id || req.body.ngoId,
      title, description,
      price: parseFloat(price),
      category,
      tags: typeof tags === 'string' ? JSON.parse(tags) : tags || [],
      stock: parseInt(stock) || 0,
      impactStory,
      images
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.initiateCheckout = async (req, res) => {
  try {
    const { items, shippingAddress, buyerName, buyerEmail, buyerPhone, pointsToRedeem = 0 } = req.body;

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive || product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Product ${item.productId} unavailable.` });
      }
      const subtotal = product.price * item.quantity;
      totalAmount += subtotal;
      validatedItems.push({ productId: product._id, ngoId: product.ngoId, title: product.title, price: product.price, quantity: item.quantity, subtotal });
    }

    // Apply points discount (1 point = ₹0.1)
    let discountAmount = 0;
    if (pointsToRedeem > 0 && req.user) {
      const reward = await Reward.findOne({ userId: req.user._id });
      const maxPoints = Math.min(pointsToRedeem, reward?.balance || 0);
      discountAmount = Math.min(maxPoints * 0.1, totalAmount * 0.5); // max 50% discount
    }

    const finalAmount = Math.max(totalAmount - discountAmount, 1);

    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(finalAmount * 100), // paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    });

    res.json({
      success: true,
      razorpayOrderId: rzpOrder.id,
      amount: finalAmount,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      checkoutData: { items: validatedItems, totalAmount, discountAmount, finalAmount, shippingAddress, buyerName, buyerEmail, buyerPhone, pointsToRedeem: Math.round(discountAmount / 0.1) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, checkoutData } = req.body;

    // Verify payment signature
    const expectedSig = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    const order = await Order.create({
      buyerId: req.user?._id,
      buyerEmail: checkoutData.buyerEmail,
      buyerName: checkoutData.buyerName,
      buyerPhone: checkoutData.buyerPhone,
      items: checkoutData.items,
      totalAmount: checkoutData.totalAmount,
      discountAmount: checkoutData.discountAmount,
      pointsRedeemed: checkoutData.pointsToRedeem,
      finalAmount: checkoutData.finalAmount,
      shippingAddress: checkoutData.shippingAddress,
      payment: { razorpayOrderId, razorpayPaymentId, razorpaySignature, status: 'PAID', paidAt: new Date() },
      status: 'CONFIRMED'
    });

    // Deduct points if redeemed
    if (checkoutData.pointsToRedeem > 0 && req.user) {
      const reward = await Reward.findOne({ userId: req.user._id });
      if (reward) {
        reward.balance -= checkoutData.pointsToRedeem;
        reward.transactions.push({ type: 'REDEEMED', points: checkoutData.pointsToRedeem, reason: 'Marketplace purchase', referenceId: order._id.toString() });
        await reward.save();
      }
    }

    // Decrement stock
    for (const item of checkoutData.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      });
    }

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'title images');
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.markShipped = async (req, res) => {
  try {
    const { trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {
      status: 'SHIPPED',
      trackingNumber,
      shippedAt: new Date()
    }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
