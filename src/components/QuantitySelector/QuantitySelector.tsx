import React, { useState } from 'react';

interface QuantitySelectorProps {
  value: number;
  maxPurchaseQuantity: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({
  value,
  maxPurchaseQuantity,
  onChange,
}: QuantitySelectorProps): React.ReactElement {
  const max = maxPurchaseQuantity ?? 10;
  const [inputValue, setInputValue] = useState<string>(String(value));

  const handleDecrement = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const raw = parseInt(inputValue, 10);
    if (isNaN(raw) || raw < 1) {
      onChange(1);
      setInputValue('1');
    } else if (raw > max) {
      onChange(max);
      setInputValue(String(max));
    } else {
      onChange(raw);
    }
  };

  return (
    <div>
      <button aria-label="Decrease quantity" disabled={value <= 1} onClick={handleDecrement}>
        -
      </button>
      <input
        type="number"
        role="spinbutton"
        min={1}
        max={max}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <button aria-label="Increase quantity" disabled={value >= max} onClick={handleIncrement}>
        +
      </button>
    </div>
  );
}
