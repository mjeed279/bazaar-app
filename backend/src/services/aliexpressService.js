// src/services/aliexpressService.js - خدمات التكامل مع واجهة برمجة تطبيقات علي إكسبريس

const axios = require('axios');
const crypto = require('crypto');
const aliexpressConfig = require('../config/aliexpressConfig');
const { filterProhibitedProducts } = require('../utils/prohibitedProductsFilter');

class AliExpressService {
  constructor() {
    this.apiKey = aliexpressConfig.apiKey;
    this.apiSecret = aliexpressConfig.apiSecret;
    this.trackingId = aliexpressConfig.trackingId;
    this.apiUrl = aliexpressConfig.apiUrl;
    this.profitMargin = aliexpressConfig.profitMargin;
  }

  /**
   * إنشاء توقيع للطلب
   * @param {Object} params - معلمات الطلب
   * @returns {string} - التوقيع المشفر
   */
  generateSignature(params) {
    // ترتيب المعلمات أبجدياً
    const sortedParams = Object.keys(params).sort().reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});

    // تحويل المعلمات إلى سلسلة نصية
    let signStr = '';
    for (const key in sortedParams) {
      signStr += `${key}${sortedParams[key]}`;
    }

    // إضافة المفتاح السري وتشفير السلسلة
    const stringToSign = this.apiSecret + signStr + this.apiSecret;
    return crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase();
  }

  /**
   * إعداد المعلمات الأساسية للطلب
   * @returns {Object} - المعلمات الأساسية
   */
  getBaseParams() {
    return {
      app_key: this.apiKey,
      timestamp: new Date().toISOString(),
      sign_method: 'md5',
      format: 'json',
      v: '2.0',
      tracking_id: this.trackingId
    };
  }

  /**
   * إرسال طلب إلى واجهة برمجة تطبيقات علي إكسبريس
   * @param {string} method - اسم الطريقة
   * @param {Object} params - معلمات الطلب
   * @returns {Promise<Object>} - استجابة الطلب
   */
  async makeRequest(method, params = {}) {
    try {
      const baseParams = this.getBaseParams();
      const requestParams = {
        ...baseParams,
        method,
        ...params
      };

      // إنشاء التوقيع
      requestParams.sign = this.generateSignature(requestParams);

      // إرسال الطلب
      const response = await axios.post(this.apiUrl, null, {
        params: requestParams
      });

      return response.data;
    } catch (error) {
      console.error('خطأ في طلب علي إكسبريس:', error.message);
      throw new Error(`فشل طلب علي إكسبريس: ${error.message}`);
    }
  }

  /**
   * البحث عن المنتجات
   * @param {Object} params - معلمات البحث
   * @returns {Promise<Object>} - نتائج البحث
   */
  async searchProducts(params) {
    return this.makeRequest('aliexpress.affiliate.product.query', params);
  }

  /**
   * الحصول على تفاصيل المنتج
   * @param {string} productId - معرف المنتج
   * @returns {Promise<Object>} - تفاصيل المنتج
   */
  async getProductDetails(productId) {
    return this.makeRequest('aliexpress.affiliate.product.details.get', {
      product_ids: productId
    });
  }

  /**
   * الحصول على فئات المنتجات
   * @returns {Promise<Object>} - فئات المنتجات
   */
  async getCategories() {
    return this.makeRequest('aliexpress.affiliate.category.get');
  }

  /**
   * تطبيق هامش الربح على سعر المنتج
   * @param {number} price - سعر المنتج الأصلي
   * @returns {number} - السعر بعد إضافة هامش الربح
   */
  applyProfitMargin(price) {
    return price * (1 + this.profitMargin / 100);
  }

  /**
   * تحويل منتجات علي إكسبريس إلى تنسيق Bazaar
   * @param {Array} products - منتجات علي إكسبريس
   * @returns {Array} - منتجات Bazaar
   */
  transformProducts(products) {
    // تحويل المنتجات إلى تنسيق Bazaar
    const transformedProducts = products.map(product => ({
      id: product.product_id,
      title: product.product_title,
      description: product.product_description || '',
      originalPrice: product.target_app_sale_price,
      price: this.applyProfitMargin(product.target_app_sale_price),
      currency: product.target_app_sale_price_currency,
      imageUrl: product.product_main_image_url,
      additionalImages: product.product_small_image_urls?.string || [],
      rating: product.evaluation_rating,
      totalOrders: product.target_app_sale_count,
      categoryId: product.category_id,
      originalUrl: product.promotion_link,
      bazaarUrl: `/product/${product.product_id}`,
      specs: product.product_specs || [],
      shippingInfo: product.ship_to_days || 'يرجى الاطلاع على صفحة المنتج للحصول على معلومات الشحن'
    }));
    
    // تصفية المنتجات الممنوعة في السعودية
    return filterProhibitedProducts(transformedProducts);
  }
}

module.exports = new AliExpressService();
