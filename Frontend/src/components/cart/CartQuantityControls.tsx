
import React, { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartQuantityControlsProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantityChange: (newQuantity: number) => void;
  maxStock?: number;
  isLoading?: boolean;
}

export const CartQuantityControls: React.FC<CartQuantityControlsProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onQuantityChange,
  maxStock = 999,
  isLoading = false
}) => {
  const [inputValue, setInputValue] = useState(quantity.toString());

  useEffect(() => {
    setInputValue(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input for typing
    if (value === '') {
      setInputValue('');
      return;
    }
    
    // Only allow numbers
    if (!/^\d+$/.test(value)) return;
    
    const numValue = parseInt(value);
    if (numValue > 0 && numValue <= maxStock) {
      setInputValue(value);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(inputValue);
    if (isNaN(numValue) || numValue < 1) {
      setInputValue(quantity.toString());
    } else if (numValue > maxStock) {
      setInputValue(maxStock.toString());
      onQuantityChange(maxStock);
    } else if (numValue !== quantity) {
      onQuantityChange(numValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  };

  return (
    <div className="flex w-32 items-center border rounded-md">
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecrease}
        disabled={quantity <= 1 || isLoading}
        className="h-8 w-8 p-0 shrink-0"
      >
        <Minus className="w-4 h-4" />
      </Button>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        className="h-8 px-2 text-center border-0 text-sm font-medium min-w-[3rem] focus:ring-0"
        min="1"
        max={maxStock}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrease}
        disabled={isLoading || quantity >= maxStock}
        className="h-8 w-8 p-0 shrink-0"
      >
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
};