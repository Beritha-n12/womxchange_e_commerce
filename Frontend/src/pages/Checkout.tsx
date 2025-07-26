
import { useState, useEffect, useContext } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthContext } from '@/contexts/AuthContext';
import  useCart  from '@/hooks/useCart';
import { placeOrder, placeAnonymousOrder } from '@/api/orders';
import { useToast } from '@/hooks/use-toast';
import { APP_CONSTANTS, ROUTES } from '@/constants/app';
import { GuestCheckoutModal } from '@/components/GuestCheckoutModal';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useLanguage } from '@/contexts/LanguageContext';

const Checkout = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { toast } = useToast();
  const { cart, isLoading } = useCart();
  const { t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<string>(APP_CONSTANTS.PAYMENT_METHODS.MTN);
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentCode, setPaymentCode] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [showGuestModal, setShowGuestModal] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    countryCode: '+250',
    location: '',
    streetLine: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    shippingAddress: ''
  });

  // Auto-save checkout form data
  const autoSaveCheckoutData = async (data: typeof formData) => {
    localStorage.setItem('checkoutFormData', JSON.stringify(data));
  };

  useAutoSave({
    data: formData,
    onSave: autoSaveCheckoutData,
    delay: 1500,
    enabled: Object.values(formData).some(value => value.trim() !== '')
  });

  // Load saved form data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('checkoutFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Failed to load saved checkout data:', error);
      }
    }
  }, []);

  // Handle payment method change
  const handlePaymentMethodChange = async (method: string) => {
    setPaymentMethod(method);
    
    if (method === APP_CONSTANTS.PAYMENT_METHODS.MTN) {
      setPaymentCode(APP_CONSTANTS.PAYMENT_CODE);
    } else {
      setPaymentCode('');
    }
  };

  const handleCompleteOrder = async () => {
    if (!cart || cart.items.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.location || !formData.streetLine || 
        !formData.city || !formData.state || !formData.postalCode || !formData.country) {
      toast({
        title: t("Error"),
        description: t("Please.fill"),
        variant: "destructive",
      });
      return;
    }

    // Email is required for anonymous users
    if (!auth?.user && !formData.email) {
      toast({
        title: t("Error"),
        description: t("Email.confirmation"),
        variant: "destructive",
      });
      return;
    }

    const billingAddress = `${formData.streetLine}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`;
    const shippingAddress = sameAsBilling 
      ? billingAddress
      : formData.shippingAddress || billingAddress;

    if (auth?.user) {
      // Authenticated user - use existing placeOrder
      setProcessing(true);
      try {
        const orderResponse = await placeOrder({
          shippingAddress,
          paymentMethod,
          customerPhone: formData.countryCode + formData.phone
        });
        
        const orderId = orderResponse.data.id;
        setCurrentOrderId(orderId);

        // Clear saved form data after successful order
        localStorage.removeItem('checkoutFormData');

      } catch (error: any) {
        console.error('Checkout error:', error);
        toast({
          title: t('common.error'),
          description: error.response?.data?.message || t('modal.failed_place_order'),
          variant: "destructive",
        });
      } finally {
        setProcessing(false);
      }
    } else {
      // Anonymous user - show guest registration modal
      setShowGuestModal(true);
    }
  };

  const handleGuestOrderSuccess = () => {
    // Clear saved form data after successful order
    localStorage.removeItem('checkoutFormData');
    setCurrentOrderId(1); // Just to show success state
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSameAsBillingChange = (checked: boolean | "indeterminate") => {
    setSameAsBilling(checked === true);
  };

  if (isLoading) {
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

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = Math.round(subtotal * APP_CONSTANTS.DISCOUNT_RATE);
  const subtotalAfterDiscount = subtotal - discount;
  
  // Hide delivery fee if Pay on Delivery is selected
  const showDeliveryFee = paymentMethod !== APP_CONSTANTS.PAYMENT_METHODS.PAY_ON_DELIVERY;
  const deliveryFee = showDeliveryFee ? APP_CONSTANTS.DELIVERY_FEE : 0;
  const total = subtotalAfterDiscount + deliveryFee;

  const guestCheckoutData = {
    customerName: `${formData.firstName} ${formData.lastName}`,
    customerEmail: formData.email,
    billingAddress: `${formData.streetLine}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`,
    shippingAddress: sameAsBilling 
      ? `${formData.streetLine}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`
      : formData.shippingAddress || `${formData.streetLine}, ${formData.city}, ${formData.state}, ${formData.postalCode}, ${formData.country}`,
    paymentMethod,
    cartId: cart?.id || 0
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to={ROUTES.CART} className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('checkout.back_to_cart')}
        </Link>

        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-6">{t('checkout.empty_cart')}</p>
            <Link to="/products">
              <Button>{t('checkout.continue_shopping')}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Forms */}
            <div className="space-y-8">
              {/* Customer Information */}
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                  <h2 className="text-xl font-semibold">{t('checkout.customer_information')}</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <Input 
                     placeholder={t('checkout.first_name')} 
                     value={formData.firstName}
                     onChange={(e) => handleInputChange('firstName', e.target.value)}
                   />
                   <Input 
                     placeholder={t('checkout.last_name')} 
                     value={formData.lastName}
                     onChange={(e) => handleInputChange('lastName', e.target.value)}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <Input 
                     placeholder={auth?.user ? t('checkout.email') : t('checkout.email_required')} 
                     type="email" 
                     value={formData.email}
                     onChange={(e) => handleInputChange('email', e.target.value)}
                   />
                  <div className="flex gap-2">
                    <select 
                      value={formData.countryCode}
                      onChange={(e) => handleInputChange('countryCode', e.target.value)}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="+250">🇷🇼 +250</option>
                      <option value="+256">🇺🇬 +256</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+255">🇹🇿 +255</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                    </select>
                     <Input 
                       placeholder={t('checkout.phone_number')} 
                       type="tel"
                       value={formData.phone}
                       onChange={(e) => handleInputChange('phone', e.target.value)}
                       className="flex-1"
                     />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <Input 
                     placeholder={t('checkout.location')} 
                     value={formData.location}
                     onChange={(e) => handleInputChange('location', e.target.value)}
                   />
                  <div></div>
                </div>
                
                 <Input 
                   placeholder={t('checkout.street_line')} 
                   className="mb-4" 
                   value={formData.streetLine}
                   onChange={(e) => handleInputChange('streetLine', e.target.value)}
                 />
                
                {!auth?.user && (
                 <p className="text-sm text-gray-600">
                   {t('checkout.required_fields_note')}
                 </p>
                )}
              </div>

              {/* Billing Address */}
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                  <h2 className="text-xl font-semibold">{t('checkout.billing_address')}</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <Input 
                     placeholder={t('checkout.city')} 
                     value={formData.city || ''}
                     onChange={(e) => handleInputChange('city', e.target.value)}
                   />
                   <Input 
                     placeholder={t('checkout.state_province')} 
                     value={formData.state || ''}
                     onChange={(e) => handleInputChange('state', e.target.value)}
                   />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                   <Input 
                     placeholder={t('checkout.postal_code')} 
                     value={formData.postalCode || ''}
                     onChange={(e) => handleInputChange('postalCode', e.target.value)}
                   />
                   <Input 
                     placeholder={t('checkout.country')} 
                     value={formData.country || ''}
                     onChange={(e) => handleInputChange('country', e.target.value)}
                   />
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                  <h2 className="text-xl font-semibold">{t('checkout.shipping_address')}</h2>
                </div>
                
                <div className="flex items-center space-x-2 mb-4">
                  <Checkbox 
                    id="same-address" 
                    checked={sameAsBilling}
                    onCheckedChange={handleSameAsBillingChange}
                  />
                  <Label htmlFor="same-address" className="text-purple-600">{t('checkout.same_as_customer_address')}</Label>
                </div>

                {!sameAsBilling && (
                  <Input 
                    placeholder={t('checkout.shipping_address')} 
                    value={formData.shippingAddress}
                    onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                  />
                )}
              </div>

              {/* Payment Method */}
              <div>
                <div className="flex items-center mb-4">
                  <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">4</span>
                  <h2 className="text-xl font-semibold">{t('checkout.payment_method')}</h2>
                </div>
                
                <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodChange} className="mb-4 space-y-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={APP_CONSTANTS.PAYMENT_METHODS.MTN} id="mtn" />
                    <Label htmlFor="mtn">MTN MOMO</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={APP_CONSTANTS.PAYMENT_METHODS.PAY_ON_DELIVERY} id="pay-on-delivery" />
                    <Label htmlFor="pay-on-delivery">{t('checkout.pay_on_delivery')}</Label>
                  </div>
                </RadioGroup>

                {/* MoMo Payment Code Display */}
                {paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.MTN && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold mb-2">{t('checkout.momo_payment_code')}</h3>
                    <div className="bg-white p-3 rounded border-2 border-green-500">
                      <h6>* Beritha Niyotwagira</h6>
                      <div className="text-lg font-bold text-green-600">+250784720984</div>
                       <p className="text-sm text-gray-600 mt-1">
                         {t('checkout.momo_payment_instructions')}
                       </p>
                    </div>
                    {currentOrderId && (
                       <p className="text-sm text-blue-600 mt-2">
                         ✅ {t('checkout.order_placed_success')}
                       </p>
                    )}
                  </div>
                )}

                {/* Pay on Delivery Notice */}
                {paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.PAY_ON_DELIVERY && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                     <h3 className="font-semibold mb-2 text-blue-800">{t('checkout.pay_on_delivery')}</h3>
                     <p className="text-sm text-blue-700">
                       {t('checkout.pay_on_delivery_description')}
                     </p>
                    {currentOrderId && (
                       <p className="text-sm text-blue-600 mt-2">
                         ✅ {t('checkout.order_placed_success')}
                       </p>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2 mt-4">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">{t('checkout.secure_payment')}</span>
                </div>
                
                 <p className="text-xs text-gray-500 mt-2">
                   {t('checkout.security_notice')}
                 </p>
              </div>

              <Button 
                onClick={handleCompleteOrder}
                disabled={processing || currentOrderId !== null}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg"
              >
                {processing ? t('checkout.processing') : currentOrderId ? t('checkout.order_completed') : t('checkout.complete_order')}
              </Button>

                          {currentOrderId === null ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Forms */}
                  <div className="space-y-8">
                    {/* Your full form fields go here */}
                    ...
                  </div>

                  {/* Right Side - Order Summary */}
                  <div className="lg:pl-8">
                    {/* Your summary block here */}
                    ...
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-800 mb-2">✅ {t('Order.Completed!')}</h3>
                  <p className="text-green-700 text-sm">
                    {t('placed.successfully')}
                    {paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.MTN &&
                      ' Please complete the payment using the MoMo code above.'}
                    {paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.PAY_ON_DELIVERY &&
                      ' Payment will be collected on delivery.'}
                    {t('order.status.')}
                  </p>
                  <Link to="/products" className="inline-block mt-2">
                    <Button variant="outline" size="sm">{t('Continue.Shopping')}</Button>
                  </Link>
                </div>
              )}

            </div>

            {/* Right Side - Order Summary */}
            <div className="lg:pl-8">
              <h2 className="text-xl font-semibold mb-6">{t('Order.Summary')}</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img 
                      src={item.product.coverImage} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.name}</h3>
                      <p className="text-gray-600">{item.product.price.toLocaleString()} Rwf</p>
                    </div>
                    <span className="font-semibold">{item.quantity} ×</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex justify-between">
                  <span>{t('Subtotal')}</span>
                  <span>{subtotal.toLocaleString()} Rwf</span>
                </div>
                <div className="flex justify-between text-red-600">
                  <span>{t('Discount')} ({(APP_CONSTANTS.DISCOUNT_RATE * 100)}%)</span>
                  <span>-{discount.toLocaleString()} Rwf</span>
                </div>
                {showDeliveryFee ? (
                  <div className="flex justify-between">
                    <span>{t('Delivery.Fee')}</span>
                    <span>{APP_CONSTANTS.DELIVERY_FEE.toLocaleString()} Rwf</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-blue-600">
                    <span>{('Delivery.Fee')}</span>
                    <span>{t('Paid.on.delivery')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>{t('Total')}</span>
                  <span>{total.toLocaleString()} Rwf</span>
                </div>
                {!showDeliveryFee && (
                  <p className="text-sm text-blue-600 text-center mt-2">
                    + {APP_CONSTANTS.DELIVERY_FEE.toLocaleString()} Rwf {t('delivery.fee.delivery')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Guest Checkout Modal */}
      <GuestCheckoutModal
        isOpen={showGuestModal}
        onClose={() => setShowGuestModal(false)}
        checkoutData={guestCheckoutData}
        onSuccess={handleGuestOrderSuccess}
      />

      <Footer />
    </div>
  );
};

export default Checkout;