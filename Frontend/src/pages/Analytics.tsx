
import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/contexts/LanguageContext';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'buyer') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.role === 'buyer') {
    return null;
  }

  return (
    <DashboardLayout currentPage="analytics">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">{t('analytics.coming_soon')}</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
