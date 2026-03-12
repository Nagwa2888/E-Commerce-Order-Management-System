import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../models/product.models';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  availableStock: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly itemsSubject = new BehaviorSubject<CartItem[]>([]);
  readonly items$ = this.itemsSubject.asObservable();

  get items(): CartItem[] {
    return this.itemsSubject.value;
  }

  addToCart(product: Product, quantity: number): void {
    if (quantity <= 0) {
      return;
    }

    const existing = this.items.find((i) => i.productId === product.id);
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, product.stockQuantity);
      this.itemsSubject.next([...this.items]);
      return;
    }

    this.itemsSubject.next([
      ...this.items,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: Math.min(quantity, product.stockQuantity),
        availableStock: product.stockQuantity
      }
    ]);
  }

  updateQuantity(productId: string, quantity: number): void {
    const nextItems = this.items
      .map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const boundedQuantity = Math.max(1, Math.min(quantity, item.availableStock));
        return { ...item, quantity: boundedQuantity };
      });

    this.itemsSubject.next(nextItems);
  }

  remove(productId: string): void {
    this.itemsSubject.next(this.items.filter((item) => item.productId !== productId));
  }

  clear(): void {
    this.itemsSubject.next([]);
  }

  getSubtotal(): number {
    return this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
