import HakkimizdaSolar2Desktop from "@/components/kurumsal/HakkimizdaSolar2Desktop";
import type { Locale } from "@/lib/i18n";

type KurumsalPageProps = {
  locale: Locale;
};

/**
 * Kurumsal (`/hakkimizda`) — solar2 masaüstü/mobil tasarımı, tek `AppChrome` shell (çift header yok).
 * `locale` şimdilik içerikte kullanılmıyor (metinler TR); ileride i18n için hazır.
 */
export default function KurumsalPage({ locale: _locale }: KurumsalPageProps) {
  return (
    <div className="page-shell">
      <HakkimizdaSolar2Desktop />
      <footer aria-label="Sayfa sonu" />
    </div>
  );
}
