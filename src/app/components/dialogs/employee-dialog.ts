import { Component, Inject, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MockStore } from '../../core/mock-store';

export interface EmployeeDialogData {
  id?: string;
  name?: string;
  code?: string;
  role?: string;
  branchId?: string;
  departmentId?: string;
  branchOptions?: { id: string; name: string }[];
  shifts?: string;
  totalTokens?: string;
  missedTokens?: string;
  avgService?: string;
  totalService?: string;
  idleTime?: string;
  satisfaction?: string;
  efficiency?: string;
}

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Employee' : 'Add Employee' }}</h2>
    <mat-dialog-content class="pad">
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Code</mat-label>
          <input matInput formControlName="code" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Role</mat-label>
          <input matInput formControlName="role" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Branch</mat-label>
          <mat-select formControlName="branchId">
            <mat-option *ngFor="let b of branchOpts" [value]="b.id">{{ b.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Department</mat-label>
          <mat-select formControlName="departmentId">
            <mat-option *ngFor="let d of deptOpts()" [value]="d.id">{{ d.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Shifts</mat-label>
          <input matInput formControlName="shifts" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Total Tokens</mat-label>
          <input matInput formControlName="totalTokens" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Missed Tokens</mat-label>
          <input matInput formControlName="missedTokens" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Avg Service</mat-label>
          <input matInput formControlName="avgService" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Total Service</mat-label>
          <input matInput formControlName="totalService" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Idle Time</mat-label>
          <input matInput formControlName="idleTime" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Satisfaction</mat-label>
          <input matInput formControlName="satisfaction" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Efficiency</mat-label>
          <input matInput formControlName="efficiency" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="pad-x">
      <button mat-button type="button" (click)="ref.close()">Cancel</button>
      <button mat-raised-button color="primary" class="btn-primary" [disabled]="form.invalid" (click)="onSubmit()">{{ data?.id ? 'Save' : 'Add' }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .pad { padding: 18px 16px 12px 16px; }
    .pad-x { padding: 0 16px 12px 16px; }
    .form { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 12px; }
  `
})
export class EmployeeDialog {
  form!: FormGroup;
  branchOpts: { id: string; name: string }[] = [];
  branchIdSig = signal<string | null>(null);
  deptOpts = computed(() => {
    const bId = this.branchIdSig();
    if (!bId) return [] as { id: string; name: string }[];
    const b = this.store.branches().find(x => x.id === bId);
    return (b?.departments || []).map(d => ({ id: d.id, name: d.name }));
  });

  constructor(
    public ref: MatDialogRef<EmployeeDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData,
    private store: MockStore
  ) {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      code: [this.data?.code ?? '', [Validators.required]],
      role: [this.data?.role ?? '', [Validators.required]],
      branchId: [this.data?.branchId ?? null, [Validators.required]],
      departmentId: [this.data?.departmentId ?? null, [Validators.required]],
      shifts: [this.data?.shifts ?? '0 Shift'],
      totalTokens: [this.data?.totalTokens ?? '0 Token'],
      missedTokens: [this.data?.missedTokens ?? '0 Token'],
      avgService: [this.data?.avgService ?? '0 Min'],
      totalService: [this.data?.totalService ?? '0 Hour'],
      idleTime: [this.data?.idleTime ?? '0 Hour'],
      satisfaction: [this.data?.satisfaction ?? '0 Star'],
      efficiency: [this.data?.efficiency ?? '0 %']
    });

    // Branch options: prefer provided options; else load from store
    this.branchOpts = (this.data?.branchOptions && this.data.branchOptions.length)
      ? this.data.branchOptions
      : this.store.branches().map(b => ({ id: b.id, name: b.name }));

    // Initialize branch signal with initial value; if missing, select first branch (add flow)
    const initialBranch = (this.form.get('branchId')!.value as string | null) || (this.branchOpts[0]?.id ?? null);
    if (initialBranch) this.form.patchValue({ branchId: initialBranch }, { emitEvent: false });
    this.branchIdSig.set(this.form.get('branchId')!.value as string | null);
    // React to branch changes (use form valueChanges instead of effect)
    this.form.get('branchId')!.valueChanges.subscribe((id: string | null) => {
      this.branchIdSig.set(id);
      const dId = this.form.get('departmentId')!.value as string | null;
      const valid = this.deptOpts().some(d => d.id === dId);
      if (!valid) this.form.patchValue({ departmentId: null }, { emitEvent: false });
      // If department is empty but options exist, preselect first
      const opts = this.deptOpts();
      if (!this.form.get('departmentId')!.value && opts.length > 0) {
        this.form.patchValue({ departmentId: opts[0].id }, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.ref.close({ ...this.data, ...this.form.value });
    }
  }
}
