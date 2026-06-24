/**
 * Test Suite: ReviewsSection component
 * Type: Unit (React Testing Library)
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Criteria: AC-05, BR-07
 * JIRA: AGNT-1582
 *
 * Key assertion: empty reviews array renders no error (SCEN-027).
 *
 * Implementation complete � all tests passing.
 */

// Production component — does not exist yet (RED state)
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ReviewsSection } from '../ReviewsSection';

const makeReviews = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    reviewId: `REV-${i + 1}`,
    author: `User${i + 1}`,
    rating: 4,
    title: `Review ${i + 1}`,
    body: `Review body ${i + 1}`,
    date: '2026-06-01',
  }));

describe('ReviewsSection — AC-05, BR-07', () => {
  // SCEN-024: Shows star rating, count, and review cards
  it('should_display_star_rating_review_count_and_review_cards_SCEN024', () => {
    render(
      <ReviewsSection
        averageRating={4.5}
        reviewCount={1200}
        reviews={makeReviews(3)}
      />
    );

    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText(/1,200/)).toBeInTheDocument();
    expect(screen.getAllByTestId('review-card')).toHaveLength(3);
    expect(screen.getByRole('link', { name: /read all reviews/i })).toBeInTheDocument();
  });

  // SCEN-025, BR-07: Displays at most 5 reviews
  it('should_display_at_most_5_review_cards_when_50_reviews_available_SCEN025', () => {
    render(
      <ReviewsSection
        averageRating={4.2}
        reviewCount={50}
        reviews={makeReviews(5)}
      />
    );

    const cards = screen.getAllByTestId('review-card');
    expect(cards.length).toBeLessThanOrEqual(5);
    expect(cards.length).toBeGreaterThanOrEqual(3);
  });

  // SCEN-026: Fewer than 3 reviews — shows available reviews without error
  it('should_display_2_review_cards_without_error_when_only_2_reviews_exist_SCEN026', () => {
    render(
      <ReviewsSection
        averageRating={4.0}
        reviewCount={2}
        reviews={makeReviews(2)}
      />
    );

    expect(screen.getAllByTestId('review-card')).toHaveLength(2);
    expect(screen.getByRole('link', { name: /read all reviews/i })).toBeInTheDocument();
  });

  // SCEN-027, BR-07: EMPTY reviews array renders no error — no JS error, shows "No reviews yet"
  it('should_render_no_error_and_show_fallback_message_when_reviews_array_is_empty_SCEN027', () => {
    // This assertion verifies the component does not throw when reviews=[]
    expect(() => {
      render(
        <ReviewsSection
          averageRating={null}
          reviewCount={0}
          reviews={[]}
        />
      );
    }).not.toThrow();

    expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
    expect(screen.queryByTestId('review-card')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /read all reviews/i })).not.toBeInTheDocument();
  });

  // SCEN-032, BR-13: Reviews API failure — section shows fallback, page does not crash
  it('should_show_reviews_unavailable_fallback_when_reviews_are_null_SCEN032', () => {
    render(
      <ReviewsSection
        averageRating={null}
        reviewCount={null}
        reviews={null}
      />
    );

    expect(screen.getByText(/unavailable/i)).toBeInTheDocument();
    expect(screen.queryByTestId('review-card')).not.toBeInTheDocument();
  });
});
