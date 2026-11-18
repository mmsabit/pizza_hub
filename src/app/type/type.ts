export interface PizzaType {
_id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  status: 'pending' | 'approved' | 'rejected';
  vendor: Vendor;
  image: string;
}

export interface Vendor {
  id: string;
  name: string;
  image: string;
}