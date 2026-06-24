import React from 'react';

interface StockIndicatorProps {
  inStock: boolean | null;
  quantity?: number | null;
}

export function StockIndicator({ inStock }: StockIndicatorProps): React.ReactElement {
  if (inStock === null) {
    return <span data-testid="stock-indicator-neutral" />;
  }

  if (inStock) {
    return <span data-stock-status="in-stock">In Stock</span>;
  }

  return <span data-stock-status="out-of-stock">Out of Stock</span>;
}
