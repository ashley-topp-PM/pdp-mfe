import React, { createContext, useContext, useState, useCallback } from 'react';

interface ProductVariant {
  variantId: string;
  label: string;
  type: string;
  swatchImageUrl: string;
  heroImageUrl: string;
  price: { current: number; original: number | null; currency: string; isOnSale: boolean };
  inStock: boolean;
}

interface AddToCartOptions {
  hasVariants: boolean;
  isOutOfStock: boolean;
}

interface PDPContextValue {
  selectedVariantId: string | null;
  currentHeroImageUrl: string | null;
  quantity: number;
  isModalOpen: boolean;
  selectVariant: (variant: ProductVariant) => void;
  openModal: () => void;
  closeModal: () => void;
  setQuantity: (qty: number) => void;
  isAddToCartEnabled: (opts: AddToCartOptions) => boolean;
}

const PDPContext = createContext<PDPContextValue | null>(null);

interface PDPProviderProps {
  productId?: string;
  locale?: string;
  children: React.ReactNode;
}

export function PDPProvider({ children }: PDPProviderProps): React.ReactElement {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [currentHeroImageUrl, setCurrentHeroImageUrl] = useState<string | null>(null);
  const [quantity, setQuantityState] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const selectVariant = useCallback((variant: ProductVariant) => {
    setSelectedVariantId(variant.variantId);
    setCurrentHeroImageUrl(variant.heroImageUrl);
  }, []);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const setQuantity = useCallback((qty: number) => {
    if (qty < 1) return;
    setQuantityState(qty);
  }, []);

  const isAddToCartEnabled = useCallback(
    ({ hasVariants, isOutOfStock }: AddToCartOptions): boolean => {
      if (isOutOfStock) return false;
      if (hasVariants && !selectedVariantId) return false;
      return true;
    },
    [selectedVariantId]
  );

  const value: PDPContextValue = {
    selectedVariantId,
    currentHeroImageUrl,
    quantity,
    isModalOpen,
    selectVariant,
    openModal,
    closeModal,
    setQuantity,
    isAddToCartEnabled,
  };

  return <PDPContext.Provider value={value}>{children}</PDPContext.Provider>;
}

export function usePDPContext(): PDPContextValue {
  const ctx = useContext(PDPContext);
  if (!ctx) {
    throw new Error('usePDPContext must be used within a PDPProvider');
  }
  return ctx;
}
