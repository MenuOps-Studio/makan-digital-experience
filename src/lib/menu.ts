import { supabase } from "@/integrations/supabase/client";

export type Category = {
  id: string;
  slug: string;
  name_el: string;
  name_en: string;
  icon: string | null;
  sort_order: number;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name_el: string;
  name_en: string;
  description_el: string | null;
  description_en: string | null;
  price: number;
  currency: string;
  badges: string[];
  is_featured: boolean;
  is_best_seller: boolean;
  sort_order: number;
};

export async function fetchMenu(): Promise<{ categories: any[]; items: any[] }> {
  const { data, error } = await (supabase as any)
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", 4)
    .neq("status", "HIDDEN") // Φέρνει τα ΠΑΝΤΑ, εκτός από αυτά που έχουν "Απόκρυψη"
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Supabase error:", error);
    throw error;
  }

  // "Εκπαίδευση" των δεδομένων για να ταιριάζουν ακριβώς σε αυτό που περιμένει το React
  const items = (data ?? []).map((i: any) => {
    const catName = i.category_el || i.category;
    
    return {
      ...i,
      price: Number(i.price),
      category_id: catName, // Συνδέει το προϊόν με τη σωστή κατηγορία στο μενού
      is_featured: i.is_chef_choice, // Φέρνει τα "Chef's Choice" στην αρχική σελίδα
      currency: "€",
      badges: i.is_chef_choice ? ["SIGNATURE"] : [], // Προσθέτει δυναμικά το ταμπελάκι
    };
  });

  // Δημιουργία των κατηγοριών δυναμικά
  const uniqueCats = new Map();
  items.forEach((item: any) => {
    const catNameEl = item.category_el || item.category;
    if (!catNameEl) return;
    
    if (!uniqueCats.has(catNameEl)) {
      uniqueCats.set(catNameEl, {
        id: catNameEl, 
        slug: catNameEl.toLowerCase().replace(/\s+/g, '-'),
        name_el: catNameEl,
        name_en: item.category_en || catNameEl
      });
    }
  });

  return {
    categories: Array.from(uniqueCats.values()),
    items: items,
  };
}