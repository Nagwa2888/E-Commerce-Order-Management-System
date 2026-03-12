import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { OrderResponse } from '../models/order.models';

@Injectable({ providedIn: 'root' })
export class OrderStateService {
  private readonly lastOrderSubject = new BehaviorSubject<OrderResponse | null>(null);
  readonly lastOrder$ = this.lastOrderSubject.asObservable();

  setLastOrder(order: OrderResponse): void {
    this.lastOrderSubject.next(order);
  }

  getLastOrder(): OrderResponse | null {
    return this.lastOrderSubject.value;
  }
}
