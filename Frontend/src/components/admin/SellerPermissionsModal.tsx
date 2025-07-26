import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Settings, CheckCircle, Edit, X, Trash2 } from 'lucide-react';
import api from '@/api/api';
import { useLanguage } from '@/contexts/LanguageContext';

interface SellerPermission {
  canConfirmOrder: boolean;
  canEditOrder: boolean;
  canCancelOrder: boolean;
  canDeleteOrder: boolean;
  canCreateCustomers: boolean;
}

interface SellerPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: any;
}

export const SellerPermissionsModal: React.FC<SellerPermissionsModalProps> = ({
  isOpen,
  onClose,
  seller
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage();

  const [permissions, setPermissions] = useState<SellerPermission>({
    canConfirmOrder: false,
    canEditOrder: false,
    canCancelOrder: false,
    canDeleteOrder: false,
    canCreateCustomers: false
  });

  useEffect(() => {
    if (seller?.sellerPermissions) {
      try {
        const parsedPermissions = JSON.parse(seller.sellerPermissions);
        setPermissions({
          canConfirmOrder: parsedPermissions.canConfirmOrder || false,
          canEditOrder: parsedPermissions.canEditOrder || false,
          canCancelOrder: parsedPermissions.canCancelOrder || false,
          canDeleteOrder: parsedPermissions.canDeleteOrder || false,
          canCreateCustomers: parsedPermissions.canCreateCustomers || false
        });
      } catch (error) {
        console.error('Error parsing seller permissions:', error);
      }
    }
  }, [seller]);

  const updatePermissionsMutation = useMutation({
    mutationFn: async (permissionsData: SellerPermission) => {
      return api.put(`/sellers/${seller.id}/status`, {
        status: seller.sellerStatus,
        permissions: permissionsData
      });
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['sellers'] });
      queryClient.invalidateQueries({ queryKey: ['pending-sellers'] });
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      toast({
        title: t('seller_permissions.permissions_updated_title'),
        description: t('seller_permissions.permissions_updated_description'),
      });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: t('seller_permissions.error_title'),
        description: error.response?.data?.message || t('seller_permissions.error_description'),
        variant: "destructive",
      });
    }
  });

  const handlePermissionChange = (key: keyof SellerPermission, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    updatePermissionsMutation.mutate(permissions);
  };

  if (!seller) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>{t('seller_permissions.manage_seller_permissions')}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Seller Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{seller.name}</h3>
              <Badge variant={seller.sellerStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                {t(`seller_permissions.status.${seller.sellerStatus.toLowerCase()}`) || seller.sellerStatus}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">{seller.email}</p>
            {seller.businessName && (
              <p className="text-sm text-gray-600">
                {t('seller_permissions.business')}: {seller.businessName}
              </p>
            )}
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <h4 className="font-semibold">{t('seller_permissions.order_management_permissions')}</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">{t('seller_permissions.confirm_orders')}</p>
                    <p className="text-sm text-gray-600">{t('seller_permissions.allow_confirm_payment')}</p>
                  </div>
                </div>
                <Switch
                  checked={permissions.canConfirmOrder}
                  onCheckedChange={(value) => handlePermissionChange('canConfirmOrder', value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Edit className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{t('seller_permissions.edit_orders')}</p>
                    <p className="text-sm text-gray-600">{t('seller_permissions.allow_edit_order')}</p>
                  </div>
                </div>
                <Switch
                  checked={permissions.canEditOrder}
                  onCheckedChange={(value) => handlePermissionChange('canEditOrder', value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <X className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium">{t('seller_permissions.cancel_orders')}</p>
                    <p className="text-sm text-gray-600">{t('seller_permissions.allow_cancel_order')}</p>
                  </div>
                </div>
                <Switch
                  checked={permissions.canCancelOrder}
                  onCheckedChange={(value) => handlePermissionChange('canCancelOrder', value)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium">{t('seller_permissions.delete_orders')}</p>
                    <p className="text-sm text-gray-600">{t('seller_permissions.allow_delete_order')}</p>
                  </div>
                </div>
                <Switch
                  checked={permissions.canDeleteOrder}
                  onCheckedChange={(value) => handlePermissionChange('canDeleteOrder', value)}
                />
              </div>
            </div>

            <h4 className="font-semibold pt-4">{t('seller_permissions.customer_management_permissions')}</h4>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="font-medium">{t('seller_permissions.create_customers')}</p>
                  <p className="text-sm text-gray-600">{t('seller_permissions.allow_add_customers')}</p>
                </div>
              </div>
              <Switch
                checked={permissions.canCreateCustomers}
                onCheckedChange={(value) => handlePermissionChange('canCreateCustomers', value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t('seller_permissions.cancel')}
            </Button>
            <Button
              onClick={handleSave}
              disabled={updatePermissionsMutation.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {updatePermissionsMutation.isPending ? t('seller_permissions.saving') : t('seller_permissions.save_permissions')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
