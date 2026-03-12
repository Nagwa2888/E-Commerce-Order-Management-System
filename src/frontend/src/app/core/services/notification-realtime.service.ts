import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class NotificationRealtimeService {
  private hubConnection?: signalR.HubConnection;

  constructor(
    private readonly notificationService: NotificationService,
    private readonly authService: AuthService
  ) {}

  start(): void {
    if (this.hubConnection) {
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.signalRUrl, {
        accessTokenFactory: () => this.authService.getToken() ?? ''
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('notification', (payload: { type: 'success' | 'error' | 'warning' | 'info'; message: string; }) => {
      this.notificationService.notify(payload.type, payload.message, 5000);
    });

    this.hubConnection.start().catch(() => {
      this.notificationService.warning('Real-time notification channel is not available.');
    });
  }
}
