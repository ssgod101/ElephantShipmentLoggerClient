import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router : Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.verifyLogin(state.url);
  }

  verifyLogin(url) : boolean {
    if (!this.isLoggedIn()) {
      if (url != '/login' && url != '/register') {
        this.router.navigate(['/login']);
        return false;
      }
      else {
        return true;
      }
    }
    else if (this.isLoggedIn() && this.needsReset()) {
      if (url != '/resetpassword') {
        this.router.navigate(['/resetpassword']);
        return false;
      }
      else {
        return true;
      }
    }
    else if (this.isLoggedIn() && !this.needsReset()) {
      if (url === '/login' || url === '/register' || url === '/resetpassword' ||
        (localStorage.getItem('type') == 'Associate' && url === '/employees')) {
        this.router.navigate(['/']);
        return false;
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }

  public isLoggedIn(): boolean {
    if(localStorage.getItem('isLoggedIn') == 'true') {
      return true;
    }
    else {
      return false;
    }
  }

  public needsReset(): boolean {
    if(localStorage.getItem('needsReset') == 'true') {
      return true;
    }
    else {
      return false;
    }
  }
}
