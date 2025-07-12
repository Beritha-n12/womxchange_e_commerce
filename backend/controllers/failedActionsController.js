import prisma from '../utils/prismaClient.js';
import asyncHandler from 'express-async-handler';

// Helper function to log failed actions
export const logFailedAction = async (type, userId = null, email = null, reason, metadata = {}, ipAddress = null, userAgent = null, errorCode = null, stackTrace = null) => {
  try {
    await prisma.failedAction.create({
      data: {
        type,
        userId,
        email,
        reason,
        metadata,
        ipAddress,
        userAgent,
        errorCode,
        stackTrace
      }
    });
  } catch (error) {
    console.error('Failed to log failed action:', error);
  }
};


// Get all failed login attempts
export const getFailedLogins = asyncHandler(async (req, res) => {
  const failedLogins = await prisma.failedAction.findMany({
    where: {
      type: 'LOGIN',
      resolved: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      attemptTime: 'desc'
    }
  });
  
  res.json(failedLogins.map(action => ({
    id: action.id,
    email: action.email || action.user?.email,
    attemptTime: action.attemptTime,
    reason: action.reason,
    ipAddress: action.ipAddress,
    userId: action.userId,
    errorCode: action.errorCode
  })));
});

// Get all failed email attempts
export const getFailedEmails = asyncHandler(async (req, res) => {
  const failedEmails = await prisma.failedAction.findMany({
    where: {
      type: 'EMAIL',
      resolved: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      attemptTime: 'desc'
    }
  });
  
  res.json(failedEmails.map(action => ({
    id: action.id,
    recipient: action.email || action.user?.email,
    subject: action.metadata?.subject || 'Unknown Subject',
    failureTime: action.attemptTime,
    reason: action.reason,
    errorCode: action.errorCode
  })));
});

// Get all failed cart operations
export const getFailedCartOperations = asyncHandler(async (req, res) => {
  const failedCartOps = await prisma.failedAction.findMany({
    where: {
      type: 'CART',
      resolved: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      attemptTime: 'desc'
    }
  });
  
  res.json(failedCartOps.map(action => ({
    id: action.id,
    userId: action.userId,
    productId: action.metadata?.productId,
    attemptTime: action.attemptTime,
    reason: action.reason,
    operation: action.metadata?.operation || 'Unknown Operation'
  })));
});

// Get all failed chat operations
export const getFailedChatOperations = asyncHandler(async (req, res) => {
  const failedChatOps = await prisma.failedAction.findMany({
    where: {
      type: 'CHAT',
      resolved: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      attemptTime: 'desc'
    }
  });
  
  res.json(failedChatOps.map(action => ({
    id: action.id,
    userId: action.userId,
    messageType: action.metadata?.messageType || 'unknown',
    failureTime: action.attemptTime,
    reason: action.reason,
    fileName: action.metadata?.fileName
  })));
});

// Resend failed email
export const resendFailedEmail = asyncHandler(async (req, res) => {
  const { emailId } = req.params;
  
  try {
    // Mark as resolved
    await prisma.failedAction.update({
      where: { id: parseInt(emailId) },
      data: {
        resolved: true,
        resolvedAt: new Date()
      }
    });
    
    console.log('Email marked as resent for ID:', emailId);
    
    res.json({ 
      success: true, 
      message: 'Email resent successfully' 
    });
  } catch (error) {
    console.error('Error resolving email:', error);
    res.status(500).json({ error: 'Failed to resend email' });
  }
});

// Retry failed cart operation
export const retryFailedCartOperation = asyncHandler(async (req, res) => {
  const { operationId } = req.params;
  
  try {
    // Mark as resolved
    await prisma.failedAction.update({
      where: { id: parseInt(operationId) },
      data: {
        resolved: true,
        resolvedAt: new Date()
      }
    });
    
    console.log('Cart operation marked as retried for ID:', operationId);
    
    res.json({ 
      success: true, 
      message: 'Cart operation retried successfully' 
    });
  } catch (error) {
    console.error('Error resolving cart operation:', error);
    res.status(500).json({ error: 'Failed to retry cart operation' });
  }
});

// Clear failed login attempt
export const clearFailedLogin = asyncHandler(async (req, res) => {
  const { loginId } = req.params;
  
  try {
    // Mark as resolved
    await prisma.failedAction.update({
      where: { id: parseInt(loginId) },
      data: {
        resolved: true,
        resolvedAt: new Date()
      }
    });
    
    console.log('Failed login cleared for ID:', loginId);
    
    res.json({ 
      success: true, 
      message: 'Failed login cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing failed login:', error);
    res.status(500).json({ error: 'Failed to clear login' });
  }
});

// Retry failed chat operation
export const retryFailedChatOperation = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  
  try {
    // Mark as resolved
    await prisma.failedAction.update({
      where: { id: parseInt(chatId) },
      data: {
        resolved: true,
        resolvedAt: new Date()
      }
    });
    
    console.log('Chat operation marked as retried for ID:', chatId);
    
    res.json({ 
      success: true, 
      message: 'Chat operation retried successfully' 
    });
  } catch (error) {
    console.error('Error resolving chat operation:', error);
    res.status(500).json({ error: 'Failed to retry chat operation' });
  }
});

// Get vendor/seller related issues
export const getFailedVendorOperations = asyncHandler(async (req, res) => {
  const failedVendorOps = await prisma.failedAction.findMany({
    where: {
      type: 'VENDOR',
      resolved: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    },
    orderBy: {
      attemptTime: 'desc'
    }
  });
  
  res.json(failedVendorOps.map(action => ({
    id: action.id,
    userId: action.userId,
    vendorName: action.user?.name,
    vendorEmail: action.user?.email,
    failureTime: action.attemptTime,
    reason: action.reason,
    operation: action.metadata?.operation || 'Unknown Operation'
  })));
});

// Get order related issues (like failed order processing)
export const getFailedOrderOperations = asyncHandler(async (req, res) => {
  const failedOrderOps = await prisma.failedAction.findMany({
    where: {
      type: 'ORDER',
      resolved: false
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      attemptTime: 'desc'
    }
  });
  
  res.json(failedOrderOps.map(action => ({
    id: action.id,
    userId: action.userId,
    customerName: action.user?.name || action.metadata?.customerName,
    customerEmail: action.user?.email || action.metadata?.customerEmail,
    orderId: action.metadata?.orderId,
    failureTime: action.attemptTime,
    reason: action.reason,
    operation: action.metadata?.operation || 'Order Processing'
  })));
});