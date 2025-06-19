
import ProductCard from './ProductCard';

const RelatedProducts = () => {
  const relatedProducts = [
    {
      image: "https://images.unsplash.com/photo-1594736797933-d0c56ba4faa0?q=80&w=300&h=300&fit=crop",
      title: "T-shirt with Details",
      price: "5000 Rwf",
      rating: 5
    },
    {
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=300&h=300&fit=crop",
      title: "T-shirt with Details",
      price: "5000 Rwf",
      rating: 4
    },
    {
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=300&h=300&fit=crop",
      title: "T-shirt with Details",
      price: "5000 Rwf",
      rating: 5
    },
    {
      image: "https://images.unsplash.com/photo-1594736797933-d0c56ba4faa0?q=80&w=300&h=300&fit=crop",
      title: "T-shirt with Details",
      price: "5000 Rwf",
      rating: 4
    }
  ];

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-8">You might also like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedProducts.map((product, index) => (
          <ProductCard key={index} {...product} />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
