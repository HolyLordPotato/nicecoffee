-- PostgreSQL schema for NiceCoffee

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  avatar TEXT,
  orders INTEGER DEFAULT 0,
  saved INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS shops (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  area TEXT,
  tag TEXT,
  img TEXT,
  rating NUMERIC(2,1) DEFAULT 0,
  mins INTEGER DEFAULT 0,
  UNIQUE(name, area)
);

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  shop_id INTEGER REFERENCES shops(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  desccription TEXT,
  cat TEXT,
  price NUMERIC(6,2) NOT NULL,
  img TEXT,
  UNIQUE(shop_id, name)
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total NUMERIC(8,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES menu_items(id),
  qty INTEGER NOT NULL,
  price NUMERIC(6,2) NOT NULL
);

-- Seed data
INSERT INTO users (name, email, avatar, orders, saved, points)
VALUES
  ('Casey Brew', 'casey@nicecoffee.app', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', 14, 6, 310)
ON CONFLICT (email) DO NOTHING;

INSERT INTO shops (name, area, tag, img, rating, mins)
VALUES
  ('Origins Coffee', 'Downtown', 'Roastery', 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80', 4.8, 8),
  ('Bean Vault', 'Riverside', 'Espresso Bar', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80', 4.6, 12),
  ('Latte Loft', 'Midtown', 'Specialty', 'https://images.unsplash.com/photo-1485686531765-ba63b07845a7?auto=format&fit=crop&w=400&q=80', 4.7, 10)
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (shop_id, name, desccription, cat, price, img)
VALUES
  (1, 'Classic Espresso', 'Rich, smooth espresso shot', 'Espresso', 3.50, 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=400&q=80'),
  (1, 'Vanilla Latte', 'Creamy latte with vanilla syrup', 'Latte', 4.95, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80'),
  (2, 'Iced Cold Brew', 'Slow-steeped cold brew coffee', 'Cold Brew', 4.50, 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=400&q=80'),
  (2, 'Matcha Tea', 'Vibrant Japanese matcha latte', 'Tea', 4.75, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=400&q=80'),
  (3, 'Caramel Macchiato', 'Espresso with steamed milk and caramel', 'Latte', 5.25, 'https://images.unsplash.com/photo-1484678879522-bdae139b8b53?auto=format&fit=crop&w=400&q=80')
ON CONFLICT DO NOTHING;
