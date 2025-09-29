import { Injectable, signal, computed, effect } from '@angular/core';

// Core domain models
export interface QueueItem {
  id: string;
  name: string; // e.g., Cheese Queue 1
  number: number; // queue number
  currentNumber: number;
  totalReserved: number;
  slotTimeMin: number;
  waitingCount: number;
}

export interface DepartmentItem {
  id: string;
  name: string; // e.g., Cheese
  queues: QueueItem[];
  // per-department metrics
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

export interface BranchItem {
  id: string;
  name: string; // e.g., Heliopolis
  hours: string;
  departments: DepartmentItem[];
  // summary demo metrics
  staff: number;
  tokens: number;
  served: number;
  missed: number;
  cancelled: number;
  avgWait: string;
  avgDuration: string;
}

export interface EmployeeItem {
  id: string;
  name: string;
  code: string;
  role: string;
  branchId: string;
  departmentId: string;
  shifts: string;
  totalTokens: string;
  missedTokens: string;
  avgService: string;
  totalService: string;
  idleTime: string;
  satisfaction: string;
  efficiency: string;
}

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

@Injectable({ providedIn: 'root' })
export class MockStore {
  private STORAGE_KEY = 'myque_store_v1';

  // Initial demo data: one department -> one branch -> one queue
  private initial = (() => {
    const depId = uid('dep');
    const brId = uid('br');
    const qId = uid('q');

    const queue: QueueItem = {
      id: qId,
      name: 'Cheese Queue 1',
      number: 1,
      currentNumber: 35,
      totalReserved: 175,
      slotTimeMin: 12,
      waitingCount: 13
    };

    const department: DepartmentItem = {
      id: depId,
      name: 'Cheese',
      queues: [queue],
      counters: 1,
      staff: 3,
      totalTokens: 7450,
      servedTokens: 7000,
      missedTokens: 350,
      cancelledTokens: 240,
      avgWait: '13.5 Min',
      avgService: '17 Min',
      abandonment: '5 %'
    };

    const branch: BranchItem = {
      id: brId,
      name: 'Heliopolis',
      hours: '13 Hours',
      departments: [department],
      staff: 6,
      tokens: 7450,
      served: 7000,
      missed: 350,
      cancelled: 100,
      avgWait: '17 Min',
      avgDuration: '25 Min'
    };

    const employee: EmployeeItem = {
      id: uid('emp'),
      name: 'Ahmed',
      code: '5031',
      role: 'Queue Manager',
      branchId: brId,
      departmentId: depId,
      shifts: '150 Shift',
      totalTokens: '7450 Token',
      missedTokens: '350 Token',
      avgService: '11.5 Min',
      totalService: '620 Hour',
      idleTime: '9.5 Hour',
      satisfaction: '4.5 Star',
      efficiency: '98 %'
    };

    return { branch, employee };
  })();

  // State
  private _branches = signal<BranchItem[]>(this.load().branches);
  private _employees = signal<EmployeeItem[]>(this.load().employees);

  // Derived
  branches = computed(() => this._branches());
  employees = computed(() => this._employees());
  branchNames = computed(() => this._branches().map(b => b.name));
  departmentNames = computed(() =>
    Array.from(new Set(this._branches().flatMap(b => b.departments.map(d => d.name))))
  );

  // Find helpers
  getBranchById(id: string) { return this._branches().find(b => b.id === id) || null; }
  getDepartmentById(branchId: string, depId: string) {
    return this.getBranchById(branchId)?.departments.find(d => d.id === depId) || null;
  }

  // CRUD: Branches
  addBranch(payload: Partial<BranchItem> & { name: string }): BranchItem {
    const item: BranchItem = {
      id: uid('br'),
      name: payload.name,
      hours: payload.hours ?? '12 Hours',
      departments: payload.departments ?? [],
      staff: payload.staff ?? 0,
      tokens: payload.tokens ?? 0,
      served: payload.served ?? 0,
      missed: payload.missed ?? 0,
      cancelled: payload.cancelled ?? 0,
      avgWait: payload.avgWait ?? '0 Min',
      avgDuration: payload.avgDuration ?? '0 Min'
    };
    this._branches.update(list => [...list, item]);
    return item;
  }

  updateBranch(id: string, patch: Partial<BranchItem>) {
    this._branches.update(list => list.map(b => b.id === id ? { ...b, ...patch } : b));
  }

  deleteBranch(id: string) {
    // Also detach employees referencing this branch
    this._employees.update(list => list.filter(e => e.branchId !== id));
    this._branches.update(list => list.filter(b => b.id !== id));
    this.save();
  }

  // CRUD: Departments
  addDepartment(branchId: string, payload: {
    name: string;
    counters?: number; staff?: number; totalTokens?: number; servedTokens?: number;
    missedTokens?: number; cancelledTokens?: number; avgWait?: string; avgService?: string; abandonment?: string;
  }): DepartmentItem | null {
    const dep: DepartmentItem = {
      id: uid('dep'),
      name: payload.name,
      queues: [],
      counters: payload.counters ?? 1,
      staff: payload.staff ?? 0,
      totalTokens: payload.totalTokens ?? 0,
      servedTokens: payload.servedTokens ?? 0,
      missedTokens: payload.missedTokens ?? 0,
      cancelledTokens: payload.cancelledTokens ?? 0,
      avgWait: payload.avgWait ?? '0 Min',
      avgService: payload.avgService ?? '0 Min',
      abandonment: payload.abandonment ?? '0 %'
    };
    this._branches.update(list => list.map(b => b.id === branchId ? { ...b, departments: [...b.departments, dep] } : b));
    return dep;
  }

  updateDepartment(branchId: string, depId: string, patch: Partial<DepartmentItem>) {
    this._branches.update(list => list.map(b => b.id !== branchId ? b : ({
      ...b,
      departments: b.departments.map(d => d.id === depId ? { ...d, ...patch } : d)
    })));
  }

  deleteDepartment(branchId: string, depId: string) {
    // Detach employees in this department
    this._employees.update(list => list.filter(e => !(e.branchId === branchId && e.departmentId === depId)));
    this._branches.update(list => list.map(b => b.id !== branchId ? b : ({
      ...b,
      departments: b.departments.filter(d => d.id !== depId)
    })));
  }

  // CRUD: Queues
  addQueue(branchId: string, depId: string, payload: Omit<QueueItem, 'id'>): QueueItem | null {
    const q: QueueItem = { id: uid('q'), ...payload };
    this._branches.update(list => list.map(b => b.id !== branchId ? b : ({
      ...b,
      departments: b.departments.map(d => d.id !== depId ? d : ({ ...d, queues: [...d.queues, q] }))
    })));
    return q;
  }

  updateQueue(branchId: string, depId: string, qId: string, patch: Partial<QueueItem>) {
    this._branches.update(list => list.map(b => b.id !== branchId ? b : ({
      ...b,
      departments: b.departments.map(d => d.id !== depId ? d : ({
        ...d,
        queues: d.queues.map(q => q.id === qId ? { ...q, ...patch } : q)
      }))
    })));
  }

  deleteQueue(branchId: string, depId: string, qId: string) {
    this._branches.update(list => list.map(b => b.id !== branchId ? b : ({
      ...b,
      departments: b.departments.map(d => d.id !== depId ? d : ({
        ...d,
        queues: d.queues.filter(q => q.id !== qId)
      }))
    })));
  }

  // CRUD: Employees
  addEmployee(payload: Omit<EmployeeItem, 'id'>): EmployeeItem {
    const emp: EmployeeItem = { id: uid('emp'), ...payload };
    this._employees.update(list => [...list, emp]);
    return emp;
  }

  updateEmployee(id: string, patch: Partial<EmployeeItem>) {
    this._employees.update(list => list.map(e => e.id === id ? { ...e, ...patch } : e));
  }

  deleteEmployee(id: string) {
    this._employees.update(list => list.filter(e => e.id !== id));
  }

  // Persistence
  private save() {
    const snapshot = {
      branches: this._branches(),
      employees: this._employees()
    };
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snapshot)); } catch {}
  }

  private load(): { branches: BranchItem[]; employees: EmployeeItem[] } {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { branches: [this.initial.branch], employees: [this.initial.employee] };
  }

  constructor() {
    // Auto-save when either branches or employees state changes
    effect(() => {
      // Access signals to create dependency
      void this._branches();
      void this._employees();
      this.save();
    });
  }
}
