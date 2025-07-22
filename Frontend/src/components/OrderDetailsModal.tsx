import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Trash2, User, Mail, Package, CreditCard, MapPin } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/api';

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: number) => {
      await api.delete(`/orders/unfinished/${orderId}`);
    },
    onSuccess: () => {
      toast({ title: 'Order deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['unfinished-orders'] });
      onClose();
    },
    onError: () => {
      toast({ title: 'Failed to delete order', variant: 'destructive' });
    }
  });

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Order Details #{order.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Status */}
          <div className="flex items-center gap-2">
            <Badge variant={order.status === 'incomplete' ? 'destructive' : 'secondary'}>
              {order.status}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {order.productsInvolved} products involved
            </span>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Name:</span> {order.userName || 'N/A'}</p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3 h-3" />
                  {order.userEmail || 'N/A'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Order Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Order Number:</span> {order.orderNumber || 'N/A'}</p>
                <p><span className="font-medium">Total Amount:</span> {order.totalAmount ? `${order.totalAmount.toLocaleString()} Rwf` : 'N/A'}</p>
                <p><span className="font-medium">Payment Status:</span> {order.paymentStatus || 'N/A'}</p>
                <p><span className="font-medium">Delivery Status:</span> {order.deliveryStatus || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Started:</span> {new Date(order.dateStarted).toLocaleString()}</p>
              <p><span className="font-medium">Last Activity:</span> {new Date(order.lastActivity).toLocaleString()}</p>
              {order.sessionId && <p><span className="font-medium">Session ID:</span> {order.sessionId}</p>}
            </div>
          </div>

          {/* Additional Details */}
          {order.billingAddress && (
            <div className="space-y-3">
              <h3 className="font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Billing Information
              </h3>
              <div className="text-sm text-muted-foreground">
                <p>{order.billingAddress}</p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => deleteOrderMutation.mutate(order.id)}
            disabled={deleteOrderMutation.isPending}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {deleteOrderMutation.isPending ? 'Deleting...' : 'Delete Order'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;