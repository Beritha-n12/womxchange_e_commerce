import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { UserResponse } from '../api/auth';
import api from '../api/api';
import { isTokenExpired } from '../utils/tokenUtils';

interface AuthContextType {
  user: UserResponse | null;
  login: (userData: UserResponse) => void;
  logout: () => void;
  loading: boolean;
  updateUser?: (data: Partial<UserResponse>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Check token expiry periodically
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('token');
      
      if (token && user) {
        console.log('🕐 AuthContext: Checking token expiry...');
        
        if (isTokenExpired(token)) {
          console.log('⏰ AuthContext: Token expired, logging out user');
          logout();
          return;
        }
        
        console.log('✅ AuthContext: Token still valid');
      }
    };

    // Check token expiry every 5 minutes
    const interval = setInterval(checkTokenExpiry, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🚀 AuthContext: Starting authentication initialization...');
      
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        console.log('📦 AuthContext: localStorage check:', {
          hasUserData: !!userData,
          hasToken: !!token
        });
        
        if (!userData || !token) {
          console.log('❌ AuthContext: No stored auth data found');
          setUser(null);
          setLoading(false);
          return;
        }

        // Check if token is expired client-side first
        if (isTokenExpired(token)) {
          console.log('⏰ AuthContext: Token expired (client-side check), clearing auth data');
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          setUser(null);
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        console.log('👤 AuthContext: Parsed user from localStorage:', {
          id: parsedUser.id,
          email: parsedUser.email,
          role: parsedUser.role
        });
        
        // Set the authorization header BEFORE making the verification request
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        console.log('🔧 AuthContext: Set Authorization header in axios defaults');
        
        console.log('🔍 AuthContext: Making token verification request...');
        const response = await api.get('/auth/verify-token');
        console.log('✅ AuthContext: Token verification response:', response.data);
        
        if (response.data.success && response.data.user) {
          const verifiedUser: UserResponse = {
            id: response.data.user.id,
            name: response.data.user.name,
            email: response.data.user.email,
            role: response.data.user.role,
            token: token,
            user: response.data.user,
            isActive: response.data.user.isActive,
            sellerStatus: response.data.user.sellerStatus,
            sellerPermissions: response.data.user.sellerPermissions,
            phone: '',
            address: '',
            businessName: '',
            businessDescription: '',
            businessLocation: '',
            businessCategory: '',
            businessWebsite: ''
          };
          
          console.log('🔄 AuthContext: Setting verified user data:', {
            id: verifiedUser.id,
            email: verifiedUser.email,
            role: verifiedUser.role,
            isActive: verifiedUser.isActive,
            sellerStatus: verifiedUser.sellerStatus
          });
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(verifiedUser));
          
          // Set user state - THIS IS THE CRITICAL PART
          setUser(verifiedUser);
          console.log('✅ AuthContext: User state successfully set, user is logged in');
        } else {
          console.log('❌ AuthContext: Invalid token verification response');
          throw new Error('Invalid token verification response');
        }
      } catch (error) {
        console.error('❌ AuthContext: Token verification failed:', error);
        console.log('🧹 AuthContext: Clearing invalid auth data');
        
        // Clear all auth data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      } finally {
        setLoading(false);
        console.log('🏁 AuthContext: Authentication initialization completed');
        console.log('👤 AuthContext: Final user state:', user ? { id: user.id, email: user.email } : 'null');
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: UserResponse) => {
    console.log('🔐 AuthContext: Logging in user:', {
      email: userData.email,
      id: userData.id,
      role: userData.role
    });
    
    try {
      // Check if token is expired before setting it
      if (isTokenExpired(userData.token)) {
        console.log('⏰ AuthContext: Received expired token during login');
        throw new Error('Received expired token');
      }

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', userData.token);
      console.log('💾 AuthContext: Stored user data in localStorage');
      
      // Set axios default header
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      console.log('🔧 AuthContext: Set axios authorization header');
      
      // Update state
      setUser(userData);
      console.log('✅ AuthContext: Login successful, user state updated:', {
        id: userData.id,
        email: userData.email,
        role: userData.role
      });
    } catch (error) {
      console.error('❌ AuthContext: Error during login:', error);
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      // Before logging out, check if user has items in cart and save as abandoned
      const cartResponse = await api.get('/orders/cart');
      const cartData = cartResponse?.data?.data;
      
      if (cartData?.items && cartData.items.length > 0) {
        console.log('🛒 User logging out with items in cart, saving as abandoned...');
        
        const totalAmount = cartData.items.reduce((total: number, item: any) => {
          return total + (item.product.price * item.quantity);
        }, 0);

        try {
          await api.post('/orders/abandoned-cart', {
            userId: user?.id || null,
            userName: user?.name || 'Unknown User',
            userEmail: user?.email || 'No email',
            cartItems: cartData.items,
            totalAmount: totalAmount,
            sessionId: `logout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          });
          console.log('✅ Abandoned cart saved on logout');
        } catch (abandonedCartError) {
          console.error('❌ Failed to save abandoned cart on logout:', abandonedCartError);
        }
      }

      // Now proceed with logout
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
      
      // Clear any anonymous cart data
      localStorage.removeItem('anonymous_cart_id');
      
      // Redirect to homepage
      window.location.href = '/';
      
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('anonymous_cart_id');
      setUser(null);
      setLoading(false);
    }
  }, [user]);

  // Debug log for context value
  console.log('🔄 AuthContext: Context value:', {
    hasUser: !!user,
    userId: user?.id,
    userEmail: user?.email,
    loading
  });

  const updateUser = (data: Partial<UserResponse>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};