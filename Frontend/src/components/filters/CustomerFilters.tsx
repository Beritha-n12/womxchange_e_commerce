import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CustomerFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
  orderCountFilter: string;
  onOrderCountChange: (value: string) => void;
}

export const CustomerFilters: React.FC<CustomerFiltersProps> = ({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateChange,
  orderCountFilter,
  onOrderCountChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t('sellerRequest.search_placeholder')}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Registration Date Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('sellerRequest.registration_date')}</label>
          <Select value={dateFilter} onValueChange={onDateChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('sellerRequest.all_dates')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('sellerRequest.all_dates')}</SelectItem>
              <SelectItem value="today">{t('sellerRequest.today')}</SelectItem>
              <SelectItem value="week">{t('sellerRequest.this_week')}</SelectItem>
              <SelectItem value="month">{t('sellerRequest.this_month')}</SelectItem>
              <SelectItem value="year">{t('sellerRequest.this_year')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Order Count Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('sellerRequest.number_of_orders')}</label>
          <Select value={orderCountFilter} onValueChange={onOrderCountChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('sellerRequest.all_orders')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('sellerRequest.all_orders')}</SelectItem>
              <SelectItem value="0">{t('sellerRequest.no_orders')}</SelectItem>
              <SelectItem value="1-5">{t('sellerRequest.orders_1_5')}</SelectItem>
              <SelectItem value="6-20">{t('sellerRequest.orders_6_20')}</SelectItem>
              <SelectItem value="20+">{t('sellerRequest.orders_20_plus')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity Status */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('sellerRequest.activity')}</label>
          <Select value="" onValueChange={() => {}}>
            <SelectTrigger>
              <SelectValue placeholder={t('sellerRequest.all_activity')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('sellerRequest.all_activity')}</SelectItem>
              <SelectItem value="active">{t('sellerRequest.recently_active')}</SelectItem>
              <SelectItem value="inactive">{t('sellerRequest.inactive')}</SelectItem>
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
              onOrderCountChange('all');
            }}
          >
            {t('sellerRequest.clear_all')}
          </Button>
        </div>
      </div>
    </div>
  );
};
