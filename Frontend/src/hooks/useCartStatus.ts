
import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { getCart } from '@/api/orders';
import { AuthContext } from '@/contexts/AuthContext';

export const useCartStatus = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  
  // Use the same query key strategy as useCart
  const cartId = !user ? parseInt(localStorage.getItem('anonymous_cart_id') || '0') || null : null;
  const queryKey = user && user.id
    ? ['cart', 'authenticated', user.id] 
    : ['cart', 'anonymous', cartId || 'no-cart'];

  const { data: cartData, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      const cartIdToUse = (user && user.id) ? null : cartId;
      const response = await getCart(cartIdToUse);
      return response?.data?.data || response?.data || null;
    },
    staleTime: 1000, // Same as useCart
    enabled: !authLoading,
  });

  console.log('🔍 useCartStatus - cartData:', cartData);
  console.log('🔍 useCartStatus - isLoading:', isLoading);
  console.log('🔍 useCartStatus - error:', error);

  const cartItems = cartData?.items || [];
  console.log('🔍 useCartStatus - cartItems:', cartItems);
  
  const isInCart = (productId: number) => {
    const inCart = cartItems.some((item: any) => item.productId === productId);
    console.log('🔍 useCartStatus - isInCart for productId', productId, ':', inCart);
    return inCart;
  };

  const getCartItemQuantity = (productId: number) => {
    const item = cartItems.find((item: any) => item.productId === productId);
    const quantity = item?.quantity || 0;
    console.log('🔍 useCartStatus - quantity for productId', productId, ':', quantity);
    return quantity;
  };

  return {
    isInCart,
    getCartItemQuantity,
    cartItems,
    isLoading,
    error,
  };
};
