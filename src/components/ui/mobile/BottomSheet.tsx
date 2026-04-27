"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, PanInfo, useDragControls } from "framer-motion";

export type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  snapPoints?: ("40" | "60" | "85")[];
  defaultSnap?: "40" | "60" | "85";
  /**
   * Görsel tema. "light" (default) DESIGN-LOCK krem-beyaz palet için;
   * "kinetic" Kinetic Enterprise dark palet için (siyah yüzey, açık metin).
   */
  variant?: "light" | "kinetic";
};

/**
 * Mobile UI Kit - BottomSheet Component
 * 
 * @example
 * <BottomSheet open={isOpen} onClose={() => setIsOpen(false)} title="Filtreler">
 *   <div>İçerik buraya gelecek</div>
 * </BottomSheet>
 */
export const BottomSheet = ({
  open,
  onClose,
  title,
  children,
  footer,
  defaultSnap = "60",
  variant = "light",
}: BottomSheetProps) => {
  const variantClass = variant === "kinetic" ? " ui-bottom-sheet--kinetic" : "";
  const overlayVariantClass = variant === "kinetic" ? " ui-bottom-sheet__overlay--kinetic" : "";
  const footerVariantClass = variant === "kinetic" ? " ui-bottom-sheet__footer--kinetic" : "";
  const [mounted, setMounted] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      if (e.key === "Tab" && sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (!firstElement || !lastElement) return;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    if (sheetRef.current) {
      const focusableElements = sheetRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        setTimeout(() => focusableElements[0]?.focus(), 10);
      }
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  if (!mounted) return null;

  const heightPercent = defaultSnap;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className={`ui-bottom-sheet__overlay${overlayVariantClass}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={sheetRef}
            className={`ui-bottom-sheet${variantClass}`}
            role="dialog"
            aria-modal="true"
            aria-label={title || "Alt Menü"}
            style={{ height: `${heightPercent}vh` }}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
          >
            <div 
              className="ui-bottom-sheet__drag-area"
              onPointerDown={(e) => dragControls.start(e)}
              style={{ touchAction: "none" }}
            >
              <div className="ui-bottom-sheet__handle-container">
                <div className="ui-bottom-sheet__handle" />
              </div>
              
              {title && (
                <div className="ui-bottom-sheet__header">
                  <h2 className="ui-bottom-sheet__title">{title}</h2>
                </div>
              )}
            </div>
            
            <div className="ui-bottom-sheet__content">
              {children}
            </div>

            {footer && (
              <div className={`ui-bottom-sheet__footer${footerVariantClass}`}>
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};
