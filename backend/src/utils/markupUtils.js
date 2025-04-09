const MARKUP_PERCENTAGE = 30;

/**
 * حساب السعر بعد إضافة هامش الربح
 * @param {number} originalPrice - السعر الأصلي
 * @returns {number} - السعر بعد إضافة هامش الربح
 */
const calculatePriceWithMarkup = (originalPrice) => {
  if (!originalPrice || isNaN(originalPrice)) return 0;
  
  const markup = (originalPrice * MARKUP_PERCENTAGE) / 100;
  return originalPrice + markup;
};

/**
 * تحويل منتج من تنسيق علي إكسبريس إلى تنسيق Bazaar مع إضافة هامش الربح
 * @param {Object} product - بيانات المنتج من علي إكسبريس
 * @returns {Object} - بيانات المنتج بتنسيق Bazaar مع هامش الربح
 */
const transformProductWithMarkup = (product) => {
  if (!product) return null;
  
  const originalPrice = parseFloat(product.price);
  const priceWithMarkup = calculatePriceWithMarkup(originalPrice);
  
  return {
    ...product,
    originalPrice: originalPrice,
    price: priceWithMarkup,
    priceBeforeMarkup: originalPrice, // للاستخدام الداخلي فقط، لا يظهر للمستخدم
    markupPercentage: MARKUP_PERCENTAGE, // للاستخدام الداخلي فقط، لا يظهر للمستخدم
  };
};

/**
 * تحويل قائمة منتجات من تنسيق علي إكسبريس إلى تنسيق Bazaar مع إضافة هامش الربح
 * @param {Array} products - قائمة المنتجات من علي إكسبريس
 * @returns {Array} - قائمة المنتجات بتنسيق Bazaar مع هامش الربح
 */
const transformProductsWithMarkup = (products) => {
  if (!products || !Array.isArray(products)) return [];
  
  return products.map(product => transformProductWithMarkup(product));
};

/**
 * حساب تفاصيل الطلب مع هامش الربح
 * @param {Array} items - عناصر الطلب
 * @param {number} shippingCost - تكلفة الشحن
 * @returns {Object} - تفاصيل الطلب مع هامش الربح
 */
const calculateOrderDetails = (items, shippingCost = 0) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return {
      subtotal: 0,
      shipping: shippingCost,
      total: shippingCost,
      originalSubtotal: 0,
      markup: 0,
    };
  }
  
  // حساب المجموع الفرعي بعد إضافة هامش الربح
  const subtotal = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // حساب المجموع الفرعي الأصلي (قبل هامش الربح)
  const originalSubtotal = items.reduce((total, item) => {
    return total + ((item.originalPrice || item.priceBeforeMarkup || (item.price / (1 + MARKUP_PERCENTAGE / 100))) * item.quantity);
  }, 0);
  
  // حساب قيمة هامش الربح
  const markup = subtotal - originalSubtotal;
  
  return {
    subtotal: subtotal,
    shipping: shippingCost,
    total: subtotal + shippingCost,
    originalSubtotal: originalSubtotal, // للاستخدام الداخلي فقط، لا يظهر للمستخدم
    markup: markup, // للاستخدام الداخلي فقط، لا يظهر للمستخدم
  };
};

/**
 * تحويل طلب من Bazaar إلى تنسيق علي إكسبريس (إزالة هامش الربح)
 * @param {Object} order - بيانات الطلب من Bazaar
 * @returns {Object} - بيانات الطلب بتنسيق علي إكسبريس
 */
const transformOrderToAliexpress = (order) => {
  if (!order) return null;
  
  // تحويل عناصر الطلب إلى تنسيق علي إكسبريس (إزالة هامش الربح)
  const transformedItems = order.items.map(item => {
    const originalPrice = item.originalPrice || item.priceBeforeMarkup || (item.price / (1 + MARKUP_PERCENTAGE / 100));
    
    return {
      ...item,
      price: originalPrice,
      // إزالة الحقول الخاصة بهامش الربح
      originalPrice: undefined,
      priceBeforeMarkup: undefined,
      markupPercentage: undefined,
    };
  });
  
  return {
    ...order,
    items: transformedItems,
    // استخدام المجموع الفرعي الأصلي (قبل هامش الربح)
    subtotal: order.originalSubtotal || (order.subtotal / (1 + MARKUP_PERCENTAGE / 100)),
    total: (order.originalSubtotal || (order.subtotal / (1 + MARKUP_PERCENTAGE / 100))) + order.shipping,
    // إزالة الحقول الخاصة بهامش الربح
    originalSubtotal: undefined,
    markup: undefined,
  };
};

module.exports = {
  MARKUP_PERCENTAGE,
  calculatePriceWithMarkup,
  transformProductWithMarkup,
  transformProductsWithMarkup,
  calculateOrderDetails,
  transformOrderToAliexpress,
};
