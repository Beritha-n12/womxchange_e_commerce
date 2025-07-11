import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface SellerProductFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  stockFilter: string;
  onStockChange: (value: string) => void;
  categories?: Array<{ id: number; name: string }>;
}

export const SellerProductFilters: React.FC<SellerProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  stockFilter,
  onStockChange,
  categories = []
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search my products by name..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
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


        {/* Stock Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Stock Level</label>
          <Select value={stockFilter} onValueChange={onStockChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in-stock">In Stock (1+)</SelectItem>
              <SelectItem value="low-stock">Low Stock (&lt;10)</SelectItem>
              <SelectItem value="critical-stock">Critical (&lt;5)</SelectItem>
              <SelectItem value="out-of-stock">Out of Stock (0)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Performance Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Performance</label>
          <Select value="all" onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder="All Performance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="best-selling">Best Selling</SelectItem>
              <SelectItem value="needs-attention">Needs Attention</SelectItem>
              <SelectItem value="new-products">New Products</SelectItem>
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
              onCategoryChange('all');
              onDateChange('all');
              onStockChange('all');
            }}
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};