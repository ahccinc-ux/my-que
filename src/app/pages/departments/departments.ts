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
import { MockStore, BranchItem, DepartmentItem } from '../../core/mock-store';
import { DepartmentDialog, DepartmentDialogData } from '../../components/dialogs/department-dialog';
import { ConfirmDialog } from '../../components/dialogs/confirm-dialog';

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
          <div class="inputs">
            <mat-form-field appearance="outline">
              <mat-label>Select Branch</mat-label>
              <mat-select formControlName="branch">
                <mat-option *ngFor="let b of branches" [value]="b.id">{{ b.name }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="actions">
            <button mat-raised-button color="primary" class="btn-primary" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Apply
            </button>
            <button mat-button type="button" (click)="resetFilters()">Reset</button>
            <button mat-raised-button color="accent" type="button" (click)="openAdd()">
              <mat-icon>add</mat-icon>
              Add Department
            </button>
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
    .inputs { display: grid; grid-template-columns: 1fr; gap: 12px; }
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
  private store = inject(MockStore);
  private dialog = inject(MatDialog);
  filters!: FormGroup;
  branches: { id: string; name: string }[] = [];

  displayedColumns = ['name','branch','counters','staff','totalTokens','servedTokens','missedTokens','cancelledTokens','avgWait','avgService','abandonment','actions'];
  data: DepartmentRow[] = [];
  dataSource = new MatTableDataSource<DepartmentRow>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.filters = this.fb.group({ branch: [null] });

    effect(() => {
      const list = this.store.branches();
      this.branches = list.map(b => ({ id: b.id, name: b.name }));
      const selected = this.filters?.value?.branch as string | null;
      const rows = list.flatMap(b => (selected && b.id !== selected) ? [] : this.mapDeps(b));
      this.data = rows;
      this.dataSource.data = this.data;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    const branchId = this.filters.value.branch as string | null;
    this.dataSource.filterPredicate = (row) => {
      if (!branchId) return true;
      const br = this.branches.find(b => b.id === branchId);
      return br ? row.branch === br.name : true;
    };
    this.dataSource.filter = Math.random().toString();
  }

  resetFilters() {
    this.filters.reset({ branch: null });
    this.dataSource.filter = '';
  }

  openAdd() {
    const ensureBranchAndOpen = () => {
      const branchOptions = this.store.branches().map(b => ({ id: b.id, name: b.name }));
      const ref = this.dialog.open<DepartmentDialog, DepartmentDialogData, DepartmentDialogData>(DepartmentDialog, {
        data: { branchOptions }, width: '560px'
      });
      ref.afterClosed().subscribe(res => {
        if (!res?.branchId || !res?.name) return;
        this.store.addDepartment(res.branchId, {
          name: res.name,
          counters: res.counters,
          staff: res.staff,
          totalTokens: res.totalTokens,
          servedTokens: res.servedTokens,
          missedTokens: res.missedTokens,
          cancelledTokens: res.cancelledTokens,
          avgWait: res.avgWait,
          avgService: res.avgService,
          abandonment: res.abandonment
        });
      });
    };

    const branches = this.store.branches();
    if (!branches.length) {
      // No branches exist: prompt to create one first
      import('../../components/dialogs/branch-dialog').then(m => {
        const ref = this.dialog.open(m.BranchDialog, { data: {}, width: '640px' });
        ref.afterClosed().subscribe(br => {
          if (!br?.name) return;
          this.store.addBranch({
            name: br.name!, hours: br.hours, staff: br.staff, tokens: br.tokens, served: br.served,
            missed: br.missed, cancelled: br.cancelled, avgWait: br.avgWait, avgDuration: br.avgDuration
          });
          // After adding a branch, open the department dialog
          ensureBranchAndOpen();
        });
      });
      return;
    }

    ensureBranchAndOpen();
  }

  openEdit(row: DepartmentRow) {
    const br = this.store.branches().find(b => b.name === row.branch);
    if (!br) return;
    const dep = br.departments.find(d => d.name === row.name.replace(' Department',''));
    if (!dep) return;
    const ref = this.dialog.open<DepartmentDialog, DepartmentDialogData, DepartmentDialogData>(DepartmentDialog, {
      data: {
        id: dep.id,
        name: dep.name,
        branchId: br.id,
        branchOptions: [{ id: br.id, name: br.name }],
        isEdit: true,
        counters: dep.counters ?? 1,
        staff: dep.staff ?? 0,
        totalTokens: dep.totalTokens ?? 0,
        servedTokens: dep.servedTokens ?? 0,
        missedTokens: dep.missedTokens ?? 0,
        cancelledTokens: dep.cancelledTokens ?? 0,
        avgWait: dep.avgWait ?? '0 Min',
        avgService: dep.avgService ?? '0 Min',
        abandonment: dep.abandonment ?? '0 %'
      },
      width: '560px'
    });
    ref.afterClosed().subscribe(res => {
      if (!res?.id) return;
      this.store.updateDepartment(br.id, dep.id, {
        name: res.name!,
        counters: res.counters,
        staff: res.staff,
        totalTokens: res.totalTokens,
        servedTokens: res.servedTokens,
        missedTokens: res.missedTokens,
        cancelledTokens: res.cancelledTokens,
        avgWait: res.avgWait,
        avgService: res.avgService,
        abandonment: res.abandonment
      });
    });
  }

  confirmDelete(row: DepartmentRow) {
    const br = this.store.branches().find(b => b.name === row.branch);
    if (!br) return;
    const dep = br.departments.find(d => d.name === row.name.replace(' Department',''));
    if (!dep) return;
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Delete Department', message: `Delete "${dep.name}" from ${br.name}?`, confirmText: 'Delete', cancelText: 'Cancel' },
      width: '480px'
    });
    ref.afterClosed().subscribe(ok => { if (ok) this.store.deleteDepartment(br.id, dep.id); });
  }

  private mapDeps(b: BranchItem): DepartmentRow[] {
    return b.departments.map(d => ({
      name: `${d.name} Department`,
      branch: b.name,
      counters: `${d.counters ?? Math.max(1, d.queues.length)} Counter`,
      staff: `${d.staff ?? 0} Employees`,
      totalTokens: `${d.totalTokens ?? 0} Token`,
      servedTokens: `${d.servedTokens ?? 0} Token`,
      missedTokens: `${d.missedTokens ?? 0} Token`,
      cancelledTokens: `${d.cancelledTokens ?? 0} Token`,
      avgWait: d.avgWait ?? '0 Min',
      avgService: d.avgService ?? '0 Min',
      abandonment: d.abandonment ?? '0 %'
    }));
  }
}
