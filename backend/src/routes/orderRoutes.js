// src/routes/orderRoutes.js - طرق الطلبات

const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const orderController = require('../controllers/orderController');

/**
 * @route   GET /api/v1/orders/link/:productId
 * @desc    إنشاء رابط تحويل للمنتج
 * @access  عام
 */
router.get('/link/:productId', [
  param('productId').isString().withMessage('يجب أن يكون معرف المنتج نصياً')
], orderController.createProductLink);

/**
 * @route   GET /api/v1/orders/track/:trackingId
 * @desc    تتبع الطلب
 * @access  عام
 */
router.get('/track/:trackingId', [
  param('trackingId').isString().withMessage('يجب أن يكون معرف التتبع نصياً')
], orderController.trackOrder);

/**
 * @route   POST /api/v1/orders
 * @desc    إنشاء طلب جديد
 * @access  عام
 */
router.post('/', [
  body('productId').isString().withMessage('يجب أن يكون معرف المنتج نصياً'),
  body('quantity').isInt({ min: 1 }).withMessage('يجب أن تكون الكمية رقماً صحيحاً أكبر من 0'),
  body('customerInfo').isObject().withMessage('يجب أن تكون معلومات العميل كائناً')
], orderController.createOrder);

module.exports = router;
