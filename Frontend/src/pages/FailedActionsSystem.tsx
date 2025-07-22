import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  AlertTriangle, 
  Package, 
  Lock, 
  Mail, 
  ShoppingCart, 
  MessageSquare, 
  Users, 
  Search,
  RefreshCw,
  Eye,
  Clock,
  Send,
  Repeat,
  Trash
} from 'lucide-react';
import { AuthContext } from '@/contexts/AuthContext';
import { getUnfinishedOrders } from '@/api/unfinishedOrders';
import { 
  getFailedLogins, 
  getFailedEmails, 
  getFailedCartOperations, 
  getFailedChatOperations,
  getFailedVendorOperations,
  getFailedOrderOperations,
  resendFailedEmail,
  retryFailedCartOperation,
  clearFailedLogin,
  retryFailedChatOperation
} from '@/api/failedActions';
import { useToast } from '@/hooks/use-toast';
import OrderDetailsModal from '@/components/OrderDetailsModal';

const FailedActionsSystem = () => {
  const { user } = useContext(AuthContext);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // Fetch unfinished orders
  const { data: unfinishedOrdersData, isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['unfinished-orders'],
    queryFn: getUnfinishedOrders,
    enabled: !!user && user.role?.toLowerCase() === 'admin',
  });

  // Fetch real failed actions data
  const { data: failedLogins = [], isLoading: loginsLoading, refetch: refetchLogins } = useQuery({
    queryKey: ['failed-logins'],
    queryFn: getFailedLogins,
    enabled: !!user && user.role?.toLowerCase() === 'admin',
  });

  const { data: failedEmails = [], isLoading: emailsLoading, refetch: refetchEmails } = useQuery({
    queryKey: ['failed-emails'],
    queryFn: getFailedEmails,
    enabled: !!user && user.role?.toLowerCase() === 'admin',
  });

  const { data: failedCartOps = [], isLoading: cartLoading, refetch: refetchCart } = useQuery({
    queryKey: ['failed-cart'],
    queryFn: getFailedCartOperations,
    enabled: !!user && user.role?.toLowerCase() === 'admin',
  });

  const { data: failedChatOps = [], isLoading: chatLoading, refetch: refetchChat } = useQuery({
    queryKey: ['failed-chat'],
    queryFn: getFailedChatOperations,
    enabled: !!user && user.role?.toLowerCase() === 'admin',
  });

  const { data: failedVendorOps = [], isLoading: vendorLoading, refetch: refetchVendor } = useQuery({
    queryKey: ['failed-vendor'],
    queryFn: getFailedVendorOperations,
    enabled: !!user && user.role?.toLowerCase() === 'admin',
  });

  const { data: failedOrderOps = [], isLoading: orderLoading, refetch: refetchOrderOps } = useQuery({
    queryKey: ['failed-order'],
    queryFn: getFailedOrderOperations,
    enabled: !!user && user.role?.toLowerCase() === 'admin',
  });

  // Resolution mutations
  const resendEmailMutation = useMutation({
    mutationFn: resendFailedEmail,
    onSuccess: () => {
      toast({ title: 'Email resent successfully' });
      refetchEmails();
    },
    onError: () => {
      toast({ title: 'Failed to resend email', variant: 'destructive' });
    }
  });

  const retryCartMutation = useMutation({
    mutationFn: retryFailedCartOperation,
    onSuccess: () => {
      toast({ title: 'Cart operation retried successfully' });
      refetchCart();
    },
    onError: () => {
      toast({ title: 'Failed to retry cart operation', variant: 'destructive' });
    }
  });

  const clearLoginMutation = useMutation({
    mutationFn: clearFailedLogin,
    onSuccess: () => {
      toast({ title: 'Failed login cleared successfully' });
      refetchLogins();
    },
    onError: () => {
      toast({ title: 'Failed to clear login', variant: 'destructive' });
    }
  });

  const retryChatMutation = useMutation({
    mutationFn: retryFailedChatOperation,
    onSuccess: () => {
      toast({ title: 'Chat operation retried successfully' });
      refetchChat();
    },
    onError: () => {
      toast({ title: 'Failed to retry chat operation', variant: 'destructive' });
    }
  });

  const unfinishedOrders = unfinishedOrdersData || [];

  const actionCategories = [
    {
      id: 'orders',
      title: 'Order Issues',
      icon: Package,
      count: unfinishedOrders.length + failedOrderOps.length,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      id: 'auth',
      title: 'Authentication Issues',
      icon: Lock,
      count: failedLogins.length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 'email',
      title: 'Email Issues',
      icon: Mail,
      count: failedEmails.length,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'cart',
      title: 'Cart Issues',
      icon: ShoppingCart,
      count: failedCartOps.length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'chat',
      title: 'Chat Issues',
      icon: MessageSquare,
      count: failedChatOps.length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 'vendor',
      title: 'Vendor Issues',
      icon: Users,
      count: failedVendorOps.length,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  const filteredOrders = unfinishedOrders.filter(order => 
    order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toString().includes(searchTerm)
  );

  const renderOrderIssues = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Failed/Unfinished Orders</h3>
        <Button onClick={() => refetchOrders()} size="sm" variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search orders..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {ordersLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No failed orders found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="destructive">Order #{order.id}</Badge>
                      <Badge variant="outline">
                        {order.totalAmount?.toLocaleString() || 0} Rwf
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p><strong>Customer:</strong> {order.userName || 'Unknown'}</p>
                      <p><strong>Email:</strong> {order.userEmail || 'N/A'}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                      <p className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(order.dateStarted).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => setSelectedOrder(order)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderIssueSection = (categoryId: string, issues: any[], fields: string[], getActionButtons?: (issue: any) => React.ReactNode) => (
    <div className="space-y-4">
      {issues.length === 0 ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No issues found in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map((issue, index) => (
            <Card key={issue.id || index} className="border-l-4 border-l-orange-500">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    {fields.map(field => (
                      <div key={field} className="text-sm">
                        <strong className="capitalize">{field.replace(/([A-Z])/g, ' $1')}:</strong> {issue[field]}
                      </div>
                    ))}
                  </div>
                  {getActionButtons && (
                    <div className="flex space-x-2">
                      {getActionButtons(issue)}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  if (!user || user.role?.toLowerCase() !== 'admin') {
    return (
      <DashboardLayout currentPage="failed-actions">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-red-600">Access denied. Admin rights required.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="failed-actions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900">Failed Actions Dashboard</h1>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {actionCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activeTab === category.id ? 'ring-2 ring-purple-500' : ''
                } ${category.bgColor}`}
                onClick={() => setActiveTab(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <IconComponent className={`w-8 h-8 mx-auto mb-2 ${category.color}`} />
                  <div className="text-2xl font-bold">{category.count}</div>
                  <div className="text-sm font-medium text-gray-700">{category.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            {actionCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {renderOrderIssues()}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="auth" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Authentication Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {renderIssueSection('auth', failedLogins, ['email', 'attemptTime', 'reason', 'ipAddress'], (login) => (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => clearLoginMutation.mutate(login.id)}
                    disabled={clearLoginMutation.isPending}
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Clear
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {renderIssueSection('email', failedEmails, ['recipient', 'subject', 'failureTime', 'reason'], (email) => (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => resendEmailMutation.mutate(email.id)}
                    disabled={resendEmailMutation.isPending}
                  >
                    <Send className="w-4 h-4 mr-1" />
                    Resend
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cart" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cart Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {renderIssueSection('cart', failedCartOps, ['userId', 'productId', 'attemptTime', 'reason'], (cartOp) => (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => retryCartMutation.mutate(cartOp.id)}
                    disabled={retryCartMutation.isPending}
                  >
                    <Repeat className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Chat Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {renderIssueSection('chat', failedChatOps, ['userId', 'messageType', 'failureTime', 'reason'], (chatOp) => (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => retryChatMutation.mutate(chatOp.id)}
                    disabled={retryChatMutation.isPending}
                  >
                    <Repeat className="w-4 h-4 mr-1" />
                    Retry
                  </Button>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Issues</CardTitle>
              </CardHeader>
              <CardContent>
                {renderIssueSection('vendor', failedVendorOps, ['vendorName', 'vendorEmail', 'operation', 'failureTime', 'reason'])}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </DashboardLayout>
  );
};

export default FailedActionsSystem;