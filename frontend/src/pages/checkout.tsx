import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FaLock, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

const CheckoutPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'credit_card',
  });
  const [loading, setLoading] = useState(false);

  // نموذج لبيانات سلة التسوق (سيتم استبداله بإدارة حالة حقيقية لاحقاً)
  const cartSummary = {
    subtotal: 899.97,
    shipping: 50,
    total: 949.97,
    items: 3
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // محاكاة إرسال الطلب إلى الخادم
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // محاكاة نجاح الطلب
      router.push('/checkout/success');
    } catch (error) {
      console.error('خطأ في إتمام الطلب:', error);
      setLoading(false);
      alert('حدث خطأ أثناء إتمام الطلب. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <Layout>
      <Head>
        <title>إتمام الطلب | Bazaar</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">إتمام الطلب</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* نموذج الدفع */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit}>
                {/* معلومات الشحن */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">معلومات الشحن</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-gray-700 mb-2">الاسم الكامل</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 mb-2">البريد الإلكتروني</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 mb-2">رقم الهاتف</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-gray-700 mb-2">العنوان</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-gray-700 mb-2">المدينة</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-gray-700 mb-2">الرمز البريدي</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* طرق الدفع */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">طريقة الدفع</h2>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={formData.paymentMethod === 'credit_card'}
                          onChange={handleInputChange}
                          className="ml-2"
                        />
                        <FaCreditCard className="text-primary-600 ml-2" />
                        <span>بطاقة ائتمان</span>
                      </label>
                      
                      {formData.paymentMethod === 'credit_card' && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2">رقم البطاقة</label>
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              className="input w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 mb-2">تاريخ الانتهاء</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="input w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 mb-2">رمز الأمان (CVV)</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="input w-full"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="cash_on_delivery"
                          checked={formData.paymentMethod === 'cash_on_delivery'}
                          onChange={handleInputChange}
                          className="ml-2"
                        />
                        <FaMoneyBill className="text-primary-600 ml-2" />
                        <span>الدفع عند الاستلام</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      جاري إتمام الطلب...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FaLock className="ml-2" />
                      إتمام الطلب
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* ملخص الطلب */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>عدد المنتجات</span>
                  <span>{cartSummary.items}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>المجموع الفرعي</span>
                  <span>{cartSummary.subtotal.toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span>
                    {cartSummary.shipping === 0 
                      ? 'مجاني' 
                      : `${cartSummary.shipping.toFixed(2)} SAR`}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">المجموع</span>
                <span className="text-lg font-bold text-primary-600">
                  {cartSummary.total.toFixed(2)} SAR
                </span>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  <FaLock className="inline ml-1 text-green-600" />
                  جميع المعاملات آمنة ومشفرة
                </p>
                <p>
                  بالضغط على "إتمام الطلب"، فإنك توافق على 
                  <a href="/terms" className="text-primary-600 hover:text-primary-800 mx-1">شروط الاستخدام</a>
                  و
                  <a href="/privacy" className="text-primary-600 hover:text-primary-800 mx-1">سياسة الخصوصية</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
