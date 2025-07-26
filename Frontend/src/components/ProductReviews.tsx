import React, { useState, useContext } from 'react';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AuthContext } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getProductReviews, createProductReview } from '@/api/reviews';
import { useLanguage } from '@/contexts/LanguageContext';  // <-- Added

type ProductReviewsProps = {
  productId: string | number;
};

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const auth = useContext(AuthContext);
  const user = auth?.user;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { t } = useLanguage(); // <-- Added

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews from backend
  const { data: reviewsData, isLoading, error } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getProductReviews(productId.toString()),
  });

  const reviews = reviewsData?.data || [];

  // Submit review mutation
  const submitReviewMutation = useMutation({
    mutationFn: (reviewData: { rating: number; comment: string }) => {
      return createProductReview(productId.toString(), reviewData);
    },
    onSuccess: () => {
      toast({
        title: t('sellerRequest.review_submitted'),
        description: t('sellerRequest.thank_you_review'),
      });
      setComment('');
      setRating(5);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] }); // Refresh testimonial section
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || t('sellerRequest.failed_to_submit_review');
      toast({
        title: t('sellerRequest.error'),
        description: errorMessage,
        variant: "destructive",
      });
    }
  });

  const handleSubmitReview = () => {
    if (!comment.trim()) {
      toast({
        title: t('sellerRequest.error'),
        description: t('sellerRequest.write_comment_review'),
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: t('sellerRequest.error'),
        description: t('sellerRequest.login_to_submit_review'),
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({ rating, comment: comment.trim() });
  };

  const StarRating = ({ value, onChange, readonly = false }: { 
    value: number; 
    onChange?: (value: number) => void; 
    readonly?: boolean;
  }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 cursor-pointer transition-colors ${
            star <= value ? 'text-yellow-400 fill-current' : 'text-gray-300'
          } ${readonly ? 'cursor-default' : 'hover:text-yellow-300'}`}
          onClick={() => !readonly && onChange?.(star)}
        />
      ))}
    </div>
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-gray-600">{t('sellerRequest.loading_reviews')}</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">{t('sellerRequest.failed_to_load_reviews')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {t('sellerRequest.customer_reviews')} ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Review Button for logged-in users */}
        {user && (
          <div className="border-b pb-6">
            {!showForm ? (
              <Button 
                onClick={() => setShowForm(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {t('sellerRequest.write_review')}
              </Button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('sellerRequest.write_your_review')}</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t('sellerRequest.rating')}</label>
                  <StarRating value={rating} onChange={setRating} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">{t('sellerRequest.comment')}</label>
                  <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={t('sellerRequest.share_experience')}
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={submitReviewMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {submitReviewMutation.isPending ? t('sellerRequest.submitting') : t('sellerRequest.submit_review')}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setComment('');
                      setRating(5);
                    }}
                  >
                    {t('sellerRequest.cancel')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {!user && (
          <div className="border-b pb-6">
            <p className="text-gray-600 text-sm">
              {t('sellerRequest.login_to_write_review', { loginLink: <a href="/login" className="text-purple-600 hover:underline">{t('auth.login')}</a> })}
            </p>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="font-medium">{review.user.name}</p>
                    <div className="flex items-center space-x-2">
                      <StarRating value={review.rating} readonly />
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 ml-13">{review.comment}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('sellerRequest.no_reviews_yet')}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviews;
