
import { Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const TestimonialSection = () => {
  const testimonials = [
    {
      name: "Beritha N",
      rating: 5,
      text: "Amazing quality products and fast delivery. I love supporting local women entrepreneurs!",
      avatar: "/Beritha Picture.jpg"
    },
    {
      name: "Gentil Mugisha",
      rating: 5,
      text: "Excellent customer service and high quality products. Will definitely shop here again!",
      avatar: "/Gentil.jpg"
    },
    {
      name: "Divine Izihirwe",
      rating: 5,
      text: "This marketplace changed my shopping experience. So many unique items and great customer service!",
      avatar: "/Divine.jpg"
    },
    {
      name: "Beritha N",
      rating: 5,
      text: "The cosmetics I bought are incredible. Great prices and authentic products from talented women.",
      avatar: "/Beritha Picture.jpg"
    },
    {
      name: "Divine Izihirwe",
      rating: 5,
      text: "Love the variety of products available. Supporting local businesses has never been easier!",
      avatar: "/Divine.jpg"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          OUR HAPPY CUSTOMERS
        </h2>
        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 h-full">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
                    />
                    <div className="flex justify-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
