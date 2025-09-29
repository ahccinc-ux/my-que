import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MockStore } from '../../core/mock-store';

export interface DepartmentDialogData {
  id?: string;
  name?: string;
  // when adding, allow selecting target branch by ID
  branchId?: string;
  branchOptions?: { id: string; name: string }[];
  // when editing, branch selection should be disabled
  isEdit?: boolean;
  counters?: number;
  staff?: number;
  totalTokens?: number;
  servedTokens?: number;
  missedTokens?: number;
  cancelledTokens?: number;
  avgWait?: string;
  avgService?: string;
  abandonment?: string;
}

@Component({
  selector: 'app-department-dialog',
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
    <h2 mat-dialog-title>{{ data?.isEdit ? 'Edit Department' : 'Add Department' }}</h2>
    <mat-dialog-content class="pad">
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline" class="full">
          <mat-label>Department Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full">
          <mat-label>Branch</mat-label>
          <mat-select formControlName="branchId" [disabled]="data?.isEdit">
            <ng-container *ngIf="(data?.branchOptions?.length || 0) > 0; else fallbackOpts">
              <mat-option *ngFor="let b of data.branchOptions!" [value]="b.id">{{ b.name }}</mat-option>
            </ng-container>
            <ng-template #fallbackOpts>
              <mat-option *ngFor="let b of opts" [value]="b.id">{{ b.name }}</mat-option>
            </ng-template>
          </mat-select>
        </mat-form-field>
        <div class="hint" *ngIf="opts.length === 0">
          No branches found. Please add a branch first.
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Counters</mat-label>
          <input matInput type="number" formControlName="counters" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Staff</mat-label>
          <input matInput type="number" formControlName="staff" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Total Tokens</mat-label>
          <input matInput type="number" formControlName="totalTokens" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Served Tokens</mat-label>
          <input matInput type="number" formControlName="servedTokens" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Missed Tokens</mat-label>
          <input matInput type="number" formControlName="missedTokens" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cancelled Tokens</mat-label>
          <input matInput type="number" formControlName="cancelledTokens" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Average Wait</mat-label>
          <input matInput formControlName="avgWait" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Average Service</mat-label>
          <input matInput formControlName="avgService" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Abandonment</mat-label>
          <input matInput formControlName="abandonment" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="pad-x">
      <button mat-button type="button" (click)="ref.close()">Cancel</button>
      <button mat-raised-button color="primary" class="btn-primary" [disabled]="form.invalid" (click)="onSubmit()">{{ data?.isEdit ? 'Save' : 'Add' }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .pad { padding: 24px 16px 16px 16px; }
    .pad-x { padding: 0 16px 12px 16px; }
    .form { display: grid; grid-template-columns: repeat(2, minmax(190px, 1fr)); gap: 18px; }
    .full { grid-column: 1 / -1; }
  `
})
export class DepartmentDialog {
  form!: FormGroup;
  opts: { id: string; name: string }[] = [];
  constructor(
    public ref: MatDialogRef<DepartmentDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DepartmentDialogData,
    private store: MockStore
  ) {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      branchId: [this.data?.branchId ?? null, [Validators.required]],
      counters: [this.data?.counters ?? 1, [Validators.required, Validators.min(0)]],
      staff: [this.data?.staff ?? 0, [Validators.required, Validators.min(0)]],
      totalTokens: [this.data?.totalTokens ?? 0, [Validators.required, Validators.min(0)]],
      servedTokens: [this.data?.servedTokens ?? 0, [Validators.required, Validators.min(0)]],
      missedTokens: [this.data?.missedTokens ?? 0, [Validators.required, Validators.min(0)]],
      cancelledTokens: [this.data?.cancelledTokens ?? 0, [Validators.required, Validators.min(0)]],
      avgWait: [this.data?.avgWait ?? '0 Min', [Validators.required]],
      avgService: [this.data?.avgService ?? '0 Min', [Validators.required]],
      abandonment: [this.data?.abandonment ?? '0 %', [Validators.required]]
    });

    // Ensure branch options are populated even if not provided via data
    this.opts = (this.data?.branchOptions && this.data.branchOptions.length)
      ? this.data.branchOptions
      : this.store.branches().map(b => ({ id: b.id, name: b.name }));

    // If no branch is preselected and options exist, select first
    if (!this.form.value.branchId && this.opts.length > 0 && !this.data?.isEdit) {
      this.form.patchValue({ branchId: this.opts[0].id });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.ref.close({ ...this.data, ...this.form.value });
    }
  }
}
