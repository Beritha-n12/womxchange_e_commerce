
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-purple-50 to-purple-100 py-24 min-h-[800px] flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 animate-slide-in-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 leading-tight">
              Welcome to A Smart Marketplace for Women Entrepreneurs in Rwanda
            </h1>
            <p className="text-lg text-gray-600 mb-10">
            Built for women entrepreneurs in Kigali, WomXchange Rwanda provides a seamless online platform for selling, managing, and expanding your business.
            </p>
            <Button className="bg-purple hover:bg-purple-600 text-white px-8 py-4 text-lg rounded-full">
              Shop Now
            </Button>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in">
            <div className="relative">
              <img 
                src="/Hero01.jpg"
                alt="Successful woman entrepreneur"
                className="rounded-2xl shadow-2xl w-100 h-100 object-cover"
              />
              {/* <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-purple font-bold text-2xl">1000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
