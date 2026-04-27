"use client";

import type { ReactNode } from "react";

export type MobilePageFrameVariant = "default" | "dense" | "content-heavy";

export type MobilePageFrameProps = {
  pageId: string;
  variant?: MobilePageFrameVariant;
  allowInnerScroll?: boolean;
  headerSlot?: ReactNode;
  contentSlot: ReactNode;
  footerSlot?: ReactNode;
  className?: string;
};

export default function MobilePageFrame({
  pageId,
  variant = "default",
  allowInnerScroll = false,
  headerSlot,
  contentSlot,
  footerSlot,
  className,
}: MobilePageFrameProps) {
  const classes = [
    "app-frame-mobile",
    `app-frame-mobile--${variant}`,
    allowInnerScroll ? "app-frame-mobile--inner-scroll" : "",
    className ?? "",
  ].filter(Boolean).join(" ");

  return (
    <main
      className={classes}
      data-page-id={pageId}
      data-inner-scroll={allowInnerScroll ? "true" : "false"}
    >
      {headerSlot ? (
        <header className="app-frame-mobile__header">
          {headerSlot}
        </header>
      ) : null}

      <section className="app-frame-mobile__content">
        {contentSlot}
      </section>

      {footerSlot ? (
        <footer className="app-frame-mobile__footer">
          {footerSlot}
        </footer>
      ) : null}
    </main>
  );
}
