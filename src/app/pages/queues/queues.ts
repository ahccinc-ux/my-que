import { Component, ViewChild, AfterViewInit, effect, inject } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MockStore, BranchItem, QueueItem } from '../../core/mock-store';
import { ConfirmDialog } from '../../components/dialogs/confirm-dialog';

interface QueueRow {
  id: string;
  branchId: string;
  depId: string;
  branch: string;
  department: string;
  queueName: string;
  queueNumber: string;
  currentNumber: string;
  totalReserved: string;
  slotTime: string;
  waitingCount: string;
}

function fmt(q: QueueItem) {
  return {
    id: q.id,
    queueName: q.name,
    queueNumber: `${q.number}`.padStart(2, '0'),
    currentNumber: `${q.currentNumber}`,
    totalReserved: `${q.totalReserved} Token`,
    slotTime: `${q.slotTimeMin} Min`,
    waitingCount: `${q.waitingCount} Customer`
  };
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
            <mat-form-field appearance="outline">
              <mat-label>Select Department</mat-label>
              <mat-select formControlName="department">
                <mat-option *ngFor="let d of departmentsFiltered" [value]="d.id">{{ d.name }}</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          <div class="actions">
            <button mat-raised-button color="primary" class="btn-primary" type="button" (click)="applyFilters()">
              <mat-icon>filter_list</mat-icon>
              Apply
            </button>
            <button mat-button type="button" (click)="resetFilters()">Reset</button>
            <button mat-raised-button color="accent" type="button" (click)="openAdd()">
              <mat-icon>add</mat-icon>
              Add Queue
            </button>
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
  private store = inject(MockStore);
  private dialog = inject(MatDialog);
  branches: { id: string; name: string }[] = [];
  departments: { id: string; name: string; branchId: string }[] = [];
  departmentsFiltered: { id: string; name: string; branchId: string }[] = [];

  filters!: FormGroup;
  displayedColumns = ['queueName','queueNumber','branch','department','currentNumber','totalReserved','slotTime','waitingCount','actions'];
  data: QueueRow[] = [];
  dataSource = new MatTableDataSource<QueueRow>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.filters = this.fb.group({ branch: [null], department: [null] });

    effect(() => {
      const branches = this.store.branches();
      this.branches = branches.map(b => ({ id: b.id, name: b.name }));
      this.departments = branches.flatMap(b => b.departments.map(d => ({ id: d.id, name: d.name, branchId: b.id })));

      const selectedBranch = this.filters?.value?.branch as string | null;
      this.departmentsFiltered = selectedBranch
        ? this.departments.filter(d => d.branchId === selectedBranch)
        : this.departments;

      const rows: QueueRow[] = branches.flatMap(b => b.departments.flatMap(d => d.queues.map(q => ({
        id: q.id,
        branchId: b.id,
        depId: d.id,
        branch: b.name,
        department: d.name,
        ...fmt(q)
      }))));
      this.data = rows;
      this.dataSource.data = rows;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // placeholder retained
  filteredDepartments = () => this.departmentsFiltered;

  applyFilters() {
    const { branch, department } = this.filters.value as { branch: string | null; department: string | null };
    this.dataSource.filterPredicate = (row) => {
      const okB = branch ? row.branchId === branch : true;
      const okD = department ? row.depId === department : true;
      return okB && okD;
    };
    this.dataSource.filter = Math.random().toString();
  }

  resetFilters() {
    this.filters.reset({ branch: null, department: null });
    this.dataSource.filter = '';
  }

  openAdd() {
    const branchOptions = this.branches;
    const selectedBranch = this.filters.value.branch as string | null;
    const departments = selectedBranch ? this.departments.filter(d => d.branchId === selectedBranch) : this.departments;
    import('../../components/dialogs/queue-dialog').then(m => {
      const ref = this.dialog.open(m.QueueDialog, {
        data: { branchOptions, departmentOptions: departments }, width: '640px'
      });
      ref.afterClosed().subscribe((res: any) => {
        if (!res?.branchId || !res?.departmentId || !res?.name) return;
        this.store.addQueue(res.branchId, res.departmentId, {
          name: res.name,
          number: Number(res.number ?? 1),
          currentNumber: Number(res.currentNumber ?? 0),
          totalReserved: Number(res.totalReserved ?? 0),
          slotTimeMin: Number(res.slotTimeMin ?? 0),
          waitingCount: Number(res.waitingCount ?? 0)
        });
      });
    });
  }

  openEdit(row: QueueRow) {
    const branchOptions = this.branches;
    const departments = this.departments.filter(d => d.branchId === row.branchId);
    import('../../components/dialogs/queue-dialog').then(m => {
      const ref = this.dialog.open(m.QueueDialog, {
        data: {
          id: row.id,
          name: row.queueName,
          number: Number(row.queueNumber),
          currentNumber: Number(row.currentNumber),
          totalReserved: Number(row.totalReserved),
          slotTimeMin: Number(row.slotTime),
          waitingCount: Number(row.waitingCount),
          branchId: row.branchId,
          departmentId: row.depId,
          branchOptions,
          departmentOptions: departments,
          isEdit: true
        }, width: '640px'
      });
      ref.afterClosed().subscribe((res: any) => {
        if (!res?.id) return;
        this.store.updateQueue(row.branchId, row.depId, row.id, {
          name: res.name,
          number: Number(res.number ?? 1),
          currentNumber: Number(res.currentNumber ?? 0),
          totalReserved: Number(res.totalReserved ?? 0),
          slotTimeMin: Number(res.slotTimeMin ?? 0),
          waitingCount: Number(res.waitingCount ?? 0)
        });
      });
    });
  }

  confirmDelete(row: QueueRow) {
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Delete Queue', message: `Delete ${row.queueName}?`, confirmText: 'Delete', cancelText: 'Cancel' },
      width: '480px'
    });
    ref.afterClosed().subscribe(ok => { if (ok) this.store.deleteQueue(row.branchId, row.depId, row.id); });
  }
}
