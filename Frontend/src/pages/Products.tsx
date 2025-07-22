
import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { getProducts } from '@/api/products';
import { getCategories } from '@/api/categories';
import { ProductFilters } from '@/components/filters/ProductFilters';
import { Search, Filter, Star, ShoppingCart, ChevronLeft, ChevronRight, User, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import  useCart  from '@/hooks/useCart';
import { useCartStatus } from '@/hooks/useCartStatus';

const Products = () => {
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const { isInCart, getCartItemQuantity } = useCartStatus();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });
  const itemsPerPage = 8;

  // Get filters from URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const sellerParam = searchParams.get('seller');
    const searchParam = searchParams.get('search');
    
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    if (sellerParam) {
      setSelectedSeller(sellerParam);
    }
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  const { data: productsData, isLoading: productsLoading, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const products = productsData?.data || [];
  const categories = categoriesData?.data || [];

  // Enhanced filter logic with price and date filtering
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || 
                           product.categoryId.toString() === categoryFilter;
    
    const matchesSeller = !selectedSeller ||
                         product.createdById?.toString() === selectedSeller;
    
    // Date filter logic
    const productDate = new Date(product.createdAt);
    const now = new Date();
    let matchesDate = dateFilter === 'all' ||
      (dateFilter === 'today' && productDate.toDateString() === now.toDateString()) ||
      (dateFilter === 'week' && productDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === 'month' && productDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
    
    // Handle custom date range
    if (dateFilter.startsWith('custom-')) {
      const [, startDate, endDate] = dateFilter.split('-');
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // Include full end date
        matchesDate = productDate >= start && productDate <= end;
      }
    }
    
    // Price filter logic
    const matchesPrice = priceFilter.min === 0 && priceFilter.max === Infinity ||
                        (product.price >= priceFilter.min && product.price <= priceFilter.max);
    
    return matchesSearch && matchesCategory && matchesSeller && matchesDate && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'name':
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategory('');
      setSearchParams({});
    } else {
      setSelectedCategory(categoryId);
      setSearchParams({ category: categoryId });
    }
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (productId: number) => {
    addToCart({ productId, quantity: 1 });
  };

  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">Failed to load products</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our amazing collection of products
          </p>
        </div>

        {/* Filters */}
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          categoryFilter={categoryFilter}
          onCategoryChange={(value) => {
            setCategoryFilter(value);
            if (value === 'all') {
              setSelectedCategory('');
            } else {
              setSelectedCategory(value);
            }
            setCurrentPage(1);
          }}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          categories={categories}
          priceFilter={priceFilter}
          onPriceChange={(min, max) => {
            setPriceFilter({ min, max });
            setCurrentPage(1);
          }}
        />

        {/* Active Filters */}
        {(selectedCategory || searchTerm) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {selectedCategory && (
              <Badge variant="secondary" className="px-3 py-1">
                Category: {categories.find(c => c.id.toString() === selectedCategory)?.name}
                <button
                  onClick={() => handleCategoryChange('')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary" className="px-3 py-1">
                Search: "{searchTerm}"
                <button
                  onClick={() => handleSearchChange('')}
                  className="ml-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            )}
          </div>
        )}

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-600">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        {/* Products Grid */}
        {paginatedProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSearchParams({});
                setCurrentPage(1);
              }}
              variant="outline"
            >
              Clear all filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedProducts.map((product) => {
                const productInCart = isInCart(product.id);
                const cartQuantity = getCartItemQuantity(product.id);
                
                return (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 relative">
                    {/* Cart indicator badge */}
                    {productInCart && (
                      <div className="absolute top-2 right-2 z-10">
                        <Badge className="bg-green-500 text-white text-xs">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {cartQuantity}
                        </Badge>
                      </div>
                    )}
                    
                    <Link to={`/products/${product.id}`}>
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={product.coverImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                    </Link>
                    <CardHeader className="p-4">
                      <Link to={`/products/${product.id}`}>
                        <CardTitle className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2">
                          {product.name}
                        </CardTitle>
                      </Link>
                      {product.averageRating > 0 && (
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.averageRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({product.numReviews})
                          </span>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-purple-600">
                            {product.price.toLocaleString()} Rwf
                          </p>
                          {product.createdBy && (
                            <div className="flex items-center text-xs text-gray-600 mb-1">
                              <User className="w-3 h-3 mr-1" />
                              <span> by: {product.createdBy.businessName || product.createdBy.name}</span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>In Stock: {product.stock}</div>
                            <div>Available: {product.availableStock || 0}</div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product.id)}
                          disabled={(product.availableStock || 0) === 0}
                          className={productInCart 
                            ? "bg-green-600 hover:bg-green-700" 
                            : "bg-purple-600 hover:bg-purple-700"
                          }
                        >
                          {productInCart ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <ShoppingCart className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="gap-1 pl-2.5"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={pageNumber === currentPage}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="gap-1 pr-2.5"
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Products;