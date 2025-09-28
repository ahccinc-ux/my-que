import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../core/auth';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card elevated">
        <div class="brand">
          <span class="accent-text brand-left">My</span>
          <span class="primary-text brand-right">Que</span>
        </div>
        <h2 class="primary-text">Sign in</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline" class="full">
            <mat-label>E-mail</mat-label>
            <input matInput placeholder="example@gmail.com" formControlName="email" type="email" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full">
            <mat-label>Password</mat-label>
            <input matInput [type]="hide() ? 'password' : 'text'" formControlName="password" />
            <button mat-icon-button matSuffix type="button" (click)="toggleHide()" [attr.aria-label]="hide() ? 'Show' : 'Hide'">
              <mat-icon>{{ hide() ? 'visibility' : 'visibility_off' }}</mat-icon>
            </button>
          </mat-form-field>
          <button mat-raised-button color="primary" class="submit-btn btn-primary" [disabled]="form.invalid">Sign in</button>
        </form>
      </div>
      <div class="login-hero"></div>
    </div>
  `,
  styles: `
    .login-container { display: grid; grid-template-columns: 1fr 1fr; height: 100vh; }
    .login-card { margin: auto; padding: 40px; width: 85%; max-width: 520px; background: var(--brand-surface); }
    .brand-logo { height: 48px; margin-bottom: 12px; object-fit: contain; }
    .brand { font-weight: 800; font-size: 46px; margin-bottom: 10px; }
    .brand-left { margin-right: 6px; }
    h2 { margin: 0 0 20px 0; font-weight: 700; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .full { width: 100%; }
    .submit-btn { width: 140px; align-self: start; }
    .login-hero {
      background-color: var(--brand-green-700);
      opacity: 0.95;
      background-image: url('/assets/secondonboard.svg');
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain; /* scale SVG to fit while preserving aspect */
    }
    @media (max-width: 900px) {
      .login-container { grid-template-columns: 1fr; }
      .login-hero { display: none; }
    }
  `
})
export class Login {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);

  protected hide = signal(true);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(3)]]
  });

  toggleHide() { this.hide.set(!this.hide()); }
  onSubmit() {
    if (this.form.valid) {
      const ok = this.auth.login(this.form.value.email!, this.form.value.password!);
      if (ok) { this.router.navigate(['/dashboard']); }
    }
  }
}
