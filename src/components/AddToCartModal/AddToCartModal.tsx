import React, { useEffect, useRef } from 'react';

interface AddToCartModalProps {
  isOpen: boolean;
  productName: string;
  selectedVariantLabel: string;
  quantity: number;
  price: string;
  onClose: () => void;
  onViewCart: () => void;
  onContinueShopping: () => void;
}

export function AddToCartModal({
  isOpen,
  productName,
  selectedVariantLabel,
  quantity,
  price,
  onClose,
  onViewCart,
  onContinueShopping,
}: AddToCartModalProps): React.ReactElement | null {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && closeRef.current) {
      closeRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div
        data-testid="modal-overlay"
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Item added to cart"
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
      >
        <button ref={closeRef} aria-label="Close" onClick={onClose}>
          &times;
        </button>
        <h2>{productName}</h2>
        <p>{selectedVariantLabel}</p>
        <p>{quantity}</p>
        <p>{price}</p>
        <button onClick={onViewCart}>View Cart</button>
        <button onClick={onContinueShopping}>Continue Shopping</button>
      </div>
    </>
  );
}
