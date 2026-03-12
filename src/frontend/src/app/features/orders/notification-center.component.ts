import { Component } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notification-center',
  standalone: false,
  template: `
    <div class="stack">
      <div class="toast" *ngFor="let n of notificationService.notifications$ | async" [ngClass]="n.type">
        <div class="content">
          <strong>{{ n.type | titlecase }}</strong>
          <p>{{ n.message }}</p>
        </div>
        <button mat-icon-button (click)="notificationService.close(n.id)"><mat-icon>close</mat-icon></button>
      </div>
    </div>
  `,
  styles: [
    `.stack{position:fixed;right:14px;bottom:14px;z-index:2000;display:flex;flex-direction:column;gap:10px;max-width:380px}`,
    `.toast{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;border-radius:10px;padding:10px 12px;box-shadow:0 8px 24px rgba(0,0,0,.15);background:white}`,
    `.content p{margin:.2rem 0 0}`,
    `.success{border-left:5px solid #2e7d32}`,
    `.error{border-left:5px solid #c62828}`,
    `.warning{border-left:5px solid #ef6c00}`,
    `.info{border-left:5px solid #1565c0}`
  ]
})
export class NotificationCenterComponent {
  constructor(public readonly notificationService: NotificationService) {}
}
