// src/utils/prohibitedProductsFilter.js - تصفية المنتجات الممنوعة في السعودية

/**
 * قائمة بالكلمات المفتاحية للمنتجات الممنوعة في السعودية
 * تم تجميعها من موقع هيئة الزكاة والضريبة والجمارك ومواقع أخرى
 */
const prohibitedKeywords = [
  // منتجات دينية وثقافية
  'صليب', 'cross', 'تماثيل دينية', 'religious statues', 'أصنام', 'idols',
  'مصاحف محرفة', 'altered quran', 'كتب مخالفة للإسلام', 'anti-islamic books',
  
  // منتجات كحولية ومخدرات
  'كحول', 'alcohol', 'خمر', 'wine', 'بيرة', 'beer', 'ويسكي', 'whiskey', 'فودكا', 'vodka',
  'مخدرات', 'drugs', 'حشيش', 'cannabis', 'ماريجوانا', 'marijuana',
  
  // منتجات التبغ الإلكتروني
  'سجائر إلكترونية', 'e-cigarettes', 'vape', 'فيب', 'شيشة إلكترونية', 'electronic hookah',
  
  // أسلحة ومتفجرات
  'سلاح', 'weapon', 'مسدس', 'gun', 'بندقية', 'rifle', 'ذخيرة', 'ammunition',
  'متفجرات', 'explosives', 'ألعاب نارية', 'fireworks',
  
  // منتجات إباحية
  'إباحي', 'pornographic', 'جنسي صريح', 'explicit sexual',
  
  // منتجات القمار
  'قمار', 'gambling', 'روليت', 'roulette', 'آلات القمار', 'slot machines',
  
  // منتجات مقلدة
  'مقلد', 'counterfeit', 'مزيف', 'fake', 'تقليد ماركات', 'brand imitation',
  
  // منتجات التجسس
  'تجسس', 'spy', 'تنصت', 'eavesdropping', 'كاميرا مخفية', 'hidden camera',
  
  // منتجات مخالفة للأنظمة
  'كاسر إشارة', 'signal jammer', 'مكبر إشارة غير مرخص', 'unlicensed signal booster',
  
  // منتجات الحيوانات المحظورة
  'عاج', 'ivory', 'جلد تمساح', 'crocodile skin', 'فراء حيوانات نادرة', 'rare animal fur'
];

/**
 * قائمة بفئات المنتجات الممنوعة في السعودية
 */
const prohibitedCategories = [
  // فئات المنتجات الكحولية
  '100001', // رمز افتراضي لفئة المشروبات الكحولية
  
  // فئات الأسلحة
  '100002', // رمز افتراضي لفئة الأسلحة
  
  // فئات المنتجات الإباحية
  '100003', // رمز افتراضي لفئة المنتجات الإباحية
  
  // فئات منتجات القمار
  '100004' // رمز افتراضي لفئة منتجات القمار
];

/**
 * فحص ما إذا كان المنتج ممنوعاً في السعودية
 * @param {Object} product - بيانات المنتج
 * @returns {boolean} - هل المنتج ممنوع؟
 */
function isProductProhibited(product) {
  // فحص الفئة
  if (prohibitedCategories.includes(product.categoryId)) {
    return true;
  }
  
  // فحص العنوان والوصف
  const textToCheck = `${product.title} ${product.description}`.toLowerCase();
  
  // فحص الكلمات المفتاحية
  for (const keyword of prohibitedKeywords) {
    if (textToCheck.includes(keyword.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

/**
 * تصفية قائمة المنتجات لإزالة المنتجات الممنوعة
 * @param {Array} products - قائمة المنتجات
 * @returns {Array} - قائمة المنتجات بعد التصفية
 */
function filterProhibitedProducts(products) {
  return products.filter(product => !isProductProhibited(product));
}

module.exports = {
  isProductProhibited,
  filterProhibitedProducts,
  prohibitedKeywords,
  prohibitedCategories
};
