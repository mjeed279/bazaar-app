import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// إنشاء نسخة من axios مع الإعدادات الافتراضية
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// وظائف API للمنتجات
export const fetchFeaturedProducts = async () => {
  try {
    const response = await api.get('/products/featured');
    return response.data.products || [];
  } catch (error) {
    console.error('خطأ في جلب المنتجات المميزة:', error);
    return [];
  }
};

export const searchProducts = async (query, page = 1, filters = {}) => {
  try {
    const params = {
      keywords: query,
      page,
      ...filters,
    };
    
    const response = await api.get('/products/search', { params });
    return response.data;
  } catch (error) {
    console.error('خطأ في البحث عن المنتجات:', error);
    throw error;
  }
};

export const getProductDetails = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}`);
    return response.data.product;
  } catch (error) {
    console.error('خطأ في جلب تفاصيل المنتج:', error);
    throw error;
  }
};

// وظائف API للفئات
export const fetchCategories = async () => {
  try {
    const response = await api.get('/categories/main');
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الفئات:', error);
    return { categories: [] };
  }
};

export const fetchSubCategories = async (parentId) => {
  try {
    const response = await api.get(`/categories/sub/${parentId}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب الفئات الفرعية:', error);
    return { categories: [] };
  }
};

export const fetchProductsByCategory = async (categoryId, page = 1) => {
  try {
    const response = await api.get(`/products/category/${categoryId}`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('خطأ في جلب منتجات الفئة:', error);
    throw error;
  }
};

// وظائف API للطلبات
export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('خطأ في إنشاء الطلب:', error);
    throw error;
  }
};

export const trackOrder = async (trackingId) => {
  try {
    const response = await api.get(`/orders/track/${trackingId}`);
    return response.data;
  } catch (error) {
    console.error('خطأ في تتبع الطلب:', error);
    throw error;
  }
};

export default api;
