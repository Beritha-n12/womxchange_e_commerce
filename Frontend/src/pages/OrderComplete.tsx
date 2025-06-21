
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const OrderComplete = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Order Completed</h1>
          <p className="text-gray-600">
            Your purchases are secured by an industry best encryption service - Braintree
          </p>
        </div>
        
        <Link to="/">
          <Button className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg">
            Return to Home Page →
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderComplete;