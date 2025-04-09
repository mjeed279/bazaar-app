const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// إنشاء جلسة دفع جديدة
router.post('/create-session', paymentController.createPaymentSession);

// التحقق من حالة الدفع
router.post('/verify', paymentController.verifyPayment);

// معالجة إشعارات webhook من بوابات الدفع
router.post('/webhook/:paymentMethod', paymentController.handlePaymentWebhook);

module.exports = router;
