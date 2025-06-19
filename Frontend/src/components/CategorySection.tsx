
const CategorySection = () => {
  const categories = [
    {
      title: "Cosmetics and Personal Products",
      color: "bg-pink-100",
      textColor: "text-pink-800",
      image: "/Cosmetics.jpeg"
    },
    {
      title: "Clothes",
      color: "bg-yellow-100",
      textColor: "text-yellow-800",
      image: "/Clothing.jpeg"
    },
    {
      title: "Made In Rwanda",
      color: "bg-purple-100",
      textColor: "text-purple-800",
      image: "/Made in Rwanda shirts.jpeg"
    },
    {
      title: "Household Products",
      color: "bg-gray-100",
      textColor: "text-gray-800",
      image: "/House.jpeg"
    },
    {
      title: "Shoes",
      color: "bg-green-100",
      textColor: "text-green-800",
      image: "/Shoes.jpeg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          BROWSE BY CATEGORIES
        </h2>
        
        {/* First row - 2 categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {categories.slice(0, 2).map((category, index) => (
            <div 
              key={index}
              className={`${category.color} rounded-3xl p-8 hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in relative overflow-hidden h-64`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between h-full">
                <div className="z-10 relative">
                  <h3 className={`font-bold text-2xl ${category.textColor} mb-4`}>
                    {category.title}
                  </h3>
                  <button className={`${category.textColor} opacity-80 hover:opacity-100 text-lg font-semibold`}>
                    Shop Now →
                  </button>
                </div>
                <div className="absolute right-4 top-4 w-40 h-40 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Second row - 3 categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.slice(2).map((category, index) => (
            <div 
              key={index + 2}
              className={`${category.color} rounded-3xl p-6 hover:scale-105 transition-all duration-300 cursor-pointer group animate-fade-in relative overflow-hidden h-56`}
              style={{ animationDelay: `${(index + 2) * 0.1}s` }}
            >
              <div className="flex flex-col justify-between h-full">
                <div className="z-10 relative">
                  <h3 className={`font-bold text-lg ${category.textColor} mb-3`}>
                    {category.title}
                  </h3>
                  <button className={`${category.textColor} opacity-80 hover:opacity-100 text-sm font-semibold`}>
                    Shop Now →
                  </button>
                </div>
                <div className="absolute right-2 bottom-2 w-40 h-40 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
