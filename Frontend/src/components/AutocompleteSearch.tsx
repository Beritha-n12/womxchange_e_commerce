import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Check } from 'lucide-react';

interface AutocompleteSearchProps {
  placeholder: string;
  items: any[];
  selectedItems: any[];
  onItemSelect: (item: any) => void;
  onItemRemove: (item: any) => void;
  displayField: string;
  searchFields: string[];
  maxDisplayItems?: number;
  className?: string;
}

export function AutocompleteSearch({
  placeholder,
  items,
  selectedItems,
  onItemSelect,
  onItemRemove,
  displayField,
  searchFields,
  maxDisplayItems = 5,
  className = ''
}: AutocompleteSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = items.filter(item => {
        return searchFields.some(field => {
          const value = field.split('.').reduce((obj, key) => obj?.[key], item);
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        });
      }).slice(0, maxDisplayItems);
      setFilteredItems(filtered);
      setShowResults(true);
    } else {
      setFilteredItems([]);
      setShowResults(false);
    }
  }, [searchTerm, items, searchFields, maxDisplayItems]);

  // Update search term when selectedItems change
  useEffect(() => {
    if (selectedItems.length > 0) {
      const lastSelected = selectedItems[selectedItems.length - 1];
      const displayValue = displayField.split('.').reduce((obj, key) => obj?.[key], lastSelected);
      setSearchTerm(displayValue || '');
    } else {
      setSearchTerm('');
    }
  }, [selectedItems, displayField]);

  const handleItemClick = (item: any) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    if (isSelected) {
      onItemRemove(item);
    } else {
      onItemSelect(item);
    }
    // Set search term to selected item's display field to show selection
    const displayValue = displayField.split('.').reduce((obj, key) => obj?.[key], item);
    setSearchTerm(displayValue || '');
    setShowResults(false);
  };

  const isItemSelected = (item: any) => {
    return selectedItems.some(selected => selected.id === item.id);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder={placeholder}
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm && setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && filteredItems.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto shadow-lg">
          <div className="p-2 space-y-1">
            {filteredItems.map((item) => {
              const isSelected = isItemSelected(item);
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    isSelected 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="flex-1">
                    <div className="font-medium">
                      {displayField.split('.').reduce((obj, key) => obj?.[key], item)}
                    </div>
                    {item.email && (
                      <div className="text-sm text-gray-500">{item.email}</div>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}