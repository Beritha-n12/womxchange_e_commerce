
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { registerUser } from '@/api/auth';
import { placeAnonymousOrder } from '@/api/orders';
import { Loader2, User, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  checkoutData: {
    customerName: string;
    customerEmail: string;
    shippingAddress: string;
    paymentMethod: string;
    cartId: number;
  };
  onSuccess: () => void;
}

export const GuestCheckoutModal: React.FC<GuestCheckoutModalProps> = ({
  isOpen,
  onClose,
  checkoutData,
  onSuccess
}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [step, setStep] = useState<'register' | 'order'>('register');
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: checkoutData.customerName,
    email: checkoutData.customerEmail,
    password: '',
    confirmPassword: ''
  });

  const handleRegistration = async () => {
    if (!registrationData.password || registrationData.password !== registrationData.confirmPassword) {
      toast({
        title: t('modal.password_error'),
        description: t('modal.passwords_not_match'),
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await registerUser({
        name: registrationData.name,
        email: registrationData.email,
        password: registrationData.password,
        role: 'buyer'
      });

      toast({
        title: t('modal.registration_successful'),
        description: t('modal.account_created'),
      });

      setStep('order');
    } catch (error: any) {
      toast({
        title: t('modal.registration_failed'),
        description: error.response?.data?.message || t('modal.failed_create_account'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOrderPlacement = async () => {
    setLoading(true);
    try {
      await placeAnonymousOrder(checkoutData);
      
      toast({
        title: t('modal.order_placed_success'),
        description: t('modal.order_confirmation_sent'),
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: t('modal.order_failed'),
        description: error.response?.data?.message || t('modal.failed_place_order'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipRegistration = async () => {
    setLoading(true);
    try {
      await placeAnonymousOrder(checkoutData);
      
      toast({
        title: t('modal.order_placed_success'),
        description: t('modal.order_confirmation_sent'),
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: t('modal.order_failed'),
        description: error.response?.data?.message || t('modal.failed_place_order'),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {step === 'register' ? (
              <>
                <User className="w-5 h-5" />
                <span>{t('modal.create_account_optional')}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                <span>{t('modal.place_order')}</span>
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {step === 'register' ? (
            <>
              <p className="text-sm text-gray-600">
                {t('modal.create_account_benefits')}
              </p>
               <Link to="/login">{t('modal.create_account')}</Link>


              <div className="flex space-x-3">
               
                
                <Button
                  variant="outline"
                  onClick={handleSkipRegistration}
                  disabled={loading}
                  className="flex-1"
                >
                  {t('modal.skip_place_order')}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                {t('modal.account_created_success')}
              </p>
              
              <Button
                onClick={handleOrderPlacement}
                disabled={loading}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {t('modal.place_order')}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
