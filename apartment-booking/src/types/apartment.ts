export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Apartment {
  id: number;
  unitName: string;
  unitNumber?: string;
  project?: string;
  description?: string;
  price: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  available?: boolean;
  features?: string[];
  images?: string[];
  ownerId?: number;
  owner?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApartmentListResponse {
  data: Apartment[];
  status: number;
}

export interface ApartmentDetailResponse {
  data: Apartment | null;
  status: number;
}
