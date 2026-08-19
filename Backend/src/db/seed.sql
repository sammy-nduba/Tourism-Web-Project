-- ============================================================
-- Davikiths Tours — Seed Data
-- Run after schema.sql
-- ============================================================

-- Countries
INSERT INTO countries (id, name, code, flag_emoji) VALUES
  ('11111111-0000-0000-0000-000000000001', 'Kenya',    'KE', '🇰🇪'),
  ('11111111-0000-0000-0000-000000000002', 'Uganda',   'UG', '🇺🇬'),
  ('11111111-0000-0000-0000-000000000003', 'Tanzania', 'TZ', '🇹🇿'),
  ('11111111-0000-0000-0000-000000000004', 'Rwanda',   'RW', '🇷🇼')
ON CONFLICT (code) DO NOTHING;

-- Cities — Kenya
INSERT INTO cities (id, name, country_id) VALUES
  ('22222222-0000-0000-0000-000000000001', 'Nairobi',   '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000002', 'Mombasa',   '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000003', 'Maasai Mara','11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000004', 'Amboseli',  '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000005', 'Diani',     '11111111-0000-0000-0000-000000000001'),
  ('22222222-0000-0000-0000-000000000006', 'Lamu',      '11111111-0000-0000-0000-000000000001')
ON CONFLICT DO NOTHING;

-- Cities — Uganda
INSERT INTO cities (id, name, country_id) VALUES
  ('22222222-0000-0000-0000-000000000007', 'Kampala',   '11111111-0000-0000-0000-000000000002'),
  ('22222222-0000-0000-0000-000000000008', 'Bwindi',    '11111111-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- Cities — Tanzania
INSERT INTO cities (id, name, country_id) VALUES
  ('22222222-0000-0000-0000-000000000009', 'Arusha',    '11111111-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000010', 'Serengeti', '11111111-0000-0000-0000-000000000003'),
  ('22222222-0000-0000-0000-000000000011', 'Zanzibar',  '11111111-0000-0000-0000-000000000003')
ON CONFLICT DO NOTHING;

-- Cities — Rwanda
INSERT INTO cities (id, name, country_id) VALUES
  ('22222222-0000-0000-0000-000000000012', 'Kigali',    '11111111-0000-0000-0000-000000000004'),
  ('22222222-0000-0000-0000-000000000013', 'Volcanoes', '11111111-0000-0000-0000-000000000004')
ON CONFLICT DO NOTHING;

-- Sample Tours
INSERT INTO tours (
  title, slug, description, city_id, duration_days, price,
  difficulty_level, max_group_size, min_age, physical_rating,
  image_url, category, featured, is_published,
  included, excluded, itinerary, what_to_bring, tags, availability
) VALUES
(
  'Classic Maasai Mara Safari',
  'classic-maasai-mara-safari',
  'Witness the Great Migration and encounter the Big Five in one of Africa''s most iconic wildlife reserves. This carefully crafted safari blends luxury accommodation with unparalleled game viewing.',
  '22222222-0000-0000-0000-000000000003',
  5, 2800.00, 'moderate', 12, 10, 2,
  'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200',
  'wildlife', true, true,
  '["Luxury tented camp accommodation","All meals (full board)","Professional guide","4x4 safari vehicle","Park fees","Airport transfers","Pre-departure briefing"]',
  '["International flights","Travel insurance","Visa fees","Personal expenses","Tips and gratuities","Alcohol"]',
  '[{"day":1,"title":"Arrival in Nairobi","description":"Arrive at JKIA, meet your guide, and transfer to your Nairobi hotel. Evening briefing and welcome dinner.","accommodation":"Nairobi Serena Hotel","meals":["Dinner"]},{"day":2,"title":"Fly to Mara","description":"Morning flight to Maasai Mara. Afternoon game drive spotting lions, elephants, and wildebeest.","accommodation":"Mara Luxury Tented Camp","meals":["Breakfast","Lunch","Dinner"]},{"day":3,"title":"Full Day in the Mara","description":"Full day of game drives. Witness the incredible density of wildlife across the savannah.","accommodation":"Mara Luxury Tented Camp","meals":["Breakfast","Lunch","Dinner"]},{"day":4,"title":"Hot Air Balloon Safari","description":"Optional sunrise hot air balloon flight over the Mara, followed by a champagne breakfast.","accommodation":"Mara Luxury Tented Camp","meals":["Breakfast","Lunch","Dinner"]},{"day":5,"title":"Return to Nairobi","description":"Morning game drive, then fly back to Nairobi. Transfer to airport for departure.","accommodation":"","meals":["Breakfast"]}]',
  '["Sunscreen","Hat and sunglasses","Neutral-colored clothing","Binoculars","Camera with telephoto lens","Light jacket for evenings","Comfortable walking shoes"]',
  '["Big Five","Great Migration","Luxury Safari","Tented Camp","Game Drive","Kenya"]',
  '[{"startDate":"2026-07-15","endDate":"2026-07-20","spotsAvailable":8,"totalSpots":12},{"startDate":"2026-08-10","endDate":"2026-08-15","spotsAvailable":4,"totalSpots":12},{"startDate":"2026-09-05","endDate":"2026-09-10","spotsAvailable":10,"totalSpots":12}]'
),
(
  'Gorilla Trekking Bwindi Experience',
  'gorilla-trekking-bwindi',
  'A once-in-a-lifetime encounter with mountain gorillas in their natural habitat. Trek through Bwindi Impenetrable Forest in Uganda and spend a precious hour with a gorilla family.',
  '22222222-0000-0000-0000-000000000008',
  4, 3500.00, 'challenging', 8, 16, 4,
  'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=1200',
  'trekking', true, true,
  '["Gorilla trekking permit","Lodge accommodation (3 nights)","All meals","Professional guide and trackers","Park fees","Transfers within Uganda","Pre-trek briefing"]',
  '["International flights","Uganda visa","Travel insurance","Tips","Personal shopping","Hot drinks on trail"]',
  '[{"day":1,"title":"Fly to Entebbe","description":"Arrive at Entebbe International Airport. Transfer to your lodge near Bwindi.","accommodation":"Bwindi Forest Lodge","meals":["Dinner"]},{"day":2,"title":"Gorilla Trek","description":"Early morning briefing followed by the gorilla trek. Spend 1 hour with a habituated gorilla family in the forest.","accommodation":"Bwindi Forest Lodge","meals":["Breakfast","Packed Lunch","Dinner"]},{"day":3,"title":"Cultural Village Visit","description":"Visit a local Batwa community. Learn about their traditions, crafts, and forest life.","accommodation":"Bwindi Forest Lodge","meals":["Breakfast","Lunch","Dinner"]},{"day":4,"title":"Departure","description":"Morning at leisure. Transfer back to Entebbe for departure flight.","accommodation":"","meals":["Breakfast"]}]',
  '["Sturdy hiking boots","Rain jacket","Long trousers","Gardening gloves","Insect repellent","Sun hat","Camera (no flash)","Walking stick (provided)","Energy snacks","Water (2L minimum)"]',
  '["Gorillas","Mountain Gorillas","Uganda","Trekking","Bwindi","Wildlife","Conservation"]',
  '[{"startDate":"2026-07-20","endDate":"2026-07-24","spotsAvailable":6,"totalSpots":8},{"startDate":"2026-08-18","endDate":"2026-08-22","spotsAvailable":3,"totalSpots":8}]'
),
(
  'Zanzibar Beach & Spice Retreat',
  'zanzibar-beach-spice-retreat',
  'Unwind on the turquoise shores of Zanzibar after your safari. Explore the UNESCO-listed Stone Town, tour fragrant spice plantations, and snorkel above vibrant coral reefs.',
  '22222222-0000-0000-0000-000000000011',
  6, 1800.00, 'easy', 16, 6, 1,
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200',
  'beach', false, true,
  '["Beach resort accommodation (5 nights)","Daily breakfast","Stone Town guided tour","Spice farm tour","Snorkeling trip","Airport transfers","Welcome pack"]',
  '["Flights to Zanzibar","Lunch and dinner (except welcome)","Visa fees","Travel insurance","Watersport extras","Tips"]',
  '[{"day":1,"title":"Arrive in Zanzibar","description":"Transfer from Zanzibar Airport to your beach resort. Sunset welcome drink.","accommodation":"Zanzibar Beach Resort","meals":["Breakfast"]},{"day":2,"title":"Stone Town Exploration","description":"Guided walking tour of UNESCO Stone Town: House of Wonders, Old Fort, spice market, and Freddie Mercury''s birthplace.","accommodation":"Zanzibar Beach Resort","meals":["Breakfast"]},{"day":3,"title":"Spice Farm Tour","description":"Morning tour of a traditional spice plantation. Taste cloves, vanilla, nutmeg, and cardamom.","accommodation":"Zanzibar Beach Resort","meals":["Breakfast"]},{"day":4,"title":"Snorkeling at Mnemba Atoll","description":"Boat trip to the crystal-clear waters of Mnemba Atoll. Snorkel with sea turtles and tropical fish.","accommodation":"Zanzibar Beach Resort","meals":["Breakfast"]},{"day":5,"title":"Beach Day","description":"Free day on the beach. Optional watersports, dolphin tour, or sailing on a traditional dhow.","accommodation":"Zanzibar Beach Resort","meals":["Breakfast"]},{"day":6,"title":"Departure","description":"Transfer to Zanzibar Airport for your onward journey.","accommodation":"","meals":["Breakfast"]}]',
  '["Swimwear and beach towel","Reef-safe sunscreen","Light linen clothing","Sandals","Snorkeling mask (optional)","Light scarf for Stone Town mosques","Camera"]',
  '["Zanzibar","Beach","Snorkeling","Stone Town","Spice","Tanzania","Relaxation"]',
  '[{"startDate":"2026-07-01","endDate":"2026-07-07","spotsAvailable":12,"totalSpots":16},{"startDate":"2026-08-01","endDate":"2026-08-07","spotsAvailable":16,"totalSpots":16},{"startDate":"2026-09-15","endDate":"2026-09-21","spotsAvailable":8,"totalSpots":16}]'
);

-- ========================
-- DEFAULT ADMIN USER
-- Password: Admin@123 (bcrypt hash — change via admin panel)
-- ========================
INSERT INTO admin_users (email, password_hash, role, permissions)
VALUES (
  'admin@davikithtours.com',
  '$2b$10$rKlhQQ5B5L5L5L5L5L5L5uK5vK5vK5vK5vK5vK5vK5vK5vK5vK5v',
  'superadmin',
  '["tours:read","tours:write","tours:delete","countries:read","countries:write","contacts:read","bookings:read"]'
) ON CONFLICT (email) DO NOTHING;
