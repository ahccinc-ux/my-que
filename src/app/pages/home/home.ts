import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { Topbar } from '../../components/layout/topbar/topbar';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource } from '@angular/material/table';

interface BranchRow {
  branch: string; hours: string; departments: number; peak: string; staff: number;
  tokens: number; served: number; missed: number; cancelled: number; avgWait: string; avgDuration: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    Sidebar,
    Topbar,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
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
          <div class="pill"></div>
          <div class="inputs">
            <mat-form-field appearance="outline">
              <mat-label>Date From</mat-label>
              <input matInput [matDatepicker]="fromPicker" formControlName="from" />
              <mat-datepicker #fromPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Date To</mat-label>
              <input matInput [matDatepicker]="toPicker" formControlName="to" />
              <mat-datepicker #toPicker></mat-datepicker>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Select Branch</mat-label>
              <mat-select formControlName="branch">
                <mat-option *ngFor="let b of branches" [value]="b">{{ b }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="actions">
            <button mat-raised-button color="primary" class="btn-primary" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Apply
            </button>
            <button mat-button type="button" (click)="resetFilters()">Reset</button>
          </div>
        </form>

        <div class="card elevated">
          <div class="card-title">
            <span class="primary-text">Branches</span>
          </div>
          <div class="table elevated">
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0">
              <ng-container matColumnDef="branch">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Branch Name</th>
                <td mat-cell *matCellDef="let r">{{ r.branch }}</td>
              </ng-container>
              <ng-container matColumnDef="hours">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Operating Hours</th>
                <td mat-cell *matCellDef="let r">{{ r.hours }}</td>
              </ng-container>
              <ng-container matColumnDef="departments">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Departments</th>
                <td mat-cell *matCellDef="let r">{{ r.departments }}</td>
              </ng-container>
              <ng-container matColumnDef="peak">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Peak Hour</th>
                <td mat-cell *matCellDef="let r">{{ r.peak }}</td>
              </ng-container>
              <ng-container matColumnDef="staff">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Number of Staff</th>
                <td mat-cell *matCellDef="let r">{{ r.staff }}</td>
              </ng-container>
              <ng-container matColumnDef="tokens">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Tokens</th>
                <td mat-cell *matCellDef="let r">{{ r.tokens }}</td>
              </ng-container>
              <ng-container matColumnDef="served">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Served</th>
                <td mat-cell *matCellDef="let r">{{ r.served }}</td>
              </ng-container>
              <ng-container matColumnDef="missed">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Missed</th>
                <td mat-cell *matCellDef="let r">{{ r.missed }}</td>
              </ng-container>
              <ng-container matColumnDef="cancelled">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Cancelled</th>
                <td mat-cell *matCellDef="let r">{{ r.cancelled }}</td>
              </ng-container>
              <ng-container matColumnDef="avgWait">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Avg Wait</th>
                <td mat-cell *matCellDef="let r">{{ r.avgWait }}</td>
              </ng-container>
              <ng-container matColumnDef="avgDuration">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Avg Duration</th>
                <td mat-cell *matCellDef="let row">{{ row.avgDuration }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>
            <mat-paginator [pageSize]="5" [pageSizeOptions]="[5,10,20]"></mat-paginator>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 260px 1fr; min-height: 100vh; }
    .content-area { padding: 12px; display: grid; grid-template-rows: auto auto 1fr; gap: 12px; }
    .filters { padding: 12px; display: grid; grid-template-columns: 160px 1fr auto; align-items: center; gap: 12px; }
    .filters .pill { height: 40px; background: var(--brand-green); border-radius: 8px; }
    .inputs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .actions { display: flex; gap: 8px; justify-content: end; }
    .card { padding: 12px; }
    .card-title { font-weight: 800; margin-bottom: 8px; }
    .table { width: 100%; overflow: auto; }
    table { width: 100%; }
    th.mat-mdc-header-cell { color: #708090; font-weight: 700; }
    tr.mat-mdc-row:nth-child(even) { background: rgba(29,186,117,0.06); }
  `
})
export class Home implements AfterViewInit {
  branches = ['Heliopolis', 'El Shrouk', 'Nasr City'];
  filters!: FormGroup;

  displayedColumns = ['branch','hours','departments','peak','staff','tokens','served','missed','cancelled','avgWait','avgDuration'];
  data: BranchRow[] = Array.from({length: 25}).map((_, i) => ({
    branch: i % 2 ? 'Heliopolis' : 'El Shrouk',
    hours: '13 Hours',
    departments: 19,
    peak: '7 PM',
    staff: 16,
    tokens: 7450 + i,
    served: 7000 + i,
    missed: 350,
    cancelled: 100,
    avgWait: '17 Min',
    avgDuration: '25 Min'
  }));
  dataSource = new MatTableDataSource<BranchRow>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.filters = this.fb.group({
      from: [null],
      to: [null],
      branch: [this.branches[0]]
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    const branch = this.filters.value.branch;
    this.dataSource.filterPredicate = (row) => branch ? row.branch === branch : true;
    // MatTableDataSource filter expects a string
    this.dataSource.filter = Math.random().toString();
  }

  resetFilters() {
    this.filters.reset({ from: null, to: null, branch: null });
    this.dataSource.filter = '';
  }
}
