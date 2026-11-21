export type MenuItem = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
};

export const MENU_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export const checkoutVerify = async (sessionId: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/checkout-verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
    })

    return response.json()
}