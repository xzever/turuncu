"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export type AccordionItemProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export type AccordionProps = {
  items: AccordionItemProps[];
  allowMultiple?: boolean;
};

/**
 * Mobile UI Kit - Accordion Component
 * 
 * @example
 * <Accordion 
 *   items={[
 *     { id: "1", title: "Soru 1", children: <p>Cevap 1</p> },
 *     { id: "2", title: "Soru 2", children: <p>Cevap 2</p> }
 *   ]} 
 * />
 */
export const Accordion = ({ items, allowMultiple = false }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    const defaultOpens = items.filter(item => item.defaultOpen).map(item => item.id);
    return new Set(defaultOpens);
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) {
          next.clear();
        }
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="ui-accordion">
      {items.map(item => {
        const isOpen = openItems.has(item.id);
        const headerId = `accordion-header-${item.id}`;
        const regionId = `accordion-region-${item.id}`;

        return (
          <div key={item.id} className={`ui-accordion__item ${isOpen ? 'is-open' : ''}`}>
            <button
              type="button"
              id={headerId}
              className="ui-accordion__trigger"
              aria-expanded={isOpen}
              aria-controls={regionId}
              onClick={() => toggleItem(item.id)}
            >
              <span className="ui-accordion__title">{item.title}</span>
              <ChevronDown 
                className="ui-accordion__icon" 
                width={20} 
                height={20} 
                aria-hidden="true" 
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={regionId}
                  role="region"
                  aria-labelledby={headerId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="ui-accordion__content-wrapper"
                >
                  <div className="ui-accordion__content">
                    {item.children}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
