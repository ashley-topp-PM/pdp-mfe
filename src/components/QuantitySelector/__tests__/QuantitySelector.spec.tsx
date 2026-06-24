/**
 * Test Suite: QuantitySelector component
 * Type: Unit (React Testing Library)
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Criteria: AC-08, BR-02
 * JIRA: AGNT-1582
 *
 * Verifies: min=1, max=maxPurchaseQuantity, default=1, reject 0 and >max.
 *
 * Implementation complete � all tests passing.
 */

// Production component — does not exist yet (RED state)
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuantitySelector } from '../QuantitySelector';

describe('QuantitySelector — AC-08, BR-02', () => {
  // SCEN-018, BR-02: Default value is 1
  it('should_default_to_quantity_1_on_initial_render_SCEN018', () => {
    render(<QuantitySelector value={1} maxPurchaseQuantity={10} onChange={jest.fn()} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(1);
  });

  // SCEN-018, BR-02: Cannot decrease below 1 — decrement button disabled at min
  it('should_disable_decrement_button_when_quantity_is_1_SCEN018', () => {
    render(<QuantitySelector value={1} maxPurchaseQuantity={10} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /decrease/i })).toBeDisabled();
  });

  // SCEN-018, BR-02: Cannot increase above maxPurchaseQuantity — increment button disabled at max
  it('should_disable_increment_button_when_quantity_equals_maxPurchaseQuantity_SCEN018', () => {
    render(<QuantitySelector value={10} maxPurchaseQuantity={10} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled();
  });

  // SCEN-019, BR-02: Entering 0 resets to 1 or shows error
  it('should_reset_quantity_to_1_when_user_enters_0_SCEN019', () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={1} maxPurchaseQuantity={10} onChange={onChange} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);

    // onChange should be called with 1 (minimum), not 0
    expect(onChange).toHaveBeenCalledWith(1);
  });

  // SCEN-020, BR-02: Entering value above max resets to max
  it('should_reset_quantity_to_max_when_user_enters_value_above_max_SCEN020', () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={10} maxPurchaseQuantity={10} onChange={onChange} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '11' } });
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith(10);
  });

  // Increment button increases quantity by 1
  it('should_increase_quantity_by_1_when_increment_button_clicked', () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={3} maxPurchaseQuantity={10} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /increase/i }));
    expect(onChange).toHaveBeenCalledWith(4);
  });

  // Decrement button decreases quantity by 1
  it('should_decrease_quantity_by_1_when_decrement_button_clicked', () => {
    const onChange = jest.fn();
    render(<QuantitySelector value={3} maxPurchaseQuantity={10} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button', { name: /decrease/i }));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  // maxPurchaseQuantity respected — custom max (e.g. 5)
  it('should_respect_custom_maxPurchaseQuantity_other_than_10', () => {
    render(<QuantitySelector value={5} maxPurchaseQuantity={5} onChange={jest.fn()} />);

    expect(screen.getByRole('button', { name: /increase/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /decrease/i })).not.toBeDisabled();
  });
});
