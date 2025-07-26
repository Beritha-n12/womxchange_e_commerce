import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/api/products';

interface ProductSectionProps {
  title: string;
  products: Product[] | undefined | null; // Allow undefined/null for safety
}

const ProductSection = ({ title, products }: ProductSectionProps) => {
  // Log the incoming products for debugging
  console.log('ProductSection received products:', products);

  // Handle if products is not an array
  if (!Array.isArray(products)) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {title}
          </h2>
          <p className="text-center text-gray-500">No products available.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id.toString()}
              image={product.coverImage || 'https://www.shutterstock.com/image-vector/shopping-cart-icon-flat-design-600nw-570153007.jpg'} // Fallback image
              title={product.name}
              price={`${product.price.toLocaleString()} Rwf`}
              rating={product.averageRating || 0}
              numReviews={product.numReviews || 0}
              averageRating={product.averageRating || 0}
              // stock={product.stock || 0}
              availableStock={product.availableStock || 0}
              seller={product.createdBy}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;