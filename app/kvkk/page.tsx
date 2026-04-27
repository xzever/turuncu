import type { Metadata } from "next";
import { SITE_URL } from "@/config/env";
import "../(legal)/legal.css";

const PATH = "/kvkk";
const TITLE = "KVKK Aydınlatma Metni";
const DESC =
  "Turuncu Solar KVKK Aydınlatma Metni — 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin işlenmesine ilişkin bilgilendirme.";

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

export default function KvkkPage() {
  return (
    <main className="legal-page">
      <p className="legal-page__eyebrow">Yasal</p>
      <h1 className="legal-page__title">KVKK Aydınlatma Metni</h1>
      <p className="legal-page__meta">Son güncelleme: 24 Nisan 2026</p>

      <div className="legal-page__content">
        <section className="legal-page__section">
          <p className="legal-page__p">
            İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun
            (&quot;KVKK&quot;) 10. maddesi uyarınca veri sorumlusu sıfatıyla hareket eden
            Turuncu Solar tarafından, kişisel verilerinizin işlenmesine ilişkin
            olarak ilgili kişilerin aydınlatılması amacıyla hazırlanmıştır.
          </p>
          <p className="legal-page__note">
            <strong>Not:</strong> Bu metin taslak niteliğindedir ve resmi yayına
            alınmadan önce Şirketinizin hukuk danışmanı tarafından
            güncellenmelidir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">1. Veri Sorumlusu</h2>
          <p className="legal-page__p">
            Turuncu Solar (&quot;Şirket&quot;), KVKK kapsamında veri sorumlusu
            sıfatıyla hareket etmektedir.
          </p>
          <ul className="legal-page__list">
            <li>Adres: Renevo / Üniversiteler Mah. 1598 Cad. Bilkent Plaza A3/17, Bilkent Çankaya Ankara</li>
            <li>Telefon: +90 312 285 66 67</li>
            <li>
              E-posta:{" "}
              <a href="mailto:info@turuncusolar.com">info@turuncusolar.com</a>
            </li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">2. İşlenen Kişisel Veriler</h2>
          <p className="legal-page__p">
            Şirketimiz, aşağıdaki kişisel verilerinizi yalnızca belirtilen
            amaçlar doğrultusunda ve bu amaçlarla sınırlı olarak işlemektedir:
          </p>
          <ul className="legal-page__list">
            <li>Kimlik bilgileri: Ad, soyad</li>
            <li>İletişim bilgileri: E-posta adresi, telefon numarası, il ve ilçe bilgisi</li>
            <li>Firma bilgileri (opsiyonel): Firma adı, pozisyon</li>
            <li>İletişim formu içeriği: Mesaj metni, konu</li>
            <li>Teknik bilgiler: IP adresi, tarayıcı bilgisi, çerez verileri</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">3. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul className="legal-page__list">
            <li>İletişim talepleri ve formların değerlendirilmesi</li>
            <li>Teklif hazırlanması ve sunulması</li>
            <li>Satış sonrası destek sağlanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Şirket süreçlerinin iyileştirilmesi ve istatistiksel analiz</li>
            <li>İletişim süreçlerinin yürütülmesi</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">4. Kişisel Verilerin İşlenme Hukuki Sebebi</h2>
          <p className="legal-page__p">
            Kişisel verileriniz, KVKK&apos;nın 5. maddesinde belirtilen hukuki
            sebepler çerçevesinde işlenmektedir: açık rızanızın bulunması, bir
            sözleşmenin kurulması veya ifası, hukuki yükümlülüklerin yerine
            getirilmesi ve meşru menfaatlerin korunması.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">5. Kişisel Verilerin Aktarılması</h2>
          <p className="legal-page__p">
            Kişisel verileriniz; yasal yükümlülüklerin yerine getirilmesi
            gereğince yetkili kamu kurum ve kuruluşlarına, hizmet alınan
            tedarikçilere (barındırma sağlayıcıları, e-posta servis sağlayıcıları)
            KVKK&apos;nın 8. ve 9. maddelerine uygun olarak aktarılabilir. Yurt
            dışına aktarım, ilgili kişinin açık rızası veya KVKK&apos;nın 9.
            maddesindeki diğer şartların sağlanması halinde gerçekleştirilir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">6. Veri Sahibi Olarak Haklarınız</h2>
          <p className="legal-page__p">KVKK&apos;nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:</p>
          <ul className="legal-page__list">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenen kişisel verileriniz hakkında bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini isteme</li>
            <li>Düzeltme/silme/yok etme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>Münhasıran otomatik sistemlerce analiz sonucu aleyhe bir sonuç doğmasına itiraz etme</li>
            <li>Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">7. Başvuru Yolu</h2>
          <div className="legal-page__contact-box">
            <p className="legal-page__p">
              KVKK kapsamındaki haklarınızı kullanmak için taleplerinizi yazılı
              olarak veya güvenli elektronik imza ile Şirketimize iletebilirsiniz:
            </p>
            <ul className="legal-page__list">
              <li>
                E-posta:{" "}
                <a href="mailto:info@turuncusolar.com">info@turuncusolar.com</a>
              </li>
              <li>Posta: Renevo / Üniversiteler Mah. 1598 Cad. Bilkent Plaza A3/17, Bilkent Çankaya Ankara</li>
            </ul>
            <p className="legal-page__p">
              Talebiniz, niteliğine göre en geç 30 (otuz) gün içinde ücretsiz
              olarak sonuçlandırılacaktır.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
