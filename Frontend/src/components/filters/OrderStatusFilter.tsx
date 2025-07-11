import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderStatusFilterProps {
  statusFilter: string;
  paymentFilter: string;
  onStatusChange: (value: string) => void;
  onPaymentChange: (value: string) => void;
}

export function OrderStatusFilter({ 
  statusFilter, 
  paymentFilter, 
  onStatusChange, 
  onPaymentChange 
}: OrderStatusFilterProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Combined Status Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Order & Payment Status</label>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Orders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending Orders</SelectItem>
            <SelectItem value="confirmed">Confirmed Orders</SelectItem>
            <SelectItem value="processing">Processing Orders</SelectItem>
            <SelectItem value="shipped">Shipped Orders</SelectItem>
            <SelectItem value="delivered">Delivered Orders</SelectItem>
            <SelectItem value="cancelled">Cancelled Orders</SelectItem>
            <SelectItem value="paid">Paid Orders</SelectItem>
            <SelectItem value="unpaid">Unpaid Orders</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Payment Status */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Payment Status</label>
        <Select value={paymentFilter} onValueChange={onPaymentChange}>
          <SelectTrigger>
            <SelectValue placeholder="All Payments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}