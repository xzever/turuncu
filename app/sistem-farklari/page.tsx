import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import SistemFarklariRouter from "@/components/sistem-farklari/SistemFarklariRouter";
import "./sistem-farklari-mobile.css";

const LOCALE = "tr";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(LOCALE, "sistem-farklari");
}

export default function SistemFarklariPage() {
  return <SistemFarklariRouter />;
}
