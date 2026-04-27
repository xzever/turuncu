import type { Metadata } from "next";
import { SITE_URL } from "@/config/env";
import "../(legal)/legal.css";

const PATH = "/gizlilik";
const TITLE = "Gizlilik Politikası";
const DESC =
  "Turuncu Solar Gizlilik Politikası — web sitemizi ziyaret ettiğinizde toplanan verilerin nasıl kullanıldığı, saklandığı ve korunduğu hakkında bilgi.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: {
    canonical: PATH,
    languages: { "tr-TR": PATH, "x-default": PATH },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: new URL(PATH, SITE_URL).toString(),
    title: `${TITLE} | Turuncu Solar`,
    description: DESC,
  },
  twitter: {
    card: "summary",
    title: TITLE,
    description: DESC,
  },
  robots: { index: true, follow: true },
};

export default function GizlilikPage() {
  return (
    <main className="legal-page">
      <p className="legal-page__eyebrow">Yasal</p>
      <h1 className="legal-page__title">Gizlilik Politikası</h1>
      <p className="legal-page__meta">Son güncelleme: 24 Nisan 2026</p>

      <div className="legal-page__content">
        <section className="legal-page__section">
          <p className="legal-page__p">
            Turuncu Solar olarak, web sitemizi ziyaret eden kullanıcılarımızın
            gizliliğine saygı duyuyoruz. Bu Gizlilik Politikası, sitemizde hangi
            bilgilerin toplandığını, nasıl kullanıldığını ve korunduğunu
            açıklamaktadır.
          </p>
          <p className="legal-page__note">
            <strong>Not:</strong> Bu metin taslaktır. Yayına almadan önce hukuk
            danışmanı onayı alınmalıdır.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">1. Toplanan Bilgiler</h2>
          <h3 className="legal-page__h3">Doğrudan Sağladığınız Bilgiler</h3>
          <p className="legal-page__p">
            İletişim formumuzu doldurduğunuzda ad, soyad, e-posta, telefon, şehir
            ve mesajınızı kendi rızanızla bize iletmiş olursunuz.
          </p>

          <h3 className="legal-page__h3">Otomatik Toplanan Bilgiler</h3>
          <p className="legal-page__p">
            Siteyi ziyaret ettiğinizde aşağıdaki teknik veriler otomatik olarak
            toplanabilir:
          </p>
          <ul className="legal-page__list">
            <li>IP adresi (anonimleştirilmiş)</li>
            <li>Tarayıcı tipi ve sürümü</li>
            <li>İşletim sistemi</li>
            <li>Ziyaret ettiğiniz sayfalar ve süreleri</li>
            <li>Referans URL (nereden geldiğiniz)</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">2. Bilgilerin Kullanım Amacı</h2>
          <ul className="legal-page__list">
            <li>Taleplerinize ve sorularınıza yanıt vermek</li>
            <li>Ürün ve hizmetlerimiz hakkında bilgi sunmak</li>
            <li>Site deneyimini iyileştirmek</li>
            <li>Yasal yükümlülükleri yerine getirmek</li>
            <li>Güvenlik ve kötüye kullanım önleme</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">3. Çerezler (Cookies)</h2>
          <p className="legal-page__p">
            Sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanır.
            Çerezler, tarayıcınızda saklanan küçük metin dosyalarıdır.
          </p>
          <ul className="legal-page__list">
            <li>
              <strong>Zorunlu çerezler:</strong> Sitenin çalışması için
              gereklidir (oturum, güvenlik). Devre dışı bırakılamaz.
            </li>
            <li>
              <strong>Analitik çerezler:</strong> Ziyaretçi davranışını anlamak
              için kullanılır. Onayınıza tabidir.
            </li>
            <li>
              <strong>Pazarlama çerezleri:</strong> Şu anda kullanılmıyor.
              Gelecekte kullanılması halinde onayınız alınacaktır.
            </li>
          </ul>
          <p className="legal-page__p">
            Tarayıcı ayarlarınızdan çerez tercihlerinizi yönetebilirsiniz. Ancak
            zorunlu çerezlerin devre dışı bırakılması sitenin bazı
            bölümlerinin çalışmamasına neden olabilir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">4. Veri Güvenliği</h2>
          <p className="legal-page__p">
            Kişisel verileriniz, yetkisiz erişime, değişikliğe, ifşaya veya
            imhaya karşı uygun teknik ve idari tedbirlerle korunmaktadır.
            Verileriniz SSL şifreleme ile aktarılır ve güvenli sunucularda
            saklanır.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">5. Üçüncü Taraf Paylaşımı</h2>
          <p className="legal-page__p">
            Bilgileriniz, açık rızanız olmadıkça üçüncü taraflarla
            paylaşılmamaktadır. İstisnalar:
          </p>
          <ul className="legal-page__list">
            <li>Yasal zorunluluklar (mahkeme kararı, yetkili kurum talebi)</li>
            <li>Hizmet sağlayıcılar (e-posta altyapısı, barındırma) — sözleşmeyle bağlı</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">6. Veri Saklama Süresi</h2>
          <p className="legal-page__p">
            İletişim formu verileri, talebinizin değerlendirilmesi amacıyla
            işlenir ve işlem tamamlandıktan sonra en fazla 2 yıl süreyle
            saklanır. Bu süreden sonra silinir veya anonimleştirilir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">7. Çocukların Gizliliği</h2>
          <p className="legal-page__p">
            Sitemiz 18 yaş altı kullanıcılara yönelik değildir. 18 yaş altı
            bireylerden bilinçli olarak kişisel veri toplamıyoruz.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">8. Politika Değişiklikleri</h2>
          <p className="legal-page__p">
            Bu Gizlilik Politikası zaman zaman güncellenebilir. Değişiklikler
            bu sayfada yayımlanır. Son güncelleme tarihi en üstte belirtilir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">9. İletişim</h2>
          <div className="legal-page__contact-box">
            <p className="legal-page__p">
              Gizlilik Politikamız hakkında sorularınız varsa:
            </p>
            <ul className="legal-page__list">
              <li>
                E-posta:{" "}
                <a href="mailto:info@turuncusolar.com">info@turuncusolar.com</a>
              </li>
              <li>Telefon: +90 312 285 66 67</li>
              <li>
                İlgili Bağlantılar:{" "}
                <a href="/kvkk">KVKK Aydınlatma Metni</a>,{" "}
                <a href="/kullanim-kosullari">Kullanım Koşulları</a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
