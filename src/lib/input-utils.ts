"use client";

import React, { useState, useEffect } from "react";

export const handleInputChange =
  (setter: React.Dispatch<React.SetStateAction<number>>) =>
  (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "");
    const numericValue = Number.parseFloat(value) || 0;
    setter(numericValue);
  };

export const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value.replace(/,/g, "");
  const numericValue = Number.parseFloat(value) || 0;
  if (numericValue > 0) {
    e.target.value = numericValue.toLocaleString();
  }
};

// Hook for easily handling number inputs that should allow the user to type freely (decimals, commas, etc.)
// and only commit a parsed numeric value when it can be successfully converted.
export function useFormattedNumberInput(
  numericValue: number,
  setNumericValue: React.Dispatch<React.SetStateAction<number>>,
) {
  const [input, setInput] = useState<string>(() =>
    numericValue.toLocaleString(),
  );

  // Keep local string in sync with the external numeric value (e.g. when a reset occurs)
  useEffect(() => {
    setInput(numericValue.toLocaleString());
  }, [numericValue]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInput(raw);

    const parsed = Number.parseFloat(raw.replace(/,/g, ""));
    if (!Number.isNaN(parsed)) {
      setNumericValue(parsed);
    }
  };

  const onBlur = () => {
    const parsed = Number.parseFloat(input.replace(/,/g, ""));
    if (!Number.isNaN(parsed)) {
      setInput(parsed.toLocaleString());
      setNumericValue(parsed);
    } else {
      // Revert to the last known good numeric value
      setInput(numericValue.toLocaleString());
    }
  };

  return {
    input,
    onChange,
    onBlur,
  } as const;
}
