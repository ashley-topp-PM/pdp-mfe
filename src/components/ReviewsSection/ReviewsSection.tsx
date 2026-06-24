import React from 'react';

interface Review {
  reviewId: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
}

interface ReviewsSectionProps {
  averageRating: number | null;
  reviewCount: number | null;
  reviews: Review[] | null;
}

export function ReviewsSection({
  averageRating,
  reviewCount,
  reviews,
}: ReviewsSectionProps): React.ReactElement {
  if (reviews === null) {
    return <p>Reviews unavailable at this time.</p>;
  }

  if (reviews.length === 0) {
    return <p>No reviews yet</p>;
  }

  return (
    <div>
      {averageRating !== null && <span>{averageRating}</span>}
      {reviewCount !== null && (
        <span>{reviewCount.toLocaleString('en-US')} reviews</span>
      )}
      <div>
        {reviews.map(r => (
          <div key={r.reviewId} data-testid="review-card">
            <strong>{r.title}</strong>
            <p>{r.body}</p>
            <span>{r.author}</span>
            <span>{r.rating}</span>
          </div>
        ))}
      </div>
      <a href="/reviews">Read all reviews</a>
    </div>
  );
}
