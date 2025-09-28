import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, MatIconModule, MatExpansionModule],
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

        <mat-accordion class="acc">
          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <div class="panel-h">
                <mat-icon class="ic">admin_panel_settings</mat-icon>
                <span>Administration</span>
              </div>
            </mat-expansion-panel-header>
            <a routerLink="/branches" class="nav-sub">My Branches</a>
            <a routerLink="/departments" class="nav-sub">My Departments</a>
            <a routerLink="/home" class="nav-sub">Staff Employees</a>
          </mat-expansion-panel>

          <mat-expansion-panel>
            <mat-expansion-panel-header>
              <div class="panel-h">
                <mat-icon class="ic">store</mat-icon>
                <span>Super Market</span>
              </div>
            </mat-expansion-panel-header>
            <a routerLink="/dashboard" class="nav-sub">Products</a>
            <a routerLink="/dashboard" class="nav-sub">Categories</a>
          </mat-expansion-panel>
        </mat-accordion>

        <a routerLink="/departments" class="nav-item"><mat-icon class="ic">group</mat-icon><span>Customer Management</span></a>
        <a routerLink="/dashboard" class="nav-item"><mat-icon class="ic">view_list</mat-icon><span>Que Management</span></a>
        <a routerLink="/dashboard" class="nav-item"><mat-icon class="ic">event</mat-icon><span>Slot Management</span></a>
        <a routerLink="/dashboard" class="nav-item"><mat-icon class="ic">notifications</mat-icon><span>Pushed Notifications</span></a>
        <a routerLink="/dashboard" class="nav-item"><mat-icon class="ic">schedule</mat-icon><span>Shift Management</span></a>
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
    .nav-item, .nav-sub { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; color: #fff; text-decoration: none; opacity: 0.95; }
    .nav-item:hover, .nav-sub:hover { background: rgba(255,255,255,0.12); }
    .nav-sub { padding-left: 34px; opacity: 0.92; }
    .ic { font-size: 18px; height: 18px; width: 18px; }
    .acc { --mat-expansion-container-background-color: transparent; --mat-expansion-header-text-color: #fff; }
    .panel-h { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
    ::ng-deep .mat-expansion-panel { background: transparent; color: #fff; }
    ::ng-deep .mat-expansion-panel-header.mat-expanded { background: rgba(255,255,255,0.08); }
  `
})
export class Sidebar {

}
