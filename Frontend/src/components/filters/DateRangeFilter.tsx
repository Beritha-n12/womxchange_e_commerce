import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';

interface DateRangeFilterProps {
  dateFilter: string;
  onDateChange: (value: string) => void;
  onCustomDateRange?: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ dateFilter, onDateChange, onCustomDateRange }: DateRangeFilterProps) {
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleDateFilterChange = (value: string) => {
    if (value === 'custom') {
      setShowCustomRange(true);
    } else {
      setShowCustomRange(false);
      onDateChange(value);
    }
  };

  const handleCustomDateSubmit = () => {
    if (startDate && endDate && onCustomDateRange) {
      onCustomDateRange(startDate, endDate);
      onDateChange('custom');
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center space-x-1">
        <Calendar className="w-4 h-4" />
        <span>Date Range</span>
      </label>
      <Select value={dateFilter} onValueChange={handleDateFilterChange}>
        <SelectTrigger>
          <SelectValue placeholder="All Dates" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Dates</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">Last 7 Days</SelectItem>
          <SelectItem value="month">Last 30 Days</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>
      
      {showCustomRange && (
        <div className="space-y-2 pt-2 border-t">
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="date"
              placeholder="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              placeholder="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {startDate && endDate && (
            <button
              onClick={handleCustomDateSubmit}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Apply Custom Range
            </button>
          )}
        </div>
      )}
    </div>
  );
}