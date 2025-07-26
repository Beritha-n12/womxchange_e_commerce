import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLanguage } from '@/contexts/LanguageContext';

const Contact = () => {
  const form = useRef<HTMLFormElement>(null);
  const { t } = useLanguage();

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.current) {
      const SERVICE_ID = 'service_qthccjo';
      const TEMPLATE_ID = 'template_72zymql';
      const PUBLIC_KEY = 'cvDC9q5Cvk7cbGNFN';

      emailjs
        .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
        .then((result) => {
          console.log('Email sent successfully!', result.text);
          alert(t('contact.message_sent_success'));
          form.current?.reset();
        })
        .catch((error) => {
          console.error('Error sending email:', error.text);
          alert(t('contact.message_send_failed'));
        });
    } else {
      console.error('Form reference is not available.');
      alert(t('contact.error_occurred'));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section with Background Image */}
      <section className="relative flex items-center justify-center py-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/Convention.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl shadow-lg p-0 max-w-4xl w-full flex overflow-hidden">
              {/* Contact Form */}
              <div className="flex-1 p-8">
                <h2 className="text-2xl font-bold mb-6">{t('contact.send_message')}</h2>

                <form ref={form} onSubmit={sendEmail} className="space-y-4">
                  <Input
                    type="text"
                    placeholder={t('contact.full_name')}
                    className="w-full border-gray-200"
                    name="user_name"
                    required
                  />
                  <Input
                    type="email"
                    placeholder={t('contact.email')}
                    className="w-full border-gray-200"
                    name="user_email"
                    required
                  />
                  <Textarea
                    placeholder={t('contact.message')}
                    rows={4}
                    className="w-full resize-none border-gray-200"
                    name="message"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-lg"
                  >
                    {t('contact.send')}
                  </Button>
                </form>
              </div>

              {/* Contact Information Card */}
              <div className="flex-1 bg-gray-900 text-white p-8 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="w-5 h-5 text-white mt-1" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">{t('contact.phone')}</p>
                      <p className="font-medium">+250 784 720 984</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Mail className="w-5 h-5 text-white mt-1" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">{t('contact.email_label')}</p>
                      <p className="font-medium">nberitha12@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <Clock className="w-5 h-5 text-white mt-1" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">{t('contact.times')}</p>
                      <p className="font-medium">{t('contact.hours')}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <MapPin className="w-5 h-5 text-white mt-1" />
                    <div>
                      <p className="text-sm text-gray-300 mb-1">{t('contact.location')}</p>
                      <p className="font-medium">{t('contact.address')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
