"use client";

import React from "react";

export type SkeletonProps = {
  variant?: "text" | "card" | "circle" | "custom";
  width?: string | number;
  height?: string | number;
  count?: number;
  className?: string;
};

/**
 * Mobile UI Kit - Skeleton Component
 * 
 * @example
 * <Skeleton variant="card" height={150} />
 * <Skeleton variant="text" count={3} />
 */
export const Skeleton = ({
  variant = "text",
  width,
  height,
  count = 1,
  className = "",
}: SkeletonProps) => {
  const elements = Array.from({ length: count }, (_, i) => i);
  
  const getStyle = () => {
    const style: React.CSSProperties = {};
    if (width !== undefined) style.width = typeof width === "number" ? `${width}px` : width;
    if (height !== undefined) style.height = typeof height === "number" ? `${height}px` : height;
    return style;
  };

  return (
    <>
      {elements.map((idx) => (
        <div
          key={idx}
          className={`ui-skeleton ui-skeleton--${variant} ${className}`}
          style={getStyle()}
          aria-hidden="true"
        />
      ))}
    </>
  );
};
