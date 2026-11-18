export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
};

export type MenuDraft = Omit<MenuItem, "id">;

export const MENU_CATEGORIES = ["Pizza", "Sides", "Drinks", "Desserts"];
