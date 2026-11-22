-- 2. aşama: giriş sistemi için ek sütunlar.

-- Kurulumu henüz onaylanmamış 2FA anahtarı (QR gösterildi, kod girilmedi)
ALTER TABLE admin_user ADD COLUMN totp_pending TEXT;
-- Son kabul edilen kodun zaman adımı: aynı kod ikinci kez kullanılamasın
ALTER TABLE admin_user ADD COLUMN totp_last_step INTEGER NOT NULL DEFAULT 0;

-- Oturum aşaması: 'password' = şifre doğru, 2FA kodu bekleniyor | 'setup' = ilk giriş, 2FA kurulacak | 'full' = giriş tamam
ALTER TABLE sessions ADD COLUMN stage TEXT NOT NULL DEFAULT 'full';
-- Form güvenlik anahtarı (CSRF): panel formları bu değeri gizli alan olarak gönderir
ALTER TABLE sessions ADD COLUMN csrf TEXT NOT NULL DEFAULT '';
