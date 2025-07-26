import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Trash2, Mail, Phone, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/contexts/LanguageContext';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface CustomerManagementProps {
  customers: Customer[];
  isLoading: boolean;
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({ customers, isLoading }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const updateCustomerMutation = useMutation({
    mutationFn: async (data: { id: number; customerData: Partial<Customer> }) => {
      console.log('🔄 Updating customer:', data.id, data.customerData);
      const response = await api.put(`/sellers/customers/${data.id}`, data.customerData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-customers'] });
      setIsEditDialogOpen(false);
      setSelectedCustomer(null);
      toast({ 
        title: t('customer_management.success'),
        description: t('customer_management.customer_updated'),
      });
    },
    onError: (error: any) => {
      console.error('❌ Error updating customer:', error);
      toast({ 
        title: t('customer_management.error'), 
        description: error.response?.data?.message || t('customer_management.update_failed'),
        variant: 'destructive' 
      });
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: async (customerId: number) => {
      console.log('🗑️ Deleting customer:', customerId);
      const response = await api.delete(`/sellers/customers/${customerId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller-customers'] });
      toast({ 
        title: t('customer_management.success'), 
        description: t('customer_management.customer_removed') 
      });
    },
    onError: (error: any) => {
      console.error('❌ Error deleting customer:', error);
      toast({ 
        title: t('customer_management.error'), 
        description: error.response?.data?.message || t('customer_management.remove_failed'),
        variant: 'destructive' 
      });
    }
  });

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || '',
      address: customer.address || ''
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateCustomer = () => {
    if (!selectedCustomer) return;
    
    updateCustomerMutation.mutate({
      id: selectedCustomer.id,
      customerData: editForm
    });
  };

  const handleDeleteCustomer = (customerId: number) => {
    if (window.confirm(t('customer_management.confirm_delete'))) {
      deleteCustomerMutation.mutate(customerId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">{t('customer_management.loading_customers')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t('customer_management.title', { count: customers.length })}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {customers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">{t('customer_management.customer')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">{t('customer_management.contact')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">{t('customer_management.orders')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">{t('customer_management.joined')}</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">{t('customer_management.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-medium">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{t('customer_management.id_prefix')} #{customer.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{customer.email}</span>
                        </div>
                        {customer.phone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {customer._count?.orders || 0} {t('customer_management.orders_label')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditCustomer(customer)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">{t('customer_management.no_customers')}</p>
            <p className="text-gray-500 text-sm mt-2">
              {t('customer_management.no_customers_subtext')}
            </p>
          </div>
        )}

        {/* Edit Customer Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('customer_management.edit_customer')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('customer_management.name')}</Label>
                <Input
                  id="name"
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">{t('customer_management.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t('customer_management.phone')}</Label>
                <Input
                  id="phone"
                  value={editForm.phone}
                  onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="address">{t('customer_management.address')}</Label>
                <Textarea
                  id="address"
                  value={editForm.address}
                  onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  {t('customer_management.cancel')}
                </Button>
                <Button 
                  onClick={handleUpdateCustomer}
                  disabled={updateCustomerMutation.isPending}
                >
                  {updateCustomerMutation.isPending ? t('customer_management.updating') : t('customer_management.update_customer')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
