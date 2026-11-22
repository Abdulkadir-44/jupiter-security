-- JÜPİTER: ilk veritabanı yapısı (Cloudflare D1 / SQLite).
-- Uygulama: npm run db:migrate:local  |  npm run db:migrate:remote
-- Kurallar:
--   * İki dilli alanlar _tr / _en. İngilizce boşsa sitede Türkçe gösterilir.
--   * Listeler (özellikler, ilçeler, markalar) JSON dizi olarak metin alanında: '["a","b"]'.
--   * Fiyatlar tam sayı (TL). Ekranda dile göre biçimlenir (9.999 / 9,999).
--   * Fotoğraf: photo_key + boyutlar. Adres /medya/foto/<photo_key>-<genişlik>.webp (src/lib/photo.ts).
--   * Bu dosya bir kez uygulandıktan sonra DEĞİŞTİRİLMEZ; yeni değişiklik = yeni numaralı dosya.

-- ───────────── Site içeriği ─────────────

-- Tek satır: iletişim, çalışma saatleri, hizmet bölgesi, markalar
CREATE TABLE settings (
  id                  INTEGER PRIMARY KEY CHECK (id = 1),
  phone_display       TEXT NOT NULL,             -- "0545 142 31 31"
  phone_e164          TEXT NOT NULL,             -- "+905451423131"
  whatsapp            TEXT NOT NULL,             -- "905451423131"
  whatsapp_message_tr TEXT NOT NULL,
  whatsapp_message_en TEXT NOT NULL DEFAULT '',
  instagram_handle    TEXT NOT NULL DEFAULT '',
  instagram_url       TEXT NOT NULL DEFAULT '',
  facebook_name       TEXT NOT NULL DEFAULT '',
  facebook_url        TEXT NOT NULL DEFAULT '',
  hours_tr            TEXT NOT NULL,
  hours_en            TEXT NOT NULL DEFAULT '',
  opening_hours       TEXT NOT NULL DEFAULT '[]', -- Google için: [{"days":["Mo",...],"opens":"09:00","closes":"18:00"}]
  region_tr           TEXT NOT NULL,
  region_en           TEXT NOT NULL DEFAULT '',
  service_areas       TEXT NOT NULL DEFAULT '[]', -- ["İskenderun","Arsuz",...]
  brands_cctv         TEXT NOT NULL DEFAULT '[]',
  brands_solar        TEXT NOT NULL DEFAULT '[]',
  updated_at          TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tek satır: kampanya şeridi
CREATE TABLE campaign (
  id         INTEGER PRIMARY KEY CHECK (id = 1),
  enabled    INTEGER NOT NULL DEFAULT 0,
  text_tr    TEXT NOT NULL DEFAULT '',
  text_en    TEXT NOT NULL DEFAULT '',
  cta_tr     TEXT NOT NULL DEFAULT '',
  cta_en     TEXT NOT NULL DEFAULT '',
  ends_at    TEXT,                               -- "2026-12-31" (bu günün sonunda kendiliğinden kapanır) ya da NULL
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Yaptığımız kurulumlar: klasörler
CREATE TABLE folders (
  id         TEXT PRIMARY KEY,                   -- "kafe-isyeri"
  title_tr   TEXT NOT NULL,
  title_en   TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0,
  published  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tüm fotoğraflar tek tabloda. place: 'folder:<klasör-id>' | 'slider:gunes' | 'slider:wifi'
-- Slider'da fotoğrafı henüz olmayan kare: photo_key NULL ("fotoğraf yakında")
CREATE TABLE photos (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  place        TEXT NOT NULL,
  caption_tr   TEXT NOT NULL DEFAULT '',
  caption_en   TEXT NOT NULL DEFAULT '',
  area         TEXT NOT NULL DEFAULT '',          -- mahalle / semt / ilçe (özel ad, iki dilde aynı)
  alt_tr       TEXT NOT NULL DEFAULT '',
  alt_en       TEXT NOT NULL DEFAULT '',
  photo_key    TEXT,
  photo_width  INTEGER,
  photo_height INTEGER,
  photo_widths TEXT,                              -- [480,960,1600]
  sort         INTEGER NOT NULL DEFAULT 0,
  published    INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX photos_place ON photos (place, sort);

-- Ürün vitrini
CREATE TABLE products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  name_tr      TEXT NOT NULL,
  name_en      TEXT NOT NULL DEFAULT '',
  category_tr  TEXT NOT NULL DEFAULT '',
  category_en  TEXT NOT NULL DEFAULT '',
  icon         TEXT NOT NULL DEFAULT 'bullet'
               CHECK (icon IN ('bullet','dome','ptz','solar','wifi','nvr')), -- fotoğraf yoksa gösterilir
  specs_tr     TEXT NOT NULL DEFAULT '[]',
  specs_en     TEXT NOT NULL DEFAULT '[]',
  brand        TEXT NOT NULL DEFAULT '',
  alt_tr       TEXT NOT NULL DEFAULT '',
  alt_en       TEXT NOT NULL DEFAULT '',
  photo_key    TEXT,
  photo_width  INTEGER,
  photo_height INTEGER,
  photo_widths TEXT,
  sort         INTEGER NOT NULL DEFAULT 0,
  published    INTEGER NOT NULL DEFAULT 1,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

-- "...TL'den başlayan fiyatlarla" etiketleri (metin kalıbı kodda)
CREATE TABLE price_tags (
  id         TEXT PRIMARY KEY CHECK (id IN ('gunes','wifi')),
  amount     INTEGER NOT NULL,
  published  INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Hazır paketler ("KDV ve montaj dahil" notu kodda)
CREATE TABLE packages (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name_tr     TEXT NOT NULL,
  name_en     TEXT NOT NULL DEFAULT '',
  cameras_tr  TEXT NOT NULL DEFAULT '',           -- "4 kamera"
  cameras_en  TEXT NOT NULL DEFAULT '',
  for_tr      TEXT NOT NULL DEFAULT '',           -- "Müstakil ev, dükkan"
  for_en      TEXT NOT NULL DEFAULT '',
  features_tr TEXT NOT NULL DEFAULT '[]',
  features_en TEXT NOT NULL DEFAULT '[]',
  price_from  INTEGER NOT NULL,
  featured    INTEGER NOT NULL DEFAULT 0,
  sort        INTEGER NOT NULL DEFAULT 0,
  published   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Müşteri yorumları
CREATE TABLE reviews (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  quote_tr   TEXT NOT NULL,
  quote_en   TEXT NOT NULL DEFAULT '',
  name       TEXT NOT NULL,                       -- "Mehmet K."
  place_tr   TEXT NOT NULL DEFAULT '',            -- "Market sahibi, İskenderun"
  place_en   TEXT NOT NULL DEFAULT '',
  sort       INTEGER NOT NULL DEFAULT 0,
  published  INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- ───────────── Admin paneli (2. aşamada kullanılmaya başlanır) ─────────────

-- Tek kullanıcı
CREATE TABLE admin_user (
  id            INTEGER PRIMARY KEY CHECK (id = 1),
  email         TEXT NOT NULL,
  password_hash TEXT NOT NULL,                    -- PBKDF2-SHA256
  password_salt TEXT NOT NULL,
  pbkdf2_iter   INTEGER NOT NULL,
  totp_secret   TEXT,                             -- 2FA kurulunca dolar
  backup_codes  TEXT NOT NULL DEFAULT '[]',       -- yedek kodların hash'leri
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE sessions (
  id_hash    TEXT PRIMARY KEY,                    -- çerezdeki rastgele değerin hash'i
  expires_at TEXT NOT NULL,
  ip         TEXT NOT NULL DEFAULT '',
  user_agent TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX sessions_expires ON sessions (expires_at);

CREATE TABLE login_attempts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ip         TEXT NOT NULL,
  success    INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX login_attempts_ip ON login_attempts (ip, created_at);

-- Genel bakış'taki "son değişiklikler"
CREATE TABLE activity_log (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  action     TEXT NOT NULL,                       -- "Paket fiyatı değişti: Ev ve dükkan"
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- "İngilizceye çevir" günlük üst sınırı
CREATE TABLE ai_usage (
  day   TEXT PRIMARY KEY,                         -- "2026-11-22"
  count INTEGER NOT NULL DEFAULT 0
);
