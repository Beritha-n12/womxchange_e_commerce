import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface VendorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

export const VendorFilters: React.FC<VendorFiltersProps> = ({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateChange,
  statusFilter,
  onStatusChange
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search vendors by name or email..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Join Date Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Join Date</label>
          <Select value={dateFilter} onValueChange={onDateChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Product Count Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Product Count</label>
          <Select value="all" onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder="All Counts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counts</SelectItem>
              <SelectItem value="0">No Products</SelectItem>
              <SelectItem value="1-5">1-5 Products</SelectItem>
              <SelectItem value="6-20">6-20 Products</SelectItem>
              <SelectItem value="20+">20+ Products</SelectItem>
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
              onDateChange('all');
              onStatusChange('all');
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};