import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
  label: string;
  placeholder: string;
  items: any[];
  selectedItem: any;
  onSelect: (item: any) => void;
  onClear: () => void;
  displayField: string;
  searchFields: string[];
  imageField?: string;
  className?: string;
  disabled?: boolean;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  placeholder,
  items,
  selectedItem,
  onSelect,
  onClear,
  displayField,
  searchFields,
  imageField,
  className,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Helper function to get nested field value
  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  // Filter items based on search term
  const filteredItems = items.filter(item => {
    if (!searchTerm) return true;
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });
  }).slice(0, 8); // Limit to 8 results

  // Handle item selection
  const handleSelect = (item: any) => {
    onSelect(item);
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle clear selection
  const handleClear = () => {
    onClear();
    setSearchTerm('');
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredItems.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredItems[highlightedIndex]) {
          handleSelect(filteredItems[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("space-y-2", className)} ref={dropdownRef}>
      <Label>{label}</Label>
      
      {/* Selected item display */}
      {selectedItem && (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center space-x-3">
            {imageField && getNestedValue(selectedItem, imageField) && (
              <img
                src={getNestedValue(selectedItem, imageField)}
                alt={getNestedValue(selectedItem, displayField)}
                className="w-10 h-10 object-cover rounded"
              />
            )}
            <div>
              <p className="font-medium text-green-800">
                {getNestedValue(selectedItem, displayField)}
              </p>
              {selectedItem.price && (
                <p className="text-sm text-green-600">
                  {selectedItem.price.toLocaleString()} Rwf
                </p>
              )}
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-green-600 hover:text-green-800"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Search input */}
      {!selectedItem && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
              setHighlightedIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10"
            disabled={disabled}
          />
        </div>
      )}

      {/* Dropdown results */}
      {isOpen && !selectedItem && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filteredItems.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No results found' : 'Start typing to search...'}
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                className={cn(
                  "flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50",
                  highlightedIndex === index && "bg-blue-50"
                )}
                onClick={() => handleSelect(item)}
              >
                {imageField && getNestedValue(item, imageField) && (
                  <img
                    src={getNestedValue(item, imageField)}
                    alt={getNestedValue(item, displayField)}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {getNestedValue(item, displayField)}
                  </p>
                  {item.email && (
                    <p className="text-sm text-gray-500 truncate">{item.email}</p>
                  )}
                  {item.phone && (
                    <p className="text-sm text-gray-500 truncate">{item.phone}</p>
                  )}
                  {item.price && (
                    <p className="text-sm text-green-600 font-medium">
                      {item.price.toLocaleString()} Rwf
                    </p>
                  )}
                  {item.stock !== undefined && (
                    <p className={cn(
                      "text-xs",
                      item.stock > 0 ? "text-green-600" : "text-red-600"
                    )}>
                      Stock: {item.stock}
                    </p>
                  )}
                </div>
                {highlightedIndex === index && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};