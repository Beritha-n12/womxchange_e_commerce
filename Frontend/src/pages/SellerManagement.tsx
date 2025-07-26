import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, Clock, Plus, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/api/api';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { SellerPermissionsModal } from '@/components/admin/SellerPermissionsModal';

interface Seller {
  id: number;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  gender: string;
  sellerStatus: 'INACTIVE' | 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  isActive: boolean;
  sellerPermissions: any;
  createdAt: string;
}

interface CreateSellerData {
  name: string;
  email: string;
  password: string;
  role: 'seller';
}

const SellerManagement = () => {
  const { t } = useLanguage();
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);

  const form = useForm<CreateSellerData>({
    defaultValues: { name: '', email: '', password: '', role: 'seller' },
  });

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/login');
    if (user.role.toLowerCase() !== 'admin') navigate('/dashboard');
  }, [user, loading, navigate]);

  // Fetch all sellers
  const { data: sellersData, isLoading, error } = useQuery({
    queryKey: ['all-sellers'],
    queryFn: () => api.get('/sellers/all'),
    enabled: !!user && user.role.toLowerCase() === 'admin',
  });

  // Create Seller mutation
  const createSellerMutation = useMutation({
    mutationFn: (data: CreateSellerData) => api.post('/auth/register', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sellers'] });
      setIsCreateModalOpen(false);
      form.reset();
      toast({ title: t('common.success'), description: t('seller_management.created_success') });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || t('seller_management.create_error');
      toast({ title: t('common.error'), description: errorMessage, variant: 'destructive' });
    },
  });

  // Update seller status mutation
  const updateSellerStatusMutation = useMutation({
    mutationFn: ({ sellerId, status, isActive }: any) =>
      api.put(`/sellers/${sellerId}/status`, { status, isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-sellers'] });
      toast({ title: t('common.success'), description: t('seller_management.status_updated') });
    },
    onError: (err: any) => {
      const errorMessage = err.response?.data?.message || err.message || t('seller_management.status_update_error');
      toast({ title: t('common.error'), description: errorMessage, variant: 'destructive' });
    },
  });

  const sellers: Seller[] = sellersData?.data || [];

  const filteredSellers = sellers.filter((s) => {
    const matchesSearch = [s.name, s.email, s.businessName].some((str) =>
      str?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && s.sellerStatus === 'ACTIVE' && s.isActive) ||
      (statusFilter === 'pending' && s.sellerStatus === 'PENDING') ||
      (statusFilter === 'suspended' && s.sellerStatus === 'SUSPENDED') ||
      (statusFilter === 'inactive' && (s.sellerStatus === 'INACTIVE' || !s.isActive));

    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (id: number, newStatus: any) =>
    updateSellerStatusMutation.mutate({ sellerId: id, status: newStatus, isActive: newStatus === 'ACTIVE' });

  const handleManagePermissions = (seller: Seller) => {
    setSelectedSeller(seller);
    setIsPermissionsModalOpen(true);
  };

  const getStatusBadge = (s: Seller) =>
    s.sellerStatus === 'ACTIVE' && s.isActive ? (
      <Badge className="bg-green-100 text-green-800">{t('seller_management.status_active')}</Badge>
    ) : s.sellerStatus === 'SUSPENDED' ? (
      <Badge className="bg-red-100 text-red-800">{t('seller_management.status_suspended')}</Badge>
    ) : s.sellerStatus === 'PENDING' ? (
      <Badge className="bg-yellow-100 text-yellow-800">{t('seller_management.status_pending')}</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">{t('seller_management.status_inactive')}</Badge>
    );

  const counts = {
    total: sellers.length,
    active: sellers.filter((s) => s.sellerStatus === 'ACTIVE' && s.isActive).length,
    pending: sellers.filter((s) => s.sellerStatus === 'PENDING').length,
    suspended: sellers.filter((s) => s.sellerStatus === 'SUSPENDED').length,
  };

  if (loading || isLoading)
    return (
      <DashboardLayout currentPage="seller-management">
        <div className="flex items-center justify-center min-h-[400px]">{t('common.loading')}</div>
      </DashboardLayout>
    );

  if (!user || user.role.toLowerCase() !== 'admin') return null;

  if (error)
    return (
      <DashboardLayout currentPage="seller-management">
        <div className="flex items-center justify-center min-h-[400px] text-red-600">
          {t('seller_management.load_error')}
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout currentPage="seller-management">
      <div className="space-y-6">
        {/* Header & Add Seller */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{t('seller_management.heading')}</h1>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => form.reset()}>
                <Plus className="w-4 h-4 mr-2" /> {t('seller_management.add_button')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('seller_management.new_seller')}</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) => createSellerMutation.mutate(data))}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    rules={{ required: t('seller_management.name_required') }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('seller_management.label_name')}</FormLabel>
                        <FormControl>
                          <Input placeholder={t('seller_management.placeholder_name')} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    rules={{
                      required: t('seller_management.email_required'),
                      pattern: { value: /^[^@]+@[^@]+\.[^@]+$/, message: t('seller_management.email_invalid') },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('seller_management.label_email')}</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    rules={{
                      required: t('seller_management.password_required'),
                      minLength: { value: 6, message: t('seller_management.password_min_length') },
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('seller_management.label_password')}</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={createSellerMutation.isPending} className="flex-1">
                      {createSellerMutation.isPending ? t('common.creating') : t('seller_management.create')}
                    </Button>
                    <Button variant="outline" type="button" onClick={() => form.reset()} className="flex-1">
                      {t('common.cancel')}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Status Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: t('seller_management.count_all'), status: 'all', count: counts.total, color: 'text-blue-600' },
            { title: t('seller_management.count_active'), status: 'active', count: counts.active, color: 'text-green-600' },
            { title: t('seller_management.count_pending'), status: 'pending', count: counts.pending, color: 'text-yellow-600' },
            { title: t('seller_management.count_suspended'), status: 'suspended', count: counts.suspended, color: 'text-red-600' },
          ].map((item) => (
            <Card
              key={item.status}
              className={`cursor-pointer transition-all hover:shadow-md ${
                statusFilter === item.status ? 'ring-2 ring-purple-500 shadow-md' : ''
              }`}
              onClick={() => setStatusFilter(item.status)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                {statusFilter === item.status && (
                  <div className="text-xs text-purple-600 mt-1">{t('seller_management.active_filter')}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('seller_management.search_placeholder')}
            className="pl-10 bg-gray-50 border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              {t('seller_management.all_sellers')} ({filteredSellers.length})
            </h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  t('seller_management.col_seller'),
                  t('seller_management.col_business'),
                  t('seller_management.col_contact'),
                  t('seller_management.col_status'),
                  t('seller_management.col_joined'),
                  t('seller_management.col_actions'),
                ].map((col) => (
                  <th key={col} className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSellers.length > 0 ? (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center text-white font-medium">
                        {seller.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{seller.name}</div>
                        <div className="text-sm text-gray-500">{seller.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{seller.businessName}</div>
                      <div className="text-sm text-gray-500 capitalize">{seller.gender}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">{seller.phone}</div>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(seller)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {seller.sellerStatus === 'PENDING' && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleStatusUpdate(seller.id, 'ACTIVE')}
                          disabled={updateSellerStatusMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" /> {t('seller_management.approve')}
                        </Button>
                      )}
                      {seller.sellerStatus === 'ACTIVE' && seller.isActive && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => handleStatusUpdate(seller.id, 'SUSPENDED')}
                            disabled={updateSellerStatusMutation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" /> {t('seller_management.suspend')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-purple-200 text-purple-600 hover:bg-purple-50"
                            onClick={() => handleManagePermissions(seller)}
                          >
                            <Settings className="w-4 h-4 mr-1" /> {t('seller_management.permissions')}
                          </Button>
                        </>
                      )}
                      {(seller.sellerStatus === 'SUSPENDED' || seller.sellerStatus === 'INACTIVE') && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleStatusUpdate(seller.id, 'ACTIVE')}
                          disabled={updateSellerStatusMutation.isPending}
                        >
                          <Clock className="w-4 h-4 mr-1" /> {t('seller_management.reactivate')}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {searchTerm
                      ? t('seller_management.no_results_search', { term: searchTerm })
                      : t('seller_management.no_results')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Permissions Modal */}
        <SellerPermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setSelectedSeller(null);
          }}
          seller={selectedSeller}
        />
      </div>
    </DashboardLayout>
  );
};

export default SellerManagement;
