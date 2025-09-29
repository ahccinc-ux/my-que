import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

export interface BranchDialogData {
  id?: string;
  name?: string;
  hours?: string;
  staff?: number;
  tokens?: number;
  served?: number;
  missed?: number;
  cancelled?: number;
  avgWait?: string;
  avgDuration?: string;
}

@Component({
  selector: 'app-branch-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data?.id ? 'Edit Branch' : 'Add Branch' }}</h2>
    <mat-dialog-content class="pad">
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form">
        <mat-form-field appearance="outline">
          <mat-label>Branch Name</mat-label>
          <input matInput formControlName="name" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Operating Hours</mat-label>
          <input matInput formControlName="hours" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Staff</mat-label>
          <input matInput type="number" formControlName="staff" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Total Tokens</mat-label>
          <input matInput type="number" formControlName="tokens" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Served</mat-label>
          <input matInput type="number" formControlName="served" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Missed</mat-label>
          <input matInput type="number" formControlName="missed" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Cancelled</mat-label>
          <input matInput type="number" formControlName="cancelled" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Avg Wait</mat-label>
          <input matInput formControlName="avgWait" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Avg Duration</mat-label>
          <input matInput formControlName="avgDuration" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="pad-x">
      <button mat-button type="button" (click)="ref.close()">Cancel</button>
      <button mat-raised-button color="primary" class="btn-primary" [disabled]="form.invalid" (click)="onSubmit()">{{ data?.id ? 'Save' : 'Add' }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    .pad { padding: 12px 16px 4px 16px; }
    .pad-x { padding: 0 16px 12px 16px; }
    .form { display: grid; grid-template-columns: repeat(2, minmax(180px, 1fr)); gap: 12px; }
  `
})
export class BranchDialog {
  form!: FormGroup;

  constructor(
    public ref: MatDialogRef<BranchDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: BranchDialogData
  ) {
    // Initialize form after data and fb are available
    this.form = this.fb.group({
      name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
      hours: [this.data?.hours ?? '12 Hours', [Validators.required]],
      staff: [this.data?.staff ?? 0, [Validators.required, Validators.min(0)]],
      tokens: [this.data?.tokens ?? 0, [Validators.required, Validators.min(0)]],
      served: [this.data?.served ?? 0, [Validators.required, Validators.min(0)]],
      missed: [this.data?.missed ?? 0, [Validators.required, Validators.min(0)]],
      cancelled: [this.data?.cancelled ?? 0, [Validators.required, Validators.min(0)]],
      avgWait: [this.data?.avgWait ?? '0 Min', [Validators.required]],
      avgDuration: [this.data?.avgDuration ?? '0 Min', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.ref.close({ ...this.data, ...this.form.value });
    }
  }
}
