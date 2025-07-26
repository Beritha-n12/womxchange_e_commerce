import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import api from "@/api/api";
import { PasswordInput } from "@/components/ui/password-input";
import { useLanguage } from "@/contexts/LanguageContext";

const SellerRequest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    emailAddress: "",
    businessName: "",
    gender: "",
    password: ""
  });
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast({
        title: t('seller_request.error'),
        description: t('seller_request.accept_terms'),
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const sellerRequestData = {
        name: formData.name,
        email: formData.emailAddress,
        password: formData.password,
        phone: formData.phoneNumber,
        businessName: formData.businessName,
        gender: formData.gender,
        role: "SELLER"
      };

      await api.post('/sellers/request', sellerRequestData);

      setIsSuccess(true);
      toast({
        title: t('seller_request.success_title'),
        description: t('seller_request.success_message'),
      });

      setTimeout(() => {
        navigate('/login', {
          state: {
            message: t('seller_request.redirect_message')
          }
        });
      }, 3000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || t('seller_request.submit_failed');
      toast({
        title: t('seller_request.error'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg p-8 shadow-2xl text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('seller_request.request_submitted')}</h2>
            <p className="text-gray-600 mb-6">{t('seller_request.await_email')}</p>
            <p className="text-sm text-gray-500">{t('seller_request.redirecting_login')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <img src="/wxc.png" alt="Logo" className="w-16 h-16 mx-auto mb-4" />

            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('seller_request.back_to_home')}
            </Link>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('seller_request.become_seller')}</h2>

            <div className="text-sm text-gray-600">
              <span>{t('seller_request.have_account')} </span>
              <Link to="/login" className="text-purple-600 hover:underline">
                {t('auth.login')}
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              placeholder={t('seller_request.full_name')}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />

            <Input
              type="tel"
              placeholder={t('seller_request.phone')}
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              required
            />

            <div className="relative">
              <Input
                type="email"
                placeholder={t('seller_request.email')}
                value={formData.emailAddress}
                onChange={(e) => handleInputChange("emailAddress", e.target.value)}
                required
              />
              <Mail className="absolute right-4 top-[50%] translate-y-[-50%] w-5 h-5 text-cyan-500 pointer-events-none" />
            </div>

            <Input
              type="text"
              placeholder={t('seller_request.business_name')}
              value={formData.businessName}
              onChange={(e) => handleInputChange("businessName", e.target.value)}
              required
            />

            <Select onValueChange={(value) => handleInputChange("gender", value)} required>
              <SelectTrigger>
                <SelectValue placeholder={t('seller_request.gender')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{t('seller_request.male')}</SelectItem>
                <SelectItem value="female">{t('seller_request.female')}</SelectItem>
                <SelectItem value="other">{t('seller_request.other')}</SelectItem>
                <SelectItem value="prefer-not-to-say">{t('seller_request.prefer_not')}</SelectItem>
              </SelectContent>
            </Select>

            <PasswordInput
              id="password"
              placeholder={t('seller_request.password')}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
            />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="seller-terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
              />
              <label htmlFor="seller-terms" className="text-sm text-gray-600">
                {t('seller_request.agree_text')}{" "}
                <Link to="/terms" className="text-purple-600 hover:underline">
                  {t('seller_request.terms')}
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-md transition-colors"
              disabled={!agreeTerms || isSubmitting}
            >
              {isSubmitting ? t('seller_request.submitting') : t('seller_request.submit')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellerRequest;
