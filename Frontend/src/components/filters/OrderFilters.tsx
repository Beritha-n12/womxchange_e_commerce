import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, User, Package } from 'lucide-react';

interface OrderFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  userFilter: string;
  onUserChange: (value: string) => void;
  customDateRange?: { startDate: string; endDate: string };
  onCustomDateRangeChange?: (range: { startDate: string; endDate: string }) => void;
}

export const OrderFilters: React.FC<OrderFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  dateFilter,
  onDateChange,
  userFilter,
  onUserChange,
  customDateRange,
  onCustomDateRangeChange
}) => {
  const [showCustomDateRange, setShowCustomDateRange] = useState(false);
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search orders by ID, customer name, or email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Date</label>
          <Select value={dateFilter} onValueChange={(value) => {
            onDateChange(value);
            setShowCustomDateRange(value === 'custom');
          }}>
            <SelectTrigger>
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Payment</label>
          <Select value={userFilter} onValueChange={onUserChange}>
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

        {/* Clear Filters */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">&nbsp;</label>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              onSearchChange('');
              onStatusChange('all');
              onDateChange('all');
              onUserChange('all');
              setShowCustomDateRange(false);
              if (onCustomDateRangeChange) {
                onCustomDateRangeChange({ startDate: '', endDate: '' });
              }
            }}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Custom Date Range */}
      {showCustomDateRange && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <Input
              type="date"
              value={customDateRange?.startDate || ''}
              onChange={(e) => onCustomDateRangeChange?.({ 
                startDate: e.target.value, 
                endDate: customDateRange?.endDate || '' 
              })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <Input
              type="date"
              value={customDateRange?.endDate || ''}
              onChange={(e) => onCustomDateRangeChange?.({ 
                startDate: customDateRange?.startDate || '', 
                endDate: e.target.value 
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};