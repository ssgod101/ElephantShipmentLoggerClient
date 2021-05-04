import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "./auth.service";
import { RestfulService } from "./restful.service";
import { Notification } from "./notification/notification";
import { Account } from "./account/account";
import { BASEURL } from "./constants";

@Component({
  selector: 'app-elephantshipmentlogger',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  msg: string;
  isLoggedIn: boolean;
  needsReset: boolean;
  notificationShow: boolean;
  notificationActive: boolean;
  account: Account;

  constructor(private router: Router, public authService: AuthService, private restService: RestfulService) { }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.isLoggedIn = true;
      this.account = JSON.parse(localStorage.getItem('token'));
      this.restService.load(`${BASEURL}accounts/${this.account.id}`).subscribe(payload => {
        this.account = payload;
        if (this.account.resetpassword == true) {
          localStorage.setItem('needsReset', "true");
        }
        else {
          localStorage.setItem('needsReset', "false");
        }
        localStorage.setItem('type', this.account.type);
        localStorage.setItem('token', JSON.stringify(this.account));
      });
      this.restService.load(BASEURL+'notifications').subscribe(
        npayload => {
          let notifications : Array<Notification> = npayload._embedded.notifications;
          notifications = notifications.filter(n => n.companyid === this.account.companyid);
          if(this.account.type === 'Owner'){
            this.notificationShow = true;
            if(notifications.length > 0){this.notificationActive = true;}
            else{this.notificationActive = false;}
          }
          else{this.notificationShow = false; this.notificationActive = false;}
        }
      )
    } else {
      this.isLoggedIn = false;
    }

    if (localStorage.getItem('needsReset') === 'true') {
      this.needsReset = true;
    }
    else {
      this.needsReset = false;
    }
  }

  deleteLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.needsReset = false;
    localStorage.setItem('msg', `Account/Company deleted successfully`);
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.needsReset = false;
    localStorage.setItem('msg', `Logged out successfully`);
    this.router.navigate(['/login']);
  }
}// AppComponent class
