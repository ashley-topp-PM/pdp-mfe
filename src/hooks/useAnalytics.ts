function dispatch(eventName: string, detail: object): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true }));
}

interface PageViewPayload {
  productId: string;
  deviceType: string;
}

interface VariantSelectedPayload {
  productId: string;
  skuId: string;
  deviceType: string;
}

interface AddToCartPayload {
  productId: string;
  skuId: string;
  quantity: number;
  listPrice: number;
  onSale: boolean;
  brandName: string;
  productName: string;
}

interface CartModalViewPayload {
  productId: string;
  skuId: string;
  quantity: number;
}

interface CartModalContinuePayload {
  productId: string;
}

interface CartModalViewCartPayload {
  productId: string;
}

interface ProductErrorPayload {
  productId: string;
  errorCode: string;
  module: string;
}

interface ReviewReadAllPayload {
  productId: string;
  reviewCount: number;
  ratingAverage: number;
}

export interface AnalyticsHook {
  trackPageView: (payload: PageViewPayload) => void;
  trackVariantSelected: (payload: VariantSelectedPayload) => void;
  trackAddToCartClicked: (payload: AddToCartPayload) => void;
  trackCartModalView: (payload: CartModalViewPayload) => void;
  trackCartModalContinue: (payload: CartModalContinuePayload) => void;
  trackCartModalViewCart: (payload: CartModalViewCartPayload) => void;
  trackProductError: (payload: ProductErrorPayload) => void;
  trackReviewReadAllClick: (payload: ReviewReadAllPayload) => void;
}

export function useAnalytics(): AnalyticsHook {
  return {
    trackPageView(payload) {
      dispatch('analytics:pdp_page_view', payload);
    },
    trackVariantSelected(payload) {
      dispatch('analytics:variant_selected', payload);
    },
    trackAddToCartClicked(payload) {
      dispatch('analytics:add_to_cart_click', payload);
    },
    trackCartModalView(payload) {
      dispatch('analytics:cart_modal_view', payload);
    },
    trackCartModalContinue(payload) {
      dispatch('analytics:cart_modal_continue', payload);
    },
    trackCartModalViewCart(payload) {
      dispatch('analytics:cart_modal_view_cart', payload);
    },
    trackProductError(payload) {
      dispatch('analytics:product_error', payload);
    },
    trackReviewReadAllClick(payload) {
      dispatch('analytics:review_read_all_click', payload);
    },
  };
}
