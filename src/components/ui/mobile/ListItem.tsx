"use client";

import React from "react";
import Link from "next/link";

export type ListItemProps = {
  title: string;
  subtitle?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  divider?: boolean;
};

/**
 * Mobile UI Kit - ListItem Component
 * 
 * @example
 * <ListItem 
 *   title="Kullanıcı Ayarları" 
 *   subtitle="Profil ve tercihler"
 *   leading={<UserIcon />}
 *   trailing={<ChevronRight />}
 *   href="/settings"
 * />
 */
export const ListItem = ({
  title,
  subtitle,
  leading,
  trailing,
  href,
  onClick,
  divider = true,
}: ListItemProps) => {
  const isInteractive = !!href || !!onClick;
  
  const baseClassName = [
    "ui-list-item",
    isInteractive ? "ui-list-item--interactive" : "",
    divider ? "ui-list-item--divider" : ""
  ].filter(Boolean).join(" ");

  const content = (
    <>
      {leading && <div className="ui-list-item__leading">{leading}</div>}
      <div className="ui-list-item__content">
        <span className="ui-list-item__title">{title}</span>
        {subtitle && <span className="ui-list-item__subtitle">{subtitle}</span>}
      </div>
      {trailing && <div className="ui-list-item__trailing">{trailing}</div>}
    </>
  );

  if (href) {
    const isExternal = href.startsWith("http");
    if (isExternal) {
      return <a href={href} className={baseClassName} onClick={onClick}>{content}</a>;
    }
    return <Link href={href} className={baseClassName} onClick={onClick}>{content}</Link>;
  }

  if (onClick) {
    return <button type="button" className={baseClassName} onClick={onClick}>{content}</button>;
  }

  return <div className={`ui-list-item ${divider ? 'ui-list-item--divider' : ''}`}>{content}</div>;
};
