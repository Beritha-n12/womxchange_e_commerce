
import { useEffect, useRef, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '@/contexts/AuthContext';
import { getCart } from '@/api/orders';
import api from '@/api/api';

const ABANDONMENT_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const ACTIVITY_CHECK_INTERVAL = 5 * 60 * 1000; // Check every 5 minutes

export const useAbandonedCartTracker = () => {
  const { user } = useContext(AuthContext);
  const lastActivityRef = useRef<number>(Date.now());
  const abandonmentTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activityCheckTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Get cart data directly without using useCart to avoid circular dependency
  const cartId = !user ? parseInt(localStorage.getItem('anonymous_cart_id') || '0') || null : null;
  const queryKey = user && user.id
    ? ['cart', 'authenticated', user.id] 
    : ['cart', 'anonymous', cartId || 'no-cart'];

  const { data: cartData } = useQuery({
    queryKey,
    queryFn: async () => {
      try {
        const cartIdToUse = (user && user.id) ? null : cartId;
        const response = await getCart(cartIdToUse);
        return response?.data?.data || response?.data || null;
      } catch (error) {
        console.error('Error fetching cart for abandonment tracking:', error);
        return null;
      }
    },
    staleTime: 5000,
    enabled: !!user || !!cartId,
  });

  const cartItems = cartData?.items || [];

  // Update last activity when cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      lastActivityRef.current = Date.now();
      console.log('🛒 Cart activity detected, resetting abandonment timer');
    }
  }, [cartItems]);

  // Save abandoned cart when user logs out with items
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (cartItems.length > 0) {
        saveAbandonedCart();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && cartItems.length > 0) {
        // User switched away from tab - potential abandonment
        lastActivityRef.current = Date.now();
      }
    };

    // Save abandoned cart on page unload
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cartItems]);

  // Periodic check for cart abandonment
  useEffect(() => {
    if (cartItems.length > 0) {
      // Clear any existing timers
      if (abandonmentTimerRef.current) {
        clearTimeout(abandonmentTimerRef.current);
      }
      if (activityCheckTimerRef.current) {
        clearInterval(activityCheckTimerRef.current);
      }

      // Set up abandonment detection
      abandonmentTimerRef.current = setTimeout(() => {
        console.log('🛒 Cart abandoned after timeout, saving...');
        saveAbandonedCart();
      }, ABANDONMENT_TIMEOUT);

      // Set up periodic activity check
      activityCheckTimerRef.current = setInterval(() => {
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity > ABANDONMENT_TIMEOUT && cartItems.length > 0) {
          console.log('🛒 Cart abandoned due to inactivity, saving...');
          saveAbandonedCart();
          if (activityCheckTimerRef.current) {
            clearInterval(activityCheckTimerRef.current);
          }
        }
      }, ACTIVITY_CHECK_INTERVAL);
    }

    return () => {
      if (abandonmentTimerRef.current) {
        clearTimeout(abandonmentTimerRef.current);
      }
      if (activityCheckTimerRef.current) {
        clearInterval(activityCheckTimerRef.current);
      }
    };
  }, [cartItems.length]);

  const saveAbandonedCart = async () => {
    if (cartItems.length === 0) return;

    try {
      const totalAmount = cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
      }, 0);

      const abandonedCartData = {
        userId: user?.id || null,
        userName: user?.name || 'Anonymous User',
        userEmail: user?.email || 'anonymous@example.com',
        cartItems: cartItems,
        totalAmount: totalAmount,
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log('💾 Saving abandoned cart:', abandonedCartData);

      const response = await api.post('/orders/abandoned-cart', abandonedCartData);
      
      if (response.data.success) {
        console.log('✅ Abandoned cart saved successfully');
      }
    } catch (error) {
      console.error('❌ Failed to save abandoned cart:', error);
    }
  };

  // Manual function to mark cart as abandoned (for logout scenarios)
  const markCartAsAbandoned = () => {
    if (cartItems.length > 0) {
      console.log('🛒 Manually marking cart as abandoned');
      saveAbandonedCart();
    }
  };

  return {
    markCartAsAbandoned,
    saveAbandonedCart
  };
};
