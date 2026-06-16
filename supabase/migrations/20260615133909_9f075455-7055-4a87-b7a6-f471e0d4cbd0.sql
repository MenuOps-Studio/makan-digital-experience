
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_el TEXT NOT NULL,
  name_en TEXT NOT NULL,
  icon TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (is_active = true);

CREATE TABLE public.menu_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name_el TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_el TEXT,
  description_en TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  image_url TEXT,
  badges TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_best_seller BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.menu_items TO anon, authenticated;
GRANT ALL ON public.menu_items TO service_role;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Menu items are publicly readable" ON public.menu_items FOR SELECT USING (is_active = true);

CREATE INDEX idx_menu_items_category ON public.menu_items(category_id);

-- Seed categories
INSERT INTO public.categories (slug, name_el, name_en, icon, sort_order) VALUES
  ('nargile', 'Ναργιλέδες', 'Hookah', 'flame', 1),
  ('cocktails', 'Cocktails', 'Cocktails', 'martini', 2),
  ('spirits', 'Ποτά', 'Spirits', 'wine', 3),
  ('coffee', 'Καφές', 'Coffee', 'coffee', 4),
  ('hot-drinks', 'Ζεστά Ροφήματα', 'Hot Drinks', 'cup-soda', 5),
  ('cold-drinks', 'Κρύα Ροφήματα', 'Cold Drinks', 'glass-water', 6),
  ('snacks', 'Snacks', 'Snacks', 'utensils', 7);

-- Seed items
WITH c AS (SELECT id, slug FROM public.categories)
INSERT INTO public.menu_items (category_id, name_el, name_en, description_el, description_en, price, badges, is_featured, is_best_seller, sort_order) VALUES
  ((SELECT id FROM c WHERE slug='nargile'), 'Makan Signature', 'Makan Signature', 'Premium μείγμα γεύσεων με παγωμένα φρούτα και μέντα', 'Premium flavor blend with iced fruits and mint', 15.00, ARRAY['signature','best-seller'], true, true, 1),
  ((SELECT id FROM c WHERE slug='nargile'), 'Διπλό Μήλο', 'Double Apple', 'Κλασική γεύση με γλυκόπικρο διπλό μήλο', 'Classic sweet-bitter double apple flavor', 12.00, ARRAY['classic'], false, true, 2),
  ((SELECT id FROM c WHERE slug='nargile'), 'Παγωμένη Μέντα', 'Iced Mint', 'Δροσιστική μέντα με παγωμένη γεύση', 'Refreshing mint with an icy finish', 12.00, ARRAY[]::TEXT[], false, false, 3),
  ((SELECT id FROM c WHERE slug='nargile'), 'Φρούτα του Δάσους', 'Forest Fruits', 'Μείγμα από βατόμουρο, μύρτιλο και φράουλα', 'Blend of blackberry, blueberry and strawberry', 13.00, ARRAY['new'], true, false, 4),
  ((SELECT id FROM c WHERE slug='nargile'), 'Λεμόνι & Τζίντζερ', 'Lemon & Ginger', 'Τονωτικός συνδυασμός εσπεριδοειδών και τζίντζερ', 'Invigorating citrus and ginger combo', 13.00, ARRAY[]::TEXT[], false, false, 5),

  ((SELECT id FROM c WHERE slug='cocktails'), 'Old Fashioned', 'Old Fashioned', 'Bourbon, ζάχαρη, angostura bitters, φλούδα πορτοκαλιού', 'Bourbon, sugar, angostura bitters, orange peel', 11.00, ARRAY['signature'], true, false, 1),
  ((SELECT id FROM c WHERE slug='cocktails'), 'Negroni', 'Negroni', 'Gin, Campari, sweet vermouth', 'Gin, Campari, sweet vermouth', 10.00, ARRAY[]::TEXT[], false, true, 2),
  ((SELECT id FROM c WHERE slug='cocktails'), 'Espresso Martini', 'Espresso Martini', 'Vodka, espresso, καφέ λικέρ', 'Vodka, espresso, coffee liqueur', 10.00, ARRAY['best-seller'], false, true, 3),
  ((SELECT id FROM c WHERE slug='cocktails'), 'Mojito', 'Mojito', 'Λευκό ρούμι, μέντα, λάιμ, σόδα', 'White rum, mint, lime, soda', 9.00, ARRAY[]::TEXT[], false, false, 4),
  ((SELECT id FROM c WHERE slug='cocktails'), 'Aperol Spritz', 'Aperol Spritz', 'Aperol, prosecco, σόδα', 'Aperol, prosecco, soda', 9.00, ARRAY[]::TEXT[], false, false, 5),

  ((SELECT id FROM c WHERE slug='spirits'), 'Premium Whisky', 'Premium Whisky', 'Επιλογή από single malt whisky', 'Selection of single malt whisky', 9.00, ARRAY[]::TEXT[], false, false, 1),
  ((SELECT id FROM c WHERE slug='spirits'), 'Gin Tonic', 'Gin & Tonic', 'Premium gin με tonic της επιλογής σας', 'Premium gin with tonic of your choice', 8.00, ARRAY[]::TEXT[], false, false, 2),
  ((SELECT id FROM c WHERE slug='spirits'), 'Vodka', 'Vodka', 'Premium vodka, σερβίρεται με την επιλογή σας', 'Premium vodka, served as you prefer', 7.00, ARRAY[]::TEXT[], false, false, 3),
  ((SELECT id FROM c WHERE slug='spirits'), 'Tequila', 'Tequila', 'Reposado tequila, σε σφηνάκι ή long', 'Reposado tequila, shot or long drink', 8.00, ARRAY[]::TEXT[], false, false, 4),

  ((SELECT id FROM c WHERE slug='coffee'), 'Espresso', 'Espresso', 'Single origin espresso', 'Single origin espresso', 2.50, ARRAY[]::TEXT[], false, false, 1),
  ((SELECT id FROM c WHERE slug='coffee'), 'Cappuccino', 'Cappuccino', 'Espresso με βελούδινο αφρό γάλακτος', 'Espresso with velvety milk foam', 3.50, ARRAY[]::TEXT[], false, false, 2),
  ((SELECT id FROM c WHERE slug='coffee'), 'Freddo Espresso', 'Freddo Espresso', 'Παγωμένος espresso με αφρόγαλα', 'Iced espresso with frothed milk', 3.50, ARRAY['best-seller'], false, true, 3),
  ((SELECT id FROM c WHERE slug='coffee'), 'Freddo Cappuccino', 'Freddo Cappuccino', 'Παγωμένος cappuccino με κρεμώδη αφρό', 'Iced cappuccino with creamy foam', 4.00, ARRAY['best-seller'], false, true, 4),

  ((SELECT id FROM c WHERE slug='hot-drinks'), 'Σοκολάτα', 'Hot Chocolate', 'Πλούσια ζεστή σοκολάτα', 'Rich hot chocolate', 4.50, ARRAY[]::TEXT[], false, false, 1),
  ((SELECT id FROM c WHERE slug='hot-drinks'), 'Τσάι', 'Tea', 'Επιλογή premium τσαγιού', 'Selection of premium teas', 3.50, ARRAY[]::TEXT[], false, false, 2),

  ((SELECT id FROM c WHERE slug='cold-drinks'), 'Φυσικός Χυμός', 'Fresh Juice', 'Φρεσκοστυμμένος χυμός εποχής', 'Freshly squeezed seasonal juice', 4.50, ARRAY['vegan'], false, false, 1),
  ((SELECT id FROM c WHERE slug='cold-drinks'), 'Λεμονάδα', 'Homemade Lemonade', 'Σπιτική λεμονάδα με μέντα', 'Homemade lemonade with mint', 4.00, ARRAY['vegan'], false, false, 2),
  ((SELECT id FROM c WHERE slug='cold-drinks'), 'Αναψυκτικά', 'Soft Drinks', 'Coca Cola, Sprite, Fanta, Soda', 'Coca Cola, Sprite, Fanta, Soda', 3.00, ARRAY[]::TEXT[], false, false, 3),

  ((SELECT id FROM c WHERE slug='snacks'), 'Πιατέλα Αλλαντικών', 'Charcuterie Board', 'Επιλογή premium αλλαντικών και τυριών', 'Selection of premium cured meats and cheeses', 14.00, ARRAY['signature'], true, false, 1),
  ((SELECT id FROM c WHERE slug='snacks'), 'Πατάτες Τρούφας', 'Truffle Fries', 'Πατάτες με λάδι τρούφας και παρμεζάνα', 'Fries with truffle oil and parmesan', 7.50, ARRAY['best-seller'], false, true, 2),
  ((SELECT id FROM c WHERE slug='snacks'), 'Φέτα Ψητή', 'Baked Feta', 'Φέτα με μέλι, σουσάμι και θυμάρι', 'Feta with honey, sesame and thyme', 6.50, ARRAY['vegetarian'], false, false, 3),
  ((SELECT id FROM c WHERE slug='snacks'), 'Bruschetta', 'Bruschetta', 'Καβουρδισμένο ψωμί με ντομάτα και βασιλικό', 'Toasted bread with tomato and basil', 5.50, ARRAY['vegan'], false, false, 4);
