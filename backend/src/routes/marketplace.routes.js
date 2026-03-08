const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.middleware');
const ctrl = require('../controllers/marketplace.controller');

router.get('/products', ctrl.getProducts);
router.get('/products/:id', ctrl.getProduct);
router.post('/products', protect, upload.array('images', 5), ctrl.createProduct);
router.patch('/products/:id', protect, ctrl.updateProduct);
router.post('/cart/checkout', optionalAuth, ctrl.initiateCheckout);
router.post('/orders', optionalAuth, ctrl.createOrder);
router.get('/orders/mine', protect, ctrl.getMyOrders);
router.patch('/orders/:id/ship', protect, ctrl.markShipped);

module.exports = router;
