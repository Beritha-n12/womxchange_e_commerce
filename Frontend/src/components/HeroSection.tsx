import { Button } from '@/components/ui/button';
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-8 sm:py-12 md:py-16 lg:py-24 min-h-[600px] sm:min-h-[700px] md:min-h-[800px] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          <div className="w-full lg:w-1/2 text-left animate-slide-in-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 md:mb-12 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-2xl lg:mx-0">
              {t('hero.description')}
            </p>
            <Link to="/products">
              <Button className="bg-purple hover:bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                {t('hero.shop_now')}
              </Button>
            </Link>
          </div>
          
          <div className="w-full lg:w-1/2 flex justify-center animate-fade-in">
            <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
              <img
                src="/Hero01.jpg"
                alt={t('hero.image_alt')}
                className="rounded-2xl shadow-2xl w-full h-auto object-cover aspect-square sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;