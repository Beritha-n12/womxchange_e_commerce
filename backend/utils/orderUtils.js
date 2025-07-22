
export const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
};

export const calculateOrderTotal = (items, shippingPrice = 0, discountAmount = 0) => {
  const itemsTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  return itemsTotal + shippingPrice - discountAmount;
};