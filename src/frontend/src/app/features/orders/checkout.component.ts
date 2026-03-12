import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { OrderService } from '../../core/services/order.service';
import { OrderStateService } from '../../core/services/order-state.service';

@Component({
  selector: 'app-checkout',
  template: `
    <mat-card>
      <h2>Checkout</h2>
      <p *ngIf="cartService.items.length === 0">Your cart is empty.</p>

      <mat-list>
        <mat-list-item *ngFor="let item of cartService.items">
          {{ item.name }} x {{ item.quantity }} = {{ item.price * item.quantity | currency }}
        </mat-list-item>
      </mat-list>

      <mat-form-field appearance="outline">
        <mat-label>Discount %</mat-label>
        <input matInput type="number" min="0" max="100" [(ngModel)]="discountPercentage" />
      </mat-form-field>

      <h3>Subtotal: {{ cartService.getSubtotal() | currency }}</h3>
      <h3>Total: {{ calculateTotal() | currency }}</h3>

      <button mat-raised-button color="primary" [disabled]="cartService.items.length === 0 || isSubmitting" (click)="placeOrder()">Complete Order</button>
    </mat-card>
  `
})
export class CheckoutComponent {
  discountPercentage = 0;
  isSubmitting = false;

  constructor(
    public readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly orderStateService: OrderStateService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  calculateTotal(): number {
    const subtotal = this.cartService.getSubtotal();
    return subtotal - (subtotal * this.discountPercentage / 100);
  }

  placeOrder(): void {
    this.isSubmitting = true;

    this.orderService.createOrder({
      discountPercentage: this.discountPercentage,
      items: this.cartService.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }).subscribe({
      next: (result) => {
        this.orderStateService.setLastOrder(result);
        this.cartService.clear();
        this.notificationService.success('Order completed successfully.');
        this.router.navigate(['/orders/summary']);
      },
      error: () => {
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
