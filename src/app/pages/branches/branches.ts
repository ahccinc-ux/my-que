import { Component, ViewChild, AfterViewInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Sidebar } from '../../components/layout/sidebar/sidebar';
import { Topbar } from '../../components/layout/topbar/topbar';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MockStore, BranchItem } from '../../core/mock-store';
import { BranchDialog, BranchDialogData } from '../../components/dialogs/branch-dialog';
import { ConfirmDialog } from '../../components/dialogs/confirm-dialog';

interface BranchRow {
  branch: string; hours: string; departments: number; peak: string; staff: number;
  tokens: number; served: number; missed: number; cancelled: number; avgWait: string; avgDuration: string;
}

@Component({
  selector: 'app-branches',
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
    MatIconModule,
    MatDialogModule
  ],
  template: `
    <div class="layout">
      <app-sidebar />
      <div class="content-area">
        <app-topbar />
        <form class="filters elevated" [formGroup]="filters">
          <mat-form-field appearance="outline" class="branch-field">
            <mat-label>Select Branch</mat-label>
            <mat-select formControlName="branch">
              <mat-option *ngFor="let b of branches" [value]="b">{{ b }}</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="actions">
            <button mat-raised-button color="primary" class="btn-primary" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Apply
            </button>
            <button mat-button type="button" (click)="resetFilters()">Reset</button>
            <button mat-raised-button color="accent" type="button" (click)="openAdd()">
              <mat-icon>add</mat-icon>
              Add Branch
            </button>
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
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let r">
                  <button mat-icon-button color="primary" (click)="openEdit(r)" aria-label="Edit">
                    <mat-icon>edit</mat-icon>
                  </button>
                  <button mat-icon-button color="warn" (click)="confirmDelete(r)" aria-label="Delete">
                    <mat-icon>delete</mat-icon>
                  </button>
                </td>
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
    .content-area { padding: 12px; display: grid; grid-template-rows: auto auto auto 1fr; gap: 12px; }
    .breadcrumb { font-size: 13px; color: #708090; }
    .breadcrumb .here { color: var(--brand-green-700); font-weight: 700; }
    .filters { padding: 6px 10px; display: flex; flex-wrap: wrap; gap: 22px; align-items: center; height: auto; min-height: 60px; }
    .branch-field { flex: 1 1 320px; min-width: 240px; margin: 0; }
    .actions { display: flex; gap: 8px; align-items: center; }
    .filters :where(.mat-mdc-form-field, .mat-mdc-form-field-infix) { margin: 0; }
    .filters :where(.mat-mdc-form-field-subscript-wrapper) { display: none; }
    .card { padding: 12px; }
    .card-title { font-weight: 800; margin-bottom: 8px; }
    .table { width: 100%; overflow: auto; }
    table { width: 100%; }
    th.mat-mdc-header-cell { color: #708090; font-weight: 700; }
    tr.mat-mdc-row:nth-child(even) { background: rgba(29,186,117,0.06); }
  `
})
export class Branches implements AfterViewInit {
  private store = inject(MockStore);
  private dialog = inject(MatDialog);
  branches: string[] = [];
  filters!: FormGroup;

  displayedColumns = ['branch','hours','departments','peak','staff','tokens','served','missed','cancelled','avgWait','avgDuration','actions'];
  data: BranchRow[] = [];
  dataSource = new MatTableDataSource<BranchRow>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.filters = this.fb.group({
      branch: [null]
    });

    effect(() => {
      const list = this.store.branches();
      this.branches = list.map(b => b.name);
      this.data = list.map(b => this.toRow(b));
      this.dataSource.data = this.data;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    const branch = this.filters.value.branch as string | null;
    this.dataSource.filterPredicate = (row) => branch ? row.branch === branch : true;
    this.dataSource.filter = Math.random().toString();
  }

  resetFilters() {
    this.filters.reset({ branch: null });
    this.dataSource.filter = '';
  }

  openAdd() {
    const ref = this.dialog.open<BranchDialog, BranchDialogData, BranchDialogData>(BranchDialog, {
      data: {},
      width: '640px'
    });
    ref.afterClosed().subscribe(res => {
      if (!res) return;
      this.store.addBranch({
        name: res.name!, hours: res.hours, staff: res.staff, tokens: res.tokens, served: res.served,
        missed: res.missed, cancelled: res.cancelled, avgWait: res.avgWait, avgDuration: res.avgDuration
      });
    });
  }

  openEdit(row: BranchRow) {
    const br = this.store.branches().find(b => b.name === row.branch);
    if (!br) return;
    const ref = this.dialog.open<BranchDialog, BranchDialogData, BranchDialogData>(BranchDialog, {
      data: { id: br.id, name: br.name, hours: br.hours, staff: br.staff, tokens: br.tokens, served: br.served, missed: br.missed, cancelled: br.cancelled, avgWait: br.avgWait, avgDuration: br.avgDuration },
      width: '680px'
    });
    ref.afterClosed().subscribe(res => {
      if (!res || !br) return;
      const { id, ...patch } = res as any;
      this.store.updateBranch(br.id, patch);
    });
  }

  confirmDelete(row: BranchRow) {
    const br = this.store.branches().find(b => b.name === row.branch);
    if (!br) return;
    const ref = this.dialog.open(ConfirmDialog, {
      data: {
        title: 'Delete Branch',
        message: `Are you sure you want to delete "${br.name}"? This will remove related employees as well.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      },
      width: '480px'
    });
    ref.afterClosed().subscribe(ok => {
      if (ok) this.store.deleteBranch(br.id);
    });
  }

  private toRow(b: BranchItem): BranchRow {
    return {
      branch: b.name,
      hours: b.hours,
      departments: b.departments.length,
      peak: '7 PM',
      staff: b.staff,
      tokens: b.tokens,
      served: b.served,
      missed: b.missed,
      cancelled: b.cancelled,
      avgWait: b.avgWait,
      avgDuration: b.avgDuration
    };
  }
}
