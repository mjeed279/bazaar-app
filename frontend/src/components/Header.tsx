import React, { useState } from 'react';
import Link from 'next/link';
import { FaShoppingCart, FaSearch, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-600">
              Bazaar
            </Link>
          </div>

          {/* زر القائمة للموبايل */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>

          {/* القائمة الرئيسية للديسكتوب */}
          <nav className="hidden md:flex space-x-8 space-x-reverse">
            <Link href="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              الرئيسية
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              التصنيفات
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              المنتجات
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary-600 transition-colors">
              من نحن
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-primary-600 transition-colors">
              اتصل بنا
            </Link>
          </nav>

          {/* أيقونات المستخدم للديسكتوب */}
          <div className="hidden md:flex items-center space-x-4 space-x-reverse">
            <button className="text-gray-700 hover:text-primary-600 transition-colors">
              <FaSearch size={20} />
            </button>
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition-colors relative">
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-secondary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
            <Link href="/account" className="text-gray-700 hover:text-primary-600 transition-colors">
              <FaUser size={20} />
            </Link>
          </div>

          {/* أيقونات المستخدم للموبايل */}
          <div className="md:hidden flex items-center space-x-4 space-x-reverse">
            <Link href="/cart" className="text-gray-700 hover:text-primary-600 transition-colors relative">
              <FaShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-secondary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>
        </div>

        {/* القائمة المنسدلة للموبايل */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4 absolute left-4 right-4 z-50">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                التصنيفات
              </Link>
              <Link 
                href="/products" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                من نحن
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                اتصل بنا
              </Link>
              <Link 
                href="/account" 
                className="text-gray-700 hover:text-primary-600 transition-colors py-2 border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                حسابي
              </Link>
              <div className="py-2">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="ابحث عن منتجات..."
                    className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-primary-600"
                  >
                    <FaSearch size={16} />
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
