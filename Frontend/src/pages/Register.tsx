
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { registerUser } from '@/api/auth';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast({
        title: t('register.registration_successful'),
        description: t('register.login_with_credentials'),
      });
      navigate('/login');
    },
    onError: (error: any) => {
      toast({
        title: t('register.registration_failed'),
        description: error.response?.data?.message || t('register.something_went_wrong'),
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password, role });
  };
  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <img src="/wxc.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />
            
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('register.back_to_home')}
            </Link>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('register.create_account')}</h2>
            
            <div className="text-sm text-gray-600">
              <span>{t('register.already_have_account')} </span>
              <Link to="/login" className="text-purple-600 hover:underline">
                {t('auth.login')}
              </Link>
            </div>
          </div>

      <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('register.full_name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('register.enter_full_name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('register.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('register.enter_email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('register.password')}</Label>
              <PasswordInput
                id="password"
                placeholder={t('register.create_password')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t('register.account_type')}</Label>
              <Select value={role} onValueChange={(value: any) => setRole(value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('register.select_account_type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">{t('register.buyer')}</SelectItem>
                  <SelectItem value="seller">{t('register.seller')}</SelectItem>
                  <SelectItem value="admin">{t('register.admin')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-black"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? t('register.creating_account') : t('register.create_account')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-4">{t('register.looking_to_sell')}</p>
            <Link
              to="/seller-request"
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
            >
              {t('register.start_selling_now')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;