import { Component, ViewChild, AfterViewInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { Topbar } from '../../components/layout/topbar/topbar';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface QueueRow {
  branch: string;
  department: string;
  queueName: string;
  queueNumber: string;
  currentNumber: string;
  totalReserved: string;
  slotTime: string;
  waitingCount: string;
}

// Shared demo data consistent with other modules
const BRANCHES = ['Heliopolis', 'El Shrouk', 'Nasr City'];
const DEPARTMENTS = ['Cheese', 'Meat', 'Seafood', 'Dairy', 'Bakery'];

function buildQueues(): QueueRow[] {
  const rows: QueueRow[] = [];
  for (const branch of BRANCHES) {
    for (const dept of DEPARTMENTS) {
      // two queues per department
      for (let i = 1; i <= 2; i++) {
        const total = 150 + (i * 25);
        const current = 30 + (i * 5);
        const waiting = 10 + i * 3;
        rows.push({
          branch,
          department: dept,
          queueName: `${dept} Queue ${i}`,
          queueNumber: `${i}`.padStart(2, '0'),
          currentNumber: `${current}`,
          totalReserved: `${total} Token`,
          slotTime: `${10 + i * 2} Min`,
          waitingCount: `${waiting} Customer`
        });
      }
    }
  }
  return rows;
}

@Component({
  selector: 'app-queues',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Topbar,
    ReactiveFormsModule,
    MatFormFieldModule,
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
                <mat-option *ngFor="let d of filteredDepartments()" [value]="d">{{ d }}</mat-option>
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
            <span class="primary-text">Queues</span>
            <span class="spacer"></span>
            <button mat-icon-button aria-label="export"><mat-icon>ios_share</mat-icon></button>
            <button mat-icon-button aria-label="add"><mat-icon>add</mat-icon></button>
          </div>
          <div class="table elevated">
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0">
              <ng-container matColumnDef="queueName">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Queue Name</th>
                <td mat-cell *matCellDef="let r">{{ r.queueName }}</td>
              </ng-container>
              <ng-container matColumnDef="queueNumber">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Queue #</th>
                <td mat-cell *matCellDef="let r">{{ r.queueNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="branch">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Branch</th>
                <td mat-cell *matCellDef="let r">{{ r.branch }}</td>
              </ng-container>
              <ng-container matColumnDef="department">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Department</th>
                <td mat-cell *matCellDef="let r">{{ r.department }}</td>
              </ng-container>
              <ng-container matColumnDef="currentNumber">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Current Number</th>
                <td mat-cell *matCellDef="let r">{{ r.currentNumber }}</td>
              </ng-container>
              <ng-container matColumnDef="totalReserved">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Reserved</th>
                <td mat-cell *matCellDef="let r">{{ r.totalReserved }}</td>
              </ng-container>
              <ng-container matColumnDef="slotTime">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Slot Time</th>
                <td mat-cell *matCellDef="let r">{{ r.slotTime }}</td>
              </ng-container>
              <ng-container matColumnDef="waitingCount">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Waiting List</th>
                <td mat-cell *matCellDef="let r">{{ r.waitingCount }}</td>
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
  `
})
export class Queues implements AfterViewInit {
  branches = BRANCHES;
  departments = DEPARTMENTS;

  filters!: FormGroup;
  displayedColumns = ['queueName','queueNumber','branch','department','currentNumber','totalReserved','slotTime','waitingCount'];
  data: QueueRow[] = buildQueues();
  dataSource = new MatTableDataSource<QueueRow>(this.data);

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

  filteredDepartments = () => this.departments; // placeholder for cascading if needed

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
