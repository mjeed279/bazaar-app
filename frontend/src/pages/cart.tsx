import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

// نموذج لسلة التسوق (سيتم استبداله بإدارة حالة حقيقية لاحقاً)
const initialCartItems = [
  {
    id: '1',
    title: 'سماعات بلوتوث لاسلكية',
    price: 199.99,
    originalPrice: 299.99,
    currency: 'SAR',
    imageUrl: 'https://example.com/headphones.jpg',
    quantity: 1
  },
  {
    id: '2',
    title: 'ساعة ذكية متوافقة مع أندرويد وiOS',
    price: 349.99,
    originalPrice: 399.99,
    currency: 'SAR',
    imageUrl: 'https://example.com/smartwatch.jpg',
    quantity: 2
  }
];

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // محاكاة جلب بيانات سلة التسوق من التخزين المحلي أو API
    setCartItems(initialCartItems);
    setLoading(false);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateShipping = () => {
    // نموذج بسيط لحساب تكلفة الشحن
    const subtotal = calculateSubtotal();
    return subtotal > 500 ? 0 : 50;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
          <div className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <Head>
          <title>سلة التسوق | Bazaar</title>
        </Head>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-xl mb-6">سلة التسوق فارغة</p>
            <Link href="/products" className="btn-primary">
              تصفح المنتجات
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>سلة التسوق | Bazaar</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">سلة التسوق</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* قائمة المنتجات في السلة */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-right">المنتج</th>
                    <th className="py-3 px-4 text-center">السعر</th>
                    <th className="py-3 px-4 text-center">الكمية</th>
                    <th className="py-3 px-4 text-center">المجموع</th>
                    <th className="py-3 px-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 relative overflow-hidden rounded">
                            <Image
                              src={item.imageUrl || '/placeholder.png'}
                              alt={item.title}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                          <div className="mr-4">
                            <Link href={`/product/${item.id}`} className="text-primary-600 hover:text-primary-800">
                              {item.title}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <div>
                          <span className="font-bold">{item.price.toFixed(2)} {item.currency}</span>
                          {item.originalPrice > item.price && (
                            <span className="block text-sm text-gray-500 line-through">
                              {item.originalPrice.toFixed(2)} {item.currency}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-300 rounded-r-md flex items-center justify-center"
                          >
                            <FaMinus size={12} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 h-8 border-t border-b border-gray-300 text-center"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-300 rounded-l-md flex items-center justify-center"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center font-bold">
                        {(item.price * item.quantity).toFixed(2)} {item.currency}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* ملخص الطلب */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">ملخص الطلب</h2>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span>المجموع الفرعي</span>
                  <span>{calculateSubtotal().toFixed(2)} SAR</span>
                </div>
                <div className="flex justify-between">
                  <span>الشحن</span>
                  <span>
                    {calculateShipping() === 0 
                      ? 'مجاني' 
                      : `${calculateShipping().toFixed(2)} SAR`}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold">المجموع</span>
                <span className="text-lg font-bold text-primary-600">
                  {calculateTotal().toFixed(2)} SAR
                </span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full btn-primary"
              >
                متابعة الدفع
              </button>
              
              <div className="mt-4">
                <Link href="/products" className="text-primary-600 hover:text-primary-800 text-center block">
                  متابعة التسوق
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
