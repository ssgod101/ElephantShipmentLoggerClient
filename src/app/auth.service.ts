import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.setItem('needsReset', 'false');
    localStorage.removeItem('type');
    localStorage.removeItem('token');
  }
}
