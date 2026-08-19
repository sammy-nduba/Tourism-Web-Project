-- ============================================================
-- Davikiths Tours — MySQL Schema
-- Run once against your davikiths_tours database
-- ============================================================

-- ========================
-- COUNTRIES
-- ========================
CREATE TABLE IF NOT EXISTS countries (
  id           VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name         VARCHAR(100) NOT NULL,
  code         CHAR(2)      NOT NULL UNIQUE,
  flag_emoji   VARCHAR(10),
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- CITIES
-- ========================
CREATE TABLE IF NOT EXISTS cities (
  id           VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name         VARCHAR(100) NOT NULL,
  country_id   VARCHAR(36),
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);

-- ========================
-- TOURS
-- ========================
CREATE TABLE IF NOT EXISTS tours (
  id               VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title            VARCHAR(255) NOT NULL,
  slug             VARCHAR(255) NOT NULL UNIQUE,
  description      TEXT,
  city_id          VARCHAR(36),
  duration_days    INTEGER     NOT NULL DEFAULT 1,
  price            DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency         VARCHAR(10) DEFAULT 'USD',
  difficulty_level VARCHAR(50) DEFAULT 'moderate',
  max_group_size   INTEGER     DEFAULT 12,
  min_age          INTEGER     DEFAULT 12,
  physical_rating  INTEGER     DEFAULT 2 CHECK (physical_rating BETWEEN 1 AND 5),
  image_url        TEXT,
  gallery_urls     JSON,
  highlights       JSON,
  included         JSON,
  excluded         JSON,
  itinerary        JSON,
  what_to_bring    JSON,
  tags             JSON,
  availability     JSON,
  category         VARCHAR(100),
  featured         BOOLEAN     NOT NULL DEFAULT false,
  is_published     BOOLEAN     NOT NULL DEFAULT false,
  created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

-- ========================
-- ADMIN USERS
-- ========================
CREATE TABLE IF NOT EXISTS admin_users (
  id            VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT        NOT NULL,
  role          VARCHAR(50) NOT NULL DEFAULT 'admin',
  permissions   JSON,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- CONTACT REQUESTS
-- ========================
CREATE TABLE IF NOT EXISTS contact_requests (
  id               VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  name             VARCHAR(255) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  phone            VARCHAR(50),
  subject          VARCHAR(255),
  message          TEXT        NOT NULL,
  inquiry_type     VARCHAR(50) DEFAULT 'general',
  preferred_contact VARCHAR(20) DEFAULT 'email',
  newsletter       BOOLEAN     DEFAULT false,
  status           VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ========================
-- BOOKINGS
-- ========================
CREATE TABLE IF NOT EXISTS bookings (
  id               VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  tour_id          VARCHAR(36),
  customer_name    VARCHAR(255) NOT NULL,
  customer_email   VARCHAR(255) NOT NULL,
  customer_phone   VARCHAR(50),
  start_date       DATE        NOT NULL,
  end_date         DATE        NOT NULL,
  guests           INTEGER     NOT NULL DEFAULT 1,
  total_amount     DECIMAL(10,2) NOT NULL,
  special_requests TEXT,
  status           VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at       DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE SET NULL
);

-- ========================
-- PROGRAMS
-- ========================
CREATE TABLE IF NOT EXISTS programs (
  id             VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title          VARCHAR(255) NOT NULL,
  slug           VARCHAR(255) NOT NULL UNIQUE,
  description    TEXT,
  program_type   VARCHAR(50)  DEFAULT 'volunteer',
  city_id        VARCHAR(36),
  duration_weeks INTEGER      DEFAULT 4,
  cost           DECIMAL(10,2) DEFAULT 0,
  image_url      TEXT,
  requirements   JSON,
  activities     JSON,
  is_published   BOOLEAN      NOT NULL DEFAULT false,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE SET NULL
);

-- ========================
-- BLOG POSTS
-- ========================
CREATE TABLE IF NOT EXISTS blog_posts (
  id                 VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title              VARCHAR(255) NOT NULL,
  slug               VARCHAR(255) NOT NULL UNIQUE,
  content            TEXT,
  excerpt            TEXT,
  featured_image_url TEXT,
  category           VARCHAR(100) DEFAULT 'general',
  tags               JSON,
  is_published       BOOLEAN      NOT NULL DEFAULT false,
  published_at       DATETIME,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- EVENTS
-- ========================
CREATE TABLE IF NOT EXISTS events (
  id             VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  title          VARCHAR(255) NOT NULL,
  description    TEXT,
  event_date     DATETIME     NOT NULL,
  end_date       DATETIME,
  location       VARCHAR(255),
  event_type     VARCHAR(50)  DEFAULT 'tour',
  image_url      TEXT,
  is_published   BOOLEAN      NOT NULL DEFAULT false,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- DONATION REQUESTS
-- ========================
CREATE TABLE IF NOT EXISTS donation_requests (
  id               VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  donor_name       VARCHAR(255) NOT NULL,
  donor_email      VARCHAR(255) NOT NULL,
  amount           DECIMAL(10,2) NOT NULL,
  currency         VARCHAR(10)  DEFAULT 'USD',
  donation_type    VARCHAR(50)  DEFAULT 'one-time',
  purpose          VARCHAR(255),
  status           VARCHAR(50)  NOT NULL DEFAULT 'pending',
  payment_provider VARCHAR(100),
  payment_id       VARCHAR(255),
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========================
-- VOLUNTEER APPLICATIONS
-- ========================
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id                   VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  program_id           VARCHAR(36),
  applicant_name       VARCHAR(255) NOT NULL,
  applicant_email      VARCHAR(255) NOT NULL,
  phone                VARCHAR(50),
  country              VARCHAR(100),
  date_of_birth        DATE,
  experience           TEXT,
  motivation           TEXT,
  preferred_start_date DATE,
  status               VARCHAR(50)  NOT NULL DEFAULT 'pending',
  admin_notes          TEXT,
  created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE
);

-- ========================
-- TOUR REVIEWS
-- ========================
CREATE TABLE IF NOT EXISTS tour_reviews (
  id             VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
  tour_id        VARCHAR(36),
  user_name      VARCHAR(255) NOT NULL,
  rating         INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        TEXT,
  is_verified    BOOLEAN     NOT NULL DEFAULT false,
  created_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE
);

-- ========================
-- VIEWS
-- ========================
CREATE OR REPLACE VIEW tour_stats AS
SELECT 
    t.id AS tour_id,
    COALESCE(ROUND(AVG(r.rating), 1), 0) AS average_rating,
    COUNT(r.id) AS review_count
FROM 
    tours t
LEFT JOIN 
    tour_reviews r ON t.id = r.tour_id
GROUP BY 
    t.id;

-- ========================
-- INDEXES
-- ========================
CREATE INDEX idx_tours_slug         ON tours(slug);
CREATE INDEX idx_tours_city_id      ON tours(city_id);
CREATE INDEX idx_tours_is_published ON tours(is_published);
CREATE INDEX idx_tours_featured     ON tours(featured);
CREATE INDEX idx_cities_country_id  ON cities(country_id);
CREATE INDEX idx_programs_slug      ON programs(slug);
CREATE INDEX idx_programs_city_id   ON programs(city_id);
CREATE INDEX idx_blog_posts_slug    ON blog_posts(slug);
CREATE INDEX idx_volunteer_apps_pid ON volunteer_applications(program_id);
CREATE INDEX idx_tour_reviews_tour_id ON tour_reviews(tour_id);
