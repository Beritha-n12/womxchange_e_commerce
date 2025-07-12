import express from 'express';
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
} from '../controllers/failedActionsController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const failedActionsRouter = express.Router();

// All routes require admin access
failedActionsRouter.use(protect, authorizeRoles('admin'));

// Get failed actions by type
failedActionsRouter.get('/logins', getFailedLogins);
failedActionsRouter.get('/emails', getFailedEmails);
failedActionsRouter.get('/cart', getFailedCartOperations);
failedActionsRouter.get('/chat', getFailedChatOperations);
failedActionsRouter.get('/vendors', getFailedVendorOperations);
failedActionsRouter.get('/orders', getFailedOrderOperations);

// Resolution actions
failedActionsRouter.post('/emails/:emailId/resend', resendFailedEmail);
failedActionsRouter.post('/cart/:operationId/retry', retryFailedCartOperation);
failedActionsRouter.delete('/logins/:loginId', clearFailedLogin);
failedActionsRouter.post('/chat/:chatId/retry', retryFailedChatOperation);

export default failedActionsRouter;