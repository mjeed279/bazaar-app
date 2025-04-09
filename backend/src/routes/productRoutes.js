// src/routes/productRoutes.js - طرق المنتجات

const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');
const productController = require('../controllers/productController');

/**
 * @route   GET /api/v1/products/search
 * @desc    البحث عن المنتجات
 * @access  عام
 */
router.get('/search', [
  query('keywords').optional().isString().withMessage('يجب أن تكون الكلمات المفتاحية نصية'),
  query('categoryId').optional().isString().withMessage('يجب أن يكون معرف الفئة نصياً'),
  query('page').optional().isInt({ min: 1 }).withMessage('يجب أن تكون الصفحة رقماً صحيحاً أكبر من 0'),
  query('pageSize').optional().isInt({ min: 1, max: 50 }).withMessage('يجب أن يكون حجم الصفحة رقماً صحيحاً بين 1 و 50'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('يجب أن يكون الحد الأدنى للسعر رقماً موجباً'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('يجب أن يكون الحد الأقصى للسعر رقماً موجباً')
], productController.searchProducts);

/**
 * @route   GET /api/v1/products/:productId
 * @desc    الحصول على تفاصيل المنتج
 * @access  عام
 */
router.get('/:productId', [
  param('productId').isString().withMessage('يجب أن يكون معرف المنتج نصياً')
], productController.getProductDetails);

/**
 * @route   GET /api/v1/products/featured
 * @desc    الحصول على المنتجات المميزة
 * @access  عام
 */
router.get('/featured', [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('يجب أن يكون الحد رقماً صحيحاً بين 1 و 50')
], productController.getFeaturedProducts);

/**
 * @route   GET /api/v1/products/category/:categoryId
 * @desc    الحصول على المنتجات حسب الفئة
 * @access  عام
 */
router.get('/category/:categoryId', [
  param('categoryId').isString().withMessage('يجب أن يكون معرف الفئة نصياً'),
  query('page').optional().isInt({ min: 1 }).withMessage('يجب أن تكون الصفحة رقماً صحيحاً أكبر من 0'),
  query('pageSize').optional().isInt({ min: 1, max: 50 }).withMessage('يجب أن يكون حجم الصفحة رقماً صحيحاً بين 1 و 50')
], productController.getProductsByCategory);

module.exports = router;
