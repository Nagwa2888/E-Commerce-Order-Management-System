import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './product-list.component';
import { ProductDetailsComponent } from './product-details.component';
import { ProductFormComponent } from './product-form.component';
import { ProductsRoutingModule } from './products-routing.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [ProductListComponent, ProductDetailsComponent, ProductFormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule, ProductsRoutingModule]
})
export class ProductsModule {}
