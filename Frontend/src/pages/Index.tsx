
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ProductSection from '@/components/ProductSection';
import CategorySection from '@/components/CategorySection';
import TestimonialSection from '@/components/TestimonialSection';
import Footer from '@/components/Footer';

const Index = () => {
  const newArrivals = [
    {
      image: "/Head Phone.jpeg",
      title: "Wireless Headphones",
      price: "15,000 Rwf",
      rating: 5
    },
    {
      image: "/Jordan1.jpeg",
      title: "Jordan 1 Shoes",
      price: "25,000 Rwf",
      rating: 5
    },
    {
      image: "/Shoulder Bag.jpeg",
      title: "Shoulder Bag",
      price: "18,000 Rwf",
      rating: 5
    },
    {
      image: "/BRUCEGAO.jpeg",
      title: "BRUCEGAO's Alligator Bag",
      price: "20,000 Rwf",
      rating: 5
    },
    {
      image: "/Trivet Set.jpeg",
      title: "Trivet Set",
      price: "45,000 Rwf",
      rating: 5
    },
    {
      image: "/Dress.jpeg",
      title: "Dress",
      price: "30,000 Rwf",
      rating: 5
    },
    {
      image: "/Samba.jpeg",
      title: "Samba",
      price: "12,000 Rwf",
      rating: 5
    },
    {
      image: "/flat shoes.jpeg",
      title: "Flat Shoes",
      price: "5,000 Rwf",
      rating: 5
    }
  ];

  const topSelling = [
    {
      image: "/Hill Shoes.jpeg",
      title: "Hill Shoes",
      price: "15,000 Rwf",
      rating: 5
    },
    {
      image: "/Women's Trendy.jpeg",
      title: "Women's Trendy Bomber Jacket",
      price: "12,000 Rwf",
      rating: 5
    },
    {
      image: "/Zingj Zingj Shorts Women's Summer Dress.jpeg",
      title: "Shorts Women's Summer Dress",
      price: "18,000 Rwf",
      rating: 5
    },
    {
      image: "/vegan brush.jpeg",
      title: "Vegan Brush",
      price: "22,000 Rwf",
      rating: 5
    },
    {
      image: "/This Drugstore.jpeg",
      title: "This Drugstore ",
      price: "28,000 Rwf",
      rating: 5
    },
    {
      image: "/Table Lamps & Table Lights _ ValueLights.jpeg",
      title: "Table Lamps & Table Lights _ ValueLights",
      price: "50,000 Rwf",
      rating: 5
    },
    {
      image: "/Yankees Branson.jpeg",
      title: "Yankees Branson",
      price: "10,000 Rwf",
      rating: 5
    },
    {
      image: "/JBL Flip 6.jpeg",
      title: "JBL Flip 6",
      price: "150,000 Rwf",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <ProductSection title="NEW ARRIVALS" products={newArrivals} />
      <ProductSection title="TOP SELLING" products={topSelling} />
      <CategorySection />
      <TestimonialSection />
      <Footer />
    </div>
  );
};

export default Index;
