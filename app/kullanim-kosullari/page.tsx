import type { Metadata } from "next";
import { SITE_URL } from "@/config/env";
import "../(legal)/legal.css";

const PATH = "/kullanim-kosullari";
const TITLE = "Kullanım Koşulları";
const DESC =
  "Turuncu Solar web sitesinin kullanım koşulları — site erişimi, içerik hakları ve sorumluluk sınırları.";

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

export default function KullanimKosullariPage() {
  return (
    <main className="legal-page">
      <p className="legal-page__eyebrow">Yasal</p>
      <h1 className="legal-page__title">Kullanım Koşulları</h1>
      <p className="legal-page__meta">Son güncelleme: 24 Nisan 2026</p>

      <div className="legal-page__content">
        <section className="legal-page__section">
          <p className="legal-page__p">
            Turuncu Solar web sitesini (&quot;Site&quot;) kullanmadan önce
            aşağıdaki koşulları dikkatle okumanızı rica ederiz. Siteyi
            kullanarak bu koşulları kabul etmiş sayılırsınız.
          </p>
          <p className="legal-page__note">
            <strong>Not:</strong> Bu metin taslaktır ve resmi yayına alınmadan
            önce hukuk danışmanı onayından geçmelidir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">1. Hizmet Tanımı</h2>
          <p className="legal-page__p">
            Site, Turuncu Solar&apos;ın güneş enerjisi sistemleri, sunduğu
            hizmetler ve kurumsal bilgiler hakkında tanıtım amacıyla hazırlanmış
            bir bilgi platformudur. Sitede yer alan bilgiler referans
            niteliğindedir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">2. Fikri Mülkiyet</h2>
          <p className="legal-page__p">
            Site içeriği (metin, görsel, video, logo, tasarım öğeleri) Turuncu
            Solar&apos;ın mülkiyetinde olup 5846 sayılı Fikir ve Sanat Eserleri
            Kanunu kapsamında korunmaktadır. İzin alınmadan kopyalanması,
            çoğaltılması veya ticari amaçla kullanılması yasaktır.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">3. Kullanıcı Yükümlülükleri</h2>
          <p className="legal-page__p">Siteyi kullanırken aşağıdaki kurallara uymayı kabul edersiniz:</p>
          <ul className="legal-page__list">
            <li>Yasalara ve ahlaka aykırı eylemlerde bulunmamak</li>
            <li>Siteye veya diğer kullanıcılara zarar verecek içerik göndermemek</li>
            <li>Yanıltıcı veya aldatıcı bilgi vermemek</li>
            <li>Otomatik araçlarla (bot, scraper) siteye erişim yapmamak</li>
            <li>Siteye kötü amaçlı yazılım yüklememek</li>
            <li>Güvenlik önlemlerini atlatmaya çalışmamak</li>
          </ul>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">4. İletişim Formu Kullanımı</h2>
          <p className="legal-page__p">
            İletişim formunu yalnızca gerçek, doğrudan ilgili talepleriniz için
            kullanmanızı bekliyoruz. Spam, reklam veya istenmeyen içerik
            gönderimi yasaktır.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">5. Sorumluluk Sınırları</h2>
          <p className="legal-page__p">
            Site içeriği &quot;olduğu gibi&quot; sunulmaktadır. Turuncu Solar,
            sitedeki bilgilerin güncel, doğru veya tam olduğunu taahhüt
            etmemekle birlikte, içeriği güncellemek için makul çaba gösterir.
          </p>
          <p className="legal-page__p">
            Şirketimiz, site üzerinden sunulan bilgilerin kullanımı sonucu
            doğabilecek doğrudan veya dolaylı zararlardan sorumlu değildir.
            Kesin teklif ve teknik detaylar için lütfen doğrudan iletişime
            geçiniz.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">6. Üçüncü Taraf Bağlantıları</h2>
          <p className="legal-page__p">
            Site içerisinde üçüncü taraf web sitelerine bağlantılar
            bulunabilir. Bu siteler bağımsızdır; içeriklerinden ve gizlilik
            uygulamalarından Turuncu Solar sorumlu değildir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">7. Site Kullanılabilirliği</h2>
          <p className="legal-page__p">
            Site kesintisiz erişilebilir olmaya çalışılır; ancak bakım,
            güncelleme veya öngörülemeyen durumlar nedeniyle geçici kesintiler
            yaşanabilir. Bu kesintilerden dolayı Şirketimiz sorumlu tutulamaz.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">8. Değişiklikler</h2>
          <p className="legal-page__p">
            Bu Kullanım Koşulları zaman zaman güncellenebilir. Güncel sürüm
            daima bu sayfada yayımlanır. Son güncelleme tarihi en üstte
            belirtilmiştir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">9. Uygulanacak Hukuk ve Yetkili Mahkeme</h2>
          <p className="legal-page__p">
            İşbu Kullanım Koşulları Türkiye Cumhuriyeti kanunlarına tabidir. Bu
            koşullardan doğabilecek uyuşmazlıklarda Ankara Mahkemeleri ve İcra
            Daireleri yetkilidir.
          </p>
        </section>

        <section className="legal-page__section">
          <h2 className="legal-page__h2">10. İletişim</h2>
          <div className="legal-page__contact-box">
            <p className="legal-page__p">
              Kullanım Koşulları hakkında sorularınız varsa:
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
                <a href="/gizlilik">Gizlilik Politikası</a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
