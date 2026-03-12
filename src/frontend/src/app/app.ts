import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';
import { NotificationRealtimeService } from './core/services/notification-realtime.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App implements OnInit {
  unreadCount$: Observable<number>;

  constructor(
    public readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly notificationRealtimeService: NotificationRealtimeService,
    private readonly router: Router
  ) {
    this.unreadCount$ = this.notificationService.unreadCount$;
  }

  ngOnInit(): void {
    this.notificationRealtimeService.start();
  }

  logout(): void {
    this.authService.logout();
    this.notificationService.info('You have been logged out.');
    this.router.navigate(['/login']);
  }
}
