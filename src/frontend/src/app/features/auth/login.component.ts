import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: false,
  template: `
    <mat-card class="card">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <mat-form-field appearance="outline">
          <mat-label>Username</mat-label>
          <input matInput formControlName="username" />
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput type="password" formControlName="password" />
        </mat-form-field>

        <button mat-raised-button color="primary" [disabled]="form.invalid || isSubmitting">Login</button>
      </form>

      <small>Demo admin: admin / Admin123!</small>
      <small>Demo customer: customer / Customer123!</small>
    </mat-card>
  `,
  styles: [
    `.card{max-width:420px;margin:40px auto;padding:20px;display:flex;flex-direction:column;gap:12px}`,
    `form{display:flex;flex-direction:column;gap:10px}`,
    `small{opacity:.75}`
  ]
})
export class LoginComponent {
  isSubmitting = false;
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private readonly authService: AuthService,
    private readonly notificationService: NotificationService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.authService.login(this.form.getRawValue() as { username: string; password: string }).subscribe({
      next: () => {
        this.notificationService.success('Logged in successfully.');
        this.router.navigate(['/products']);
      },
      error: () => {
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
