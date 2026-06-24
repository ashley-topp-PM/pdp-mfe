import React, { useState } from 'react';

interface ProductImage {
  url: string;
  altText: string;
  displayOrder: number;
}

interface ProductHeroProps {
  images: ProductImage[];
  productName: string;
  selectedHeroImageUrl?: string;
}

export function ProductHero({
  images,
  productName,
  selectedHeroImageUrl,
}: ProductHeroProps): React.ReactElement {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleNext = () => {
    setCurrentIndex(i => Math.min(i + 1, images.length - 1));
  };

  const handlePrev = () => {
    setCurrentIndex(i => Math.max(i - 1, 0));
  };

  const displayUrl = selectedHeroImageUrl ?? images[currentIndex]?.url;
  const displayAlt = selectedHeroImageUrl ? productName : images[currentIndex]?.altText;

  return (
    <div>
      <img
        src={displayUrl}
        alt={displayAlt}
        onClick={() => setIsZoomed(true)}
        style={{ cursor: 'pointer' }}
      />
      <button aria-label="Previous image" onClick={handlePrev}>
        &lsaquo;
      </button>
      <button aria-label="Next image" onClick={handleNext}>
        &rsaquo;
      </button>
      {isZoomed && (
        <div role="dialog" aria-label="Zoom view" onClick={() => setIsZoomed(false)}>
          <img src={displayUrl} alt={displayAlt} />
        </div>
      )}
    </div>
  );
}
