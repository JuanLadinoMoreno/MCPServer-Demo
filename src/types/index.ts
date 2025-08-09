export interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  role: string;
}
export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}
export interface Branch {
  _id: string;
  name: string;
  phone: string;
}

export interface Sale {
  _id: string;
  user: User;
  totalPrice: number;
  date: string;
  items: any[];
}

export interface Product {
  _id: string;
  nombre: string;
  precio: number;
  status: string;
  stock: number;
}

export interface ApiResponse<T> {
  success: boolean;
  payload: T;
  message?: string;
}

export interface TopSeller {
  id: string;
  nombre: string;
  totalVentas: number;
}

export interface SalesRequest {
  token: string;
  branchId: string;
  month: number;
  year: number;
}