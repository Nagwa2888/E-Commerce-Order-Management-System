import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { OrderSummaryComponent } from './order-summary.component';
import { NotificationsPageComponent } from './notifications-page.component';

const routes: Routes = [
  { path: 'checkout', component: CheckoutComponent },
  { path: 'summary', component: OrderSummaryComponent },
  { path: 'notifications', component: NotificationsPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'checkout' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule {}
