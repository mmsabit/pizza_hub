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

export type OrderStateType =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'


export interface OrderVendor {
  id: string;
  name: string;
  image:string
}

export interface OrderCustomer {
  name: string;
  phone: string;
  address: string;
  note: string;
  id: string;
}

export interface OrderType {
  _id: string;
  menuId: string;
  menuName: string;
  menuImage:string;
  vendor: OrderVendor;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  payment: string ;
  order_status: OrderStateType;
  customer: OrderCustomer;
}