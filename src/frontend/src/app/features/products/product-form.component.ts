import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-product-form',
  standalone: false,
  template: `
    <mat-card>
      <h2>{{ editMode ? 'Edit Product' : 'Create Product' }}</h2>
      <form [formGroup]="form" (ngSubmit)="save()" class="form">
        <mat-form-field appearance="outline"><mat-label>Name</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Category</mat-label><input matInput formControlName="category" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Description</mat-label><textarea matInput formControlName="description"></textarea></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Price</mat-label><input matInput type="number" formControlName="price" min="1" /></mat-form-field>
        <mat-form-field appearance="outline"><mat-label>Stock</mat-label><input matInput type="number" formControlName="stockQuantity" min="0" /></mat-form-field>
        <button mat-raised-button color="primary" [disabled]="form.invalid">Save</button>
      </form>
    </mat-card>
  `,
  styles: [`.form{display:grid;grid-template-columns:1fr;gap:10px;max-width:600px}`]
})
export class ProductFormComponent implements OnInit {
  productId?: string;
  editMode = false;
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    name: ['', Validators.required],
    category: ['', Validators.required],
    description: ['', Validators.required],
    price: [1, [Validators.required, Validators.min(1)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productService: ProductService,
    private readonly notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? undefined;
    if (!this.productId) {
      return;
    }

    this.editMode = true;
    this.productService.getProductById(this.productId).subscribe((product) => {
      this.form.patchValue(product);
    });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = this.form.getRawValue() as { name: string; category: string; description: string; price: number; stockQuantity: number };

    if (!this.editMode) {
      this.productService.createProduct(payload).subscribe(() => {
        this.notificationService.success('Product created successfully.');
        this.router.navigate(['/products']);
      });
      return;
    }

    this.productService.updateProduct(this.productId!, payload).subscribe(() => {
      this.notificationService.success('Product updated successfully.');
      this.router.navigate(['/products']);
    });
  }
}
