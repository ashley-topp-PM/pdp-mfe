import React from 'react';

interface PriceDto {
  current: number;
  original: number | null;
  currency: string;
  isOnSale: boolean;
}

interface PriceAndCTAProps {
  price: PriceDto;
  hasVariants: boolean;
  selectedVariantId: string | null;
  isOutOfStock: boolean;
  onAddToCart: () => void;
}

function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function PriceAndCTA({
  price,
  hasVariants,
  selectedVariantId,
  isOutOfStock,
  onAddToCart,
}: PriceAndCTAProps): React.ReactElement {
  const needsVariantSelection = hasVariants && !selectedVariantId;
  const isDisabled = needsVariantSelection || isOutOfStock;

  return (
    <div>
      <div>
        {price.isOnSale && price.original !== null ? (
          <>
            <span>{formatPrice(price.current)}</span>
            <span style={{ textDecoration: 'line-through' }}>{formatPrice(price.original)}</span>
          </>
        ) : (
          <span>{formatPrice(price.current)}</span>
        )}
      </div>
      {needsVariantSelection && (
        <p>Please select a shade or size to continue.</p>
      )}
      <button disabled={isDisabled} onClick={isDisabled ? undefined : onAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}
