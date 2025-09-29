import { Component, ViewChild, AfterViewInit, effect, inject } from '@angular/core';
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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MockStore, EmployeeItem } from '../../core/mock-store';
import { ConfirmDialog } from '../../components/dialogs/confirm-dialog';

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
                <mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option>
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
            <button mat-icon-button aria-label="add" (click)="openAdd()"><mat-icon>add</mat-icon></button>
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
    .link { color: var(--brand-green-700); cursor: pointer; text-decoration: underline; }
  `
})
export class Employees implements AfterViewInit {
  private store = inject(MockStore);
  private dialog = inject(MatDialog);
  branches: { id: string; name: string }[] = [];
  departments: { id: string; name: string; branchId: string }[] = [];
  filters!: FormGroup;

  displayedColumns = ['name','code','role','branch','department','shifts','totalTokens','missedTokens','avgService','totalService','idleTime','satisfaction','efficiency','actions'];
  data: EmployeeRow[] = [];
  dataSource = new MatTableDataSource<EmployeeRow>(this.data);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) {
    this.filters = this.fb.group({ branch: [null], department: [null] });

    effect(() => {
      const branches = this.store.branches();
      this.branches = branches.map(b => ({ id: b.id, name: b.name }));
      this.departments = branches.flatMap(b => b.departments.map(d => ({ id: d.id, name: d.name, branchId: b.id })));
      const rows = this.store.employees().map(e => this.toRow(e));
      this.data = rows;
      this.dataSource.data = rows;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilters() {
    const { branch, department } = this.filters.value as { branch: string | null; department: string | null };
    this.dataSource.filterPredicate = (row) => {
      const okB = branch ? row.branch === (this.branches.find(b => b.id === branch)?.name || '') : true;
      const okD = department ? row.department === (this.departments.find(d => d.id === department)?.name || '') : true;
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
    import('../../components/dialogs/employee-dialog').then(m => {
      const ref = this.dialog.open(m.EmployeeDialog, { data: { branchOptions }, width: '640px' });
      ref.afterClosed().subscribe((res: any) => {
        if (!res?.name || !res?.code || !res?.role || !res?.branchId || !res?.departmentId) return;
        this.store.addEmployee({
          name: res.name, code: res.code, role: res.role, branchId: res.branchId, departmentId: res.departmentId,
          shifts: res.shifts ?? '0 Shift', totalTokens: res.totalTokens ?? '0 Token', missedTokens: res.missedTokens ?? '0 Token',
          avgService: res.avgService ?? '0 Min', totalService: res.totalService ?? '0 Hour', idleTime: res.idleTime ?? '0 Hour',
          satisfaction: res.satisfaction ?? '0 Star', efficiency: res.efficiency ?? '0 %'
        });
      });
    });
  }

  openEdit(row: EmployeeRow) {
    const emp = this.store.employees().find(e => e.name === row.name && e.code === row.code);
    if (!emp) return;
    const branchOptions = this.branches;
    import('../../components/dialogs/employee-dialog').then(m => {
      const ref = this.dialog.open(m.EmployeeDialog, {
        data: {
          id: emp.id,
          name: emp.name, code: emp.code, role: emp.role,
          branchId: emp.branchId, departmentId: emp.departmentId,
          branchOptions,
          shifts: emp.shifts, totalTokens: emp.totalTokens, missedTokens: emp.missedTokens,
          avgService: emp.avgService, totalService: emp.totalService, idleTime: emp.idleTime,
          satisfaction: emp.satisfaction, efficiency: emp.efficiency
        },
        width: '640px'
      });
      ref.afterClosed().subscribe((res: any) => {
        if (!res?.id) return;
        const { id, ...patch } = res as any;
        this.store.updateEmployee(emp.id, patch);
      });
    });
  }

  confirmDelete(row: EmployeeRow) {
    const emp = this.store.employees().find(e => e.name === row.name && e.code === row.code);
    if (!emp) return;
    const ref = this.dialog.open(ConfirmDialog, {
      data: { title: 'Delete Employee', message: `Delete ${emp.name} (${emp.code})?`, confirmText: 'Delete', cancelText: 'Cancel' },
      width: '480px'
    });
    ref.afterClosed().subscribe(ok => { if (ok) this.store.deleteEmployee(emp.id); });
  }

  private toRow(e: EmployeeItem): EmployeeRow {
    const b = this.store.branches().find(x => x.id === e.branchId);
    const d = b?.departments.find(y => y.id === e.departmentId);
    return {
      name: e.name,
      code: e.code,
      role: e.role,
      branch: b?.name || '',
      department: d?.name || '',
      shifts: e.shifts,
      totalTokens: e.totalTokens,
      missedTokens: e.missedTokens,
      avgService: e.avgService,
      totalService: e.totalService,
      idleTime: e.idleTime,
      satisfaction: e.satisfaction,
      efficiency: e.efficiency
    };
  }
}
