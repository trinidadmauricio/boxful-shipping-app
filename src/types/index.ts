export interface User {
  id: string;
  email: string;
  name: string;
  lastName: string;
  sex?: string;
  birthDate?: string;
  phone: string;
  phoneCode: string;
  createdAt: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  lastName: string;
  sex?: string;
  birthDate?: string;
  email: string;
  phone: string;
  phoneCode?: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface PackageItem {
  content: string;
  weight: number;
  length: number;
  height: number;
  width: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  pickupAddress: string;
  scheduledDate: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  phoneCode: string;
  deliveryAddress: string;
  department: string;
  municipality: string;
  reference?: string;
  instructions?: string;
  packages: PackageItem[];
  isCod: boolean;
  codExpectedAmount?: number;
  codCollectedAmount?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  deliveredAt?: string;
}

export interface CreateOrderPayload {
  pickupAddress: string;
  scheduledDate: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  phoneCode?: string;
  deliveryAddress: string;
  department: string;
  municipality: string;
  reference?: string;
  instructions?: string;
  packages: PackageItem[];
  isCod?: boolean;
  codExpectedAmount?: number;
}

export interface OrderFilters {
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedOrders {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
