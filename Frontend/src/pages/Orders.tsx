
import React, { useContext, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, Package, Plus, Trash2, Edit, Eye, X, Search, Filter, Calendar } from 'lucide-react';
import { getAllOrders, confirmOrderPayment, deleteOrder, updateOrderStatus } from '@/api/orders';
import { AuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ThreeStepOrderCreation } from '@/components/admin/ThreeStepOrderCreation';
import { ThreeStepSellerOrderCreation } from '@/components/seller/ThreeStepSellerOrderCreation';
import { OrderUpdateDialog } from '@/components/OrderUpdateDialog';
import { Link } from 'react-router-dom';
import { useSellerPermissions } from '@/hooks/useSellerPermissions';

const Orders = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOrderOpen, setIsCreateOrderOpen] = useState(false);
  const [isUpdateOrderOpen, setIsUpdateOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string; endDate: string }>({ 
    startDate: '', 
    endDate: '' 
  });
  
  // Get seller permissions for permission-based button visibility
  const sellerPermissions = useSellerPermissions();

  const { data: ordersResponse, isLoading, error } = useQuery({
    queryKey: ['all-orders', user?.role, user?.id],
    queryFn: async () => {
      return getAllOrders(user?.role?.toLowerCase() || '', user?.id);
    },
    enabled: !!user && (user.role?.toLowerCase() === 'admin' || user.role?.toLowerCase() === 'seller'),
    staleTime: 30000,
    retry: (failureCount, error) => failureCount < 2,
  });

  const confirmPaymentMutation = useMutation({
    mutationFn: (orderId: number) => confirmOrderPayment(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['all-orders', user?.role, user?.id] });
      toast({ title: 'Payment confirmed', description: `Order #${orderId} payment confirmed.` });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to confirm payment',
        variant: 'destructive',
      });
    },
  });

  const cancelOrderMutation = useMutation({
    mutationFn: (orderId: number) =>
      updateOrderStatus(orderId, undefined, undefined, { status: 'CANCELLED', isCancelled: true }),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['all-orders', user?.role, user?.id] });
      toast({ title: 'Order cancelled', description: `Order #${orderId} has been cancelled.` });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to cancel order',
        variant: 'destructive',
      });
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: (orderId: number) => deleteOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['all-orders', user?.role, user?.id] });
      toast({ title: 'Order deleted', description: `Order #${orderId} has been deleted.` });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete order',
        variant: 'destructive',
      });
    },
  });

  const orders = React.useMemo(() => {
    if (Array.isArray(ordersResponse?.data)) return ordersResponse.data;
    if (Array.isArray(ordersResponse)) return ordersResponse;
    return [];
  }, [ordersResponse]);

  // Filter and search logic
  const filteredOrders = React.useMemo(() => {
    return orders.filter(order => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        order.id.toString().includes(searchTerm) ||
        (order.user?.name || order.customerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.user?.email || order.customerEmail || '').toLowerCase().includes(searchTerm.toLowerCase());

      // Unified status filter (combines order status and payment status)
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'cancelled' && order.status === 'CANCELLED') ||
        (statusFilter === 'pending' && order.status === 'PENDING') ||
        (statusFilter === 'confirmed' && order.status === 'CONFIRMED') ||
        (statusFilter === 'processing' && order.status === 'PROCESSING') ||
        (statusFilter === 'shipped' && order.status === 'SHIPPED') ||
        (statusFilter === 'delivered' && order.status === 'DELIVERED') ||
        (statusFilter === 'paid' && order.isPaid) ||
        (statusFilter === 'unpaid' && !order.isPaid);

      // Legacy payment filter (kept for compatibility)
      const matchesPayment = paymentFilter === 'all' ||
        (paymentFilter === 'paid' && order.isPaid) ||
        (paymentFilter === 'unpaid' && !order.isPaid);

      // Date filter with quick options and custom range
      const orderDate = new Date(order.createdAt);
      const today = new Date();
      let matchesDate = true;
      
      if (selectedDate === 'custom' && (customDateRange.startDate || customDateRange.endDate)) {
        const orderDateStr = orderDate.toISOString().split('T')[0];
        if (customDateRange.startDate && customDateRange.endDate) {
          matchesDate = orderDateStr >= customDateRange.startDate && orderDateStr <= customDateRange.endDate;
        } else if (customDateRange.startDate) {
          matchesDate = orderDateStr >= customDateRange.startDate;
        } else if (customDateRange.endDate) {
          matchesDate = orderDateStr <= customDateRange.endDate;
        }
      } else if (selectedDate && selectedDate !== '' && selectedDate !== 'all') {
        matchesDate = 
          (selectedDate === 'today' && orderDate.toDateString() === today.toDateString()) ||
          (selectedDate === '7days' && orderDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) ||
          (selectedDate === '30days' && orderDate >= new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)) ||
          (selectedDate !== 'today' && selectedDate !== '7days' && selectedDate !== '30days' && selectedDate !== 'custom' && 
           orderDate.toISOString().split('T')[0] === selectedDate);
      }

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, selectedDate, customDateRange]);

  const handleConfirmPayment = (orderId: number) => {
    confirmPaymentMutation.mutate(orderId);
  };

  const handleCancelOrder = (orderId: number) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      cancelOrderMutation.mutate(orderId);
    }
  };

  const handleDeleteOrder = (orderId: number) => {
    if (window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
      deleteOrderMutation.mutate(orderId);
    }
  };

  const handleUpdateOrder = (order: any) => {
    setSelectedOrder(order);
    setIsUpdateOrderOpen(true);
  };

  const userRole = user?.role?.toLowerCase();
  const isAdmin = userRole === 'admin';
  const isSeller = userRole === 'seller';

  if (isLoading) {
    return (
      <DashboardLayout currentPage="orders">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout currentPage="orders">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg text-red-600 mb-4">Failed to load orders</div>
            <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['all-orders', user?.role, user?.id] })}>
              Retry
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="orders">
      <div className="space-y-4 p-4 md:p-6">
        <div className="max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-700">Order Management</h1>
          </div>
          {(isAdmin || (isSeller && sellerPermissions.canCreateCustomers)) && (
            <Button onClick={() => setIsCreateOrderOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search Orders</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Order ID, customer name, email..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>


              {/* Unified Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Orders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending Orders</SelectItem>
                    <SelectItem value="delivered">Delivered Orders</SelectItem>
                    <SelectItem value="cancelled">Cancelled Orders</SelectItem>
                    <SelectItem value="paid">Paid Orders</SelectItem>
                    <SelectItem value="unpaid">Unpaid Orders</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter with Quick Options */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Filter by Date</label>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="custom">Custom date</SelectItem>
                  </SelectContent>
                </Select>
                 {selectedDate === 'custom' && (
                   <div className="grid grid-cols-2 gap-2 mt-2">
                     <Input
                       type="date"
                       value={customDateRange.startDate}
                       onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                       placeholder="Start date"
                       className="w-full"
                     />
                     <Input
                       type="date"
                       value={customDateRange.endDate}
                       onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                       placeholder="End date"
                       className="w-full"
                     />
                   </div>
                 )}
                {selectedDate && selectedDate !== 'custom' && selectedDate !== '' && (
                  <p className="text-xs text-gray-600">
                    Showing orders from {
                      selectedDate === 'today' ? 'today' :
                      selectedDate === '7days' ? 'last 7 days' :
                      selectedDate === '30days' ? 'last 30 days' :
                      new Date(selectedDate).toLocaleDateString()
                    }
                  </p>
                )}
              </div>
            </div>

            {/* Filter Summary */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                {(searchTerm || statusFilter !== 'all' || paymentFilter !== 'all' || selectedDate !== '') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setPaymentFilter('all');
                      setSelectedDate('');
                      setCustomDateRange({ startDate: '', endDate: '' });
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Real-time updates</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
                </p>
                {orders.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Try adjusting your search terms or filters
                  </p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead className="hidden sm:table-cell">Items</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead className="hidden md:table-cell">Payment</TableHead>
                      <TableHead className="hidden md:table-cell">Delivery</TableHead>
                      <TableHead className="hidden lg:table-cell">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {filteredOrders.map((order: any) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <Link to={`/orders/${order.id}`} className="text-blue-600 hover:underline">
                          #{order.id}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.user?.name || order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.user?.email || order.customerEmail}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {isSeller 
                          ? order.items?.filter((item: any) => item.product?.createdById === user?.id).length || 0
                          : order.items?.length || 0
                        }
                      </TableCell>
                      <TableCell>{order.totalPrice?.toLocaleString() || 0} Rwf</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <Badge variant={order.isPaid ? 'default' : 'secondary'} className="text-xs">
                            {order.isPaid ? 'Paid' : 'Pending'}
                          </Badge>
                          {order.isConfirmedByAdmin && order.status !== 'CANCELLED' && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              Admin Confirmed
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col gap-1">
                          <Badge variant={order.isDelivered ? 'default' : 'secondary'} className="text-xs">
                            {order.isDelivered ? 'Delivered' : 'Pending'}
                          </Badge>
                          {order.status === 'CANCELLED' && (
                            <Badge variant="destructive" className="text-xs">Cancelled</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1 flex-wrap gap-1">
                          <Link to={`/orders/${order.id}`}>
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          
                          {/* Admin actions - always show all buttons */}
                          {isAdmin && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleUpdateOrder(order)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              {!order.isPaid && (
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmPayment(order.id)}
                                  disabled={confirmPaymentMutation.isPending}
                                  className="bg-green-600 text-white"
                                >
                                  {confirmPaymentMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Confirm
                                    </>
                                  )}
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelOrder(order.id)}
                                className="text-red-600"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteOrder(order.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          
                          {/* Seller actions - permission-based button visibility */}
                          {isSeller && order.status !== 'CANCELLED' && (
                            <>
                              {/* Edit Order - only if has edit permission */}
                              {sellerPermissions.canEditOrder && (
                                <Button size="sm" variant="outline" onClick={() => handleUpdateOrder(order)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                              )}
                              
                              {/* Confirm Payment - only if has confirm permission and order is unpaid */}
                              {sellerPermissions.canConfirmOrder && !order.isPaid && (
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmPayment(order.id)}
                                  disabled={confirmPaymentMutation.isPending}
                                  className="bg-green-600 text-white"
                                >
                                  {confirmPaymentMutation.isPending ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-1" />
                                      Confirm
                                    </>
                                  )}
                                </Button>
                              )}
                              
                              {/* Cancel Order - only if has cancel permission */}
                              {sellerPermissions.canCancelOrder && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleCancelOrder(order.id)}
                                  className="text-red-600"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                              
                              {/* Delete Order - only if has delete permission */}
                              {sellerPermissions.canDeleteOrder && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteOrder(order.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {(isAdmin || isSeller) && (
          <>
            {/* Order Creation Dialog - show for admin or seller with create permission */}
            {(isAdmin) && (
              <ThreeStepOrderCreation isOpen={isCreateOrderOpen} onClose={() => setIsCreateOrderOpen(false)} />
            )}
               {((isSeller && sellerPermissions.canCreateCustomers)) && (
              <ThreeStepSellerOrderCreation isOpen={isCreateOrderOpen} onClose={() => setIsCreateOrderOpen(false)} />
            )}



            {/* Order Update Dialog - show for admin or seller with edit permission */}
            {selectedOrder && (isAdmin || (isSeller && sellerPermissions.canEditOrder)) && (
              <OrderUpdateDialog
                isOpen={isUpdateOrderOpen}
                onClose={() => {
                  setIsUpdateOrderOpen(false);
                  setSelectedOrder(null);
                }}
                order={selectedOrder}
                userRole={userRole || ''}
              />
            )}
          </>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Orders;