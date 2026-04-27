"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export type TopBarAction = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
};

export type TopBarProps = {
  title?: string;
  back?: boolean | { href?: string; onClick?: () => void };
  actions?: TopBarAction[];
  variant?: "solid" | "transparent";
  showLogo?: boolean;
  autoHideOnScroll?: boolean;
};

/**
 * Mobile UI Kit - TopBar Component
 * 
 * @example
 * <TopBar 
 *   title="Detaylar" 
 *   back={{ href: "/home" }} 
 *   variant="solid" 
 * />
 */
export const TopBar = ({
  title,
  back,
  actions,
  variant = "solid",
  showLogo = false,
  autoHideOnScroll = false,
}: TopBarProps) => {
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const showTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!autoHideOnScroll) {
      setIsHidden(false);
      return undefined;
    }

    lastScrollYRef.current = window.scrollY;

    const scheduleShow = () => {
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
      }
      showTimerRef.current = window.setTimeout(() => {
        setIsHidden(false);
        showTimerRef.current = null;
      }, 700);
    };

    const hideWhileReading = () => {
      const currentY = Math.max(0, window.scrollY);

      if (currentY < 64) {
        setIsHidden(false);
        return;
      }

      setIsHidden(true);
      scheduleShow();
    };

    const handleScroll = () => {
      const currentY = Math.max(0, window.scrollY);
      hideWhileReading();
      lastScrollYRef.current = currentY;
    };

    const handleTouchMove = () => {
      hideWhileReading();
    };

    const handleTouchEnd = () => {
      scheduleShow();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      if (showTimerRef.current !== null) {
        window.clearTimeout(showTimerRef.current);
      }
    };
  }, [autoHideOnScroll]);

  const renderBack = () => {
    if (!back) return null;
    
    const content = (
      <span className="ui-topbar__icon-btn" aria-label="Geri">
        <ChevronLeft width={24} height={24} aria-hidden="true" />
      </span>
    );

    if (typeof back === "object") {
      if (back.href) {
        return <Link href={back.href} onClick={back.onClick}>{content}</Link>;
      }
      return <button type="button" onClick={back.onClick}>{content}</button>;
    }

    return (
      <button type="button" onClick={() => window.history.back()}>
        {content}
      </button>
    );
  };

  const renderActions = () => {
    if (!actions || actions.length === 0) return null;

    return (
      <div className="ui-topbar__actions">
        {actions.map((action, index) => {
          const content = (
            <span className="ui-topbar__icon-btn" aria-label={action.label}>
              {action.icon}
            </span>
          );

          if (action.href) {
            return (
              <Link key={index} href={action.href} onClick={action.onClick}>
                {content}
              </Link>
            );
          }

          return (
            <button key={index} type="button" onClick={action.onClick}>
              {content}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <header className={`ui-topbar ui-topbar--${variant}${isHidden ? " ui-topbar--hidden" : ""}`}>
      <div className="ui-topbar__left">
        {renderBack()}
        {showLogo && (
          <div className="ui-topbar__logo">
            <span className="ui-topbar__logo-text">Turuncu Solar</span>
          </div>
        )}
      </div>
      
      <div className="ui-topbar__center">
        {title && <h1 className="ui-topbar__title">{title}</h1>}
      </div>

      <div className="ui-topbar__right">
        {renderActions()}
      </div>
    </header>
  );
};
