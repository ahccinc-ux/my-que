import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private _isAuthed = signal<boolean>(false);

  isAuthenticated() {
    return this._isAuthed();
  }

  login(email: string, password: string) {
    // Demo: accept any non-empty credentials
    if (email?.trim() && password?.trim()) {
      this._isAuthed.set(true);
    }
    return this._isAuthed();
  }

  logout() {
    this._isAuthed.set(false);
  }
}
