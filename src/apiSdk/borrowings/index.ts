import axios from 'axios';
import queryString from 'query-string';
import { BorrowingInterface, BorrowingGetQueryInterface } from 'interfaces/borrowing';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';

export const getBorrowings = async (
  query?: BorrowingGetQueryInterface,
): Promise<PaginatedInterface<BorrowingInterface>> => {
  const response = await axios.get('/api/borrowings', {
    params: query,
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const createBorrowing = async (borrowing: BorrowingInterface) => {
  const response = await axios.post('/api/borrowings', borrowing);
  return response.data;
};

export const updateBorrowingById = async (id: string, borrowing: BorrowingInterface) => {
  const response = await axios.put(`/api/borrowings/${id}`, borrowing);
  return response.data;
};

export const getBorrowingById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/borrowings/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBorrowingById = async (id: string) => {
  const response = await axios.delete(`/api/borrowings/${id}`);
  return response.data;
};
