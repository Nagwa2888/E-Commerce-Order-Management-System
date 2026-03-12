import { Component } from '@angular/core';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-notifications-page',
  standalone: false,
  template: `
    <mat-card>
      <h2>Notification Center</h2>
      <button mat-stroked-button color="primary" (click)="notificationService.markAllRead()">Mark All Read</button>

      <mat-list>
        <mat-list-item *ngFor="let n of notificationService.notifications$ | async">
          <div class="line">
            <span>[{{ n.type | uppercase }}] {{ n.message }}</span>
            <small>{{ n.createdAtUtc | date: 'short' }}</small>
          </div>
        </mat-list-item>
      </mat-list>
    </mat-card>
  `,
  styles: [`.line{display:flex;justify-content:space-between;gap:8px;width:100%}`]
})
export class NotificationsPageComponent {
  constructor(public readonly notificationService: NotificationService) {}
}
