import React, { useContext, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { BarChart3, Clock, Users, Package, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthContext } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/api/api';

const VendorDashboard = () => {
  const { t } = useLanguage();
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role?.toLowerCase() !== 'seller') {
      navigate(user ? '/dashboard' : '/login');
    }
  }, [user, loading, navigate]);

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['seller-stats', user?.id],
    queryFn: () => api.get('/sellers/my-stats').then((res) => res.data),
    enabled: !!user && user.role?.toLowerCase() === 'seller',
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['seller-orders', user?.id],
    queryFn: () => api.get('/sellers/my-orders').then((res) => res.data),
    enabled: !!user && user.role?.toLowerCase() === 'seller',
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['seller-products', user?.id],
    queryFn: () => api.get('/sellers/my-products').then((res) => res.data),
    enabled: !!user && user.role?.toLowerCase() === 'seller',
  });

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['seller-customers', user?.id],
    queryFn: () => api.get('/sellers/my-customers').then((res) => res.data),
    enabled: !!user && user.role?.toLowerCase() === 'seller',
  });

  if (loading || !user || user.role?.toLowerCase() !== 'seller') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">{t('vendor_dashboard.loading')}</div>
      </div>
    );
  }

  const stats = statsData || { totalProducts: 0, totalOrders: 0, totalRevenue: 0, totalCustomers: 0 };
  const recentOrders = (ordersData || []).slice(0, 5);
  const products = (productsData || []).slice(0, 5);
  const customers = (customersData || []).slice(0, 5);

  return (
    <DashboardLayout currentPage="dashboard">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('vendor_dashboard.title')}</h1>
          <div className="flex gap-2">
            <Link to="/admin-products">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                {t('vendor_dashboard.add_product')}
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline">
                <Package className="w-4 h-4 mr-2" />
                {t('vendor_dashboard.create_order')}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title={t('vendor_dashboard.total_orders')} value={statsLoading ? "..." : stats.totalOrders?.toString()} icon={BarChart3} color="text-red-500" />
          <StatsCard title={t('vendor_dashboard.total_revenue')} value={statsLoading ? "..." : `${stats.totalRevenue?.toLocaleString()} Rwf`} icon={Clock} color="text-green-500" />
          <StatsCard title={t('vendor_dashboard.total_customers')} value={statsLoading ? "..." : stats.totalCustomers?.toString()} icon={Users} color="text-blue-500" />
          <StatsCard title={t('vendor_dashboard.total_products')} value={statsLoading ? "..." : stats.totalProducts?.toString()} icon={Package} color="text-purple-500" />
        </div>

        {/* Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex justify-between items-center">
              {t('vendor_dashboard.my_products')}
              <Link to="/admin-products">
                <Button variant="ghost" size="sm">{t('vendor_dashboard.view_all')}</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                {t('vendor_dashboard.loading_products')}
              </div>
            ) : products.length > 0 ? (
              <div className="space-y-3">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-gray-50">
                    <img src={product.coverImage} alt={product.name} className="w-10 h-10 rounded object-cover" />
                    <div className="flex-1">
                      <Link to={`/products/${product.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800 truncate block">
                        {product.name}
                      </Link>
                      <p className="text-sm text-gray-500">{product.category?.name || 'No Category'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{product.price.toLocaleString()} Rwf</p>
                      <p className="text-xs text-gray-500">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('vendor_dashboard.no_products')}{' '}
                <Link to="/admin-products" className="text-blue-600 underline">
                  {t('vendor_dashboard.create_first_product')}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">{t('vendor_dashboard.revenue_overview')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('vendor_dashboard.total_revenue')}</span>
                <span className="font-semibold">{stats.totalRevenue.toLocaleString()} Rwf</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('vendor_dashboard.avg_order_value')}</span>
                <span className="font-semibold">
                  {stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toFixed(0) : '0'} Rwf
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex justify-between items-center">
              {t('vendor_dashboard.recent_orders')}
              <Link to="/orders">
                <Button variant="ghost" size="sm">{t('vendor_dashboard.view_all')}</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                {t('vendor_dashboard.loading_orders')}
              </div>
            ) : recentOrders.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">{t('vendor_dashboard.order_id')}</th>
                    <th className="px-4 py-3 text-left">{t('vendor_dashboard.customer')}</th>
                    <th className="px-4 py-3 text-left">{t('vendor_dashboard.products')}</th>
                    <th className="px-4 py-3 text-left">{t('vendor_dashboard.date')}</th>
                    <th className="px-4 py-3 text-left">{t('vendor_dashboard.total')}</th>
                    <th className="px-4 py-3 text-left">{t('vendor_dashboard.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-3">#{order.id}</td>
                      <td className="px-4 py-3">{order.user?.name || t('vendor_dashboard.unknown')}</td>
                      <td className="px-4 py-3 flex items-center space-x-2">
                        {order.items.slice(0, 2).map((item) => (
                          <img key={item.id} src={item.product.coverImage} alt={item.product.name} className="w-8 h-8 rounded object-cover" />
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs text-gray-500">+{order.items.length - 2}</span>
                        )}
                      </td>
                      <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 font-semibold">{order.totalPrice.toLocaleString()} Rwf</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.isPaid ? t('vendor_dashboard.paid') : t('vendor_dashboard.pending')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('vendor_dashboard.no_orders')}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium flex justify-between items-center">
              {t('vendor_dashboard.recent_customers')}
              <Link to="/customers">
                <Button variant="ghost" size="sm">{t('vendor_dashboard.view_all')}</Button>
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customersLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                {t('vendor_dashboard.loading_customers')}
              </div>
            ) : customers.length > 0 ? (
              <div className="space-y-3">
                {customers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-medium">
                          {customer.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{customer.name || t('vendor_dashboard.unknown')}</p>
                        <p className="text-sm text-gray-500">{customer.email || t('vendor_dashboard.no_email')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{customer._count?.orders || 0} {t('vendor_dashboard.orders_count')}</p>
                      <p className="text-xs text-gray-500">
                        {t('vendor_dashboard.joined')} {new Date(customer.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {t('vendor_dashboard.no_customers')}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
