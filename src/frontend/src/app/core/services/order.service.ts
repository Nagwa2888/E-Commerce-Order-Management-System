import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderRequest, OrderResponse } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private readonly http: HttpClient) {}

  createOrder(payload: CreateOrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${environment.apiBaseUrl}/orders`, payload);
  }
}
