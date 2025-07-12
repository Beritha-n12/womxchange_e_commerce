
import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Users, Package, FileText, ShoppingCart, TrendingUp, MessageSquare, UserCheck, FolderOpen, Settings, X } from 'lucide-react';
import { AuthContext } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  currentPage: string;
  onClose?: () => void;
}

const getMenuItems = (userRole: string) => {
  const baseItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', roles: ['admin', 'seller'] }
  ];

  // Add role-specific menu items
  if (userRole === 'seller') {
    baseItems.push(
      { id: 'customers', label: 'Customers', icon: Users, path: '/customers', roles: ['seller'] }
    );
  } else if (userRole === 'admin') {
    baseItems.push(
      { id: 'customers', label: 'Users', icon: Users, path: '/user-management', roles: ['admin'] }
    );
  }

  // Add common items
  baseItems.push(
    { id: 'seller-management', label: 'Vendor', icon: Settings, path: '/seller-management', roles: ['admin'] },
    { id: 'community-chat', label: 'Community Chat', icon: MessageSquare, path: '/community-chat', roles: ['admin', 'seller'] }
  );

  return baseItems;
};

const managementItems = [
  { label: 'Products', path: '/admin-products', roles: ['admin', 'seller'] },
  { label: 'Categories', path: '/admin-categories', roles: ['admin', 'seller'] },
  { label: 'Orders', path: '/orders', roles: ['admin', 'seller'] },
  { label: 'Track issue', path: '/unfinished-orders', roles: ['admin'] },
  { label: 'Reports', path: '/reports', roles: ['admin', 'seller'] },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onClose }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  if (!user) return null;

  const userRole = user.role?.toLowerCase();
  const menuItems = getMenuItems(userRole);
  
  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(userRole)
  );
  
  const filteredManagementItems = managementItems.filter(item => 
    item.roles.includes(userRole)
  );

  const handleLinkClick = () => {
    // Close mobile sidebar when a link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 h-full bg-gradient-to-b from-purple-400 to-purple-600 text-white p-4 lg:p-6">
      {/* Mobile close button */}
      {onClose && (
        <div className="flex justify-end mb-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold">
          w<span className="text-purple-200">X</span>c
        </h1>
        <p className="text-purple-200 text-xs lg:text-sm">Change Potential</p>
      </div>

      <nav className="space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || currentPage === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              onClick={handleLinkClick}
              className={`flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-white bg-opacity-20 text-white' 
                  : 'text-purple-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon size={18} className="lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {filteredManagementItems.length > 0 && (
        <div className="mt-8 pt-8 border-t border-purple-300">
          <h3 className="text-purple-200 text-sm font-semibold mb-4">Management</h3>
          <div className="space-y-2">
            {filteredManagementItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`block px-3 lg:px-4 py-2 transition-colors rounded-lg text-sm lg:text-base ${
                    isActive 
                      ? 'bg-white bg-opacity-20 text-white' 
                      : 'text-purple-100 hover:text-white hover:bg-white hover:bg-opacity-10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-auto pt-6 lg:pt-8">
        <div className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-3 bg-white bg-opacity-10 rounded-lg">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-purple-300 rounded-full flex items-center justify-center">
            <span className="text-purple-800 font-semibold text-sm lg:text-base">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white font-medium text-sm lg:text-base truncate">{user.name}</p>
            <p className="text-purple-200 text-xs lg:text-sm capitalize">{user.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};