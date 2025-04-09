// src/controllers/categoryController.js - وحدة التحكم بالفئات

const aliexpressService = require('../services/aliexpressService');

/**
 * الحصول على جميع الفئات
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.getAllCategories = async (req, res) => {
  try {
    // الحصول على الفئات من علي إكسبريس
    const response = await aliexpressService.getCategories();
    
    if (!response.categories || !response.categories.category_list) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على فئات'
      });
    }

    // تحويل الفئات إلى تنسيق أبسط
    const categories = response.categories.category_list.map(category => ({
      id: category.category_id,
      name: category.category_name,
      level: category.category_level,
      parentId: category.parent_category_id || null,
      isLeaf: category.is_leaf_category === 'true'
    }));

    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('خطأ في الحصول على الفئات:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحصول على الفئات',
      error: error.message
    });
  }
};

/**
 * الحصول على الفئات الرئيسية
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.getMainCategories = async (req, res) => {
  try {
    // الحصول على الفئات من علي إكسبريس
    const response = await aliexpressService.getCategories();
    
    if (!response.categories || !response.categories.category_list) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على فئات'
      });
    }

    // تصفية الفئات الرئيسية (المستوى الأول)
    const mainCategories = response.categories.category_list
      .filter(category => category.category_level === '1')
      .map(category => ({
        id: category.category_id,
        name: category.category_name,
        level: category.category_level,
        parentId: null,
        isLeaf: category.is_leaf_category === 'true'
      }));

    res.json({
      success: true,
      categories: mainCategories
    });
  } catch (error) {
    console.error('خطأ في الحصول على الفئات الرئيسية:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحصول على الفئات الرئيسية',
      error: error.message
    });
  }
};

/**
 * الحصول على الفئات الفرعية
 * @param {Object} req - طلب HTTP
 * @param {Object} res - استجابة HTTP
 */
exports.getSubCategories = async (req, res) => {
  try {
    const { parentId } = req.params;

    if (!parentId) {
      return res.status(400).json({
        success: false,
        message: 'معرف الفئة الأم مطلوب'
      });
    }

    // الحصول على الفئات من علي إكسبريس
    const response = await aliexpressService.getCategories();
    
    if (!response.categories || !response.categories.category_list) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على فئات'
      });
    }

    // تصفية الفئات الفرعية
    const subCategories = response.categories.category_list
      .filter(category => category.parent_category_id === parentId)
      .map(category => ({
        id: category.category_id,
        name: category.category_name,
        level: category.category_level,
        parentId: category.parent_category_id,
        isLeaf: category.is_leaf_category === 'true'
      }));

    res.json({
      success: true,
      parentId,
      categories: subCategories
    });
  } catch (error) {
    console.error('خطأ في الحصول على الفئات الفرعية:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ أثناء الحصول على الفئات الفرعية',
      error: error.message
    });
  }
};
