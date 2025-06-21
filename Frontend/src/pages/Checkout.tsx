
import { useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const orderItems = [
    {
      id: 1,
      name: "Healthcare Erinology",
      price: 20000,
      quantity: 1,
      image: "/Head Phone.jpeg"
    },
    {
      id: 2,
      name: "Makeup Lancome Rouge",
      price: 20000,
      quantity: 1,
      image: "/Trivet Set.jpeg"
    }
  ];

  const subtotal = 40000;
  const shippingTax = 12000;
  const total = 52000;

  const handleCompleteOrder = () => {
    navigate('/order-complete');
  };

  const handleSameAsBillingChange = (checked: boolean | "indeterminate") => {
    setSameAsBilling(checked === true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Home
        </Link>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Forms */}
          <div className="space-y-8">
            {/* Billing Address */}
            <div>
              <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">1</span>
                <h2 className="text-xl font-semibold">Billing Address</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input placeholder="First Name" />
                <Input placeholder="Last Name" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Input placeholder="Email" type="email" />
                <Input placeholder="Location" />
              </div>
              
              <Input placeholder="Street Line" className="mb-4" />
            </div>

            {/* Shipping Address */}
            <div>
              <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">2</span>
                <h2 className="text-xl font-semibold">Shipping Address</h2>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox 
                  id="same-address" 
                  checked={sameAsBilling}
                  onCheckedChange={handleSameAsBillingChange}
                />
                <Label htmlFor="same-address" className="text-purple-600">Same as billing address</Label>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <div className="flex items-center mb-4">
                <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm mr-3">3</span>
                <h2 className="text-xl font-semibold">Payment Method</h2>
              </div>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CARD" id="card" />
                  <Label htmlFor="card">CARD</Label>
                  <RadioGroupItem value="MTN" id="mtn" className="ml-8" />
                  <Label htmlFor="mtn">MTN</Label>
                </div>
              </RadioGroup>

              {paymentMethod === 'CARD' && (
                <div className="space-y-4">
                  <Input placeholder="Name on Card" />
                  <Input placeholder="Card Number" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Expire Date" />
                    <Input placeholder="Security Code" />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2 mt-4">
                <Shield className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-600">Secure Checkout</span>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Your purchases are secured by an industry best encryption service - Braintree
              </p>
            </div>

            <Button 
              onClick={handleCompleteOrder}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg"
            >
              Complete Order →
            </Button>
          </div>

          {/* Right Side - Order Summary */}
          <div className="lg:pl-8">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {orderItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">{item.price.toLocaleString()} Rwf</p>
                  </div>
                  <span className="font-semibold">{item.quantity} ×</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <Input placeholder="Discount Code" />
              <Button variant="outline" className="w-full text-purple-600 border-purple-600">
                Apply Coupon
              </Button>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{subtotal.toLocaleString()}Frw</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Tax</span>
                <span>{shippingTax.toLocaleString()}Frw</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{total.toLocaleString()}Frw</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;