import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

export interface QueueDialogData {
  id?: string;
  name?: string;
  number?: number;
  currentNumber?: number;
  totalReserved?: number;
  slotTimeMin?: number;
  waitingCount?: number;
  branchId?: string;
  departmentId?: string;
  isEdit?: boolean;
  branchOptions?: { id: string; name: string }[];
  departmentOptions?: { id: string; name: string }[];
}

@Component({
  selector: 'app-queue-dialog',
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
    <h2 mat-dialog-title>{{ data?.isEdit ? 'Edit Queue' : 'Add Queue' }}</h2>
    <mat-dialog-content class="pad">
      <form [formGroup]="form" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Queue Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Queue Number</mat-label>
          <input matInput type="number" formControlName="number" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Current Number</mat-label>
          <input matInput type="number" formControlName="currentNumber" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Total Reserved</mat-label>
          <input matInput type="number" formControlName="totalReserved" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Slot Time (Min)</mat-label>
          <input matInput type="number" formControlName="slotTimeMin" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Waiting Count</mat-label>
          <input matInput type="number" formControlName="waitingCount" />
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Branch</mat-label>
          <mat-select formControlName="branchId" [disabled]="data?.isEdit">
            <mat-option *ngFor="let b of data.branchOptions || []" [value]="b.id">{{ b.name }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full">
          <mat-label>Department</mat-label>
          <mat-select formControlName="departmentId" [disabled]="data?.isEdit">
            <mat-option *ngFor="let d of data.departmentOptions || []" [value]="d.id">{{ d.name }}</mat-option>
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="pad-x">
      <button mat-button type="button" (click)="ref.close()">Cancel</button>
      <button mat-raised-button color="primary" class="btn-primary" [disabled]="form.invalid" (click)="onSubmit()">{{ data?.isEdit ? 'Save' : 'Add' }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .pad { padding: 18px 16px 12px 16px; }
    .pad-x { padding: 0 16px 12px 16px; }
    .form { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 12px; }
    .full { grid-column: 1 / -1; }
  `
})
export class QueueDialog {
  form!: FormGroup;
  constructor(
    public ref: MatDialogRef<QueueDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: QueueDialogData
  ) {
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      number: [this.data?.number ?? 1, [Validators.required, Validators.min(1)]],
      currentNumber: [this.data?.currentNumber ?? 0, [Validators.required, Validators.min(0)]],
      totalReserved: [this.data?.totalReserved ?? 0, [Validators.required, Validators.min(0)]],
      slotTimeMin: [this.data?.slotTimeMin ?? 10, [Validators.required, Validators.min(1)]],
      waitingCount: [this.data?.waitingCount ?? 0, [Validators.required, Validators.min(0)]],
      branchId: [this.data?.branchId ?? null, [Validators.required]],
      departmentId: [this.data?.departmentId ?? null, [Validators.required]]
    });
  }
  onSubmit() {
    if (this.form.valid) {
      this.ref.close({ ...this.data, ...this.form.value });
    }
  }
}
