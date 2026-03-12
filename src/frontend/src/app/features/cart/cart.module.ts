import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './cart.component';
import { MaterialModule } from '../../shared/material.module';
import { CartRoutingModule } from './cart-routing.module';

@NgModule({
  declarations: [CartComponent],
  imports: [CommonModule, FormsModule, MaterialModule, CartRoutingModule]
})
export class CartModule {}
