import { Metadata } from "next";
import { PreviewClient } from "./PreviewClient";

export const metadata: Metadata = {
  title: "Mobile UI Kit Preview",
  robots: { index: false, follow: false },
};

export default function MobileUIKitPreview() {
  return <PreviewClient />;
}
