export interface PizzaType {
_id: string;
  name: string;
  category: string;
  price: number | string;
  description: string;
  available: boolean;
  featured?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  vendor: Vendor;
  image: string;
}

export interface Vendor {
  id: string;
  name: string;
  image: string;
}

export interface StatusType {
  status: "pending" | "approved" | "rejected";
}

export interface OrderType{
  orderstate: | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
}