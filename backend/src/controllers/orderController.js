// src/controllers/orderController.js - وحدة التحكم بالطلبات

const aliexpressService = require('../services/aliexpressService');
const { validationResult } = require('express-validator');

/**
 * إنشاء رابط تحويل للمنتج
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.createProductLink = async (req, res) => {
  try {
    // التحقق من صحة المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'معرف المنتج مطلوب'
      });
    }

    // الحصول على تفاصيل المنتج
    const productDetails = await aliexpressService.getProductDetails(productId);
    
    if (!productDetails.products || productDetails.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    // الحصول على رابط المنتج الأصلي
    const originalUrl = productDetails.products[0].promotion_link;

    // إنشاء رابط تحويل مع هامش الربح
    const product = aliexpressService.transformProducts(productDetails.products)[0];

    res.json({
      success: true,
      productId,
      originalUrl,
      bazaarUrl: `/product/${productId}`,
      originalPrice: product.originalPrice,
      bazaarPrice: product.price,
      profitMargin: aliexpressService.profitMargin
    });
  } catch (error) {
    console.error('خطأ في إنشاء رابط المنتج:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء رابط المنتج',
      error: error.message
    });
  }
};

/**
 * تتبع الطلب
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.trackOrder = async (req, res) => {
  try {
    // التحقق من صحة المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { trackingId } = req.params;

    if (!trackingId) {
      return res.status(400).json({
        success: false,
        message: 'معرف التتبع مطلوب'
      });
    }

    // في الإصدار الحالي، نقوم بإرجاع رسالة توضح أن هذه الميزة قيد التطوير
    // لأن واجهة برمجة تطبيقات علي إكسبريس قد لا توفر هذه الوظيفة مباشرة
    res.json({
      success: true,
      trackingId,
      status: 'قيد التطوير',
      message: 'ميزة تتبع الطلبات قيد التطوير. يرجى زيارة موقع علي إكسبريس لتتبع طلبك باستخدام معرف التتبع.'
    });
  } catch (error) {
    console.error('خطأ في تتبع الطلب:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء تتبع الطلب',
      error: error.message
    });
  }
};

/**
 * إنشاء طلب جديد
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.createOrder = async (req, res) => {
  try {
    // التحقق من صحة المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { productId, quantity, customerInfo } = req.body;

    if (!productId || !quantity || !customerInfo) {
      return res.status(400).json({
        success: false,
        message: 'معرف المنتج والكمية ومعلومات العميل مطلوبة'
      });
    }

    // في الإصدار الحالي، نقوم بإرجاع رسالة توضح أن هذه الميزة قيد التطوير
    // لأن إنشاء الطلبات يتطلب تكاملاً مع بوابات الدفع وواجهة برمجة تطبيقات علي إكسبريس
    res.json({
      success: true,
      orderId: `ORDER-${Date.now()}`,
      productId,
      quantity,
      status: 'قيد التطوير',
      message: 'ميزة إنشاء الطلبات قيد التطوير. سيتم توجيهك إلى صفحة الدفع قريباً.'
    });
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء إنشاء الطلب',
      error: error.message
    });
  }
};
