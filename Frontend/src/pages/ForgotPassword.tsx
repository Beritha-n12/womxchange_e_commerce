import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, CheckCircle, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/api/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userFound, setUserFound] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [step, setStep] = useState<'email' | 'code' | 'verified'>('email');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      if (response.data.success && response.data.user) {
        setUserFound(true);
        setUserId(response.data.user.id);
        setStep('code');
        toast({ 
          title: t('auth.user_found') || 'User found!',
          description: t('auth.verification_code_sent') || 'A verification code has been sent to your email.'
        });
      } else {
        toast({ 
          title: t('auth.user_not_found') || 'User not found', 
          description: response.data.message || t('auth.no_account_found') || 'No account found with this email address.',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: t('auth.failed_check_user') || 'Failed to check user existence.',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/verify-reset-code', { 
        email, 
        code: verificationCode 
      });
      
      if (response.data.success) {
        setCodeVerified(true);
        setStep('verified');
        toast({ 
          title: t('auth.code_verified') || 'Code verified!',
          description: t('auth.can_reset_password') || 'You can now reset your password.'
        });
      } else {
        toast({ 
          title: t('auth.invalid_code') || 'Invalid code', 
          description: t('auth.code_incorrect') || 'The verification code is incorrect or expired.',
          variant: 'destructive' 
        });
      }
    } catch (error) {
      toast({ 
        title: t('common.error') || 'Error', 
        description: t('auth.failed_verify_code') || 'Failed to verify code.',
        variant: 'destructive' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = () => {
    if (userId && codeVerified) {
      navigate(`/reset-password/${userId}`, { 
        state: { email, fromForgotPassword: true, verified: true } 
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/login')}
              className="p-0 h-auto"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <CardTitle className="text-2xl">{t('auth.forgot_password') || 'Forgot Password'}</CardTitle>
          </div>
          <CardDescription>
            {step === 'email' 
              ? t('auth.enter_email_check') || 'Enter your email address to check if an account exists'
              : step === 'code'
              ? t('auth.enter_verification_code') || 'Enter the verification code sent to your email'
              : t('auth.account_verified') || 'Account verified! Click below to reset your password'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'email' && (
            <form onSubmit={handleCheckEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email') || 'Email Address'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.enter_email') || 'Enter your email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t('auth.checking') || 'Checking...' : t('auth.check_email') || 'Check Email'}
              </Button>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">{t('auth.verification_code') || 'Verification Code'}</Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="code"
                    type="text"
                    placeholder={t('auth.enter_code') || 'Enter 6-digit code'}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    className="pl-10"
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? t('auth.verifying') || 'Verifying...' : t('auth.verify_code') || 'Verify Code'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                className="w-full"
                onClick={() => setStep('email')}
              >
                {t('common.back') || 'Back'}
              </Button>
            </form>
          )}

          {step === 'verified' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">{t('auth.account_found') || 'Account Found'}</p>
                  <p className="text-sm text-green-600">{email}</p>
                </div>
              </div>
              <Button 
                onClick={handleResetPassword}
                className="w-full"
              >
                {t('auth.reset_password') || 'Reset Password'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;