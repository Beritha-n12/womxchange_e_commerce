
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BuyerLayout } from '@/components/layout/BuyerLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateProfile } from '@/api/profile';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Building } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';


const Profile = () => {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    businessName: user?.businessName || '',
    businessDescription: user?.businessDescription || '',
    businessLocation: user?.businessLocation || '',
    businessCategory: user?.businessCategory || '',
    businessWebsite: user?.businessWebsite || '',
  });

  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      updateUser(data.data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  const profileContent = (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>

            {(user.role && ['seller', 'admin', 'buyer'].includes(user.role.toLowerCase())) && (
              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                  <Building className="w-5 h-5" />
                  <span>Business Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Enter your business name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessCategory">Business Category</Label>
                    <Input
                      id="businessCategory"
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="e.g., Retail, Services, Manufacturing"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessLocation">Business Location</Label>
                    <Input
                      id="businessLocation"
                      name="businessLocation"
                      value={formData.businessLocation}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="City, District, Province"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessWebsite">Business Website</Label>
                    <Input
                      id="businessWebsite"
                      name="businessWebsite"
                      type="url"
                      value={formData.businessWebsite}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="https://www.yourbusiness.com"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="businessDescription">Business Description</Label>
                    <Textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      className="mt-1"
                      rows={3}
                      placeholder="Describe your business, products, or services"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Role:</span>
              <span className="text-sm font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Phone:</span>
                <span className="text-sm">{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Address:</span>
                <span className="text-sm">{user.address}</span>
              </div>
            )}
            {user.businessName && (
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Business:</span>
                <span className="text-sm">{user.businessName}</span>
              </div>
            )}
            {user.businessCategory && (
              <div className="flex items-center space-x-3">
                <span className="w-4 h-4 text-gray-500">📋</span>
                <span className="text-sm text-gray-600">Category:</span>
                <span className="text-sm">{user.businessCategory}</span>
              </div>
            )}
            {user.businessLocation && (
              <div className="flex items-center space-x-3">
                <span className="w-4 h-4 text-gray-500">📍</span>
                <span className="text-sm text-gray-600">Location:</span>
                <span className="text-sm">{user.businessLocation}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Use different layouts based on user role
  if (user.role === 'buyer'||'BUYER') {
    return (
      <BuyerLayout title="My Profile">
        {profileContent}
      </BuyerLayout>
    );
  }

  return (
    <DashboardLayout currentPage="profile">
      {profileContent}
    </DashboardLayout>
  );
};

export default Profile;
