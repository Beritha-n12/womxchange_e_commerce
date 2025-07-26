import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminProductFiltersProps {
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

export const AdminProductFilters: React.FC<AdminProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  dateFilter,
  onDateChange,
  stockFilter,
  onStockChange,
  categories = [],
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t('admin_filters.search_placeholder')}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('admin_filters.category')}</label>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('admin_filters.all_categories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin_filters.all_categories')}</SelectItem>
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
          <label className="text-sm font-medium text-gray-700">{t('admin_filters.stock')}</label>
          <Select value={stockFilter} onValueChange={onStockChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('admin_filters.all_stock')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin_filters.all_stock')}</SelectItem>
              <SelectItem value="in-stock">{t('admin_filters.in_stock')}</SelectItem>
              <SelectItem value="low-stock">{t('admin_filters.low_stock')}</SelectItem>
              <SelectItem value="out-of-stock">{t('admin_filters.out_of_stock')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('admin_filters.price_range')}</label>
          <Select value="all" onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder={t('admin_filters.all_prices')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin_filters.all_prices')}</SelectItem>
              <SelectItem value="low">{t('admin_filters.price_under_10000')}</SelectItem>
              <SelectItem value="medium">{t('admin_filters.price_between_10000_50000')}</SelectItem>
              <SelectItem value="high">{t('admin_filters.price_above_50000')}</SelectItem>
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
            {t('admin_filters.clear_all')}
          </Button>
        </div>
      </div>
    </div>
  );
};
