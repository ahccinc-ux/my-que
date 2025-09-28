import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { Topbar } from '../../components/layout/topbar/topbar';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, ChartOptions, ChartType, CategoryScale, LinearScale, BarElement, Tooltip, Legend, BarController } from 'chart.js';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

// Register Chart.js components once for the app (required for Chart.js v4)
Chart.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, BarController);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Topbar,
    MatIconModule,
    BaseChartDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <div class="layout">
      <app-sidebar />
      <div class="content-area">
        <app-topbar />

        <form class="filters elevated" [formGroup]="filters">
     
          <div class="inputs">
            <mat-form-field appearance="outline">
              <mat-label>Date From</mat-label>
              <input matInput [matDatepicker]="fromPicker" formControlName="from" />
              <mat-datepicker-toggle matSuffix [for]="fromPicker"></mat-datepicker-toggle>
              <mat-datepicker #fromPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date To</mat-label>
              <input matInput [matDatepicker]="toPicker" formControlName="to" />
              <mat-datepicker-toggle matSuffix [for]="toPicker"></mat-datepicker-toggle>
              <mat-datepicker #toPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Branch</mat-label>
              <mat-select formControlName="branch">
                <mat-option *ngFor="let b of branches" [value]="b">{{ b }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Department</mat-label>
              <mat-select formControlName="department">
                <mat-option *ngFor="let d of departments" [value]="d">{{ d }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Employee</mat-label>
              <mat-select formControlName="employee">
                <mat-option *ngFor="let e of employees" [value]="e">{{ e }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="actions">
            <button mat-raised-button color="primary" class="btn-primary" type="button" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Apply
            </button>
            <button mat-button type="button" (click)="resetFilters()">Reset</button>
          </div>
        </form>

        <div class="stats">
          <div class="stat elevated">
            <div class="value">89,935</div>
            <div class="label"><mat-icon>store</mat-icon> Branches</div>
          </div>
          <div class="stat elevated">
            <div class="value">23,283</div>
            <div class="label"><mat-icon>category</mat-icon> Departments</div>
          </div>
          <div class="stat elevated">
            <div class="value">46,827</div>
            <div class="label"><mat-icon>groups</mat-icon> Active Employees</div>
          </div>
          <div class="stat elevated">
            <div class="value">124,854</div>
            <div class="label"><mat-icon>person</mat-icon> Served Customers</div>
          </div>
          <div class="stat elevated">
            <div class="value">124,854</div>
            <div class="label"><mat-icon>schedule</mat-icon> Service Time / Customer</div>
          </div>
        </div>

        <div class="grid">
          <div class="card elevated chart-card">
            <div class="card-title">Served Customer</div>
            <div class="chart-wrap">
              <canvas baseChart
                [type]="tokensChartType"
                [data]="tokensChartData"
                [options]="tokensChartOptions">
              </canvas>
            </div>
          </div>
          <div class="card elevated chart-card">
            <div class="card-title">Department</div>
            <div class="chart-wrap">
              <canvas baseChart
                [type]="deptChartType"
                [data]="deptChartData"
                [options]="deptChartOptions">
              </canvas>
            </div>
          </div>
          <!-- <div class="card elevated">
            <div class="card-title">Served Customers</div>
            <div class="placeholder">Category bars placeholder</div>
          </div>
          <div class="card elevated">
            <div class="card-title">Customer Reviews</div>
            <div class="placeholder">Recent reviews table placeholder</div>
          </div> -->
        </div>
      </div>
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
    .content-area { padding: 12px; display: grid; grid-template-rows: auto auto auto 1fr; gap: 12px; }
    .filters { padding: 12px; display: grid; grid-template-columns: 160px 1fr auto; align-items: center; gap: 12px; }
    .filters .pill { height: 40px; background: var(--brand-green); border-radius: 8px; }
    .filters .inputs { display: grid; grid-template-columns: repeat(5, minmax(160px, 1fr)); gap: 12px; }
    .filters .actions { display: flex; gap: 8px; justify-content: end; }
    .stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
    .stat { padding: 16px; }
    .stat .value { font-size: 28px; font-weight: 800; }
    .stat .label { color: #708090; display: flex; align-items: center; gap: 6px; }

    .grid { display: grid; grid-template-columns: 2fr 1.4fr; grid-auto-rows: minmax(220px, auto); gap: 12px; }
    .card { padding: 12px; }
    .card-title { font-weight: 800; margin-bottom: 8px; }
    .placeholder { display: grid; place-items: center; color: #8090a0; height: 100%; border: 1px dashed #e0e6eb; border-radius: 8px; }
    .chart-card { min-height: 320px; }
    .chart-wrap { height: 280px; position: relative; }
    .chart-wrap canvas { display: block; width: 100% !important; height: 100% !important; }

    @media (max-width: 1200px) {
      .stats { grid-template-columns: repeat(2, 1fr); }
      .grid { grid-template-columns: 1fr; }
    }
  `
})
export class Dashboard implements OnInit {
  // Brand colors
  private brandGreen = '#1DBA75';
  private brandOrange = '#F5A25A';
  private brandMuted = '#E6EAEE';
  private brandText = '#1F2D3D';

  branches = ['Heliopolis', 'El Shrouk', 'Nasr City'];
  departments = ['Cheese', 'Meat', 'Seafood', 'Bakery'];
  employees = ['Ahmed', 'Mona', 'Yousef'];

  private fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);

  filters = this.fb.group({
    from: [null],
    to: [null],
    branch: [this.branches[0]],
    department: [this.departments[0]],
    employee: [this.employees[0]]
  });

  // Tokens stacked bar chart
  tokensChartType: ChartType = 'bar';
  tokensChartData: ChartConfiguration['data'] = {
    labels: ['Sun, 1 Dec', 'Mon, 2 Dec', 'Tue, 3 Dec', 'Wed, 4 Dec', 'Thu, 5 Dec', 'Fri, 6 Dec', 'Sat, 7 Dec'],
    datasets: [
      { label: 'Served Tokens', data: [10, 14, 16, 12, 18, 11, 13], backgroundColor: this.brandGreen, borderRadius: 6, stack: 'tokens' },
      { label: 'Missed Tokens', data: [6, 5, 7, 6, 8, 7, 6], backgroundColor: '#F59E0B', borderRadius: 6, stack: 'tokens' },
      { label: 'Canceled Tokens', data: [4, 6, 5, 7, 6, 5, 4], backgroundColor: '#9CA3AF', borderRadius: 6, stack: 'tokens' }
    ]
  };
  tokensChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: this.brandText, boxWidth: 12, boxHeight: 12 }
      },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { color: '#708090' }
      },
      y: {
        stacked: true,
        grid: { color: this.brandMuted },
        ticks: { color: '#708090', stepSize: 10 }
      }
    }
  };

  // Department comparison bar chart
  deptChartType: ChartType = 'bar';
  deptChartData: ChartConfiguration['data'] = {
    labels: ['Heliopolis', 'El Shrouk', 'Heliopolis', 'El Shrouk', 'Heliopolis'],
    datasets: [
      { label: 'Department', data: [40, 90, 60, 75, 50], backgroundColor: this.brandOrange, borderRadius: 6 }
    ]
  };
  deptChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#708090' }
      },
      y: {
        grid: { color: this.brandMuted },
        ticks: { color: '#708090', stepSize: 25 }
      }
    }
  };

  ngOnInit(): void {
    const sub = this.filters.valueChanges.subscribe(() => this.recalculateCharts());
    this.destroyRef.onDestroy(() => sub.unsubscribe());
  }

  applyFilters() { this.recalculateCharts(); }
  resetFilters() {
    this.filters.reset({ from: null, to: null, branch: this.branches[0], department: this.departments[0], employee: this.employees[0] });
    this.recalculateCharts();
  }

  private recalculateCharts() {
    // Simple demo: change datasets slightly based on selected branch/department/employee
    const seed = (this.filters.value.branch?.length || 1) + (this.filters.value.department?.length || 1) + (this.filters.value.employee?.length || 1);
    const rand = (n: number, offset = 0) => ((seed * 7 + n * 3) % 10) + offset;

    this.tokensChartData = {
      labels: ['Sun, 1 Dec', 'Mon, 2 Dec', 'Tue, 3 Dec', 'Wed, 4 Dec', 'Thu, 5 Dec', 'Fri, 6 Dec', 'Sat, 7 Dec'],
      datasets: [
        { label: 'Served Tokens', data: [rand(1, 8), rand(2, 10), rand(3, 12), rand(4, 9), rand(5, 13), rand(6, 10), rand(7, 11)], backgroundColor: this.brandGreen, borderRadius: 6, stack: 'tokens' },
        { label: 'Missed Tokens', data: [rand(1, 4), rand(2, 4), rand(3, 5), rand(4, 4), rand(5, 6), rand(6, 5), rand(7, 4)], backgroundColor: '#F59E0B', borderRadius: 6, stack: 'tokens' },
        { label: 'Canceled Tokens', data: [rand(1, 3), rand(2, 4), rand(3, 3), rand(4, 5), rand(5, 4), rand(6, 3), rand(7, 3)], backgroundColor: '#9CA3AF', borderRadius: 6, stack: 'tokens' }
      ]
    };

    this.deptChartData = {
      labels: ['Heliopolis', 'El Shrouk', 'Heliopolis', 'El Shrouk', 'Heliopolis'],
      datasets: [
        { label: 'Department', data: [rand(1, 35), rand(2, 70), rand(3, 50), rand(4, 60), rand(5, 45)], backgroundColor: this.brandOrange, borderRadius: 6 }
      ]
    };
  }
}
