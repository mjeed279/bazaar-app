import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchCategories } from '../utils/api';

interface Category {
  id: string;
  name: string;
  isLeaf: boolean;
}

const CategoryList: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchCategories();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('خطأ في تحميل الفئات:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Array(6).fill(0).map((_, index) => (
          <div key={index} className="bg-gray-200 animate-pulse h-24 rounded-lg"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.slice(0, 12).map((category) => (
        <Link 
          href={`/category/${category.id}`} 
          key={category.id}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200"
        >
          <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-3 flex items-center justify-center">
            <span className="text-primary-600 text-2xl">{category.name.charAt(0)}</span>
          </div>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{category.name}</h3>
        </Link>
      ))}
      
      <Link 
        href="/categories" 
        className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow duration-200 flex flex-col items-center justify-center"
      >
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-gray-600 text-2xl">+</span>
        </div>
        <h3 className="text-sm font-medium text-gray-800">عرض المزيد</h3>
      </Link>
    </div>
  );
};

export default CategoryList;
