import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { Topbar } from '../../components/layout/topbar/topbar';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Removed datepicker modules as per new filter requirements
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface EmployeeRow {
  name: string;
  code: string;
  role: string;
  branch: string;
  department: string;
  shifts: string;
  totalTokens: string;
  missedTokens: string;
  avgService: string;
  totalService: string;
  idleTime: string;
  satisfaction: string;
  efficiency: string;
}

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Topbar,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="layout">
      <app-sidebar />
      <div class="content-area">
        <app-topbar />

        <form class="filters elevated" [formGroup]="filters">
          <div class="inputs">
            <mat-form-field appearance="outline">
              <mat-label>Select Branch</mat-label>
              <mat-select formControlName="branch">
                <mat-option *ngFor="let b of branches" [value]="b">{{ b }}</mat-option>
              </mat-select>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Select Department</mat-label>
              <mat-select formControlName="department">
                <mat-option *ngFor="let d of departments" [value]="d">{{ d }}</mat-option>
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

        <div class="card elevated">
          <div class="card-title">
            <span class="primary-text">Employees</span>
            <span class="spacer"></span>
            <button mat-icon-button aria-label="export"><mat-icon>ios_share</mat-icon></button>
            <button mat-icon-button aria-label="add"><mat-icon>add</mat-icon></button>
          </div>
          <div class="table elevated">
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Employee Name</th>
                <td mat-cell *matCellDef="let r"><a class="link">{{ r.name }}</a></td>
              </ng-container>
              <ng-container matColumnDef="code">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Employee ID (Code)</th>
                <td mat-cell *matCellDef="let r">{{ r.code }}</td>
              </ng-container>
              <ng-container matColumnDef="role">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
                <td mat-cell *matCellDef="let r">{{ r.role }}</td>
              </ng-container>
              <ng-container matColumnDef="branch">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Branch</th>
                <td mat-cell *matCellDef="let r">{{ r.branch }}</td>
              </ng-container>
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Department</th>
                <td mat-cell *matCellDef="let r">{{ r.department }}</td>
              </ng-container>
              <ng-container matColumnDef="shifts">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Shifts Worked</th>
                <td mat-cell *matCellDef="let r">{{ r.shifts }}</td>
              </ng-container>
              <ng-container matColumnDef="totalTokens">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Tokens Handled</th>
                <td mat-cell *matCellDef="let r">{{ r.totalTokens }}</td>
              </ng-container>
              <ng-container matColumnDef="missedTokens">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Missed Tokens</th>
                <td mat-cell *matCellDef="let r">{{ r.missedTokens }}</td>
              </ng-container>
              <ng-container matColumnDef="avgService">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Average Service Time</th>
                <td mat-cell *matCellDef="let r">{{ r.avgService }}</td>
              </ng-container>
              <ng-container matColumnDef="totalService">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Service Time</th>
                <td mat-cell *matCellDef="let r">{{ r.totalService }}</td>
              </ng-container>
              <ng-container matColumnDef="idleTime">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Idle Time</th>
                <td mat-cell *matCellDef="let r">{{ r.idleTime }}</td>
              </ng-container>
              <ng-container matColumnDef="satisfaction">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Satisfaction Score</th>
                <td mat-cell *matCellDef="let r">{{ r.satisfaction }}</td>
              </ng-container>
              <ng-container matColumnDef="efficiency">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Staff Efficiency</th>
                <td mat-cell *matCellDef="let r">{{ r.efficiency }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
            <mat-paginator [pageSize]="10" [pageSizeOptions]="[10,20,50]"></mat-paginator>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
    .content-area { padding: 12px; display: grid; grid-template-rows: auto auto 1fr; gap: 12px; }
    .filters { padding: 12px; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px; border-radius: 10px; }
    .inputs { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 12px; }
    .actions { display: flex; gap: 8px; justify-content: end; }
    .card { padding: 12px; }
    .card-title { font-weight: 800; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
    .card-title .spacer { flex: 1; }
    .table { width: 100%; overflow: auto; }
    table { width: 100%; }
    th.mat-mdc-header-cell { color: #708090; font-weight: 700; }
    tr.mat-mdc-row:nth-child(even) { background: rgba(29,186,117,0.06); }
    .link { color: var(--brand-green-700); cursor: pointer; text-decoration: underline; }
  `
})
export class Employees implements AfterViewInit {
  branches = ['Heliopolis', 'El Shrouk', 'Nasr City'];
  departments = ['Cheese', 'Meat', 'Seafood', 'Dairy', 'Bakery'];
  filters!: FormGroup;

  displayedColumns = ['name','code','role','branch','department','shifts','totalTokens','missedTokens','avgService','totalService','idleTime','satisfaction','efficiency'];
  data: EmployeeRow[] = [
    { name: 'Ahmed', code: '5031', role: 'Queue Manager', branch: 'Heliopolis', department: 'Cheese', shifts: '150 Shift', totalTokens: '7450 Token', missedTokens: '350 Token', avgService: '11.5 Min', totalService: '620 Hour', idleTime: '9.5 Hour', satisfaction: '4.5 Star', efficiency: '98 %' },
    { name: 'Mohamed', code: '2517', role: 'Queue Manager', branch: 'Heliopolis', department: 'Meat', shifts: '150 Shift', totalTokens: '7450 Token', missedTokens: '350 Token', avgService: '11.5 Min', totalService: '620 Hour', idleTime: '9.5 Hour', satisfaction: '4.5 Star', efficiency: '98 %' },
    { name: 'Hassan', code: '5482', role: 'Queue Manager', branch: 'Heliopolis', department: 'Dairy', shifts: '150 Shift', totalTokens: '7450 Token', missedTokens: '350 Token', avgService: '11.5 Min', totalService: '620 Hour', idleTime: '9.5 Hour', satisfaction: '4.5 Star', efficiency: '98 %' },
    { name: 'Mahmoud', code: '2863', role: 'Queue Manager', branch: 'Heliopolis', department: 'Seafood', shifts: '150 Shift', totalTokens: '7450 Token', missedTokens: '350 Token', avgService: '11.5 Min', totalService: '620 Hour', idleTime: '9.5 Hour', satisfaction: '4.5 Star', efficiency: '98 %' },
    { name: 'Alaa', code: '6833', role: 'Queue Manager', branch: 'Heliopolis', department: 'Cheese', shifts: '150 Shift', totalTokens: '7450 Token', missedTokens: '350 Token', avgService: '11.5 Min', totalService: '620 Hour', idleTime: '9.5 Hour', satisfaction: '4.5 Star', efficiency: '98 %' },
    { name: 'Nader', code: '7525', role: 'Queue Manager', branch: 'Heliopolis', department: 'Meat', shifts: '150 Shift', totalTokens: '7450 Token', missedTokens: '350 Token', avgService: '11.5 Min', totalService: '620 Hour', idleTime: '9.5 Hour', satisfaction: '4.5 Star', efficiency: '98 %' },
    { name: 'Seif', code: '4742', role: 'Queue Manager', branch: 'Heliopolis', department: 'Dairy', shifts: '150 Shift', totalTokens: '7450 Token', missedTokens: '350 Token', avgService: '11.5 Min', totalService: '620 Hour', idleTime: '9.5 Hour', satisfaction: '4.5 Star', efficiency: '98 %' }
  ];
  dataSource = new MatTableDataSource<EmployeeRow>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.filters = this.fb.group({
      branch: [null],
      department: [null]
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    const { branch, department } = this.filters.value as { branch: string | null; department: string | null };
    this.dataSource.filterPredicate = (row) =>
      (branch ? row.branch === branch : true) &&
      (department ? row.department === department : true);
    this.dataSource.filter = Math.random().toString();
  }

  resetFilters() {
    this.filters.reset({ branch: null, department: null });
    this.dataSource.filter = '';
  }
}
