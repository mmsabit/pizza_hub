export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
};

export const FREE_MENU_LIMIT = 3;

export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];
