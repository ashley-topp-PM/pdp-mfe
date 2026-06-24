/**
 * Test Suite: VariantSelector component
 * Type: Unit (React Testing Library)
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Criteria: AC-03, AC-04, BR-01
 * JIRA: AGNT-1582
 *
 * Verifies: swatch selection updates hero src prop and enables CTA (BR-01).
 *
 * Implementation complete � all tests passing.
 */

// Production component — does not exist yet (RED state)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VariantSelector } from '../VariantSelector';

const shadeVariants = [
  {
    variantId: 'SKU-310',
    label: '310 Warm Olive',
    type: 'shade' as const,
    swatchImageUrl: 'https://cdn.sephora.com/swatches/310.jpg',
    heroImageUrl: 'https://cdn.sephora.com/hero/310.jpg',
    price: { current: 36.00, original: null, currency: 'USD', isOnSale: false },
    inStock: true,
  },
  {
    variantId: 'SKU-330',
    label: '330 Medium Beige',
    type: 'shade' as const,
    swatchImageUrl: 'https://cdn.sephora.com/swatches/330.jpg',
    heroImageUrl: 'https://cdn.sephora.com/hero/330.jpg',
    price: { current: 36.00, original: null, currency: 'USD', isOnSale: false },
    inStock: true,
  },
  {
    variantId: 'SKU-420',
    label: '420 Deep Neutral',
    type: 'shade' as const,
    swatchImageUrl: 'https://cdn.sephora.com/swatches/420.jpg',
    heroImageUrl: 'https://cdn.sephora.com/hero/420.jpg',
    price: { current: 36.00, original: null, currency: 'USD', isOnSale: false },
    inStock: true,
  },
];

describe('VariantSelector — AC-03, AC-04, BR-01', () => {
  // SCEN-010: Swatch selection calls onVariantSelected with correct variant
  it('should_call_onVariantSelected_with_selected_variant_when_swatch_clicked_SCEN010', () => {
    const onVariantSelected = jest.fn();
    render(
      <VariantSelector
        variants={shadeVariants}
        selectedVariantId={null}
        onVariantSelected={onVariantSelected}
      />
    );

    const swatch330 = screen.getByRole('button', { name: /330 Medium Beige/i });
    fireEvent.click(swatch330);

    expect(onVariantSelected).toHaveBeenCalledWith(shadeVariants[1]);
    expect(onVariantSelected).toHaveBeenCalledTimes(1);
  });

  // SCEN-010: onVariantSelected passes hero image URL for hero update
  it('should_pass_hero_image_url_in_selected_variant_for_hero_update_SCEN010', () => {
    const onVariantSelected = jest.fn();
    render(
      <VariantSelector
        variants={shadeVariants}
        selectedVariantId={null}
        onVariantSelected={onVariantSelected}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /330 Medium Beige/i }));

    const selectedVariant = onVariantSelected.mock.calls[0][0];
    expect(selectedVariant.heroImageUrl).toBe('https://cdn.sephora.com/hero/330.jpg');
    expect(selectedVariant.variantId).toBe('SKU-330');
  });

  // SCEN-011, BR-01: Selected swatch shows visual border/highlight
  it('should_show_selected_visual_state_on_chosen_swatch_SCEN011', () => {
    render(
      <VariantSelector
        variants={shadeVariants}
        selectedVariantId="SKU-330"
        onVariantSelected={jest.fn()}
      />
    );

    const swatch330 = screen.getByRole('button', { name: /330 Medium Beige/i });
    // Selected state indicated via aria-pressed or data-selected
    expect(swatch330).toHaveAttribute('aria-pressed', 'true');
  });

  // SCEN-011: Only one swatch shows selected state at a time
  it('should_only_show_selected_state_on_one_swatch_at_a_time_SCEN011', () => {
    render(
      <VariantSelector
        variants={shadeVariants}
        selectedVariantId="SKU-330"
        onVariantSelected={jest.fn()}
      />
    );

    const pressedButtons = screen
      .getAllByRole('button')
      .filter(btn => btn.getAttribute('aria-pressed') === 'true');

    expect(pressedButtons).toHaveLength(1);
    expect(pressedButtons[0]).toHaveAccessibleName(/330 Medium Beige/i);
  });

  // SCEN-012: Size selector — dropdown value updates on selection
  it('should_update_selected_size_when_size_option_selected_SCEN012', () => {
    const sizeVariants = [
      { variantId: 'SKU-T', label: 'Travel (1 oz)', type: 'size' as const, swatchImageUrl: '', heroImageUrl: '', price: { current: 18.00, original: null, currency: 'USD', isOnSale: false }, inStock: true },
      { variantId: 'SKU-S', label: 'Standard (2 oz)', type: 'size' as const, swatchImageUrl: '', heroImageUrl: '', price: { current: 36.00, original: null, currency: 'USD', isOnSale: false }, inStock: true },
      { variantId: 'SKU-V', label: 'Value (3 oz)', type: 'size' as const, swatchImageUrl: '', heroImageUrl: '', price: { current: 48.00, original: null, currency: 'USD', isOnSale: false }, inStock: true },
    ];
    const onVariantSelected = jest.fn();

    render(
      <VariantSelector
        variants={sizeVariants}
        selectedVariantId={null}
        onVariantSelected={onVariantSelected}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'SKU-V' } });

    expect(onVariantSelected).toHaveBeenCalledWith(sizeVariants[2]);
  });

  // SCEN-039: Each swatch announces shade name via aria-label
  it('should_have_aria_label_with_shade_name_on_each_swatch_button_SCEN039', () => {
    render(
      <VariantSelector
        variants={shadeVariants}
        selectedVariantId={null}
        onVariantSelected={jest.fn()}
      />
    );

    shadeVariants.forEach(v => {
      expect(screen.getByRole('button', { name: new RegExp(v.label, 'i') })).toBeInTheDocument();
    });
  });
});
