// src/index.js - نقطة الدخول الرئيسية للتطبيق

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// تحميل متغيرات البيئة
dotenv.config();

// استيراد الطرق
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderRoutes = require('./routes/orderRoutes');

// إنشاء تطبيق Express
const app = express();

// الإعدادات الأساسية
const PORT = process.env.PORT || 5000;
const API_PREFIX = process.env.API_PREFIX || '/api/v1';

// الوسائط (Middleware)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// الطرق
app.use(`${API_PREFIX}/products`, productRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/orders`, orderRoutes);

// طريق الاختبار الأساسي
app.get('/', (req, res) => {
  res.json({
    message: 'مرحباً بك في واجهة برمجة تطبيقات Bazaar',
    version: '1.0.0',
    status: 'active'
  });
});

// التعامل مع الطرق غير الموجودة
app.use((req, res) => {
  res.status(404).json({
    error: 'الطريق غير موجود'
  });
});

// التعامل مع الأخطاء
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'خطأ في الخادم',
    message: err.message
  });
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`واجهة برمجة التطبيقات متاحة على ${API_PREFIX}`);
});

module.exports = app;
