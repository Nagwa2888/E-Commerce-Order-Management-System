import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product.models';
import { CartService } from '../../core/services/cart.service';
import { NotificationService } from '../../core/services/notification.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: false,
  template: `
    <mat-card *ngIf="product">
      <h2>{{ product.name }}</h2>
      <p>{{ product.description }}</p>
      <p><strong>Category:</strong> {{ product.category }}</p>
      <p><strong>Price:</strong> {{ product.price | currency }}</p>
      <p><strong>In Stock:</strong> {{ product.stockQuantity }}</p>

      <div class="row">
        <mat-form-field appearance="outline">
          <mat-label>Quantity</mat-label>
          <input matInput type="number" [(ngModel)]="quantity" min="1" [max]="product.stockQuantity" />
        </mat-form-field>
        <button mat-raised-button color="primary" (click)="addToCart()">Add To Cart</button>
      </div>
    </mat-card>
  `,
  styles: [`.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}`]
})
export class ProductDetailsComponent implements OnInit {
  product?: Product;
  quantity = 1;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productService: ProductService,
    private readonly cartService: CartService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.productService.getProductById(id).subscribe((result) => {
      this.product = result;
    });
  }

  addToCart(): void {
    if (!this.product) {
      return;
    }

    this.cartService.addToCart(this.product, this.quantity);
    this.notificationService.success('Item added to cart.');
  }
}
