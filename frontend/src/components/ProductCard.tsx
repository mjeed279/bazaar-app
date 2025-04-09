import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    originalPrice: number;
    currency: string;
    imageUrl: string;
    rating?: number;
    totalOrders?: number;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = product.originalPrice > 0 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <div className="card group h-full flex flex-col">
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative overflow-hidden aspect-square">
          {product.imageUrl ? (
            <Image 
              src={product.imageUrl} 
              alt={product.title}
              width={300}
              height={300}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">لا توجد صورة</span>
            </div>
          )}
          
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-secondary-600 text-white text-xs font-bold px-2 py-1 rounded">
              خصم {discount}%
            </div>
          )}
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 line-clamp-2 mb-2 flex-grow">
            {product.title}
          </h3>
          
          <div className="flex items-center justify-between mt-auto">
            <div>
              <span className="text-sm sm:text-base md:text-lg font-bold text-primary-600">
                {product.price.toFixed(2)} {product.currency}
              </span>
              
              {discount > 0 && (
                <span className="text-xs sm:text-sm text-gray-500 line-through mr-2">
                  {product.originalPrice.toFixed(2)} {product.currency}
                </span>
              )}
            </div>
            
            {product.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">★</span>
                <span className="text-xs sm:text-sm text-gray-600">{product.rating}</span>
              </div>
            )}
          </div>
          
          {product.totalOrders && (
            <div className="mt-2 text-xs sm:text-sm text-gray-500">
              {product.totalOrders}+ طلب
            </div>
          )}
          
          <button className="mt-4 w-full btn-primary text-sm sm:text-base">
            إضافة للسلة
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
