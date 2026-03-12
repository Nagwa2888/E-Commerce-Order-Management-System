import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Product, ProductQuery } from '../../core/models/product.models';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: false,
  template: `
    <mat-card>
      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput [(ngModel)]="query.search" (keyup.enter)="load()" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Category</mat-label>
          <input matInput [(ngModel)]="query.category" (keyup.enter)="load()" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Sort By</mat-label>
          <mat-select [(ngModel)]="query.sortBy" (selectionChange)="load()">
            <mat-option value="name">Name</mat-option>
            <mat-option value="price">Price</mat-option>
            <mat-option value="category">Category</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Direction</mat-label>
          <mat-select [(ngModel)]="query.sortDirection" (selectionChange)="load()">
            <mat-option value="asc">Ascending</mat-option>
            <mat-option value="desc">Descending</mat-option>
          </mat-select>
        </mat-form-field>

        <button mat-raised-button color="primary" (click)="load()">Apply</button>
      </div>

      <div class="grid">
        <mat-card class="item" *ngFor="let product of products">
          <h3>{{ product.name }}</h3>
          <p>{{ product.description }}</p>
          <mat-chip-set>
            <mat-chip>{{ product.category }}</mat-chip>
            <mat-chip>Stock: {{ product.stockQuantity }}</mat-chip>
          </mat-chip-set>
          <strong>{{ product.price | currency }}</strong>
          <div class="actions">
            <button mat-button color="primary" [routerLink]="['/products', product.id]">Details</button>
            <button mat-button color="accent" *ngIf="authService.getRole() === 'Admin'" [routerLink]="['/admin', product.id, 'edit']">Edit</button>
          </div>
        </mat-card>
      </div>

      <mat-paginator [length]="totalCount" [pageSize]="query.pageSize" [pageSizeOptions]="[5,10,20]" (page)="pageChanged($event)"></mat-paginator>
    </mat-card>
  `,
  styles: [
    `.filters{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;align-items:end}`,
    `.grid{margin-top:16px;display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}`,
    `.item{display:flex;flex-direction:column;gap:10px}`,
    `.actions{display:flex;gap:8px}`
  ]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  totalCount = 0;

  query: ProductQuery = {
    pageNumber: 1,
    pageSize: 10,
    search: '',
    category: '',
    sortBy: 'name',
    sortDirection: 'asc'
  };

  constructor(
    private readonly productService: ProductService,
    public readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.productService.getProducts(this.query).subscribe((result) => {
      this.products = result.items;
      this.totalCount = result.totalCount;
    });
  }

  pageChanged(event: PageEvent): void {
    this.query.pageNumber = event.pageIndex + 1;
    this.query.pageSize = event.pageSize;
    this.load();
  }
}
