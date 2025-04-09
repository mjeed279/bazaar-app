import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../../components/Layout';
import { getProductDetails } from '../../utils/api';
import { FaShoppingCart, FaHeart, FaShare, FaStar } from 'react-icons/fa';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const productData = await getProductDetails(id);
          setProduct(productData);
          setLoading(false);
        } catch (error) {
          console.error('خطأ في جلب تفاصيل المنتج:', error);
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    // سيتم تنفيذ هذه الوظيفة لاحقاً مع إدارة حالة سلة التسوق
    console.log('إضافة إلى السلة:', { product, quantity });
    alert('تمت إضافة المنتج إلى سلة التسوق');
  };

  const handleBuyNow = () => {
    // سيتم تنفيذ هذه الوظيفة لاحقاً مع نظام الدفع
    console.log('شراء الآن:', { product, quantity });
    router.push('/checkout');
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-12 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-12 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <p className="mb-6">عذراً، لم نتمكن من العثور على المنتج المطلوب.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            العودة إلى الصفحة الرئيسية
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{product.title} | Bazaar</title>
        <meta name="description" content={product.description.substring(0, 160)} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* صور المنتج */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
              <Image
                src={product.imageUrl || product.additionalImages[selectedImage] || '/placeholder.png'}
                alt={product.title}
                width={600}
                height={600}
                className="object-contain w-full h-full"
              />
            </div>

            {/* معرض الصور المصغرة */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex space-x-2 space-x-reverse overflow-x-auto">
                {[product.imageUrl, ...product.additionalImages].map((image, index) => (
                  <div
                    key={index}
                    className={`w-20 h-20 cursor-pointer border-2 rounded ${
                      selectedImage === index ? 'border-primary-600' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={image || '/placeholder.png'}
                      alt={`${product.title} - صورة ${index + 1}`}
                      width={80}
                      height={80}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* تفاصيل المنتج */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
            
            {/* التقييم */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={star <= Math.round(product.rating) ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-gray-600 mr-2">{product.rating}</span>
                {product.totalOrders && (
                  <span className="text-gray-500">({product.totalOrders}+ طلب)</span>
                )}
              </div>
            )}

            {/* السعر */}
            <div className="mb-6">
              <span className="text-3xl font-bold text-primary-600">
                {product.price.toFixed(2)} {product.currency}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-gray-500 line-through mr-2">
                    {product.originalPrice.toFixed(2)} {product.currency}
                  </span>
                  <span className="text-secondary-600 font-bold mr-2">
                    خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                  </span>
                </>
              )}
            </div>

            {/* الوصف */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">الوصف</h2>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {/* معلومات الشحن */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">معلومات الشحن</h2>
              <p className="text-gray-700">{product.shippingInfo}</p>
            </div>

            {/* الكمية */}
            <div className="mb-6">
              <h2 className="text-lg font-bold mb-2">الكمية</h2>
              <div className="flex items-center">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 border border-gray-300 rounded-r-md flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 h-10 border-t border-b border-gray-300 text-center"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 border border-gray-300 rounded-l-md flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* أزرار الشراء */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                className="btn-outline flex items-center justify-center"
              >
                <FaShoppingCart className="ml-2" />
                إضافة للسلة
              </button>
              <button
                onClick={handleBuyNow}
                className="btn-primary flex items-center justify-center"
              >
                شراء الآن
              </button>
            </div>

            {/* أزرار إضافية */}
            <div className="flex justify-between mt-6">
              <button className="text-gray-600 flex items-center">
                <FaHeart className="ml-1" />
                إضافة للمفضلة
              </button>
              <button className="text-gray-600 flex items-center">
                <FaShare className="ml-1" />
                مشاركة
              </button>
            </div>
          </div>
        </div>

        {/* المواصفات */}
        {product.specs && product.specs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">المواصفات</h2>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <tbody>
                  {product.specs.map((spec, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-3 px-4 border-b border-gray-200 font-medium">{spec.name}</td>
                      <td className="py-3 px-4 border-b border-gray-200">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
