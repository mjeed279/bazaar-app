// src/config/aliexpressConfig.js - إعدادات واجهة برمجة تطبيقات علي إكسبريس

const dotenv = require('dotenv');
dotenv.config();

const aliexpressConfig = {
  apiKey: process.env.ALIEXPRESS_API_KEY,
  apiSecret: process.env.ALIEXPRESS_API_SECRET,
  trackingId: process.env.ALIEXPRESS_TRACKING_ID,
  apiUrl: process.env.ALIEXPRESS_API_URL || 'https://api.aliexpress.com/v2',
  profitMargin: parseFloat(process.env.PROFIT_MARGIN) || 30
};

module.exports = aliexpressConfig;
