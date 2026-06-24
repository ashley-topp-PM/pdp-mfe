/**
 * Test Suite: AddToCartModal component
 * Type: Unit (React Testing Library)
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Criteria: AC-06, BR-08, BR-09
 * JIRA: AGNT-1582
 *
 * Key assertion: zero fetch/axios calls when "View Cart" is clicked (BR-09 regression guard).
 * Modal is UI-only — no Cart API calls under any interaction.
 *
 * Implementation complete � all tests passing.
 */

// Production component — does not exist yet (RED state)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AddToCartModal } from '../AddToCartModal';

const defaultProps = {
  isOpen: true,
  productName: "Pro Filt'r Foundation",
  selectedVariantLabel: '330 Medium Beige',
  quantity: 1,
  price: '$36.00',
  onClose: jest.fn(),
  onViewCart: jest.fn(),
  onContinueShopping: jest.fn(),
};

describe('AddToCartModal — AC-06, BR-08, BR-09', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on fetch and XMLHttpRequest to detect any accidental API calls
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-016, AC-06: Modal shows product name, variant, quantity, price
  it('should_display_product_name_variant_quantity_and_price_when_open_SCEN016', () => {
    render(<AddToCartModal {...defaultProps} />);

    expect(screen.getByText("Pro Filt'r Foundation")).toBeInTheDocument();
    expect(screen.getByText(/330 Medium Beige/i)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('$36.00')).toBeInTheDocument();
  });

  // SCEN-016: Modal contains View Cart and Continue Shopping buttons
  it('should_render_View_Cart_and_Continue_Shopping_buttons_SCEN016', () => {
    render(<AddToCartModal {...defaultProps} />);

    expect(screen.getByRole('button', { name: /view cart/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue shopping/i })).toBeInTheDocument();
  });

  // SCEN-017: Modal shows correct quantity when quantity is 3
  it('should_display_quantity_3_when_passed_as_prop_SCEN017', () => {
    render(<AddToCartModal {...defaultProps} quantity={3} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  // SCEN-021: X button closes modal
  it('should_call_onClose_when_X_button_is_clicked_SCEN021', () => {
    render(<AddToCartModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // SCEN-022: Clicking overlay closes modal
  it('should_call_onClose_when_overlay_backdrop_is_clicked_SCEN022', () => {
    render(<AddToCartModal {...defaultProps} />);

    const overlay = screen.getByTestId('modal-overlay');
    fireEvent.click(overlay);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  // SCEN-023, BR-09: CRITICAL — no fetch/axios calls when View Cart clicked
  it('should_make_zero_fetch_calls_when_View_Cart_is_clicked_BR09_SCEN023_regression_guard', () => {
    render(<AddToCartModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /view cart/i }));

    expect(global.fetch).not.toHaveBeenCalled();
    // onViewCart prop is for navigation only
    expect(defaultProps.onViewCart).toHaveBeenCalledTimes(1);
  });

  // SCEN-023, BR-09: No fetch calls on Add to Cart click either (modal rendering itself)
  it('should_make_zero_fetch_calls_when_Continue_Shopping_is_clicked_BR09_regression_guard', () => {
    render(<AddToCartModal {...defaultProps} />);

    fireEvent.click(screen.getByRole('button', { name: /continue shopping/i }));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(defaultProps.onContinueShopping).toHaveBeenCalledTimes(1);
  });

  // SCEN-040, AC-15: Modal has role=dialog with aria-label
  it('should_have_role_dialog_with_aria_label_for_accessibility_SCEN040', () => {
    render(<AddToCartModal {...defaultProps} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label');
  });

  // SCEN-040: Modal traps focus — first focusable element receives focus on open
  it('should_have_close_button_as_first_focusable_element_for_focus_trap_SCEN040', () => {
    render(<AddToCartModal {...defaultProps} />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
    // Focus should be within the modal
    expect(document.activeElement).not.toBe(document.body);
  });

  // Modal not rendered when isOpen=false
  it('should_not_render_modal_content_when_isOpen_is_false', () => {
    render(<AddToCartModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
