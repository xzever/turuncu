"use client";

/**
 * MobilePicker — native <select> yerine app-içi picker.
 *
 * AGENTS.md Madde 0.3 + 8: hover-only YASAK, native dropdown YASAK,
 * touch ≥44px, klavye erişimi (Enter/Space açar, Escape kapatır,
 * ok tuşları seçenek değiştirir).
 *
 * Picker BottomSheet üzerinde modal olarak açılır; alttaki form
 * alanlarının üzerine binmez (BottomSheet z-modal + portal).
 *
 * Telefon ve tablet aynı davranır (BottomSheet ≤1279 + coarse'da
 * her iki ekrana da uygulanır). Desktop'ta da çalışır ama IletisimMobile
 * yalnızca mobil shell'de render edildiği için pratikte etkisi yok.
 */

import { useEffect, useId, useRef, useState, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import { BottomSheet } from "./BottomSheet";

export type MobilePickerOption = {
  value: string;
  label: string;
  /** Sub-label, ikincil bilgi (örn. "Merkez şube") */
  hint?: string;
};

export type MobilePickerProps = {
  /** Seçilen değer (controlled) */
  value: string;
  /** Seçenekler */
  options: ReadonlyArray<MobilePickerOption>;
  /** Yeni değer seçildiğinde */
  onChange: (value: string) => void;
  /** Erişilebilir etiket — trigger butonun aria-labelledby'ı için */
  label: string;
  /** Trigger butonda ve sheet header'da görünecek başlık */
  sheetTitle?: string;
  /** Boş değer için gösterilecek placeholder */
  placeholder?: string;
  /** Devre dışı bırak (örn. il seçilmeden ilçe) */
  disabled?: boolean;
  /** Picker tetiği için ek className */
  className?: string;
  /** Pasif durumda gösterilecek mesaj (örn. "Önce il seçin") */
  disabledHint?: string;
};

export function MobilePicker({
  value,
  options,
  onChange,
  label,
  sheetTitle,
  placeholder = "Seçiniz...",
  disabled = false,
  className = "",
  disabledHint,
}: MobilePickerProps) {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);
  const triggerText =
    selected?.label ?? (disabled && disabledHint ? disabledHint : placeholder);

  const handleClose = useCallback(() => {
    setOpen(false);
    // Sheet kapanınca focus trigger'a geri dönsün (a11y).
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, []);

  const handleSelect = useCallback(
    (next: string) => {
      onChange(next);
      handleClose();
    },
    [onChange, handleClose],
  );

  // Sheet açıldığında seçili option'a focus et.
  useEffect(() => {
    if (!open) return;
    const node = listRef.current;
    if (!node) return;
    const target =
      node.querySelector<HTMLButtonElement>(
        '[data-mobile-picker-option="true"][aria-selected="true"]',
      ) ??
      node.querySelector<HTMLButtonElement>('[data-mobile-picker-option="true"]');
    target?.focus();
  }, [open]);

  // Ok tuşları ile seçenek dolaş.
  function handleListKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Home" && e.key !== "End") {
      return;
    }
    const node = listRef.current;
    if (!node) return;
    const items = Array.from(
      node.querySelectorAll<HTMLButtonElement>('[data-mobile-picker-option="true"]'),
    );
    if (items.length === 0) return;
    const currentIndex = items.findIndex((item) => item === document.activeElement);
    let nextIndex = currentIndex;
    if (e.key === "ArrowDown") nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    if (e.key === "ArrowUp") nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    if (e.key === "Home") nextIndex = 0;
    if (e.key === "End") nextIndex = items.length - 1;
    e.preventDefault();
    items[nextIndex]?.focus();
  }

  const triggerClasses = `mobile-picker__trigger${disabled ? " is-disabled" : ""}${className ? ` ${className}` : ""}`;
  const valueClasses = `mobile-picker__value${selected ? "" : " is-placeholder"}`;

  return (
    <div className="mobile-picker">
      <button
        ref={triggerRef}
        type="button"
        className={triggerClasses}
        aria-labelledby={labelId}
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        <span id={labelId} className="mobile-picker__visually-hidden">
          {label}
        </span>
        <span className={valueClasses}>{triggerText}</span>
        <ChevronDown
          width={16}
          height={16}
          aria-hidden="true"
          className="mobile-picker__chevron"
        />
      </button>

      <BottomSheet
        open={open}
        onClose={handleClose}
        title={sheetTitle ?? label}
        defaultSnap="60"
        variant="kinetic"
      >
        <div
          ref={listRef}
          role="listbox"
          aria-label={sheetTitle ?? label}
          tabIndex={-1}
          className="mobile-picker__list"
          onKeyDown={handleListKeyDown}
        >
          {options.length === 0 ? (
            <p className="mobile-picker__empty">Seçenek bulunamadı.</p>
          ) : (
            options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-mobile-picker-option="true"
                  className={`mobile-picker__option${isSelected ? " is-selected" : ""}`}
                  onClick={() => handleSelect(option.value)}
                >
                  <span className="mobile-picker__option-text">
                    <span className="mobile-picker__option-label">{option.label}</span>
                    {option.hint ? (
                      <span className="mobile-picker__option-hint">{option.hint}</span>
                    ) : null}
                  </span>
                  {isSelected ? (
                    <Check
                      width={18}
                      height={18}
                      aria-hidden="true"
                      className="mobile-picker__option-check"
                    />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </BottomSheet>
    </div>
  );
}

export default MobilePicker;
