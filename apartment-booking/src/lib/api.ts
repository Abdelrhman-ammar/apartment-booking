import { Apartment } from '../types/apartment';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function getApartments(page: number = 1, limit: number = 10): Promise<{ data: Apartment[], status: number }> {
  try {
    const response = await fetch(`${API_URL}/apartments?page=${page}&limit=${limit}`);

    const result = await response.json();
    return { data: result.data || [], status: response.status };
  } catch (error) {
    console.error('Error fetching apartments:', error);
    return { data: [], status: 500 };
  }
}

export async function getApartmentById(id: number): Promise<{ data: Apartment | null, status: number }> {
  try {
    const response = await fetch(`${API_URL}/apartments/${id}`);
    const result = await response.json();
    return { data: result.data, status: response.status };
  } catch (error) {
    console.error(`Error fetching apartment with id ${id}:`, error);
    return { data: null, status: 500 };
  }
}
