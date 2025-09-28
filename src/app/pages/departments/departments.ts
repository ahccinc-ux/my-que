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
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface DepartmentRow {
  name: string; branch: string; counters: string; staff: string;
  totalTokens: string; servedTokens: string; missedTokens: string; cancelledTokens: string;
  avgWait: string; avgService: string; abandonment: string;
}

@Component({
  selector: 'app-departments',
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
            <span class="primary-text">Departments</span>
          </div>
          <div class="table elevated">
            <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z0">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Department Name</th>
                <td mat-cell *matCellDef="let r">{{ r.name }}</td>
              </ng-container>
              <ng-container matColumnDef="branch">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Branch Name</th>
                <td mat-cell *matCellDef="let r">{{ r.branch }}</td>
              </ng-container>
              <ng-container matColumnDef="counters">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Assigned Counters</th>
                <td mat-cell *matCellDef="let r">{{ r.counters }}</td>
              </ng-container>
              <ng-container matColumnDef="staff">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Assigned Staff</th>
                <td mat-cell *matCellDef="let r">{{ r.staff }}</td>
              </ng-container>
              <ng-container matColumnDef="totalTokens">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Total Tokens Issued</th>
                <td mat-cell *matCellDef="let r">{{ r.totalTokens }}</td>
              </ng-container>
              <ng-container matColumnDef="servedTokens">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Tokens Served</th>
                <td mat-cell *matCellDef="let r">{{ r.servedTokens }}</td>
              </ng-container>
              <ng-container matColumnDef="missedTokens">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Missed Tokens</th>
                <td mat-cell *matCellDef="let r">{{ r.missedTokens }}</td>
              </ng-container>
              <ng-container matColumnDef="cancelledTokens">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Cancelled Tokens</th>
                <td mat-cell *matCellDef="let r">{{ r.cancelledTokens }}</td>
              </ng-container>
              <ng-container matColumnDef="avgWait">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Average Wait Time</th>
                <td mat-cell *matCellDef="let r">{{ r.avgWait }}</td>
              </ng-container>
              <ng-container matColumnDef="avgService">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Average Service Time</th>
                <td mat-cell *matCellDef="let r">{{ r.avgService }}</td>
              </ng-container>
              <ng-container matColumnDef="abandonment">
                <th mat-header-cell *matHeaderCellDef mat-sort-header>Queue Abandonment Rate</th>
                <td mat-cell *matCellDef="let r">{{ r.abandonment }}</td>
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
export class Departments implements AfterViewInit {
  branches = ['Heliopolis', 'El Shrouk', 'Nasr City'];
  filters!: FormGroup;

  displayedColumns = ['name','branch','counters','staff','totalTokens','servedTokens','missedTokens','cancelledTokens','avgWait','avgService','abandonment'];
  data: DepartmentRow[] = [
    { name: 'Cheese Department', branch: 'Heliopolis', counters: '1 Counter', staff: '3 Employees', totalTokens: '7450 Token', servedTokens: '7000 Token', missedTokens: '350 Token', cancelledTokens: '240 Token', avgWait: '13.5 Min', avgService: '17 Min', abandonment: '90 %' },
    { name: 'Meat Department', branch: 'Heliopolis', counters: '2 Counters', staff: '3 Employees', totalTokens: '7450 Token', servedTokens: '7000 Token', missedTokens: '350 Token', cancelledTokens: '240 Token', avgWait: '13.5 Min', avgService: '17 Min', abandonment: '100 %' },
    { name: 'Seafood Department', branch: 'Heliopolis', counters: '2 Counters', staff: '3 Employees', totalTokens: '7450 Token', servedTokens: '7000 Token', missedTokens: '350 Token', cancelledTokens: '240 Token', avgWait: '13.5 Min', avgService: '17 Min', abandonment: '100 %' },
    { name: 'Dairy Department', branch: 'Heliopolis', counters: '2 Counters', staff: '3 Employees', totalTokens: '7450 Token', servedTokens: '7000 Token', missedTokens: '350 Token', cancelledTokens: '240 Token', avgWait: '13.5 Min', avgService: '17 Min', abandonment: '100 %' },
    { name: 'Bakery Department', branch: 'Heliopolis', counters: '2 Counters', staff: '3 Employees', totalTokens: '7450 Token', servedTokens: '7000 Token', missedTokens: '350 Token', cancelledTokens: '240 Token', avgWait: '13.5 Min', avgService: '17 Min', abandonment: '100 %' }
  ];
  dataSource = new MatTableDataSource<DepartmentRow>(this.data);

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
    this.dataSource.filter = Math.random().toString();
  }

  resetFilters() {
    this.filters.reset({ from: null, to: null, branch: null });
    this.dataSource.filter = '';
  }
}
