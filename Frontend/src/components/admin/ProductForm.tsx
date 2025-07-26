import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getAllUsers } from '@/api/users';
import FileUpload, { FileData } from '@/components/chat/FileUpload';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductFormProps {
  editingProduct?: any;
  categories: any[];
  onUrlChange: (url: string) => void;
  previewImage: string;
  isLoading: boolean;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  editingProduct,
  categories,
  onUrlChange,
  previewImage,
  isLoading,
  onSubmit,
  onCancel,
}) => {
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    coverImage: '',
    colors: [] as string[],
    sizes: [] as string[],
    assignedSellerId: '',
  });

  const [newColor, setNewColor] = useState('');
  const [newSize, setNewSize] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const { data: usersData } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
    select: (response) => {
      const users = response.data || [];
      return users.filter((user) => user.role.toLowerCase() === 'seller');
    },
  });

  const sellers = usersData || [];

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price?.toString() || '',
        stock: editingProduct.stock?.toString() || '',
        categoryId: editingProduct.categoryId?.toString() || '',
        coverImage: editingProduct.coverImage || '',
        colors: editingProduct.colors || [],
        sizes: editingProduct.sizes || [],
        assignedSellerId: editingProduct.createdById?.toString() || '',
      });
      setImageUrl(editingProduct.coverImage || '');
    }
  }, [editingProduct]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      coverImage: previewImage || imageUrl || formData.coverImage,
      assignedSellerId: formData.assignedSellerId
        ? parseInt(formData.assignedSellerId)
        : undefined,
    };
    onSubmit(submitData);
  };

  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      setFormData((prev) => ({
        ...prev,
        colors: [...prev.colors, newColor.trim()],
      }));
      setNewColor('');
    }
  };

  const removeColor = (color: string) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c !== color),
    }));
  };

  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...prev.sizes, newSize.trim()],
      }));
      setNewSize('');
    }
  };

  const removeSize = (size: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((s) => s !== size),
    }));
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    onUrlChange(url);
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">{t('seller.name')}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="category">{t('seller.category')}</Label>
          <Select
            value={formData.categoryId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, categoryId: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t('seller.select_category')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">{t('seller.price')}</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, price: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="stock">{t('seller.stock')}</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, stock: e.target.value }))
            }
            required
          />
        </div>

        <div className="md:col-span-2">
          <Label htmlFor="assignedSeller">{t('seller.assign')}</Label>
          <Select
            value={formData.assignedSellerId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, assignedSellerId: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t('seller.select_seller')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="self">{t('seller.assign_self')}</SelectItem>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.id.toString()}>
                  {seller.businessName || seller.name} ({seller.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">{t('seller.description')}</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">{t('seller.image_label')}</Label>
        <div className="border-t pt-4">
          <Label className="block text-sm font-medium mb-2 p-2">
            {t('seller.upload_image')}
          </Label>
          <FileUpload
            onlyImages
            onFileSelect={(files: FileData[]) => {
              const imageFile = files.find((f) => f.type === 'image');
              if (imageFile) {
                handleImageUrlChange(imageFile.url);
              }
            }}
          />
          <Label className="block text-sm font-medium mb-2 p-2">
            {t('seller.or_use_url')}
          </Label>
        </div>

        <Input
          id="imageUrl"
          placeholder={t('seller.enter_image_url')}
          value={imageUrl}
          onChange={(e) => handleImageUrlChange(e.target.value)}
        />
        {previewImage && (
          <div className="mt-2">
            <img
              src={previewImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded border"
            />
          </div>
        )}
      </div>

      <div>
        <Label>{t('seller.available_colors')}</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder={t('seller.add_color')}
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
          />
          <Button type="button" onClick={addColor} size="sm">
            {t('seller.add')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.colors.map((color) => (
            <Badge
              key={color}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {color}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeColor(color)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label>{t('seller.available_sizes')}</Label>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder={t('seller.add_size')}
            value={newSize}
            onChange={(e) => setNewSize(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
          />
          <Button type="button" onClick={addSize} size="sm">
            {t('seller.add')}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.sizes.map((size) => (
            <Badge
              key={size}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {size}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeSize(size)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('seller.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? t('seller.processing')
            : editingProduct
            ? t('seller.update_product')
            : t('seller.create_product')}
        </Button>
      </div>
    </form>
  );
};
