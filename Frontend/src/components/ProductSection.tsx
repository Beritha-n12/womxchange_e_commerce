
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  products: Array<{
    image: string;
    title: string;
    price: string;
    originalPrice?: string;
    rating?: number;
  }>;
}

const ProductSection = ({ title, products }: ProductSectionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.map((product, index) => (
            <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <ProductCard {...product} />
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
        <button className="text-black hover:text-purple-700 border border-gray-400 rounded-md px-4 py-2 transition-all duration-300 transform hover:scale-105">
        View More
      </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
