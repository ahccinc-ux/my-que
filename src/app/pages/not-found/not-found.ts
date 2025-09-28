import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="login-container">
      <div class="login-card elevated">
        <div class="brand">
          <span class="accent-text brand-left">My</span>
          <span class="primary-text brand-right">Que</span>
        </div>
        <h2 class="primary-text">Page not found</h2>
        <p class="muted">The page you're looking for doesn't exist or has moved.</p>
        <div class="actions">
          <button mat-raised-button color="primary" class="submit-btn btn-primary" (click)="goLogin()">
            <mat-icon>login</mat-icon>
            <span>Go to Sign in</span>
          </button>
          <button mat-button (click)="goHome()">
            <mat-icon>home</mat-icon>
            <span>Go to Dashboard</span>
          </button>
        </div>
      </div>
      <div class="login-hero" [style.background-image]="'url(' + assetUrl('assets/secondonboard.png') + ')'">
      </div>
    </div>
  `,
  styles: `
    .login-container { display: grid; grid-template-columns: 1fr 1fr; height: 100vh; }
    .login-card { margin: auto; padding: 40px; width: 85%; max-width: 520px; background: var(--brand-surface); }
    .brand { font-weight: 800; font-size: 46px; margin-bottom: 10px; }
    h2 { margin: 0 0 10px 0; font-weight: 700; }
    .muted { color: #6b7280; margin: 0 0 18px 0; }
    .actions { display: flex; gap: 12px; align-items: center; }
    .submit-btn { min-width: 160px; }
    .login-hero {
      background-color: var(--brand-green-100);
      opacity: 0.95;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
    }
    @media (max-width: 900px) {
      .login-container { grid-template-columns: 1fr; }
      .login-hero { display: none; }
    }
  `
})
export class NotFound {
  private readonly router = inject(Router);

  assetUrl(rel: string) {
    return new URL(rel, document.baseURI).toString();
  }
  goLogin() { this.router.navigate(['/login']); }
  goHome() { this.router.navigate(['/dashboard']); }
}
