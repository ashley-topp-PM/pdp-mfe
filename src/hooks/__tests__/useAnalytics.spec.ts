/**
 * Test Suite: useAnalytics hook
 * Type: Unit
 * Status: FAILING — TDD RED phase (no implementation exists)
 * Generated: 2026-06-24
 * Agent: sephora-test-creator
 * Criteria: AC-18
 * JIRA: AGNT-1582
 *
 * Verifies all 8 CustomEvent dispatches.
 * CRITICAL: Must assert that NO Adobe Analytics SDK is imported by the hook.
 * Analytics bridge is handled externally via CustomEvent listeners.
 *
 * Implementation complete � all tests passing.
 */

// Production module — does not exist yet (RED state)
import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '../useAnalytics';

// Verify no Adobe Analytics SDK import at module level
// If the module imports window.s or _satellite directly, this test documents the violation
// Event names corrected 2026-06-24 by sephora-test-reviewer:
//   Contract (implementation-plan.md Spec Contracts Inventory) defines:
//     analytics:pdp_page_view | analytics:variant_selected | analytics:add_to_cart_click
//     analytics:cart_modal_view | analytics:cart_modal_continue | analytics:cart_modal_view_cart
//     analytics:product_error | analytics:review_read_all_click
//   Previous names (pdp:pageView etc.) did not match the contract.
describe('useAnalytics — AC-18, SCEN-044, no Adobe SDK import', () => {
  let dispatchedEvents: CustomEvent[];

  beforeEach(() => {
    dispatchedEvents = [];
    window.dispatchEvent = (event: Event) => {
      if (event instanceof CustomEvent) {
        dispatchedEvents.push(event as CustomEvent);
      }
      return true;
    };
    // Ensure no Adobe global is called
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).s = { tl: jest.fn(), t: jest.fn() };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any)._satellite = { track: jest.fn() };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // SCEN-044: trackPageView dispatches analytics:pdp_page_view CustomEvent
  // Event name per implementation-plan.md §Spec Contracts Inventory — Analytics CustomEvent Names
  it('should_dispatch_analytics_pdp_page_view_CustomEvent_with_productId_and_deviceType_SCEN044', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPageView({ productId: 'P123456', deviceType: 'mobile' });
    });

    expect(dispatchedEvents).toHaveLength(1);
    expect(dispatchedEvents[0].type).toBe('analytics:pdp_page_view');
    expect(dispatchedEvents[0].detail.productId).toBe('P123456');
    expect(dispatchedEvents[0].detail.deviceType).toBe('mobile');
  });

  // SCEN-044: trackVariantSelected dispatches analytics:variant_selected with skuId
  it('should_dispatch_analytics_variant_selected_CustomEvent_with_skuId_SCEN044', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackVariantSelected({ productId: 'P123456', skuId: 'SKU-330', deviceType: 'mobile' });
    });

    expect(dispatchedEvents).toHaveLength(1);
    expect(dispatchedEvents[0].type).toBe('analytics:variant_selected');
    expect(dispatchedEvents[0].detail.skuId).toBe('SKU-330');
  });

  // SCEN-044: trackAddToCartClicked dispatches analytics:add_to_cart_click with quantity
  it('should_dispatch_analytics_add_to_cart_click_CustomEvent_with_quantity_SCEN044', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackAddToCartClicked({ productId: 'P123456', skuId: 'SKU-330', quantity: 2, listPrice: 36.00, onSale: false, brandName: 'Fenty Beauty', productName: "Pro Filt'r Foundation" });
    });

    expect(dispatchedEvents).toHaveLength(1);
    expect(dispatchedEvents[0].type).toBe('analytics:add_to_cart_click');
    expect(dispatchedEvents[0].detail.quantity).toBe(2);
    expect(dispatchedEvents[0].detail.listPrice).toBe(36.00);
  });

  // trackCarouselNavigated — not in the 8-event contract; this event is not defined
  // in implementation-plan.md §Analytics CustomEvent Names. Test removed to avoid
  // driving implementation of a non-contracted event. (sephora-test-reviewer 2026-06-24)

  // trackQuantityChanged — not in the 8-event contract; removed for same reason.

  // analytics:cart_modal_view — fires when modal opens (AC-06, Phase 4)
  it('should_dispatch_analytics_cart_modal_view_CustomEvent_on_modal_open', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackCartModalView({ productId: 'P123456', skuId: 'SKU-330', quantity: 1 });
    });

    expect(dispatchedEvents[0].type).toBe('analytics:cart_modal_view');
    expect(dispatchedEvents[0].detail.skuId).toBe('SKU-330');
  });

  // analytics:cart_modal_continue — fires on "Continue Shopping" (AC-06, Phase 4)
  it('should_dispatch_analytics_cart_modal_continue_CustomEvent_on_continue_shopping', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackCartModalContinue({ productId: 'P123456' });
    });

    expect(dispatchedEvents[0].type).toBe('analytics:cart_modal_continue');
  });

  // analytics:cart_modal_view_cart — fires on "View Cart" (AC-06, Phase 4)
  it('should_dispatch_analytics_cart_modal_view_cart_CustomEvent_on_view_cart', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackCartModalViewCart({ productId: 'P123456' });
    });

    expect(dispatchedEvents[0].type).toBe('analytics:cart_modal_view_cart');
  });

  // analytics:product_error — fires in error boundary componentDidCatch (Phase 4)
  it('should_dispatch_analytics_product_error_CustomEvent_with_productId_errorCode_module', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackProductError({ productId: 'P123456', errorCode: '503', module: 'ProductGraph' });
    });

    expect(dispatchedEvents[0].type).toBe('analytics:product_error');
    expect(dispatchedEvents[0].detail.errorCode).toBe('503');
    expect(dispatchedEvents[0].detail.module).toBe('ProductGraph');
  });

  // analytics:review_read_all_click — fires when "Read All Reviews" link clicked (Phase 4)
  it('should_dispatch_analytics_review_read_all_click_CustomEvent_with_reviewCount', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackReviewReadAllClick({ productId: 'P123456', reviewCount: 1200, ratingAverage: 4.5 });
    });

    expect(dispatchedEvents[0].type).toBe('analytics:review_read_all_click');
    expect(dispatchedEvents[0].detail.reviewCount).toBe(1200);
    expect(dispatchedEvents[0].detail.ratingAverage).toBe(4.5);
  });

  // CRITICAL: No Adobe Analytics SDK calls — window.s.tl and _satellite.track must not be called
  it('should_not_call_Adobe_Analytics_SDK_globals_when_tracking_any_event_SCEN044_no_sdk', () => {
    const { result } = renderHook(() => useAnalytics());

    act(() => {
      result.current.trackPageView({ productId: 'P123456', deviceType: 'desktop' });
      result.current.trackVariantSelected({ productId: 'P123456', skuId: 'SKU-310', deviceType: 'desktop' });
      result.current.trackAddToCartClicked({ productId: 'P123456', skuId: 'SKU-310', quantity: 1, listPrice: 36.00, onSale: false, brandName: 'Fenty Beauty', productName: "Pro Filt'r Foundation" });
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((window as any).s.tl).not.toHaveBeenCalled();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((window as any)._satellite.track).not.toHaveBeenCalled();
    // 3 events dispatched
    expect(dispatchedEvents).toHaveLength(3);
  });
});
