import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

export type Property = {
  id: string;
  address: string;
  price: number;
};

export type Favourite = {
  id: number;
  propertyId: string;
};

export type LoginResponse = {
  access_token: string;
  user: any;
};

export async function login(data: LoginInput): Promise<LoginResponse> {
  const res = await axios.post(`${API_BASE_URL}/auth/login`, data);
  return res.data;
}

export async function register(data: RegisterInput): Promise<void> {
  await axios.post(`${API_BASE_URL}/user/register`, data);
}

export async function fetchProperties(): Promise<Property[]> {
  const res = await axios.get(`${API_BASE_URL}/properties`);
  return res.data;
}

export async function fetchFavourites(token: string): Promise<Favourite[]> {
  const res = await axios.get(`${API_BASE_URL}/favourites`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function addFavourite(token: string, propertyId: string): Promise<void> {
  await axios.post(`${API_BASE_URL}/favourites/${propertyId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function removeFavourite(token: string, propertyId: string): Promise<void> {
  await axios.delete(`${API_BASE_URL}/favourites/${propertyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
