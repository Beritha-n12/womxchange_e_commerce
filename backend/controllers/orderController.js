import prisma from '../utils/prismaClient.js';
import { sendOrderConfirmationEmail, sendOrderCancellationEmail, sendPaymentConfirmationEmail,sendDeliveryStatusUpdateEmail } from '../utils/emailService.js';
import { generateOrderNumber } from '../utils/orderUtils.js';
import { logFailedAction } from './failedActionsController.js';

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity, cartId } = req.body;
    const userId = req.user?.id;

    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Missing productId or quantity' });
    }

    // Check if product exists and get its price
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: `Insufficient stock. Only ${product.stock} available.` });
    }

    let cart;

    if (userId) {
      // Authenticated user
      cart = await prisma.cart.upsert({
        where: { userId: userId },
        update: {},
        create: { userId: userId }
      });
    } else {
      // Anonymous user
      if (cartId) {
        cart = await prisma.cart.findUnique({
          where: { id: cartId }
        });

        if (!cart) {
          return res.status(404).json({ message: 'Cart not found' });
        }
      } else {
        cart = await prisma.cart.create({
          data: {}
        });
      }
    }

    // Check if the item already exists in the cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (existingCartItem) {
      // Update quantity if item exists
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: { increment: quantity } }
      });

      return res.status(200).json({
        message: 'Cart item quantity updated',
        cartId: cart.id,
        item: updatedCartItem
      });
    } else {
      // Add new item to cart
      const newCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: quantity
        }
      });

      return res.status(201).json({
        message: 'Cart item added',
        cartId: cart.id,
        item: newCartItem
      });
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ message: 'Failed to add item to cart', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, cartId } = req.body;
    const userId = req.user?.id;

    if (!productId) {
      return res.status(400).json({ message: 'Missing productId' });
    }

    let cart;

    if (userId) {
      // Authenticated user
      cart = await prisma.cart.findUnique({
        where: { userId: userId }
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found for user' });
      }
    } else {
      // Anonymous user
      if (!cartId) {
        return res.status(400).json({ message: 'Missing cartId for anonymous user' });
      }

      cart = await prisma.cart.findUnique({
        where: { id: cartId }
      });

      if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
      }
    }

    // Find the cart item to be removed
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId
      }
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Remove the item from the cart
    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    });

    res.status(200).json({ message: 'Cart item removed' });
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ message: 'Failed to remove item from cart', error: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    const cartId = req.query.cartId ? parseInt(req.query.cartId.toString(), 10) : null;

    let cart;

    if (userId) {
      // Authenticated user
      cart = await prisma.cart.findUnique({
        where: { userId: userId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } else if (cartId) {
      // Anonymous user with cartId
      cart = await prisma.cart.findUnique({
        where: { id: cartId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } else {
      return res.status(400).json({ message: 'Missing cartId for anonymous user' });
    }

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ message: 'Cart retrieved', data: cart });
  } catch (error) {
    console.error('Error getting cart:', error);
    res.status(500).json({ message: 'Failed to get cart', error: error.message });
  }
};

export const placeOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, customerPhone } = req.body;
    const userId = req.user.id;

    console.log('📦 Placing order for user:', userId);

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Check available stock first
    for (const item of cart.items) {
      if (item.product.availableStock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient available stock for ${item.product.name}. Available: ${item.product.availableStock}, Requested: ${item.quantity}` 
        });
      }
    }

    // Calculate totals
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderNumber = generateOrderNumber();

    // Create order with optimized transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          user: {
            connect: { id: userId }
          },
          customerName: req.user.name,
          customerEmail: req.user.email,
          customerPhone,
          shippingAddress,
          paymentMethod,
          totalPrice,
          status: 'PENDING',
          isPaid: false,
          isDelivered: false,
          isConfirmedByAdmin: false,
        }
      });

      // Create order items and update stock
      const orderItems = cart.items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await tx.orderItem.createMany({
        data: orderItems
      });

      // Update available stock (not full stock)
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            availableStock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    }, {
      timeout: 10000, // 10 second timeout
      maxWait: 5000,
    });

    console.log('✅ Order placed successfully:', order.id);

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    console.error('❌ Place order error:', error);
    
    if (error.code === 'P2034') {
      return res.status(500).json({ 
        message: 'Order processing timeout. Please try again.',
        error: 'Transaction timeout'
      });
    }

    res.status(500).json({ 
      message: 'Failed to place order. Please try again.',
      error: error.message 
    });
  }
};

export const placeAnonymousOrder = async (req, res, next) => {
  try {
    const { customerName, customerEmail, billingAddress, shippingAddress, paymentMethod, cartId } = req.body;

    console.log('📦 Placing anonymous order for cart:', cartId);

    if (!customerName || !customerEmail || !shippingAddress || !cartId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get cart with items
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty or not found' });
    }

    // Check available stock
    for (const item of cart.items) {
      if (item.product.availableStock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient available stock for ${item.product.name}. Available: ${item.product.availableStock}, Requested: ${item.quantity}` 
        });
      }
    }

    const totalPrice = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const orderNumber = generateOrderNumber();

    // Create order with optimized transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          billingAddress,
          shippingAddress,
          paymentMethod,
          totalPrice,
          status: 'PENDING',
          isPaid: false,
          isDelivered: false,
          isConfirmedByAdmin: false,
        }
      });

      // Create order items
      const orderItems = cart.items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      await tx.orderItem.createMany({
        data: orderItems
      });

      // Update available stock (not full stock)
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            availableStock: {
              decrement: item.quantity
            }
          }
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id }
      });

      return newOrder;
    }, {
      timeout: 10000,
      maxWait: 5000,
    });

    console.log('✅ Anonymous order placed successfully:', order.id);

    // Get order with items for email
    const orderWithItems = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        ...orderWithItems,
        items: orderWithItems.items
      });
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // Log failed email action
      await logFailedAction(
        'EMAIL',
        null,
        orderWithItems.customerEmail,
        `Failed to send order confirmation email: ${emailError.message}`,
        {
          orderId: order.id,
          orderNumber: order.orderNumber,
          emailType: 'order_confirmation'
        },
        null,
        null,
        emailError.code,
        emailError.stack
      );
    }

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });

  } catch (error) {
    console.error('❌ Anonymous order error:', error);
    
    if (error.code === 'P2034') {
      return res.status(500).json({ 
        message: 'Order processing timeout. Please try again.',
        error: 'Transaction timeout'
      });
    }

    res.status(500).json({ 
      message: 'Failed to place order. Please try again.',
      error: error.message 
    });
  }
};

export const createOrder = async (req, res, next) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      userId,
      billingAddress,
      shippingAddress,
      shippingPrice,
      discountAmount = 0,
      paymentMethod,
      items,
      totalPrice
    } = req.body;

    console.log('📦 Creating order with data:', {
      customerName,
      customerEmail,
      itemsCount: items?.length,
      totalPrice
    });

    if (!customerName || !customerEmail || !shippingAddress || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create order with optimized transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order first
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerName,
          customerEmail,
          customerPhone,
          userId,
          billingAddress,
          shippingAddress,
          shippingPrice,
          discountAmount,
          paymentMethod,
          totalPrice,
          status: 'PENDING',
          isPaid: false,
          isDelivered: false,
          isConfirmedByAdmin: false,
        }
      });

      // Create order items in batch
      const orderItems = items.map(item => ({
        orderId: newOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      }));

      await tx.orderItem.createMany({
        data: orderItems
      });

      // Update product stock in batch
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return newOrder;
    }, {
      timeout: 10000, // Increase timeout to 10 seconds
      maxWait: 5000,  // Maximum time to wait for a transaction slot
    });

    console.log('✅ Order created successfully:', order.id);

    // Send confirmation email (outside of transaction to avoid blocking)
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error('❌ Failed to send confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({
      message: 'Order created successfully',
      order
    });

  } catch (error) {
    console.error('❌ Order creation error:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2034') {
      return res.status(500).json({ 
        message: 'Order processing timeout. Please try again.',
        error: 'Transaction timeout'
      });
    }
    
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        message: 'Order number already exists. Please try again.',
        error: 'Duplicate order'
      });
    }

    res.status(500).json({ 
      message: 'Failed to create order. Please try again.',
      error: error.message 
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Failed to fetch user orders', error: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const userRole = req.user?.role?.toLowerCase();
    const userId = req.user?.id;

    let whereClause = {};

    // 🔐 SELLERS: Only see orders containing their products
    if (userRole === 'seller') {
      whereClause = {
        items: {
          some: {
            product: {
              createdById: userId
            }
          }
        }
      };
    }
    // 🔐 ADMINS: Can see all orders (no filter)

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true,
          },
          // For sellers, only include their own products in the items
          ...(userRole === 'seller' && {
            where: {
              product: {
                createdById: userId
              }
            }
          })
        },
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
  }
};

export const getUnfinishedOrders = async (req, res) => {
  try {
    const unfinishedOrders = await prisma.order.findMany({
      where: {
        status: {
          notIn: ['COMPLETED', 'CANCELLED'],
        },
      },
      include: {
        items: true,
        user: true,
      },
    });
    res.status(200).json(unfinishedOrders);
  } catch (error) {
    console.error('Error fetching unfinished orders:', error);
    res.status(500).json({ message: 'Failed to fetch unfinished orders', error: error.message });
  }
};

export const deleteUnfinishedOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Delete order items associated with the order
    await prisma.orderItem.deleteMany({
      where: {
        orderId: parseInt(orderId),
      },
    });

    // Delete the order
    await prisma.order.delete({
      where: {
        id: parseInt(orderId),
      },
    });

    res.status(200).json({ message: 'Unfinished order deleted successfully' });
  } catch (error) {
    console.error('Error deleting unfinished order:', error);
    res.status(500).json({ message: 'Failed to delete unfinished order', error: error.message });
  }
};

export const saveAbandonedCart = async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items to save in abandoned cart' });
    }

    // Save the items to the user's cart
    await prisma.cart.upsert({
      where: { userId: userId },
      update: {
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      create: {
        userId: userId,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    res.status(200).json({ message: 'Abandoned cart saved successfully' });
  } catch (error) {
    console.error('Error saving abandoned cart:', error);
    res.status(500).json({ message: 'Failed to save abandoned cart', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isPaid, isDelivered, confirmedAt, isCancelled } = req.body;

    // Use transaction to handle status updates and stock restoration
    const order = await prisma.$transaction(async (tx) => {
      // Get current order first
      const currentOrder = await tx.order.findUnique({
        where: { id: parseInt(id) },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      const updateData = {};
      if (status) updateData.status = status;
      if (isPaid !== undefined) {
        updateData.isPaid = isPaid;
        // If confirming payment, clear cancel status
        if (isPaid === true) {
          updateData.isCancelled = false;
          updateData.isConfirmedByAdmin = true;
          updateData.confirmedAt = new Date();
        }
      }
      if (isDelivered !== undefined) updateData.isDelivered = isDelivered;
      if (confirmedAt) updateData.confirmedAt = confirmedAt;
      if (isCancelled !== undefined) {
        updateData.isCancelled = isCancelled;
        // If cancelling, clear payment confirmation
        if (isCancelled === true) {
          updateData.isPaid = false;
          updateData.isConfirmedByAdmin = false;
          updateData.confirmedAt = null;
          updateData.status = 'CANCELLED';
          updateData.cancelledAt = new Date();
        }
      }

      const updatedOrder = await tx.order.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // If order is being cancelled, restore available stock
      if (isCancelled === true && !currentOrder.isCancelled) {
        for (const item of updatedOrder.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              availableStock: {
                increment: item.quantity
              }
            }
          });
        }
      }

      return updatedOrder;
    });

    // Send email notifications based on status changes
    try {
      if (isCancelled === true) {
        await sendOrderCancellationEmail({
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          items: order.items,
          cancelReason: 'Order cancelled by admin'
        });
      } else if (isDelivered === true || status === 'DELIVERED' || status === 'SHIPPED') {
        // 📩 Send delivery status update email
        await sendDeliveryStatusUpdateEmail({
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          orderNumber: order.orderNumber,
          status: status || (isDelivered ? 'DELIVERED' : 'SHIPPED'),
          items: order.items
        });
      }
    } catch (emailError) {
      console.error('❌ Failed to send status update email:', emailError);
      await logFailedAction(
        'EMAIL',
        null,
        order.customerEmail,
        `Failed to send order status update email: ${emailError.message}`,
        { orderId: order.id, orderNumber: order.orderNumber, emailType: 'status_update' }
      );
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, customerEmail, shippingAddress, paymentMethod, status } = req.body;

    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        customerName,
        customerEmail,
        shippingAddress,
        paymentMethod,
        status,
      },
    });

    res.status(200).json({ message: 'Order updated successfully', order: updatedOrder });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete order items associated with the order
    await prisma.orderItem.deleteMany({
      where: {
        orderId: parseInt(id),
      },
    });

    // Delete the order
    await prisma.order.delete({
      where: {
        id: parseInt(id),
      },
    });

    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
};
export const confirmOrderDelivery = async (req, res) => {
  try { 
    const { id } = req.params;
    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: {
        isDelivered: true,
        deliveryConfirmedAt: new Date()
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    // Send delivery confirmation email
    try {
      await sendDeliveryStatusUpdateEmail({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        items: order.items,
        shippingAddress: order.shippingAddress
      });
    } catch (emailError) {
      console.error('❌ Failed to send delivery confirmation email:', emailError);
      await logFailedAction(
        'EMAIL',
        null,
        order.customerEmail,
        `Failed to send delivery confirmation email: ${emailError.message}`,
        { orderId: order.id, orderNumber: order.orderNumber, emailType: 'delivery_confirmation' }
      );
    }
    res.status(200).json({ message: 'Order delivery confirmed successfully', order });
  } catch (error) {
    console.error('Error confirming order delivery:', error);
    res.status(500).json({ message: 'Failed to confirm order delivery', error: error.message });
  }
};
    

export const confirmOrderPayment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Use transaction to handle payment confirmation and stock updates
    const order = await prisma.$transaction(async (tx) => {
      // Update order status
      const updatedOrder = await tx.order.update({
        where: { id: parseInt(id) },
        data: {
          isPaid: true,
          isConfirmedByAdmin: true,
          confirmedAt: new Date(),
          isCancelled: false, // Clear any cancel status
          status: 'CONFIRMED'
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      // Now deduct from actual stock (payment confirmed)
      for (const item of updatedOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity
            }
          }
        });
      }

      return updatedOrder;
    });

    // Send payment confirmation email
    try {
      await sendPaymentConfirmationEmail({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        totalPrice: order.totalPrice,
        items: order.items,
        shippingAddress: order.shippingAddress
      });
    } catch (emailError) {
      console.error('❌ Failed to send payment confirmation email:', emailError);
      await logFailedAction(
        'EMAIL',
        null,
        order.customerEmail,
        `Failed to send payment confirmation email: ${emailError.message}`,
        { orderId: order.id, orderNumber: order.orderNumber, emailType: 'payment_confirmation' }
      );
    }

    res.status(200).json({ message: 'Order payment confirmed successfully', order });
  } catch (error) {
    console.error('Error confirming order payment:', error);
    res.status(500).json({ message: 'Failed to confirm order payment', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
};