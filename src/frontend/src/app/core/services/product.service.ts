import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResult, Product, ProductQuery } from '../models/product.models';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private readonly http: HttpClient) {}

  getProducts(query: ProductQuery): Observable<PagedResult<Product>> {
    let params = new HttpParams()
      .set('pageNumber', query.pageNumber)
      .set('pageSize', query.pageSize)
      .set('sortBy', query.sortBy ?? 'name')
      .set('sortDirection', query.sortDirection ?? 'asc');

    if (query.search?.trim()) {
      params = params.set('search', query.search.trim());
    }

    if (query.category?.trim()) {
      params = params.set('category', query.category.trim());
    }

    return this.http.get<PagedResult<Product>>(`${environment.apiBaseUrl}/products`, { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${environment.apiBaseUrl}/products/${id}`);
  }

  createProduct(payload: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${environment.apiBaseUrl}/products`, payload);
  }

  updateProduct(id: string, payload: Omit<Product, 'id'>): Observable<Product> {
    return this.http.put<Product>(`${environment.apiBaseUrl}/products/${id}`, payload);
  }
}
