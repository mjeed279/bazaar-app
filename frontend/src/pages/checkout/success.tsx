import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { FaCheckCircle, FaBoxOpen, FaHome, FaShoppingBag } from 'react-icons/fa';

const CheckoutSuccessPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  
  // إنشاء معرف طلب افتراضي إذا لم يتم توفيره
  const displayOrderId = orderId || `ORD-${Math.floor(Math.random() * 1000000)}`;

  return (
    <Layout>
      <Head>
        <title>تم إتمام الطلب بنجاح | Bazaar</title>
      </Head>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 mb-6">
            <FaCheckCircle size={80} className="mx-auto" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">تم إتمام الطلب بنجاح!</h1>
          
          <p className="text-xl mb-6">
            شكراً لك على طلبك. تم استلام طلبك وسيتم معالجته قريباً.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold mb-4">تفاصيل الطلب</h2>
            
            <div className="flex justify-between mb-2">
              <span className="font-medium">رقم الطلب:</span>
              <span>{displayOrderId}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="font-medium">تاريخ الطلب:</span>
              <span>{new Date().toLocaleDateString('ar-SA')}</span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="font-medium">حالة الطلب:</span>
              <span className="text-green-600">تم الاستلام</span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">طريقة الدفع:</span>
              <span>بطاقة ائتمان</span>
            </div>
          </div>
          
          <p className="mb-8">
            تم إرسال تفاصيل الطلب إلى بريدك الإلكتروني. يمكنك تتبع حالة طلبك من خلال حسابك.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/" className="btn-primary flex items-center justify-center">
              <FaHome className="ml-2" />
              العودة للرئيسية
            </Link>
            
            <Link href="/products" className="btn-outline flex items-center justify-center">
              <FaShoppingBag className="ml-2" />
              متابعة التسوق
            </Link>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold mb-4">ماذا يحدث بعد ذلك؟</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4">
                <div className="text-primary-600 mb-2">
                  <FaCheckCircle size={24} className="mx-auto" />
                </div>
                <h4 className="font-bold mb-2">تأكيد الطلب</h4>
                <p className="text-sm text-gray-600">تم تأكيد طلبك وسيتم معالجته قريباً</p>
              </div>
              
              <div className="p-4">
                <div className="text-primary-600 mb-2">
                  <FaBoxOpen size={24} className="mx-auto" />
                </div>
                <h4 className="font-bold mb-2">شحن الطلب</h4>
                <p className="text-sm text-gray-600">سيتم شحن طلبك خلال 1-3 أيام عمل</p>
              </div>
              
              <div className="p-4">
                <div className="text-primary-600 mb-2">
                  <FaHome size={24} className="mx-auto" />
                </div>
                <h4 className="font-bold mb-2">استلام الطلب</h4>
                <p className="text-sm text-gray-600">سيصلك طلبك خلال 7-14 يوم عمل</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutSuccessPage;
