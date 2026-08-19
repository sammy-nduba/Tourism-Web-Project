-- ============================================================
-- Davikiths Tours — Seed Admin User
-- Run this once in phpMyAdmin against your davikith_tours database
-- ============================================================

-- Insert admin user with pre-hashed password (Davikith2026!)
-- To change the password later, generate a new bcrypt hash and update password_hash.
INSERT INTO admin_users (id, email, password_hash, role, permissions)
VALUES (
  UUID(),
  'admin@davikithtours.com',
  '$2a$10$JW/f.sOqd6i942HFaYR6J.QxTKoNYtYZHkDiOuHje5jklWpUuYWbq',
  'superadmin',
  JSON_ARRAY('tours:create', 'tours:read', 'tours:update', 'tours:delete',
             'countries:create', 'countries:read', 'countries:update', 'countries:delete',
             'cities:create', 'cities:read', 'cities:update', 'cities:delete',
             'programs:manage', 'blog:manage', 'events:manage',
             'contacts:read', 'contacts:update',
             'bookings:read', 'bookings:update',
             'volunteers:read', 'volunteers:update',
             'donations:read', 'uploads:manage')
);
