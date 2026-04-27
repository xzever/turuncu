TURUNCU SOLAR - DEPLOY TESLIM NOTU

Bu paket Next.js uygulamasinin kaynak kodunu icerir.
`node_modules` ve `.next` bilerek pakete dahil edilmemistir.

Gereksinimler
- Node.js 20.9+ veya daha guncel
- npm

Kurulum
1. Arsivi acin
2. Proje klasorune girin
3. `npm ci`
4. `npm run build`
5. `npm run start`

Varsayilan uygulama portu Next.js tarafindan belirlenir.
Gerekirse:
- `PORT=3000 npm run start`

Notlar
- Bu proje `package-lock.json` ile gelir; kurulum icin `npm ci` kullanin.
- `.env` dosyasi gerekiyorsa sunucu tarafinda ayrica eklenmelidir.
- Deploy oncesi temiz kurulum onerilir.
