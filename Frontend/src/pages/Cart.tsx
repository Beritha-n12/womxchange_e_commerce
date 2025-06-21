
import { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "White dress",
      size: "Large",
      color: "White",
      price: 25000,
      quantity: 1,
      image: "/Dress.jpeg"
    },
    {
      id: 2,
      name: "Men Pant",
      size: "Large", 
      color: "blue",
      price: 15000,
      quantity: 1,
      image: "/Samba.jpeg"
    },
    {
      id: 3,
      name: "Sport T-shirt",
      size: "Large",
      color: "Sky Blue", 
      price: 10000,
      quantity: 1,
      image: "/Made in Rwanda shirts.jpeg"
    }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = Math.round(subtotal * 0.2);
  const deliveryFee = 1200;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-md">
        <h1 className="text-2xl font-bold mb-6">YOUR CART</h1>
        
        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-600">Size: {item.size}</p>
                <p className="text-sm text-gray-600">Color: {item.color}</p>
                <p className="font-semibold mt-1">{item.price.toLocaleString()} Rwf</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => removeItem(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-8 h-8 flex items-center justify-center border rounded"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold">{subtotal.toLocaleString()} Rwf</span>
            </div>
            <div className="flex justify-between text-red-600">
              <span>Discount (-20%)</span>
              <span>-{discount.toLocaleString()} Rwf</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-semibold">{deliveryFee.toLocaleString()} Rwf</span>
            </div>
            <div className="border-t pt-3 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>{total.toLocaleString()} Rwf</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <Link to="/checkout">
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-4 rounded-full">
            Go to checkout
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;