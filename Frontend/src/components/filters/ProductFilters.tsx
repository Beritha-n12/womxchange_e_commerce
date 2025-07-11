import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, DollarSign, Calendar } from 'lucide-react';

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  categories?: Array<{ id: number; name: string }>;
  priceFilter?: { min: number; max: number };
  onPriceChange?: (min: number, max: number) => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  categories = [],
  priceFilter,
  onPriceChange
}) => {
  const [minPrice, setMinPrice] = useState(priceFilter?.min?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(priceFilter?.max?.toString() || '');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const handlePriceFilter = () => {
    const min = parseFloat(minPrice) || 0;
    const max = parseFloat(maxPrice) || Infinity;
    if (onPriceChange) {
      onPriceChange(min, max);
    }
  };

  const handleCustomDateFilter = () => {
    if (customStartDate && customEndDate) {
      onDateChange(`custom-${customStartDate}-${customEndDate}`);
    }
  };
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search products by name, SKU, or description..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Price Range (Rwf)
          </label>
          <div className="flex space-x-2">
            <Input
              placeholder="Min"
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="text-xs"
            />
            <Input
              placeholder="Max"
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="text-xs"
            />
          </div>
          {onPriceChange && (minPrice || maxPrice) && (
            <Button size="sm" onClick={handlePriceFilter} className="w-full text-xs">
              Apply Price
            </Button>
          )}
        </div>

        {/* Date Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Created Date
          </label>
          <Select value={dateFilter} onValueChange={onDateChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {dateFilter === 'custom' && (
            <div className="space-y-1 pt-1">
              <div className="grid grid-cols-2 gap-1">
                <Input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="text-xs"
                />
                <Input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="text-xs"
                />
              </div>
              {customStartDate && customEndDate && (
                <Button size="sm" onClick={handleCustomDateFilter} className="w-full text-xs">
                  Apply Range
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Clear Filters */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">&nbsp;</label>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => {
              onSearchChange('');
              onCategoryChange('all');
              onDateChange('all');
              setMinPrice('');
              setMaxPrice('');
              setCustomStartDate('');
              setCustomEndDate('');
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};