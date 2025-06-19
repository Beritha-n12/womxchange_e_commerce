import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import TopBanner from './TopBanner';

const Header = () => {
  return (
    <>
      <TopBanner />
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <img 
                src="/wxc.png" 
                alt="Rwanda Marketplace Logo" 
                className="h-12 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 transition-colors">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-purple-600 transition-colors">Products</Link>
            <Link to="/categories" className="text-gray-700 hover:text-purple-600 transition-colors">Categories</Link>
            <Link to="/about" className="text-gray-700 hover:text-purple-600 transition-colors">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">Contact</Link>
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-3">
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="bg-transparent border-none outline-none text-sm"
                />
              </div>
              <Button variant="ghost" size="icon">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
