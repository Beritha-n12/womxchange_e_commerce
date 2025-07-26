import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  roleFilter: string;
  onRoleChange: (value: string) => void;
  dateFilter: string;
  onDateChange: (value: string) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roleFilter,
  onRoleChange,
  dateFilter,
  onDateChange
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={t('user_filters.search_placeholder')}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Status Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('user_filters.status')}</label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('user_filters.all_status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('user_filters.all_status')}</SelectItem>
              <SelectItem value="active">{t('user_filters.active')}</SelectItem>
              <SelectItem value="inactive">{t('user_filters.inactive')}</SelectItem>
              <SelectItem value="blocked">{t('user_filters.blocked')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Role Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('user_filters.role')}</label>
          <Select value={roleFilter} onValueChange={onRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('user_filters.all_roles')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('user_filters.all_roles')}</SelectItem>
              <SelectItem value="buyer">{t('user_filters.buyers')}</SelectItem>
              <SelectItem value="seller">{t('user_filters.sellers')}</SelectItem>
              <SelectItem value="admin">{t('user_filters.admins')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">{t('user_filters.registered')}</label>
          <Select value={dateFilter} onValueChange={onDateChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('user_filters.all_dates')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('user_filters.all_dates')}</SelectItem>
              <SelectItem value="today">{t('user_filters.today')}</SelectItem>
              <SelectItem value="week">{t('user_filters.this_week')}</SelectItem>
              <SelectItem value="month">{t('user_filters.this_month')}</SelectItem>
              <SelectItem value="year">{t('user_filters.this_year')}</SelectItem>
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
              onRoleChange('all');
              onDateChange('all');
            }}
          >
            {t('user_filters.clear_all')}
          </Button>
        </div>
      </div>
    </div>
  );
};
