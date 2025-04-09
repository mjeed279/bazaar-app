import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../utils/api';
import { FaFilter, FaTimes } from 'react-icons/fa';

const SearchPage = () => {
  const router = useRouter();
  const { q: query } = router.query;
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [totalResults, setTotalResults] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    minPrice: '',
    maxPrice: '',
    sortBy: 'relevance',
  });

  React.useEffect(() => {
    if (query) {
      const fetchSearchResults = async () => {
        try {
          setLoading(true);
          const data = await searchProducts(query, currentPage, filters);
          setProducts(data.products || []);
          setTotalResults(data.total || 0);
          setTotalPages(data.totalPages || 1);
        } catch (error) {
          console.error('خطأ في البحث عن المنتجات:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchSearchResults();
    }
  }, [query, currentPage, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
    setCurrentPage(1); // إعادة تعيين الصفحة عند تغيير الفلاتر
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  return (
    <Layout>
      <Head>
        <title>{query ? `نتائج البحث: ${query}` : 'بحث'} | Bazaar</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {query ? `نتائج البحث: "${query}"` : 'بحث'}
            </h1>
            {!loading && (
              <p className="text-gray-600">
                تم العثور على {totalResults} منتج
              </p>
            )}
          </div>

          {/* زر الفلاتر للموبايل */}
          <button
            onClick={toggleFilters}
            className="mt-4 md:hidden btn-outline flex items-center"
          >
            {showFilters ? (
              <>
                <FaTimes className="ml-2" />
                إغلاق الفلاتر
              </>
            ) : (
              <>
                <FaFilter className="ml-2" />
                عرض الفلاتر
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* الفلاتر - دائماً مرئية على الديسكتوب، قابلة للتبديل على الموبايل */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white rounded-lg shadow-md p-6 sticky top-4`}>
            <h2 className="text-lg font-bold mb-4">تصفية النتائج</h2>

            <div className="mb-4">
              <label htmlFor="sortBy" className="block text-gray-700 mb-2">
                ترتيب حسب
              </label>
              <select
                id="sortBy"
                name="sortBy"
                value={filters.sortBy}
                onChange={handleFilterChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="relevance">الأكثر صلة</option>
                <option value="price_asc">السعر: من الأقل إلى الأعلى</option>
                <option value="price_desc">السعر: من الأعلى إلى الأقل</option>
                <option value="rating_desc">التقييم: من الأعلى إلى الأقل</option>
                <option value="orders_desc">الأكثر مبيعاً</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">نطاق السعر</label>
              <div className="flex items-center">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="من"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="mx-2">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="إلى"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setFilters({
                minPrice: '',
                maxPrice: '',
                sortBy: 'relevance',
              })}
              className="w-full btn-outline"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>

          {/* نتائج البحث */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                  <div key={index} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <p className="text-xl mb-6">لم يتم العثور على منتجات مطابقة للبحث</p>
                <p className="text-gray-600 mb-4">جرب البحث بكلمات مختلفة أو تصفح الفئات</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* ترقيم الصفحات */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex items-center">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-r-md mr-1 disabled:opacity-50"
                      >
                        السابق
                      </button>

                      {[...Array(Math.min(5, totalPages))].map((_, index) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = index + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + index;
                        } else {
                          pageNumber = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-1 border border-gray-300 mx-1 ${
                              currentPage === pageNumber
                                ? 'bg-primary-600 text-white'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-l-md ml-1 disabled:opacity-50"
                      >
                        التالي
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SearchPage;
