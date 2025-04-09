import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  currency: string;
  imageUrl: string;
  rating?: number;
  totalOrders?: number;
}

interface FeaturedProductsProps {
  products: Product[];
  loading: boolean;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, index) => (
          <div key={index} className="bg-gray-200 animate-pulse h-80 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد منتجات مميزة حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default FeaturedProducts;
