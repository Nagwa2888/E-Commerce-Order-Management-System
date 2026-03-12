import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderStateService } from '../../core/services/order-state.service';

@Component({
  selector: 'app-order-summary',
  template: `
    <mat-card *ngIf="orderStateService.getLastOrder() as order; else noOrder">
      <h2>Order Summary</h2>
      <p><strong>Order ID:</strong> {{ order.orderId }}</p>
      <p><strong>Status:</strong> {{ order.status }}</p>
      <p><strong>User:</strong> {{ order.username }}</p>
      <p><strong>Subtotal:</strong> {{ order.subtotal | currency }}</p>
      <p><strong>Discount:</strong> {{ order.discountAmount | currency }} ({{ order.discountPercentage }}%)</p>
      <p><strong>Total:</strong> {{ order.totalAmount | currency }}</p>

      <h3>Items</h3>
      <mat-list>
        <mat-list-item *ngFor="let item of order.items">
          {{ item.productName }} x {{ item.quantity }} = {{ item.lineTotal | currency }}
        </mat-list-item>
      </mat-list>
    </mat-card>

    <ng-template #noOrder>
      <mat-card>
        <p>No recent order available.</p>
        <button mat-raised-button color="primary" (click)="router.navigate(['/products'])">Back To Products</button>
      </mat-card>
    </ng-template>
  `
})
export class OrderSummaryComponent {
  constructor(public readonly orderStateService: OrderStateService, public readonly router: Router) {}
}
