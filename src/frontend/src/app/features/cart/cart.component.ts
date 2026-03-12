import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: false,
  template: `
    <mat-card>
      <h2>Cart</h2>
      <div *ngIf="cartService.items.length === 0">Your cart is empty.</div>

      <mat-list>
        <mat-list-item *ngFor="let item of cartService.items">
          <div class="line">
            <span>{{ item.name }} ({{ item.price | currency }})</span>
            <input type="number" min="1" [max]="item.availableStock" [ngModel]="item.quantity" (ngModelChange)="update(item.productId, $event)" />
            <button mat-button color="warn" (click)="remove(item.productId)">Remove</button>
          </div>
        </mat-list-item>
      </mat-list>

      <h3>Subtotal: {{ cartService.getSubtotal() | currency }}</h3>
      <button mat-raised-button color="primary" [disabled]="cartService.items.length === 0" (click)="checkout()">Proceed To Checkout</button>
    </mat-card>
  `,
  styles: [`.line{display:flex;align-items:center;gap:10px;width:100%;justify-content:space-between} input{width:70px}`]
})
export class CartComponent {
  constructor(public readonly cartService: CartService, private readonly router: Router) {}

  update(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, Number(quantity));
  }

  remove(productId: string): void {
    this.cartService.remove(productId);
  }

  checkout(): void {
    this.router.navigate(['/orders/checkout']);
  }
}
