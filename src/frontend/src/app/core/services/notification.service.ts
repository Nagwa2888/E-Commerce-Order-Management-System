import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationMessage, NotificationType } from '../models/notification.models';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsSubject = new BehaviorSubject<NotificationMessage[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  private readonly unreadCountSubject = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  notify(type: NotificationType, message: string, autoDismissMs = 5000): void {
    const notification: NotificationMessage = {
      id: crypto.randomUUID(),
      type,
      message,
      createdAtUtc: new Date().toISOString(),
      read: false
    };

    this.notificationsSubject.next([notification, ...this.notificationsSubject.value]);
    this.unreadCountSubject.next(this.unreadCountSubject.value + 1);

    if (autoDismissMs > 0) {
      setTimeout(() => this.close(notification.id), autoDismissMs);
    }
  }

  success(message: string): void { this.notify('success', message); }
  error(message: string): void { this.notify('error', message, 7000); }
  warning(message: string): void { this.notify('warning', message, 6000); }
  info(message: string): void { this.notify('info', message); }

  close(id: string): void {
    this.notificationsSubject.next(this.notificationsSubject.value.filter((n) => n.id !== id));
  }

  markAllRead(): void {
    const current = this.notificationsSubject.value.map((n) => ({ ...n, read: true }));
    this.notificationsSubject.next(current);
    this.unreadCountSubject.next(0);
  }
}
