export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stockQuantity: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface ProductQuery {
  pageNumber: number;
  pageSize: number;
  search?: string;
  category?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
