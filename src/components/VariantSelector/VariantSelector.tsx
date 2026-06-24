import React from 'react';

interface ProductVariant {
  variantId: string;
  label: string;
  type: 'shade' | 'size' | string;
  swatchImageUrl: string;
  heroImageUrl: string;
  price: { current: number; original: number | null; currency: string; isOnSale: boolean };
  inStock: boolean;
}

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedVariantId: string | null;
  onVariantSelected: (variant: ProductVariant) => void;
}

export function VariantSelector({
  variants,
  selectedVariantId,
  onVariantSelected,
}: VariantSelectorProps): React.ReactElement {
  if (variants.length === 0) {
    return <div />;
  }

  const variantType = variants[0].type;

  if (variantType === 'size') {
    return (
      <div>
        <select
          value={selectedVariantId ?? ''}
          onChange={e => {
            const found = variants.find(v => v.variantId === e.target.value);
            if (found) onVariantSelected(found);
          }}
        >
          <option value="">Select a size</option>
          {variants.map(v => (
            <option key={v.variantId} value={v.variantId}>
              {v.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  // shade (or other) — swatches
  return (
    <div>
      {variants.map(v => (
        <button
          key={v.variantId}
          aria-label={v.label}
          aria-pressed={v.variantId === selectedVariantId}
          onClick={() => onVariantSelected(v)}
        >
          {v.swatchImageUrl && (
            <img src={v.swatchImageUrl} alt={v.label} />
          )}
          <span>{v.label}</span>
        </button>
      ))}
    </div>
  );
}
