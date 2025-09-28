import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule, MatButtonModule],
  template: `
    <header class="topbar elevated">
      <div class="crumbs">Home / {{ moduleName }}</div>
      <div class="actions">
        <button mat-icon-button aria-label="notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        <button mat-icon-button aria-label="help">
          <mat-icon>help</mat-icon>
        </button>
        <div class="user">
          <div class="info">
            <div class="name">Ali Ahmed</div>
            <div class="role">Admin</div>
          </div>
          <div class="avatar">A</div>
        </div>
      </div>
    </header>
  `,
  styles: `
    .topbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 16px; background: var(--brand-surface); }
    .crumbs { font-weight: 600; color: #6c7a89; }
    .actions { display: flex; align-items: center; gap: 6px; }
    .user { display: flex; align-items: center; gap: 10px; padding-left: 8px; }
    .info { text-align: right; }
    .name { font-weight: 700; }
    .role { font-size: 12px; color: #8a97a6; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--brand-green); color: #fff; display: grid; place-items: center; font-weight: 700; }
  `
})
export class Topbar {
  private router = inject(Router);
  moduleName = this.computeModuleName(this.router.url);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(ev => {
        this.moduleName = this.computeModuleName(ev.urlAfterRedirects || ev.url);
      });
  }

  private computeModuleName(url: string): string {
    try {
      const path = (url || '').split('?')[0];
      const parts = path.split('/').filter(Boolean);
      const last = parts[parts.length - 1] || '';
      if (!last || last === 'home') return 'Home';
      // Map known routes to desired labels (e.g., singularize Departments)
      const labelMap: Record<string, string> = {
        dashboard: 'Dashboard',
        login: 'Login',
        departments: 'Department',
        branches: 'Branches',
        employees: 'Employees',
        queues: 'Que Management'
      };
      if (labelMap[last.toLowerCase()]) return labelMap[last.toLowerCase()];
      // Fallback: Title-case last segment
      return last.replace(/[-_]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    } catch {
      return 'Home';
    }
  }
}
