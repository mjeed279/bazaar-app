import Head from 'next/head';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import CategoryList from '../components/CategoryList';
import FeaturedProducts from '../components/FeaturedProducts';
import SearchBar from '../components/SearchBar';
import { fetchFeaturedProducts } from '../utils/api';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const products = await fetchFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error('خطأ في تحميل المنتجات المميزة:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <Layout>
      <Head>
        <title>Bazaar - متجر التسوق الإلكتروني</title>
        <meta name="description" content="تسوق أفضل المنتجات من علي إكسبريس بأسعار منافسة" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <section className="hero-section bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-lg p-8 mb-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">أهلاً بك في Bazaar</h1>
            <p className="text-xl mb-6">اكتشف آلاف المنتجات بأسعار منافسة وشحن مباشر إلى السعودية</p>
            <SearchBar />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">تصفح حسب الفئات</h2>
          <CategoryList />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">منتجات مميزة</h2>
          <FeaturedProducts products={featuredProducts} loading={loading} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">وصل حديثاً</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {loading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
              ))
            ) : (
              featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
