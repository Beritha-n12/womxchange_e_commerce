import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t('seller_filter.search_by_name')}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Category Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('seller_filter.category')}</label>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('seller_filter.all_categories')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('seller_filter.all_categories')}</SelectItem>
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
          <label className="text-sm font-medium text-gray-700">{t('seller_filter.stock_level')}</label>
          <Select value={stockFilter} onValueChange={onStockChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('seller_filter.all_stock')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('seller_filter.all_stock')}</SelectItem>
              <SelectItem value="in-stock">{t('seller_filter.in_stock')}</SelectItem>
              <SelectItem value="low-stock">{t('seller_filter.low_stock')}</SelectItem>
              <SelectItem value="critical-stock">{t('seller_filter.critical_stock')}</SelectItem>
              <SelectItem value="out-of-stock">{t('seller_filter.out_of_stock')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Performance Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('seller_filter.performance')}</label>
          <Select value="all" onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder={t('seller_filter.all_performance')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('seller_filter.all_performance')}</SelectItem>
              <SelectItem value="best-selling">{t('seller_filter.best_selling')}</SelectItem>
              <SelectItem value="needs-attention">{t('seller_filter.needs_attention')}</SelectItem>
              <SelectItem value="new-products">{t('seller_filter.new_products')}</SelectItem>
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
            {t('seller_filter.clear_all')}
          </Button>
        </div>
      </div>
    </div>
  );
};
