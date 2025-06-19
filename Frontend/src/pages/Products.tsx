
import { useState } from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

const Products = () => {
  const [priceRange, setPriceRange] = useState([5000, 3000000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const products = [
    {
      image: "/Head Phone.jpeg",
      title: "Wireless Headphones",
      price: "15,000 Rwf",
      rating: 5
    },
    {
      image: "/Jordan1.jpeg",
      title: "Jordan 1 Shoes",
      price: "25,000 Rwf",
      rating: 5
    },
    {
      image: "/Shoulder Bag.jpeg",
      title: "Shoulder Bag",
      price: "18,000 Rwf",
      rating: 5
    },
    {
      image: "/BRUCEGAO.jpeg",
      title: "BRUCEGAO's Alligator Bag",
      price: "20,000 Rwf",
      rating: 5
    },
    {
      image: "/Trivet Set.jpeg",
      title: "Trivet Set",
      price: "45,000 Rwf",
      rating: 5
    },
    {
      image: "/Dress.jpeg",
      title: "Dress",
      price: "30,000 Rwf",
      rating: 5
    },
    {
      image: "/Samba.jpeg",
      title: "Samba",
      price: "12,000 Rwf",
      rating: 5
    },
    {
      image: "/flat shoes.jpeg",
      title: "Flat Shoes",
      price: "5,000 Rwf",
      rating: 5
    }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg border">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Filters</h2>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>T-shirt</span>
                    <span className="text-gray-500">3</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Dress</span>
                    <span className="text-gray-500">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shoes</span>
                    <span className="text-gray-500">1</span>
                  </div>
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Price</h3>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-20 px-2 py-1 border rounded text-sm"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-24 px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Size Filter */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Size</h3>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`px-3 py-2 text-xs border rounded ${
                        selectedSizes.includes(size)
                          ? 'bg-purple text-white border-purple'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-purple'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-purple hover:bg-purple-600 text-white">
                Filter
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {products.map((product, index) => (
                <ProductCard key={index} {...product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-purple">
                Previous
              </button>
              
              <button className="w-8 h-8 bg-purple text-white text-sm rounded">
                1
              </button>
              <button className="w-8 h-8 text-sm text-gray-700 hover:text-purple">
                2
              </button>
              <button className="w-8 h-8 text-sm text-gray-700 hover:text-purple">
                3
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="w-8 h-8 text-sm text-gray-700 hover:text-purple">
                67
              </button>
              <button className="w-8 h-8 text-sm text-gray-700 hover:text-purple">
                68
              </button>
              
              <button className="px-3 py-2 text-sm text-gray-500 hover:text-purple">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Products;
