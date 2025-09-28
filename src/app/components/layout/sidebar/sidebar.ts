import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Auth } from '../../../core/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatIconModule],
  template: `
    <aside class="sidebar">
      <div class="brand-area">
        <img  src="assets/royalhouse-logo.png"  width="220" height="200"  />
        <div class="logo">Royal House</div>
        <div class="since">Since 2001</div>
      </div>

      <nav class="nav">
        <a routerLink="/dashboard" class="nav-item">
          <mat-icon class="ic">dashboard</mat-icon>
          <span>Dashboard</span>
        </a>
        <a routerLink="/branches" class="nav-item">
          <mat-icon class="ic">store</mat-icon>
          <span>My Branches</span>
        </a>
        <a routerLink="/departments" class="nav-item">
          <mat-icon class="ic">category</mat-icon>
          <span>My Department</span>
        </a>
        <a routerLink="/employees" class="nav-item">
          <mat-icon class="ic">groups</mat-icon>
          <span>Staff Employees</span>
        </a>
        <a routerLink="/queues" class="nav-item">
          <mat-icon class="ic">view_list</mat-icon>
          <span>Que Management</span>
        </a>
        <button type="button" class="nav-item logout" (click)="onLogout()">
          <mat-icon class="ic">logout</mat-icon>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  `,
  styles: `
    .sidebar { width: 260px; background: var(--brand-green-700); color: #fff; height: 100vh; position: sticky; top: 0; }
    .brand-area { padding: 22px 18px; border-bottom: 1px solid rgba(255,255,255,0.2); }
    .logo-img { width: 140px; height: auto; display: block; margin-bottom: 6px; filter: brightness(0) invert(1); }
    .logo { font-weight: 800; font-size: 20px; }
    .since { font-size: 11px; opacity: .85; }
    .nav { display: flex; flex-direction: column; padding: 10px; gap: 4px; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: #fff; text-decoration: none; opacity: 0.95; background: transparent; border: 0; text-align: left; cursor: pointer; }
    .nav-item:hover { background: rgba(255,255,255,0.12); }
    .logout { margin-top: 8px; }
    .ic { font-size: 18px; height: 18px; width: 18px; }
  `
})
export class Sidebar {
  private auth = inject(Auth);
  private router = inject(Router);

  onLogout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
