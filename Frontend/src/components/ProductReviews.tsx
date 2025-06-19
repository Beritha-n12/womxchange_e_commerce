
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Gentil M.",
      rating: 5,
      date: "2 days ago",
      comment: "I love the fitting and quality. Beautifully designed!",
      verified: true,
      helpful: 12
    },
    {
      id: 2,
      name: "Eloi",
      rating: 4,
      date: "1 week ago",
      comment: "Good quality shirt. The fabric feels premium and comfortable to wear.",
      verified: true,
      helpful: 8
    },
    {
      id: 3,
      name: "Gentil M.",
      rating: 5,
      date: "2 weeks ago",
      comment: "Excellent product! The fit is perfect and the color is exactly as shown in the pictures.",
      verified: true,
      helpful: 15
    },
    {
      id: 4,
      name: "Urban B.",
      rating: 4,
      date: "3 weeks ago",
      comment: "Great shirt overall. The material is soft and the sizing is accurate. Would recommend!",
      verified: true,
      helpful: 6
    }
  ];

  return (
    <div className="space-y-6">
      {/* Review Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">All Reviews (451)</h3>
        </div>
        <div className="flex items-center gap-4">
          <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
            <option>Latest</option>
            <option>Oldest</option>
            <option>Highest Rating</option>
            <option>Lowest Rating</option>
          </select>
          <Button className="bg-purple hover:bg-purple-600 text-white">
            Write a Review
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple rounded-full flex items-center justify-center text-white font-semibold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.name}</span>
                    {review.verified && (
                      <span className="text-green-600 text-sm">✓</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-3">{review.comment}</p>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center">
        <Button variant="outline" className="border-purple text-purple hover:bg-purple hover:text-white">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};

export default ProductReviews;
