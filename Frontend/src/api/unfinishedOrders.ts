import api from './api';

export interface UnfinishedOrder {
  id: number;
  userName: string;
  userEmail: string;
  dateStarted: string;
  status: 'incomplete' | 'abandoned' | 'error' | 'timeout';
  productsInvolved: number;
  totalAmount?: number;
  lastActivity: string;
  sessionId?: string;
  orderNumber?: string;
  paymentStatus?: string;
  deliveryStatus?: string;
}

export const getUnfinishedOrders = async (): Promise<UnfinishedOrder[]> => {
  const response = await api.get<UnfinishedOrder[]>('/orders/unfinished');
  return response.data;
};

export const deleteUnfinishedOrder = async (orderId: number): Promise<any> => {
  const response = await api.delete(`/orders/unfinished/${orderId}`);
  return response.data;
};