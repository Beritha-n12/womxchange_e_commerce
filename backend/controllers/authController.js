import asyncHandler from 'express-async-handler'; 
import prisma from '../prismaClient.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { notify } from '../utils/notify.js';
import { sendWelcomeEmail, sendVerificationCodeEmail } from '../utils/emailService.js';
import { logFailedAction } from './failedActionsController.js';

// Register User
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Use findFirst to check email uniqueness
  const userExists = await prisma.user.findFirst({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
    }
  });

  try {
    await sendWelcomeEmail({
      email: user.email,
      name: user.name
    });
  } catch (emailError) {
    console.error('❌ Error sending welcome email:', emailError);
  }

  try {
    await notify({
      userId: null,
      message: `New user registered: ${user.name} (${user.role})`,
      recipientRole: 'ADMIN',
      relatedOrderId: null,
    });
  } catch (error) {
    console.error('Notification error:', error);
  }

  if (user) {
    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        sellerStatus: user.sellerStatus,
      },
      token: generateToken(user.id, user.role),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// Login User
export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log('🔍 LOGIN ATTEMPT:', { 
    email, 
    passwordLength: password?.length,
    timestamp: new Date().toISOString()
  });

  try {
    console.log('🔍 SEARCHING FOR USER IN DATABASE:', { email });
    const user = await prisma.user.findFirst({  // changed to findFirst for consistency
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
        sellerStatus: true,
        sellerPermissions: true,
        createdAt: true
      }
    });
    
    console.log('👤 USER FOUND:', user ? {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      sellerStatus: user.sellerStatus,
      hasPassword: !!user.password,
      createdAt: user.createdAt
    } : 'NO USER FOUND');

    if (!user) {
      console.log('❌ LOGIN FAILED: User not found');
      
      await logFailedAction(
        'LOGIN',
        null,
        email,
        'User not found with provided email',
        { email, attemptType: 'invalid_email' },
        req.ip,
        req.get('User-Agent')
      );
      
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 PASSWORD CHECK:', { 
      email: user.email,
      passwordMatch,
      storedPasswordHash: user.password?.substring(0, 10) + '...'
    });

    if (!passwordMatch) {
      console.log('❌ LOGIN FAILED: Invalid password');
      
      await logFailedAction(
        'LOGIN',
        user.id,
        user.email,
        'Invalid password provided',
        { email: user.email, attemptType: 'invalid_password' },
        req.ip,
        req.get('User-Agent')
      );
      
      res.status(401);
      throw new Error('Invalid email or password');
    }

    if (user.role === 'SELLER') {
      console.log('🏪 SELLER LOGIN CHECK:', {
        email: user.email,
        sellerStatus: user.sellerStatus,
        isActive: user.isActive,
        canLogin: user.sellerStatus === 'ACTIVE' && user.isActive
      });
    }

    console.log('✅ LOGIN SUCCESS:', {
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      sellerStatus: user.sellerStatus,
    });

    const token = generateToken(user.id, user.role);
    console.log('🎫 TOKEN GENERATED:', { 
      userId: user.id, 
      role: user.role,
      tokenLength: token?.length
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      sellerStatus: user.sellerStatus,
      sellerPermissions: user.sellerPermissions,
      token: token,
    });

  } catch (error) {
    console.error('💥 LOGIN ERROR:', {
      email,
      error: error.message,
      stack: error.stack?.substring(0, 200)
    });
    
    if (!res.headersSent) {
      res.status(500);
      throw new Error(`Login failed: ${error.message}`);
    }
  }
});

// Verify token endpoint
export const verifyToken = asyncHandler(async (req, res) => {
  const dbUser = await prisma.user.findFirst({ // changed to findFirst
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      sellerStatus: true,
      sellerPermissions: true
    }
  });

  if (!dbUser) {
    res.status(404);
    throw new Error('User not found');
  }

  console.log('🟢 Verified token for user:', dbUser);

  res.json({ success: true, user: dbUser });
});

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findFirst({  // changed to findFirst
    where: { id: req.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      bio: true,
      company: true,
      createdAt: true,
      isActive: true,
      sellerStatus: true
    }
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.json(user);
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, address, bio, company } = req.body;

  const user = await prisma.user.findFirst({ where: { id: req.user.id } }); // changed to findFirst

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email !== user.email) {
    const emailExists = await prisma.user.findFirst({ where: { email } }); // changed to findFirst
    if (emailExists) {
      res.status(400);
      throw new Error('Email already exists');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(bio && { bio }),
      ...(company && { company })
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      bio: true,
      company: true,
      isActive: true,
      sellerStatus: true
    }
  });

  res.json(updatedUser);
});

// Get single user (Admin only)
export const getUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log('Getting user:', userId);

  const user = await prisma.user.findFirst({ // changed to findFirst
    where: { id: parseInt(userId) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      bio: true,
      company: true,
      isActive: true,
      sellerStatus: true,
      businessName: true,
      createdAt: true
    }
  });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  console.log('User found successfully');
  res.json(user);
});

// Create user (Admin only)
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, address, bio, company } = req.body;

  console.log('Creating user:', email);

  const userExists = await prisma.user.findFirst({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role.toUpperCase(),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(bio && { bio }),
      ...(company && { company })
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      bio: true,
      company: true,
      isActive: true,
      sellerStatus: true,
      businessName: true,
      createdAt: true
    }
  });

  console.log('User created successfully');
  res.status(201).json(user);
});

// Get all users (Admin only)
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      sellerStatus: true,
      businessName: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  res.status(200).json(users);
});

// Delete user (Admin only)
export const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log('Deleting user:', userId);

  const user = await prisma.user.findFirst({ where: { id: parseInt(userId) } }); // changed to findFirst

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'ADMIN') {
    res.status(403);
    throw new Error('Cannot delete admin users');
  }

  await prisma.user.delete({
    where: { id: parseInt(userId) }
  });

  console.log('User deleted successfully');
  res.json({ message: 'User deleted successfully' });
});

// Update user (Admin only)
export const updateUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { name, email, role, isActive } = req.body;

  console.log('Updating user:', userId, req.body);

  const user = await prisma.user.findFirst({ where: { id: parseInt(userId) } }); // changed to findFirst

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (email && email !== user.email) {
    const emailExists = await prisma.user.findFirst({ where: { email } }); // changed to findFirst
    if (emailExists) {
      res.status(400);
      throw new Error('Email already exists');
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: parseInt(userId) },
    data: {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role: role.toUpperCase() }),
      ...(typeof isActive === 'boolean' && { isActive })
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      isActive: true,
      sellerStatus: true,
      businessName: true,
      createdAt: true
    }
  });

  console.log('User updated successfully');
  res.json(updatedUser);
});

// Verify user exists (for two-step verification)
export const verifyUserExists = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;

  console.log('Verifying user exists:', { email, phone });

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        ...(email ? [{ email }] : []),
        ...(phone ? [{ phone }] : [])
      ]
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isActive: true
    }
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found with provided email or phone'
    });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isActive: user.isActive
    }
  });
});

// Forgot Password - Check if user exists
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log('🔍 FORGOT PASSWORD REQUEST:', { email });

  try {
    const user = await prisma.user.findFirst({ // changed to findFirst
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log(`Verification code for ${email}: ${verificationCode}`);
    
    try {
      await sendVerificationCodeEmail({
        email: user.email,
        name: user.name,
        verificationCode: verificationCode
      });
      console.log('✅ Verification code email sent successfully');
    } catch (emailError) {
      console.error('❌ Error sending verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email. Please try again.'
      });
    }
    
    res.json({
      success: true,
      message: 'Verification code sent to your email.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:', error);
    
    await logFailedAction({
      type: 'LOGIN',
      userId: null,
      email: email,
      reason: `Forgot password error: ${error.message}`,
      metadata: { action: 'forgot_password' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Verify Reset Code
export const verifyResetCode = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  console.log('🔍 VERIFY RESET CODE REQUEST:', { email, code });

  try {
    if (!code || code.length !== 6 || isNaN(parseInt(code))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code format'
      });
    }

    const user = await prisma.user.findFirst({ // changed to findFirst
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    console.log('✅ VERIFICATION CODE ACCEPTED:', { email, code });

    res.json({
      success: true,
      message: 'Verification code verified successfully.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('❌ VERIFY RESET CODE ERROR:', error);
    
    await logFailedAction({
      type: 'LOGIN',
      userId: null,
      email: email,
      reason: `Verify reset code error: ${error.message}`,
      metadata: { action: 'verify_reset_code' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Reset Password - Set new password
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, userId } = req.body;

  console.log('🔍 RESET PASSWORD REQUEST:', { email });

  try {
    const whereClause = userId ? { id: parseInt(userId) } : { email };
    
    const user = await prisma.user.findFirst({ // changed to findFirst
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email address'
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: whereClause,
      data: {
        password: hashedPassword
      }
    });

    console.log('✅ PASSWORD RESET SUCCESS:', { email });

    res.json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('❌ RESET PASSWORD ERROR:', error);
    
    await logFailedAction({
      type: 'LOGIN',
      userId: null,
      email: email,
      reason: `Reset password error: ${error.message}`,
      metadata: { action: 'reset_password' },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
});

// Logout User
export const logoutUser = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: 'Logged out successfully' });
};
