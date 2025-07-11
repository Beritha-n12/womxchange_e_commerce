import api from './api';

export interface FailedLogin {
  id: number;
  email: string;
  attemptTime: string;
  reason: string;
  ipAddress: string;
}

export interface FailedEmail {
  id: number;
  recipient: string;
  subject: string;
  failureTime: string;
  reason: string;
}

export interface FailedCartOperation {
  id: number;
  userId: number;
  productId: number;
  attemptTime: string;
  reason: string;
}

export interface FailedChatOperation {
  id: number;
  userId: number;
  messageType: string;
  failureTime: string;
  reason: string;
}

export interface FailedVendorOperation {
  id: number;
  userId: number;
  vendorName: string;
  vendorEmail: string;
  failureTime: string;
  reason: string;
  operation: string;
}

export interface FailedOrderOperation {
  id: number;
  userId: number;
  customerName: string;
  customerEmail: string;
  orderId?: number;
  failureTime: string;
  reason: string;
  operation: string;
}

export const getFailedLogins = async (): Promise<FailedLogin[]> => {
  const response = await api.get<FailedLogin[]>('/failed-actions/logins');
  return response.data;
};

export const getFailedEmails = async (): Promise<FailedEmail[]> => {
  const response = await api.get<FailedEmail[]>('/failed-actions/emails');
  return response.data;
};

export const getFailedCartOperations = async (): Promise<FailedCartOperation[]> => {
  const response = await api.get<FailedCartOperation[]>('/failed-actions/cart');
  return response.data;
};

export const getFailedChatOperations = async (): Promise<FailedChatOperation[]> => {
  const response = await api.get<FailedChatOperation[]>('/failed-actions/chat');
  return response.data;
};

export const getFailedVendorOperations = async (): Promise<FailedVendorOperation[]> => {
  const response = await api.get<FailedVendorOperation[]>('/failed-actions/vendors');
  return response.data;
};

export const getFailedOrderOperations = async (): Promise<FailedOrderOperation[]> => {
  const response = await api.get<FailedOrderOperation[]>('/failed-actions/orders');
  return response.data;
};

export const resendFailedEmail = async (emailId: number): Promise<any> => {
  const response = await api.post(`/failed-actions/emails/${emailId}/resend`);
  return response.data;
};

export const retryFailedCartOperation = async (operationId: number): Promise<any> => {
  const response = await api.post(`/failed-actions/cart/${operationId}/retry`);
  return response.data;
};

export const clearFailedLogin = async (loginId: number): Promise<any> => {
  const response = await api.delete(`/failed-actions/logins/${loginId}`);
  return response.data;
};

export const retryFailedChatOperation = async (chatId: number): Promise<any> => {
  const response = await api.post(`/failed-actions/chat/${chatId}/retry`);
  return response.data;
};