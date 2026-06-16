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

export async function fetchMenu(): Promise<{ categories: Category[]; items: MenuItem[] }> {
  const [catsRes, itemsRes] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("menu_items").select("*").eq("is_active", true).order("sort_order"),
  ]);
  if (catsRes.error) throw catsRes.error;
  if (itemsRes.error) throw itemsRes.error;
  return {
    categories: (catsRes.data ?? []) as Category[],
    items: (itemsRes.data ?? []).map((i: any) => ({ ...i, price: Number(i.price) })) as MenuItem[],
  };
}
