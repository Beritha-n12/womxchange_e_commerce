import nodemailer from 'nodemailer';
import { logFailedAction } from '../controllers/failedActionsController.js';

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nberitha12@gmail.com',
    pass: 'uxwu bprd zjlh bgyt',
  },
});

export const sendWelcomeEmail = async (userData) => {
  const { email, name } = userData;

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: email,
    subject: 'Welcome to Our E-Commerce Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Our Store!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for joining our community</p>
        </div>
        
        <div style="background-color: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #374151; margin-top: 0;">Hello ${name}!</h2>
          
          <p style="color: #6B7280; line-height: 1.6;">
            We're excited to have you as part of our e-commerce community! Your account has been successfully created.
          </p>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #374151; margin-top: 0;">What's Next?</h3>
            <ul style="color: #6B7280; line-height: 1.8; padding-left: 20px;">
              <li>Browse our amazing product collection</li>
              <li>Add items to your cart and place orders</li>
              <li>Track your order status in real-time</li>
              <li>Enjoy secure payments with MoMo integration</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://womxchangerwanda.vercel.app'}/products" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Start Shopping Now
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Welcome email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    
    // Log failed email action
    await logFailedAction(
      'EMAIL',
      null,
      email,
      `Failed to send welcome email: ${error.message}`,
      {
        subject: 'Welcome to Our E-Commerce Platform!',
        emailType: 'welcome',
        recipient: email
      },
      null,
      null,
      error.code,
      error.stack
    );
    
    throw error;
  }
};

export const sendSellerWelcomeEmail = async (userData) => {
  const { email, name } = userData;

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: email,
    subject: 'Welcome Seller - Awaiting Approval',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome, Seller!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Thank you for joining our platform</p>
        </div>

        <div style="background-color: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #374151; margin-top: 0;">Hello ${name}!</h2>

          <p style="color: #6B7280; line-height: 1.6;">
            Your seller account has been successfully created and is now pending approval by our admin team.
          </p>

          <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="color: #92400E; margin-top: 0;">What’s Next?</h3>
            <ul style="color: #78350F; line-height: 1.8; padding-left: 20px;">
              <li>Wait for your account to be reviewed and approved</li>
              <li>Once approved, access your dashboard</li>
              <li>Create, update, and manage your products</li>
              <li>Track orders and view sales insights</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://womxchangerwanda.vercel.app'}/login" 
               style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Visit Your Seller Dashboard
            </a>
          </div>

          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            We’ll notify you by email as soon as your account is approved. If you have any questions in the meantime, feel free to reach out to our support team.
          </p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Welcome seller email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending seller welcome email:', error);
    throw error;
  }
};

export const sendSellerStatusEmail = async (sellerData, status) => {
  const { email, name, businessName } = sellerData;
  const isApproved = status === 'ACTIVE';

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: email,
    subject: `Seller Account ${isApproved ? 'Approved' : 'Status Update'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${isApproved ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'}; padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">
            ${isApproved ? '🎉 Congratulations!' : '⏳ Status Update'}
          </h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
            ${isApproved ? 'Your seller account has been approved!' : 'Your seller account status has been updated'}
          </p>
        </div>
        
        <div style="background-color: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #374151; margin-top: 0;">Hello ${name}!</h2>
          
          ${isApproved ? `
            <p style="color: #6B7280; line-height: 1.6;">
              Great news! Your seller account for <strong>${businessName}</strong> has been approved and activated. 
              You can now start selling on our platform!
            </p>
            
            <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10B981;">
              <h3 style="color: #065F46; margin-top: 0;">What You Can Do Now:</h3>
              <ul style="color: #047857; line-height: 1.8; padding-left: 20px;">
                <li>Access your seller dashboard</li>
                <li>Add and manage your products</li>
                <li>View and manage orders</li>
                <li>Track your sales performance</li>
                <li>Manage customer relationships</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://womxchangerwanda.vercel.app'}/login" 
                 style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Access Seller Dashboard
              </a>
            </div>
          ` : `
            <p style="color: #6B7280; line-height: 1.6;">
              Your seller account status for <strong>${businessName}</strong> has been updated to: <strong>${status}</strong>
            </p>
            
            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #F59E0B;">
              <p style="color: #92400E; margin: 0;">
                ${status === 'INACTIVE' ? 'Your account is currently inactive. Please contact support for assistance.' : 'Please check your dashboard for more details.'}
              </p>
            </div>
          `}
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            If you have any questions or need assistance, please contact our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Seller status email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending seller status email:', error);
    throw error;
  }
};

export const sendOrderConfirmationEmail = async (orderData) => {
  const { customerEmail, customerName, orderNumber, totalPrice, items, shippingAddress, billingAddress, paymentMethod, deliveryFee, discount } = orderData;
  
  // Check if items exists and is an array
  if (!items || !Array.isArray(items)) {
    console.error('❌ Items not found or not an array in order data:', orderData);
    throw new Error('Order items are required for email confirmation');
  }
  
  const itemsList = items.map(item => {
  const name = item.product?.name || item.name || 'Unknown Product';
  const quantity = item.quantity ?? 1;
  const price = item.price ?? item.product?.price ?? 0;
  const total = price * quantity;

  return `• ${name} x${quantity} - ${total.toLocaleString()} Rwf`;
}).join('\n');


  // FIXED: Enhanced payment method display
  const paymentMethodDisplay = paymentMethod === 'PAY_ON_DELIVERY' 
    ? 'Pay on Delivery' 
    : paymentMethod === 'MTN' 
      ? 'MTN Mobile Money' 
      : paymentMethod;

  // FIXED: Proper payment instructions with correct MoMo code
  const paymentInstructions = paymentMethod === 'MTN' 
    ? `
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1976d2;">Payment Information</h3>
        <p><strong>Payment Method:</strong> MTN Mobile Money</p>
        <p><strong>Payment Code:</strong> <span style="font-size: 18px; font-weight: bold; color: #1976d2;">+250 784 720 984</span></p>
        <p>Please use this number to complete your Mobile Money payment.</p>
      </div>
    `
    : `
      <div style="background-color: #f3e5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #7b1fa2;">Payment Information</h3>
        <p><strong>Payment Method:</strong> Pay on Delivery</p>
        <p>You will pay when your order is delivered to your address.</p>
      </div>
    `;

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: customerEmail,
    subject: `Order Confirmation - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Order Confirmation</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for your order! We've received your order and are processing it now.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          ${discount ? `<p><strong>Discount:</strong> -${discount.toLocaleString()} Rwf</p>` : ''}
          ${deliveryFee ? `<p><strong>Delivery Fee:</strong> ${deliveryFee.toLocaleString()} Rwf</p>` : ''}
          <p><strong>Total Amount:</strong> ${totalPrice.toLocaleString()-discount.toLocaleString()+1200} Rwf</p>
          ${billingAddress ? `<p><strong>Billing Address:</strong> ${typeof billingAddress === 'string' ? billingAddress : JSON.stringify(billingAddress)}</p>` : ''}
          <p><strong>Shipping Address:</strong> ${
            typeof shippingAddress === 'string' 
              ? shippingAddress 
              : `${shippingAddress.street || ''}, ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.postalCode || ''}, ${shippingAddress.country || ''}`.replace(/,\s*,/g, ',').replace(/^\s*,|,\s*$/g, '')
          }</p>
          
          <h4>Items Ordered:</h4>
          <pre style="white-space: pre-line; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        ${paymentInstructions}
        
        <p>You will receive another email once your payment is confirmed by our admin.</p>
        <p>Thank you for shopping with us!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Order confirmation email sent to:', customerEmail);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    throw error;
  }
};

export const sendOrderCancellationEmail = async (orderData) => {
  const { customerEmail, customerName, orderNumber, items, cancelReason } = orderData;
  
  const itemsList = items.map(item => 
    `• ${item.product.name} x${item.quantity}`
  ).join('\n');

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: customerEmail,
    subject: `Order Cancelled - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Order Cancelled</h2>
        <p>Dear ${customerName},</p>
        <p>We regret to inform you that your order has been cancelled.</p>
        
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
          <h3>Cancelled Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Cancellation Reason:</strong> ${cancelReason}</p>
          
          <h4>Items in Cancelled Order:</h4>
          <pre style="white-space: pre-line; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        <div style="background-color: #e0f2fe; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #0277bd;">What happens next?</h3>
          <ul style="color: #0277bd;">
            <li>If you made a payment, we will process your refund within 3-5 business days</li>
            <li>You will receive a separate email confirmation once the refund is processed</li>
            <li>If you have any questions, please contact our support team</li>
          </ul>
        </div>
        
        <p>We apologize for any inconvenience caused. Please feel free to place a new order at any time.</p>
        <p>Thank you for understanding.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Order cancellation email sent to:', customerEmail);
  } catch (error) {
    console.error('❌ Error sending order cancellation email:', error);
    throw error;
  }
};

export const sendAdminOrderNotification = async (orderData, adminEmails = ['nberitha12@gmail.com','willynorbert53@gmail.com']) => {
  const { customerEmail, customerName, orderNumber, totalPrice, items, shippingAddress } = orderData;
  
  const itemsList = items.map(item => 
    `• ${item.product.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} Rwf`
  ).join('\n');

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: adminEmails.join(', '),
    subject: `New Order Received - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">New Order Received</h2>
        <p>A new order has been placed and requires your attention.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Customer Email:</strong> ${customerEmail}</p>
          <p><strong>Total Amount:</strong> ${totalPrice.toLocaleString()} Rwf</p>
          <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
          
          <h4>Items Ordered:</h4>
          <pre style="white-space: pre-line; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        <p><strong>Action Required:</strong> Please review and confirm the payment for this order.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated notification from your e-commerce system.</p>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Admin order notification sent');
    console.log('Admin emails:', adminEmails);
  } catch (error) {
    console.error('❌ Error sending admin order notification:', error);
    console.log('Admin emails:', adminEmails);
    throw error;
    
  }
  console.log('Failed to send admin order notification email:', error);
};

export const sendSellerOrderConfirmationEmail = async (orderData) => {
  const { customerEmail, customerName, orderNumber, totalPrice, items, shippingAddress, paymentMethod, sellerName, sellerBusinessName } = orderData;
  
  const itemsList = items.map(item => 
    `• ${item.product.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} Rwf`
  ).join('\n');

  const sellerDisplayName = sellerBusinessName || sellerName;

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: customerEmail,
    subject: `Order Created for You - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Created for You!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">By ${sellerDisplayName}</p>
        </div>
        
        <div style="background-color: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #374151; margin-top: 0;">Dear ${customerName},</h2>
          
          <div style="background-color: #EDE9FE; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #8B5CF6;">
            <p style="color: #5B21B6; margin: 0; font-weight: 500;">
              This order was created for you by <strong>${sellerDisplayName}</strong>
            </p>
          </div>
          
          <p style="color: #6B7280; line-height: 1.6;">
            An order has been created on your behalf. Please review the details below and confirm your payment.
          </p>
          
          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Total Amount:</strong> ${totalPrice.toLocaleString()} Rwf</p>
            <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod === 'PAY_ON_DELIVERY' ? 'Pay on Delivery' : paymentMethod === 'MTN' ? 'MTN Mobile Money' : paymentMethod}</p>
            
            <h4 style="margin-top: 20px; margin-bottom: 10px;">Items Ordered:</h4>
            <pre style="white-space: pre-line; font-family: Arial, sans-serif; color: #4B5563;">${itemsList}</pre>
          </div>
          
          ${paymentMethod === 'MTN' ? `
            <div style="background-color: #E3F2FD; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1976D2; margin-top: 0;">Payment Information</h3>
              <p><strong>Payment Method:</strong> MTN Mobile Money</p>
              <p><strong>Payment Code:</strong> <span style="font-size: 18px; font-weight: bold; color: #1976D2;">+250 784 720 984</span></p>
              <p>Please use this number to complete your Mobile Money payment.</p>
            </div>
          ` : paymentMethod === 'PAY_ON_DELIVERY' ? `
            <div style="background-color: #F3E5F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #7B1FA2; margin-top: 0;">Payment Information</h3>
              <p><strong>Payment Method:</strong> Pay on Delivery</p>
              <p>You will pay when your order is delivered to your address.</p>
            </div>
          ` : ''}
          
          <p style="color: #6B7280; line-height: 1.6;">
            If you have any questions about this order, please contact ${sellerDisplayName} or our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Seller order confirmation email sent to:', customerEmail);
  } catch (error) {
    console.error('❌ Error sending seller order confirmation email:', error);
    throw error;
  }
};

export const sendPaymentConfirmationEmail = async (orderData) => {
  const {
    customerEmail,
    customerName,
    orderNumber,
    totalPrice,
    items,
    shippingAddress,
    deliveryFee = 1200,
    discountAmount = totalPrice * 0.02, // Assuming a 10% discount if not specified
  } = orderData;

  const itemsList = items.map(item =>
    `• ${item.product?.name || item.product.name || 'Unknown Product'} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} Rwf`
  ).join('\n');

  const finalAmount = totalPrice - discountAmount + deliveryFee;

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: customerEmail,
    subject: `Payment Confirmed - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Payment Confirmed!</h2>
        <p>Dear ${customerName},</p>
        <p>Great news! Your payment has been confirmed and your order is now being processed.</p>
        
        <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details:</h3>
          <p><strong>Order Number:</strong> ${orderNumber}</p>
          <p><strong>Total Amount:</strong> ${finalAmount.toLocaleString()} Rwf</p>
          <p><strong>Payment Code Used:</strong> +250 784 720 984</p>
          <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
          
          <h4>Items Ordered:</h4>
          <pre style="white-space: pre-line; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #155724;">✅ Payment Status: Paid</h3>
          <p>Your order is now being prepared for shipment. You will receive tracking information once your order has been dispatched.</p>
        </div>
        
        <p>Thank you for shopping with us!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Payment confirmation email sent to:', customerEmail);
  } catch (error) {
    console.error('❌ Error sending payment confirmation email:', error);
    throw error;
  }
};


export const sendOrderStatusUpdateEmail = async (toEmail, status, productName) => {
  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: toEmail,
    subject: `Order Status Updated - ${productName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Order Status Update</h2>
        <p>Dear customer,</p>
        <p>The status of your order for <strong>${productName}</strong> has been updated to:</p>
        <div style="margin: 20px 0; padding: 10px; background-color: #f3f4f6; border-radius: 8px;">
          <strong>${status}</strong>
        </div>
        <p>We will keep you posted on the next steps. Thank you for shopping with us!</p>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Order status update email sent to:', toEmail);
  } catch (error) {
    console.error('❌ Error sending order status update email:', error);
    throw error;
  }
};

// Send Delivery Status Update Email - FIXED
// NEW: Send email notification to seller when order is confirmed
export const sendSellerOrderNotificationEmail = async (orderData) => {
  const { sellerEmail, sellerName, customerName, orderNumber, totalPrice, items, orderDate } = orderData;
  
  const itemsList = items.map(item => 
    `• ${item.product.name} x${item.quantity} - ${(item.price * item.quantity).toLocaleString()} Rwf`
  ).join('\n');

  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: sellerEmail,
    subject: `Order Confirmed - ${orderNumber} - Your Product Sold!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your product has been sold</p>
        </div>
        
        <div style="background-color: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #374151; margin-top: 0;">Hello ${sellerName}!</h2>
          
          <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
            <p style="color: #065F46; margin: 0; font-weight: 500;">
              Great news! An order containing your products has been confirmed and payment has been received.
            </p>
          </div>
          
          <p style="color: #6B7280; line-height: 1.6;">
            The admin has confirmed payment for an order that includes your products. Please prepare the items for shipment.
          </p>
          
          <div style="background-color: #F9FAFB; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
            <p><strong>Order Number:</strong> ${orderNumber}</p>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Order Total:</strong> ${totalPrice.toLocaleString()} Rwf</p>
            <p><strong>Order Date:</strong> ${new Date(orderDate).toLocaleDateString()}</p>
            
            <h4 style="margin-top: 20px; margin-bottom: 10px;">Your Items in This Order:</h4>
            <pre style="white-space: pre-line; font-family: Arial, sans-serif; color: #4B5563;">${itemsList}</pre>
          </div>
          
          <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400E; margin-top: 0;">Next Steps:</h3>
            <ul style="color: #78350F; line-height: 1.8; padding-left: 20px;">
              <li>Prepare your products for shipment</li>
              <li>Package items securely</li>
              <li>Coordinate with delivery if needed</li>
              <li>Update order status when shipped</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'https://womxchangerwanda.vercel.app'}/login" 
               style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Order Details
            </a>
          </div>
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Congratulations on your sale! If you have any questions, please contact our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Seller order notification email sent to:', sellerEmail);
  } catch (error) {
    console.error('❌ Error sending seller order notification email:', error);
    throw error;
  }
};

export const sendDeliveryStatusUpdateEmail = async ({
  customerEmail,
  customerName,
  orderNumber,
  status,
  items
}) => {
  // Extract product names from items
  const productNames = items ? items.map(item => item.product?.name || 'Unknown Product') : [];
  const statusDisplay = status === 'DELIVERED' ? 'Delivered' : status === 'SHIPPED' ? 'Shipped' : status;
  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: customerEmail,
    subject: `Order Status Update - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">📦 Order Status Update</h1>
          <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has been updated</p>
        </div>
        
        <div style="background-color: white; padding: 40px 20px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #374151; margin-top: 0;">Hello ${customerName}!</h2>
          
          <p style="color: #6B7280; line-height: 1.6;">
            Great news! Your order status has been updated to <strong style="color: #10B981;">${statusDisplay}</strong>.
          </p>
          
          <div style="background-color: #ECFDF5; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10B981;">
            <h3 style="color: #065F46; margin-top: 0;">Order Details:</h3>
            <p style="color: #047857; margin: 5px 0;"><strong>Order Number:</strong> ${orderNumber}</p>
            <p style="color: #047857; margin: 5px 0;"><strong>Status:</strong> ${statusDisplay}</p>
            ${productNames.length > 0 ? `<p style="color: #047857; margin: 5px 0;"><strong>Items:</strong> ${productNames.join(', ')}</p>` : ''}
          </div>
          
          ${status === 'DELIVERED' ? `
            <div style="background-color: #FEF3C7; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #F59E0B;">
              <h3 style="color: #92400E; margin-top: 0;">🎉 Order Delivered!</h3>
              <p style="color: #78350F; margin: 0;">
                Your order has been successfully delivered. We hope you enjoy your purchase!
              </p>
            </div>
          ` : status === 'SHIPPED' ? `
            <div style="background-color: #DBEAFE; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #3B82F6;">
              <h3 style="color: #1E40AF; margin-top: 0;">🚚 Order Shipped!</h3>
              <p style="color: #1E3A8A; margin: 0;">
                Your order is on its way! You should receive it soon.
              </p>
            </div>
          ` : ''}
          
          <p style="color: #6B7280; font-size: 14px; line-height: 1.6;">
            Thank you for shopping with us! If you have any questions, please contact our support team.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; text-align: center; margin: 0;">
              This is an automated email. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('📧 Delivery status update email sent successfully to:', customerEmail);
  } catch (error) {
    console.error('❌ Error sending delivery status update email:', error);
    throw error;
  }
};

// Send Verification Code Email for Password Reset
export const sendVerificationCodeEmail = async ({ email, name, verificationCode }) => {
  const mailOptions = {
    from: 'nberitha12@gmail.com',
    to: email,
    subject: 'Password Reset Verification Code - WomXchange',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="color: #4A5568; margin-bottom: 10px;">Hi ${name}! 👋</h2>
            <p style="color: #666; font-size: 16px;">
              You requested to reset your password. Use the verification code below:
            </p>
          </div>
          
          <div style="background-color: #F7FAFC; padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0;">
            <p style="color: #4A5568; margin-bottom: 10px; font-size: 16px;">Your verification code is:</p>
            <h1 style="font-size: 48px; color: #667eea; letter-spacing: 8px; margin: 20px 0; font-family: 'Courier New', monospace; background-color: white; padding: 20px; border-radius: 8px; border: 2px dashed #667eea;">
              ${verificationCode}
            </h1>
            <p style="color: #718096; font-size: 14px; margin-top: 15px;">
              This code will expire in 15 minutes for security.
            </p>
          </div>
          
          <div style="background-color: #FFF5F5; padding: 20px; border-radius: 8px; border-left: 4px solid #F56565; margin: 20px 0;">
            <p style="color: #C53030; margin: 0; font-weight: bold;">Security Notice:</p>
            <p style="color: #742A2A; margin: 10px 0 0 0; font-size: 14px;">
              If you didn't request this password reset, please ignore this email or contact support if you have concerns.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              Need help? Contact our support team at <a href="mailto:support@womxchange.rw" style="color: #667eea;">support@womxchange.rw</a>
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
            <p style="color: #A0AEC0; font-size: 12px; text-align: center; margin: 0;">
              © 2024 WomXchange Rwanda. Empowering women entrepreneurs.
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('✅ Verification code email sent to:', email);
  } catch (error) {
    console.error('❌ Error sending verification email:', error);
    throw error;
  }
};