// src/controllers/productController.js - وحدة التحكم بالمنتجات

const aliexpressService = require('../services/aliexpressService');
const { validationResult } = require('express-validator');

/**
 * البحث عن المنتجات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.searchProducts = async (req, res) => {
  try {
    // التحقق من صحة المدخلات
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      keywords, 
      categoryId, 
      page = 1, 
      pageSize = 20,
      sort = 'SALE_PRICE_ASC',
      minPrice,
      maxPrice,
      shipToCountry = 'SA' // السعودية كدولة افتراضية
    } = req.query;

    // إعداد معلمات البحث
    const searchParams = {
      keywords,
      page_no: page,
      page_size: pageSize,
      sort_by: sort,
      ship_to_country: shipToCountry,
      target_currency: 'SAR', // الريال السعودي كعملة افتراضية
      target_language: 'ar' // اللغة العربية كلغة افتراضية
    };

    // إضافة معلمات اختيارية
    if (categoryId) searchParams.category_ids = categoryId;
    if (minPrice) searchParams.min_sale_price = minPrice;
    if (maxPrice) searchParams.max_sale_price = maxPrice;

    // البحث عن المنتجات
    const response = await aliexpressService.searchProducts(searchParams);
    
    // تحويل المنتجات إلى تنسيق Bazaar
    const products = aliexpressService.transformProducts(response.products || []);

    res.json({
      success: true,
      totalResults: response.total_record_count || 0,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      products
    });
  } catch (error) {
    console.error('خطأ في البحث عن المنتجات:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء البحث عن المنتجات',
      error: error.message
    });
  }
};

/**
 * الحصول على تفاصيل المنتج
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'معرف المنتج مطلوب'
      });
    }

    // الحصول على تفاصيل المنتج
    const response = await aliexpressService.getProductDetails(productId);
    
    if (!response.products || response.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'المنتج غير موجود'
      });
    }

    // تحويل المنتج إلى تنسيق Bazaar
    const product = aliexpressService.transformProducts(response.products)[0];

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('خطأ في الحصول على تفاصيل المنتج:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحصول على تفاصيل المنتج',
      error: error.message
    });
  }
};

/**
 * الحصول على المنتجات المميزة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // إعداد معلمات البحث للمنتجات المميزة
    const searchParams = {
      page_no: 1,
      page_size: limit,
      sort_by: 'SALE_PRICE_ASC',
      ship_to_country: 'SA',
      target_currency: 'SAR',
      target_language: 'ar'
    };

    // البحث عن المنتجات المميزة
    const response = await aliexpressService.searchProducts(searchParams);
    
    // تحويل المنتجات إلى تنسيق Bazaar
    const products = aliexpressService.transformProducts(response.products || []);

    res.json({
      success: true,
      products
    });
  } catch (error) {
    console.error('خطأ في الحصول على المنتجات المميزة:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحصول على المنتجات المميزة',
      error: error.message
    });
  }
};

/**
 * الحصول على المنتجات حسب الفئة
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { page = 1, pageSize = 20 } = req.query;

    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: 'معرف الفئة مطلوب'
      });
    }

    // إعداد معلمات البحث
    const searchParams = {
      category_ids: categoryId,
      page_no: page,
      page_size: pageSize,
      ship_to_country: 'SA',
      target_currency: 'SAR',
      target_language: 'ar'
    };

    // البحث عن المنتجات حسب الفئة
    const response = await aliexpressService.searchProducts(searchParams);
    
    // تحويل المنتجات إلى تنسيق Bazaar
    const products = aliexpressService.transformProducts(response.products || []);

    res.json({
      success: true,
      totalResults: response.total_record_count || 0,
      currentPage: parseInt(page),
      pageSize: parseInt(pageSize),
      products
    });
  } catch (error) {
    console.error('خطأ في الحصول على المنتجات حسب الفئة:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحصول على المنتجات حسب الفئة',
      error: error.message
    });
  }
};
