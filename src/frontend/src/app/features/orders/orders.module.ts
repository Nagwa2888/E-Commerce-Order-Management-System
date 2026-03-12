import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { OrdersRoutingModule } from './orders-routing.module';
import { CheckoutComponent } from './checkout.component';
import { OrderSummaryComponent } from './order-summary.component';
import { NotificationsPageComponent } from './notifications-page.component';

@NgModule({
  declarations: [CheckoutComponent, OrderSummaryComponent, NotificationsPageComponent],
  imports: [CommonModule, FormsModule, MaterialModule, OrdersRoutingModule]
})
export class OrdersModule {}
