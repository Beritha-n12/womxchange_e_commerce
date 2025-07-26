import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { CustomerFilters } from '@/components/filters/CustomerFilters';
import { ShoppingBag, Users, Calendar } from 'lucide-react';
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
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role?.toLowerCase() !== 'seller') {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  const { data: customersData, isLoading, error } = useQuery({
    queryKey: ['seller-customers', user?.id],
    queryFn: async () => {
      const response = await api.get('/sellers/my-customers');
      return response.data;
    },
    enabled: !!user && user.role?.toLowerCase() === 'seller',
  });

  if (!user || user.role?.toLowerCase() !== 'seller') {
    return null;
  }

  if (error) {
    return (
      <DashboardLayout currentPage="customers">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">{t('seller_customers.failed_load_customers')}</div>
        </div>
      </DashboardLayout>
    );
  }

  const customers: SellerCustomer[] = Array.isArray(customersData) ? customersData : [];

  return (
    <DashboardLayout currentPage="customers">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('seller_customers.my_customers')}</h1>
          <div className="text-sm text-gray-500">
            {t('seller_customers.total_customers', { count: customers.length })}
          </div>
        </div>

        <CustomerFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
          orderCountFilter={orderCountFilter}
          onOrderCountChange={setOrderCountFilter}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{customers.length}</p>
                  <p className="text-gray-600">{t('seller_customers.total_customers_label')}</p>
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
                    {customers.reduce((sum, c) => sum + (c._count?.orders || 0), 0)}
                  </p>
                  <p className="text-gray-600">{t('seller_customers.total_orders_label')}</p>
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
                      const created = new Date(c.createdAt);
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      return created >= thirtyDaysAgo;
                    }).length}
                  </p>
                  <p className="text-gray-600">{t('seller_customers.new_this_month_label')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <CustomerManagement customers={customers} isLoading={isLoading} />
      </div>
    </DashboardLayout>
  );
};

export default SellerCustomers;
