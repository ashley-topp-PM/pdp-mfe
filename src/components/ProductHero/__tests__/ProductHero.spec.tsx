/**
 * Test Suite: ProductHero component
 * Type: Unit (React Testing Library)
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Criteria: AC-01, AC-02, BR-05, BR-06
 * JIRA: AGNT-1582
 *
 * Implementation complete � all tests passing.
 */

// Production component — does not exist yet (RED state)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductHero } from '../ProductHero';

const makeImages = (count: number) =>
  Array.from({ length: count }, (_, i) => ({
    url: `https://cdn.sephora.com/img${i + 1}.jpg`,
    altText: `Product image ${i + 1}`,
    displayOrder: i + 1,
  }));

describe('ProductHero — AC-01, AC-02, BR-05, BR-06', () => {
  // SCEN-001: Hero renders first image on load
  it('should_render_first_image_on_initial_load_SCEN001', () => {
    const images = makeImages(5);
    render(<ProductHero images={images} productName="Pro Filt'r Foundation" />);

    const heroImg = screen.getByRole('img', { name: /Product image 1/i });
    expect(heroImg).toBeInTheDocument();
    expect(heroImg).toHaveAttribute('src', images[0].url);
  });

  // SCEN-005: Arrow navigation — right arrow advances to next image
  it('should_advance_to_next_image_when_right_arrow_clicked_SCEN005', () => {
    const images = makeImages(5);
    render(<ProductHero images={images} productName="Foundation" />);

    const nextBtn = screen.getByRole('button', { name: /next image/i });
    fireEvent.click(nextBtn);

    const heroImg = screen.getByRole('img', { name: /Product image 2/i });
    expect(heroImg).toHaveAttribute('src', images[1].url);
  });

  // SCEN-005: Arrow navigation — left arrow goes back
  it('should_navigate_to_previous_image_when_left_arrow_clicked_SCEN005', () => {
    const images = makeImages(5);
    render(<ProductHero images={images} productName="Foundation" />);

    const nextBtn = screen.getByRole('button', { name: /next image/i });
    const prevBtn = screen.getByRole('button', { name: /previous image/i });

    fireEvent.click(nextBtn); // → image 2
    fireEvent.click(prevBtn); // → image 1

    const heroImg = screen.getByRole('img', { name: /Product image 1/i });
    expect(heroImg).toHaveAttribute('src', images[0].url);
  });

  // SCEN-007: Click on hero image opens zoom view
  it('should_open_zoom_view_when_hero_image_is_clicked_SCEN007', () => {
    const images = makeImages(3);
    render(<ProductHero images={images} productName="Foundation" />);

    const heroImg = screen.getByRole('img', { name: /Product image 1/i });
    fireEvent.click(heroImg);

    expect(screen.getByRole('dialog', { name: /zoom/i })).toBeInTheDocument();
  });

  // SCEN-008: Minimum 2 images — no layout errors
  it('should_render_without_error_when_product_has_exactly_2_images_SCEN008', () => {
    const images = makeImages(2);
    const { container } = render(<ProductHero images={images} productName="Foundation" />);

    expect(container).not.toBeEmptyDOMElement();
    expect(screen.getByRole('img', { name: /Product image 1/i })).toBeInTheDocument();
  });

  // SCEN-009: Maximum 12 images — all reachable via navigation
  it('should_render_all_12_images_reachable_via_navigation_SCEN009', () => {
    const images = makeImages(12);
    render(<ProductHero images={images} productName="Foundation" />);

    const nextBtn = screen.getByRole('button', { name: /next image/i });

    // Navigate through all 12 images
    for (let i = 1; i < 12; i++) {
      fireEvent.click(nextBtn);
    }

    // After 11 clicks from image 1, should be at image 12
    expect(screen.getByRole('img', { name: /Product image 12/i })).toBeInTheDocument();
  });

  // SCEN-039: Hero carousel buttons have ARIA labels (Next image / Previous image)
  it('should_have_ARIA_labels_on_carousel_navigation_buttons_SCEN039', () => {
    render(<ProductHero images={makeImages(3)} productName="Foundation" />);

    expect(screen.getByRole('button', { name: /next image/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /previous image/i })).toBeInTheDocument();
  });

  // Variant image swap — when selectedHeroImageUrl prop changes, hero src updates
  // SCEN-010: Swatch selection updates hero image
  it('should_update_hero_src_when_selectedHeroImageUrl_prop_changes_SCEN010', () => {
    const images = makeImages(3);
    const variantImageUrl = 'https://cdn.sephora.com/shade330.jpg';

    const { rerender } = render(
      <ProductHero images={images} productName="Foundation" selectedHeroImageUrl={undefined} />
    );

    rerender(
      <ProductHero images={images} productName="Foundation" selectedHeroImageUrl={variantImageUrl} />
    );

    const heroImg = screen.getByRole('img', { name: /Foundation/i });
    expect(heroImg).toHaveAttribute('src', variantImageUrl);
  });
});
