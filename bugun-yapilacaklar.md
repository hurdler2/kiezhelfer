



Şunu dedin:
BACKEND-DUZELTMELERI
-kullanicilar icin ilan durdurma ozelligi ekle
-sifremi unuttum ozelligi ekle
-profil icinden sifremi degistir ozelligi ekle
-kayit olurken email aktivasyonu sarti ekle
-kullanici uye olurken sifre girerken sifresini gorme optionu ekle
-uye olanlar yaptiklari aksiyonlarda mail bildirimleri alsin, yorum yaptiginda / ilan verdiginde / ilani onaylanip yayinlandiginda / mesaj veya yildiz aldiginda vb.
-ilan olustururken ilanlara fotograf ekleme ozelligi ekle 
***************************************************************************** 

HATALAR
-ilani editlerken fotograf eklenmiyor
-ilan paylasildiktan sonra goruntulenirken katagori isimleri kucuk harflerle gosteriliyor bunlari katagorilerin kendi font ayarlarina gore duzenle ve ayni yap
-ilan silme ozelligi ekle
-ilan editleme ye tikladigimda 404 hatasi aliyorum
-profilime gittigimde ilana gitmeye calistigim da This page could not be found. hatasi aliyorum
-admin sadece admin paneline erisebilsin kullanici olarak siteye erisimi olmasin admin paneline giris yaptigimda siteye de giris yapiyor cunku bunu istemiyorum
-kontakt sayfasindan mesaj gonderildiginde admin panele gelmiyor
projemde su eksikleri ve gelistirmeleri tamamlatmak istiyorum claudeye bunlari asama asama hatasiz yaptiracak bir mardown dosyasi lazim

ChatGPT:
# BACKEND Düzeltmeleri + Hata Fixleri — Claude için Adım Adım Uygulama Planı (Hatasız İlerleme)

> Amaç: Aşağıdaki geliştirmeleri ve hataları **aşama aşama**, her aşamada **test + doğrulama** yaparak, üretimde kırmadan tamamlamak.  
> Kural: Claude her adımda **küçük PR** mantığıyla ilerleyecek (maks 1-2 özellik / PR), her PR sonunda **acceptance checklist** dolduracak.

---

## 0) Çalışma Kuralları (Claude’a Talimat)
1. Önce repo yapısını analiz et: auth, ilan (listing), profil, admin panel, upload, mail, contact modülleri nerede?
2. Mevcut route’ları ve endpoint’leri çıkar:  
   - İlan oluştur / düzenle / sil / listele  
   - Profil “ilanlarım” sayfası  
   - Admin panel auth + rol kontrol  
   - Contact mesajları
3. Her değişiklik için:
   - Migration gerekiyorsa ekle
   - Unit/integration test veya en azından Postman/Insomnia koleksiyonu + manuel test adımları ekle
   - Log ekle (özellikle mail, upload, contact)
4. Güvenlik:
   - Token’lar (reset token, verify token) **hash’li** saklanacak
   - Rate-limit (forgot password, verify email) eklenecek
   - Admin kullanıcıları “site UI” erişemeyecek (net kural)
5. Her aşama bitince “DONE ✅” bölümünde nelerin bittiğini ve nasıl test edildiğini yaz.

---

## 1) Geliştirme Listesi (İstenilenler)
### A) BACKEND Düzeltmeleri / Yeni Özellikler
- [A1] Kullanıcılar için **ilan durdurma (pause/unpause)** özelliği
- [A2] **Şifremi unuttum** (forgot password) + reset akışı
- [A3] Profil içinden **şifre değiştir**
- [A4] Kayıt olurken **email aktivasyonu zorunlu** (verify email)
- [A5] Kayıtta şifre girerken **şifreyi göster** opsiyonu (**frontend**, ama backend etkisi: kayıt validasyonları + response)
- [A6] Mail bildirimleri: kullanıcı **yorum**, **ilan**, **ilan onay/yayın**, **mesaj**, **yıldız/puan** vb aksiyonlarda mail alsın
- [A7] İlan oluştururken **fotoğraf ekleme** (upload)

### B) HATALAR
- [B1] İlan editlerken **fotoğraf eklenmiyor**
- [B2] İlan görüntülemede kategori isimleri **küçük harf** görünüyor → kategori font/format ayarlarıyla **orijinal casing korunacak**
- [B3] **İlan silme** özelliği
- [B4] İlan editlemeye tıklayınca **404**
- [B5] Profilimde ilana gidince **This page could not be found**
- [B6] Admin sadece admin paneline erişsin; admin paneline girince siteye de giriş oluyor **istemiyorum**
- [B7] Contact sayfasından mesaj gidince admin panelde görünmüyor

---

## 2) Ön Hazırlık: Teknik Envanter ve Tasarım Kararları (1 PR)
### 2.1 İncelenecek Dosyalar (Claude repo içinden bulacak)
- Auth: login/register middleware/guards, session/jwt
- Role sistemi: admin/user ayrımı
- Listing modeli: status, images, category
- Upload altyapısı: local/s3/cloudinary vb.
- Mail altyapısı: SMTP/SendGrid/Resend vb.
- Contact: mesaj kaydı + admin listeleme

### 2.2 Eklenmesi Önerilen Alanlar (DB)
> Mevcut DB yapısına göre uyarlanacak.

**users**
- `emailVerifiedAt` (datetime, nullable)
- `role` (enum: USER, ADMIN)
- `passwordHash`
- `notificationPrefs` (json) (opsiyonel)

**email_tokens**
- `id`
- `userId`
- `type` (VERIFY_EMAIL | RESET_PASSWORD)
- `tokenHash`
- `expiresAt`
- `usedAt` (nullable)
- `createdAt`

**listings**
- `status` (enum: DRAFT | PENDING | PUBLISHED | PAUSED | DELETED)
- `isDeleted` (opsiyonel, soft delete)
- `categoryId`
- `title`, `description`, vb.

**listing_images**
- `id`
- `listingId`
- `url`
- `order`
- `createdAt`

**contact_messages**
- `id`
- `name`, `email`, `subject`, `message`
- `createdAt`
- `isRead` (bool)

### 2.3 Status Kuralları
- İlan oluşturma → `DRAFT` veya `PENDING` (sistemin mevcut akışına göre)
- Admin onayı sonrası → `PUBLISHED`
- Kullanıcı durdur → `PAUSED`
- Sil → `DELETED` (soft delete önerilir)

**Acceptance**
- DB migration çalışıyor
- Proje build/test geçiyor

---

## 3) ROUTE 404 Problemleri (B4 + B5) — Öncelik 1 (1 PR)
### Hedef
- İlan edit sayfası 404 vermeyecek
- Profilde ilan detayına gitme 404 vermeyecek

### Yapılacaklar
1. Frontend route haritasını çıkar:
   - Örn: `/listing/[id]`, `/listing/[id]/edit`, `/profile/listings`, vb.
2. Backend endpoint’ler ile eşleştir:
   - GET listing by id
   - GET user listings
   - GET listing edit data
3. 404 root-cause:
   - Yanlış dynamic route adı (id vs slug)
   - Next/React Router mismatch
   - Backend 404 (yetki kontrolü yanlış, listing status filter yüzünden görünmüyor)
4. Çözüm:
   - Route’ları standardize et (tek kaynak: route constants)
   - Listing fetch’te kullanıcı kendi ilanını “PENDING/PAUSED” olsa bile görebilsin
   - Public sayfa sadece `PUBLISHED` göstersin

**Acceptance Checklist**
- ✅ “Edit” butonuna basınca edit sayfası açılıyor
- ✅ Profilde ilanın üzerine tıklayınca detay sayfası açılıyor
- ✅ Console’da 404 yok (network 200/304)

---

## 4) Admin Erişim Kısıtı (B6) — Öncelik 1 (1 PR)
### Hedef
- Admin kullanıcı “normal kullanıcı site UI” alanına giremesin
- Admin login sadece admin panel session’ı açsın (veya role guard)

### Yapılacaklar
1. Auth layer’da `role` kontrolü ekle:
   - Admin panel route’ları: sadece ADMIN
   - User site route’ları: sadece USER (ADMIN reddedilecek)
2. Admin login sonrası redirect sadece `/admin` olsun
3. Ortak session kullanılıyorsa:
   - ya ayrı cookie/session adı
   - ya da middleware ile role guard

**Acceptance**
- ✅ Admin kullanıcı `/` veya user sayfalarına gidince 403/redirect alıyor
- ✅ USER `/admin` giremiyor
- ✅ Admin panelde gezinme sorunsuz

---

## 5) İlan Silme + Soft Delete (B3) — Öncelik 1 (1 PR)
### Hedef
- Kullanıcı kendi ilanını silebilsin
- Silinen ilan public’te görünmesin
- Admin panelde (opsiyonel) “deleted” filtrelenebilsin

### Yapılacaklar
- DELETE `/api/listings/:id`
- Yetki: sadece ilan sahibi veya admin
- Soft delete: `status=DELETED` (veya `isDeleted=true`)
- Public list/detail sorgularına `status=PUBLISHED` filtresi

**Acceptance**
- ✅ Sil butonu ilanı kaldırıyor
- ✅ Silinen ilan public’te görünmüyor
- ✅ Profilde “silindi” olarak gösterilebilir (opsiyonel) ya da listeden kalkar

---

## 6) İlan Durdurma (Pause/Unpause) (A1) — Öncelik 2 (1 PR)
### Hedef
- Kullanıcı ilanını “yayından kaldırmadan” durdurabilsin
- Durdurulan ilan public listede görünmesin
- Kullanıcı profilinde durumu görsün

### Yapılacaklar
- PATCH `/api/listings/:id/pause`  → `status=PAUSED`
- PATCH `/api/listings/:id/unpause` → `status=PUBLISHED` (ya da önceki status)
- Public sorgular: sadece `PUBLISHED`

**Acceptance**
- ✅ Pause sonrası ilan public’ten kaybolur
- ✅ Unpause sonrası tekrar görünür
- ✅ Status doğru saklanır

---

## 7) Fotoğraf Upload Sistemi + Edit Bug Fix (A7 + B1) — Öncelik 2 (2 PR olabilir)
### 7.1 Upload Tasarımı
- Storage seçimi: local disk / S3 / Cloudinary (mevcut neyse onu kullan)
- Güvenlik: mime-type kontrolü, max boyut, rate limit
- Listing-images ilişkisi: çoklu foto

### 7.2 Endpoints (örnek)
- POST `/api/uploads/listing-image` (multipart/form-data) → {url}
- POST `/api/listings/:id/images` → url’yi listing’e ekler
- DELETE `/api/listings/:id/images/:imageId`
- PUT `/api/listings/:id/images/reorder`

### 7.3 “Editte eklenmiyor” (B1) Root Cause
- Edit form sadece “create” endpoint’ine bağlı olabilir
- Multipart handling edit endpoint’inde yoktur
- Transaction yoktur, DB kaydı oluşuyor ama UI refresh etmiyor

**Fix**
- Create ve Edit aynı upload akışını kullansın
- Edit sayfası upload sonrası listing’i refetch etsin
- Backend image create işlemi atomic olsun

**Acceptance**
- ✅ Create’te foto ekleniyor
- ✅ Edit’te yeni foto ekleniyor
- ✅ Foto silme çalışıyor
- ✅ Foto sıralama (opsiyonel) çalışıyor

---

## 8) Kategori Harf Formatı (B2) — Öncelik 3 (1 PR)
### Hedef
- Kategori isimleri orijinal haliyle görünsün (DB’de ne ise)
- Frontend’de `toLowerCase()` / CSS `text-transform: lowercase` gibi dönüşümler kaldırılacak
- Eğer “kategori font ayarı” ayrı tabloda ise: onu baz al

**Acceptance**
- ✅ İlan detayında kategori adı doğru casing ile görünüyor
- ✅ Liste kartlarında da aynı

---

## 9) Email Aktivasyonu + Şifre Sıfırlama + Şifre Değiştirme (A4 + A2 + A3) — Öncelik 2 (3 PR önerilir)
### 9.1 Email Aktivasyonu (A4)
- Register sonrası:
  - Kullanıcı oluştur
  - Verify token üret + hash’le DB’ye kaydet
  - Email gönder: “Verify your email” linki
- Verify endpoint:
  - GET `/api/auth/verify-email?token=...`
  - Token hash doğrula, expire kontrolü, usedAt set, `emailVerifiedAt=now`

**Kural**
- Email verify olmadan:
  - Login engellenebilir **veya**
  - Login olur ama ilan verme/yorum/mesaj engellenir  
  (Mevcut ürün akışına göre seç ve netleştir: genelde “login olur ama kritik aksiyonlar kilitli” daha iyi UX.)

### 9.2 Şifremi Unuttum (A2)
- POST `/api/auth/forgot-password` (email)
  - Rate limit
  - Token üret + hash + expires
  - Email gönder: reset link
- POST `/api/auth/reset-password` (token + newPassword)
  - Token doğrula, expire kontrolü, usedAt set
  - passwordHash güncelle
  - Tüm session’ları invalidate et (varsa)

### 9.3 Profil İçinden Şifre Değiştir (A3)
- POST `/api/profile/change-password`
  - oldPassword doğrula
  - newPassword policy kontrol
  - passwordHash güncelle

**Acceptance**
- ✅ Verify email linki çalışıyor
- ✅ Verify olmadan kısıtlanan aksiyonlar doğru şekilde engelleniyor
- ✅ Forgot password mail gidiyor
- ✅ Reset password token expire/used kontrolü var
- ✅ Change password çalışıyor

---

## 10) Mail Bildirimleri (A6) — Öncelik 3 (Entegrasyon PR + Event Sistemi)
### Hedef
Kullanıcı aşağıdaki olaylarda mail alsın:
- Yorum yaptığında / yorum geldiğinde
- İlan verdiğinde (submission)
- İlan onaylanıp yayınlandığında
- Mesaj aldığında
- Yıldız/puan aldığında

### Tasarım
- “Event bus” yaklaşımı:
  - `emit("listing.created", payload)`
  - `emit("listing.published", payload)`
  - `emit("message.received", payload)`
- Listener:
  - Notification preference kontrolü
  - Email template seçimi
  - Mail queue (opsiyonel) / retry

### Minimum Uygulama
- Önce 2 kritik mail:
  1) Listing published
  2) Message received
- Sonra diğerlerini ekle

**Acceptance**
- ✅ Event tetikleniyor
- ✅ Email doğru kişiye gidiyor
- ✅ Duplicate mail atmıyor (idempotency)
- ✅ Loglarda mail status görülebiliyor

---

## 11) Contact Mesajları Admin Panelde Görünmüyor (B7) — Öncelik 2 (1 PR)
### Root Causes
- Contact form backend’e yazmıyor
- Yazıyor ama admin panel query yanlış
- Admin panel route auth/role yüzünden erişemiyor
- DB tablo adı/kolon mismatch

### Yapılacaklar
1. Contact submit endpoint:
   - POST `/api/contact`
   - DB’ye insert
   - (opsiyonel) admin’e mail
2. Admin panel:
   - GET `/api/admin/contact-messages`
   - pagination + read/unread
3. Admin UI listesi:
   - gelen mesajlar listeleniyor mu?

**Acceptance**
- ✅ Contact form gönderince DB’ye düşüyor
- ✅ Admin panelde listeleniyor
- ✅ Read/unread çalışıyor (opsiyonel)

---

## 12) Frontend “Şifreyi Göster” (A5) — Not
Bu madde frontend tarafıdır:
- Register ekranında password input type toggle
- Backend sadece password policy + error mesajlarını düzgün döndürsün

**Acceptance**
- ✅ Toggle çalışıyor
- ✅ Backend validasyon mesajları anlaşılır

---

## 13) Son Kontrol — Release Checklist (Final PR)
- [ ] Tüm endpoint’ler için Postman koleksiyonu / API docs güncel
- [ ] Migration production’da güvenli (backup plan)
- [ ] Upload boyut limitleri + virus scanning yoksa en azından mime/size kontrol
- [ ] Rate limiting aktif (forgot/verify)
- [ ] Admin/user role guard her route’ta doğru
- [ ] 404 problemleri yok
- [ ] İlan status akışı net: DRAFT/PENDING/PUBLISHED/PAUSED/DELETED
- [ ] Mail provider env değişkenleri tanımlı
- [ ] Log seviyeleri ayarlı (prod’de PII yazma)

---

## 14) Claude’a Çalıştırılacak Komutlar (Repo’ya göre uyarlanacak)
- `npm test` / `pnpm test`
- `npm run lint`
- `npm run build`
- DB migrate: `prisma migrate deploy` / `sequelize db:migrate` / vb.
- Upload test: 2-3 farklı dosya (jpg/png + büyük dosya reject)

---

## 15) Çıktı Formatı (Claude her PR sonunda yazacak)
### PR: <başlık>
- Değişiklikler:
  - ...
- DB değişiklikleri:
  - ...
- API değişiklikleri:
  - ...
- Test:
  - [ ] Senaryo 1
  - [ ] Senaryo 2
- Risk / Rollback:
  - ...

---

# Başlangıç Talimatı (Claude’a kopyala-yapıştır)
“Repo’yu analiz et ve önce 1. PR olarak **404 hatalarının kök nedenini** bulup fixle. Sonra sırayla bu dokümandaki aşamalara göre ilerle. Her PR sonunda acceptance checklist’i doldur ve test adımlarını yaz.”



