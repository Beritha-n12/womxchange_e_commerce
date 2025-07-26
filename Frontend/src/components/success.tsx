import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from '@/components/ui/button'; // Adjust import as needed
import { APP_CONSTANTS, ROUTES } from '@/constants/app'; // Adjust import as needed

function YourOrderComponent() {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(""); // set this based on your form

  const handlePlaceOrder = async () => {
    try {
      // Your existing order placing logic here...

      // On successful order placement:
      if (
        paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.MTN ||
        paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.PAY_ON_DELIVERY
      ) {
        setOrderPlaced(true);
      }
    } catch (error) {
      // Handle errors here...
      console.error(error);
    }
  };

  return (
    <div>
      {/* Your order form/button here */}
      <button onClick={handlePlaceOrder}>Place Order</button>

      {/* Inline success message instead of toast */}
      {orderPlaced && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">✅ Order Completed!</h3>
          <p className="text-green-700 text-sm">
            Your order has been placed successfully.
            {paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.MTN &&
              " Please complete the payment using the MoMo code above."}
            {paymentMethod === APP_CONSTANTS.PAYMENT_METHODS.PAY_ON_DELIVERY &&
              " Payment will be collected on delivery."}
            You will receive email updates about your order status.
          </p>
          <Link to="/products" className="inline-block mt-2">
            <Button variant="outline" size="sm">
              Continue Shopping
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default YourOrderComponent;
