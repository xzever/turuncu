"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

export type SearchInputProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  ariaLabel?: string;
};

/**
 * Mobile UI Kit - SearchInput Component
 * 
 * @example
 * <SearchInput 
 *   value={searchQuery} 
 *   onChange={setSearchQuery} 
 *   onClear={() => setSearchQuery("")}
 *   placeholder="Ara..." 
 * />
 */
export const SearchInput = ({
  value,
  onChange,
  placeholder,
  onClear,
  autoFocus,
  ariaLabel = "Ara",
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleClear = () => {
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  return (
    <div className="ui-search-input-wrapper">
      <Search className="ui-search-input__icon ui-search-input__icon--leading" width={20} height={20} aria-hidden="true" />
      
      <input
        ref={inputRef}
        type="search"
        className="ui-search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />

      {value && onClear && (
        <button
          type="button"
          className="ui-search-input__clear-btn"
          onClick={handleClear}
          aria-label="Aramayı temizle"
        >
          <X width={16} height={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
