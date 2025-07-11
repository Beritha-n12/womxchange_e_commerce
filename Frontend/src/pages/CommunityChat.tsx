import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { markMessagesAsRead } from '@/api/chat'; // <-- import here
import WhatsAppChat from '@/components/chat/WhatsAppChat';

const CommunityChat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Hide chat functionality for buyers - redirect them to home
    if (user.role === 'buyer') {
      navigate('/');
      return;
    }

    // Mark messages as read on chat open
    markMessagesAsRead().catch((err) => {
      console.error('Failed to mark messages as read:', err);
    });
  }, [user, navigate]);

  if (!user || user.role === 'buyer') return null;

  return (
    <DashboardLayout currentPage="community-chat">
      <div className="h-full flex flex-col space-y-6">

        <WhatsAppChat currentUser={user} />
      </div>
    </DashboardLayout>
  );
};

export default CommunityChat;
