import type { SVGProps } from "react";

/**
 * Marka ikonu — `src/icons/logo.svg` ile aynı geometri.
 * `fill="currentColor"` → üst öğenin metin rengini kullanır (üst bar butonları).
 */
export default function LogoMarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 68.93 76.4" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path
        fill="currentColor"
        d="M56.9,35.26c-3.98,2.42-8.21,3.11-12.69,3.08l-9.51-.08L7.36,2.28h36.22c10.44-.51,19.47,7.06,20.84,17.29.56,6.41-1.98,12.31-7.52,15.68Z"
      />
      <polygon
        fill="currentColor"
        points="63 74.62 32.74 74.67 21.59 60.52 4.58 38.98 34.64 38.92 63 74.62"
      />
    </svg>
  );
}
