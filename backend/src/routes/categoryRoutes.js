// src/routes/categoryRoutes.js - طرق الفئات

const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const categoryController = require('../controllers/categoryController');

/**
 * @route   GET /api/v1/categories
 * @desc    الحصول على جميع الفئات
 * @access  عام
 */
router.get('/', categoryController.getAllCategories);

/**
 * @route   GET /api/v1/categories/main
 * @desc    الحصول على الفئات الرئيسية
 * @access  عام
 */
router.get('/main', categoryController.getMainCategories);

/**
 * @route   GET /api/v1/categories/sub/:parentId
 * @desc    الحصول على الفئات الفرعية
 * @access  عام
 */
router.get('/sub/:parentId', [
  param('parentId').isString().withMessage('يجب أن يكون معرف الفئة الأم نصياً')
], categoryController.getSubCategories);

module.exports = router;
