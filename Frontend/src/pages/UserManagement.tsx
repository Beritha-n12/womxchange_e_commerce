
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UserFilters } from '@/components/filters/UserFilters';
import { 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  UserPlus,
  Plus
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllUsers, getUser, createUser, deleteUser, updateUser, User, UpdateUserData, CreateUserData } from '@/api/users';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useLanguage } from '@/contexts/LanguageContext';

const UserManagement = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const editForm = useForm<UpdateUserData>();
  const createForm = useForm<CreateUserData>();

  const { data: usersData, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getAllUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
      createForm.reset();
      toast({
        title: t('common.success'),
        description: t('user_management.user_created_success'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('user_management.failed_create_user'),
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: t('common.success'),
        description: t('user_management.user_deleted_success'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('user_management.failed_delete_user'),
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserData }) =>
      updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditModalOpen(false);
      editForm.reset();
      toast({
        title: t('common.success'),
        description: t('user_management.user_updated_success'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.response?.data?.message || t('user_management.failed_update_user'),
        variant: "destructive",
      });
    },
  });

  const users = usersData?.data || [];
  
  // Apply filters
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role.toLowerCase() === roleFilter;
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && user.isActive) ||
                         (statusFilter === 'inactive' && !user.isActive);
    
    const matchesDate = dateFilter === 'all' || (() => {
      const userDate = new Date(user.createdAt);
      const now = new Date();
      switch (dateFilter) {
        case 'today':
          return userDate.toDateString() === now.toDateString();
        case 'week':
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return userDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(now);
          monthAgo.setMonth(now.getMonth() - 1);
          return userDate >= monthAgo;
        case 'year':
          const yearAgo = new Date(now);
          yearAgo.setFullYear(now.getFullYear() - 1);
          return userDate >= yearAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesRole && matchesStatus && matchesDate;
  });

  const handleDelete = (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(userId);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      name: user.name,
      email: user.email,
      role: user.role.toLowerCase(),
      phone: user.phone || '',
      address: user.address || '',
      bio: user.bio || '',
      company: user.company || '',
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleView = (user: User) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const onEditSubmit = (data: UpdateUserData) => {
    if (selectedUser) {
      updateMutation.mutate({ userId: selectedUser.id, data });
    }
  };

  const onCreateSubmit = (data: CreateUserData) => {
    createMutation.mutate(data);
  };

  const getRoleBadge = (role: string) => {
    const roleColors = {
      admin: 'bg-red-100 text-red-800',
      seller: 'bg-blue-100 text-blue-800',
      buyer: 'bg-green-100 text-green-800',
    };
    return roleColors[role.toLowerCase() as keyof typeof roleColors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <DashboardLayout currentPage="user-management">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-gray-600">{t('user_management.loading_users')}</div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout currentPage="user-management">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg text-red-600">{t('user_management.failed_load_users')}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="user-management">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{t('user_management.title')}</h1>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-purple-700 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-2" />
            {t('user_management.create_user')}
          </Button>
        </div>

        {/* Filters */}
        <UserFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          roleFilter={roleFilter}
          onRoleChange={setRoleFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          dateFilter={dateFilter}
          onDateChange={setDateFilter}
        />

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('user_management.all_users')} ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('user_management.user')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('user_management.email')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('user_management.role')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('user_management.status')}</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">{t('user_management.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user: User) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-600 font-medium">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            {user.businessName && (
                              <p className="text-sm text-gray-500">{user.businessName}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{user.email}</td>
                      <td className="px-4 py-3">
                        <Badge className={getRoleBadge(user.role)}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.isActive ? t('user_management.active') : t('user_management.inactive')}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(user)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {user.role.toLowerCase() !== 'admin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDelete(user.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create User Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('user_management.create_new_user')}</DialogTitle>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('user_management.name')}</FormLabel>
                      <FormControl>
                        <Input {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={createForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('user_management.email')}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('user_management.password')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} required />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('user_management.role')}</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t('user_management.select_role')} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="buyer">{t('user_management.buyer')}</SelectItem>
                          <SelectItem value="seller">{t('user_management.seller')}</SelectItem>
                          <SelectItem value="admin">{t('user_management.admin')}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1"
                  >
                    {createMutation.isPending ? t('user_management.creating') : t('user_management.create_user')}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="flex-1"
                  >
                    {t('common.cancel')}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{t('user_management.edit_user')}</DialogTitle>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="buyer">Buyer</SelectItem>
                          <SelectItem value="seller">Seller</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1"
                  >
                    {updateMutation.isPending ? 'Updating...' : 'Update User'}
                  </Button>
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View User Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <Badge className={getRoleBadge(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge className={selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                {selectedUser.phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                  </div>
                )}
                {selectedUser.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <p className="text-sm text-gray-900">{selectedUser.address}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-700">Joined</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;