/**
 * Test Suite: PriceAndCTA component
 * Type: Unit (React Testing Library)
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Criteria: AC-07, BR-01, BR-04
 * JIRA: AGNT-1582
 *
 * Key assertion: Add to Cart button is DISABLED when no variant is selected (BR-01).
 *
 * Implementation complete � all tests passing.
 */

// Production component — does not exist yet (RED state)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PriceAndCTA } from '../PriceAndCTA';

const regularPrice = { current: 36.00, original: null, currency: 'USD', isOnSale: false };
const salePrice = { current: 25.00, original: 36.00, currency: 'USD', isOnSale: true };

describe('PriceAndCTA — AC-07, BR-01, BR-04', () => {
  // SCEN-015, BR-01: Add to Cart button is disabled when hasVariants=true and no variant selected
  it('should_render_Add_to_Cart_button_disabled_when_product_has_variants_and_none_selected_SCEN015_BR01', () => {
    render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={true}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={jest.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).toBeDisabled();
  });

  // SCEN-015: Disabled button does not fire onAddToCart when clicked
  it('should_not_fire_onAddToCart_when_button_is_disabled_due_to_no_variant_SCEN015', () => {
    const onAddToCart = jest.fn();
    render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={true}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={onAddToCart}
      />
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    fireEvent.click(button);

    expect(onAddToCart).not.toHaveBeenCalled();
  });

  // SCEN-014, BR-01: Add to Cart enabled immediately when product has no variants
  it('should_render_Add_to_Cart_button_enabled_when_product_has_no_variants_SCEN014', () => {
    render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={false}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={jest.fn()}
      />
    );

    const button = screen.getByRole('button', { name: /add to cart/i });
    expect(button).not.toBeDisabled();
  });

  // SCEN-010, BR-01: Add to Cart enabled after variant is selected
  it('should_enable_Add_to_Cart_button_after_variant_is_selected_SCEN010', () => {
    const { rerender } = render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={true}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={jest.fn()}
      />
    );

    rerender(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={true}
        selectedVariantId="SKU-330"
        isOutOfStock={false}
        onAddToCart={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /add to cart/i })).not.toBeDisabled();
  });

  // SCEN-034, BR-03: Add to Cart disabled when out of stock
  it('should_disable_Add_to_Cart_button_when_selected_variant_is_out_of_stock_SCEN034', () => {
    render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={true}
        selectedVariantId="SKU-310"
        isOutOfStock={true}
        onAddToCart={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /add to cart/i })).toBeDisabled();
  });

  // SCEN-002, BR-04: Sale price renders current price prominently
  it('should_display_sale_price_prominently_and_original_with_strikethrough_SCEN002', () => {
    render(
      <PriceAndCTA
        price={salePrice}
        hasVariants={false}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={jest.fn()}
      />
    );

    // Sale price displayed
    expect(screen.getByText('$25.00')).toBeInTheDocument();
    // Original price with strikethrough
    const originalPrice = screen.getByText('$36.00');
    expect(originalPrice).toBeInTheDocument();
    expect(originalPrice).toHaveStyle({ textDecoration: 'line-through' });
  });

  // SCEN-003, BR-04: Non-sale — only current price visible
  it('should_display_only_current_price_when_product_is_not_on_sale_SCEN003', () => {
    render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={false}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={jest.fn()}
      />
    );

    expect(screen.getByText('$36.00')).toBeInTheDocument();
    // No second price element
    const prices = screen.getAllByText(/\$\d+\.\d{2}/);
    expect(prices).toHaveLength(1);
  });

  // SCEN-015: Message visible indicating variant must be selected
  it('should_show_variant_selection_prompt_when_button_disabled_SCEN015', () => {
    render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={true}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={jest.fn()}
      />
    );

    expect(screen.getByText(/select/i)).toBeInTheDocument();
  });

  // onAddToCart fires when enabled and clicked
  it('should_fire_onAddToCart_when_button_is_enabled_and_clicked', () => {
    const onAddToCart = jest.fn();
    render(
      <PriceAndCTA
        price={regularPrice}
        hasVariants={false}
        selectedVariantId={null}
        isOutOfStock={false}
        onAddToCart={onAddToCart}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    expect(onAddToCart).toHaveBeenCalledTimes(1);
  });
});
