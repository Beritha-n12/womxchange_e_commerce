
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { CustomerFilters } from '@/components/filters/CustomerFilters';
import { Search, ShoppingBag, Users, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { CustomerManagement } from '@/components/seller/CustomerManagement';

interface SellerCustomer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

const SellerCustomers = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [orderCountFilter, setOrderCountFilter] = React.useState('all');

  useEffect(() => {
    console.log('👥 SellerCustomers: useEffect - user:', user);
    
    if (!user) {
      console.log('❌ SellerCustomers: No user, redirecting to login');
      navigate('/login');
      return;
    }
    
    const userRole = user.role?.toLowerCase();
    console.log('🔍 SellerCustomers: User role check:', userRole);
    
    if (userRole !== 'seller') {
      console.log('❌ SellerCustomers: User is not seller, redirecting to dashboard');
      navigate('/dashboard');
      return;
    }
    
    console.log('✅ SellerCustomers: Seller authenticated, userId:', user.id);
  }, [user, navigate]);

  const { data: customersData, isLoading, error } = useQuery({
    queryKey: ['seller-customers', user?.id],
    queryFn: async () => {
      console.log('👥 Fetching seller customers for user:', user?.id);
      const response = await api.get('/sellers/my-customers');
      console.log('👨‍👩‍👧‍👦 Seller customers API response:', response.data?.length, 'customers');
      return response.data;
    },
    enabled: !!user && user.role?.toLowerCase() === 'seller',
  });

  if (!user || user.role?.toLowerCase() !== 'seller') {
    return null;
  }

  if (error) {
    console.error('❌ SellerCustomers: Error loading customers:', error);
    return (
      <DashboardLayout currentPage="customers">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">Failed to load customers</div>
        </div>
      </DashboardLayout>
    );
  }

  const customers: SellerCustomer[] = Array.isArray(customersData) ? customersData : [];

  console.log('👥 SellerCustomers render data:', { 
    customersData, 
    customers: customers.length,
    userRole: user.role 
  });

  return (
    <DashboardLayout currentPage="customers">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Customers</h1>
          <div className="text-sm text-gray-500">
            Total: {customers.length} customers
          </div>
        </div>

        {/* Filters */}
        <CustomerFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          orderCountFilter={orderCountFilter}
          onOrderCountChange={setOrderCountFilter}
        />

        {/* Customer Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{customers.length}</p>
                  <p className="text-gray-600">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {customers.reduce((sum, customer) => sum + (customer._count?.orders || 0), 0)}
                  </p>
                  <p className="text-gray-600">Total Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {customers.filter(c => {
                      const customerDate = new Date(c.createdAt);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return customerDate >= thirtyDaysAgo;
                    }).length}
                  </p>
                  <p className="text-gray-600">New This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Management Component with CRUD */}
        <CustomerManagement customers={customers} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default SellerCustomers;
