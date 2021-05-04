import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";
import { Account } from "../account/account";
import { BASEURL } from "../constants";
import { RestfulService } from "../restful.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  msg: string;
  accounts: Account[];
  loginForm: FormGroup;
  username: FormControl;
  password: FormControl;

  constructor(private restService: RestfulService, private builder: FormBuilder, private router: Router, public authService: AuthService) {
    this.username = new FormControl('', Validators.compose([Validators.required]));
    this.password = new FormControl('', Validators.compose([Validators.required]));
    this.authService.logout();
  }

  ngOnInit() {
    this.msg = localStorage.getItem('msg');
    localStorage.removeItem('msg');

    this.restService.load(BASEURL + 'accounts').subscribe(
      accPayload => {
        this.accounts = accPayload._embedded.accounts;
      },
      err => {this.msg = `Error occurred - Cannot load existing accounts - ${err.status} - ${err.statusText}`;
      });

    this.loginForm = this.builder.group({
      username: this.username,
      password: this.password
    });
  }

  loginAccount() {
    let account = this.accounts.find(acc => acc.id === this.username.value)

    if (account != undefined && account.password === this.password.value) {
      localStorage.setItem('isLoggedIn', 'true');

      if (account.resetpassword == true) {
        localStorage.setItem('needsReset', 'true');
      }
      else {
        localStorage.setItem('needsReset', 'false');
      }

      localStorage.setItem('type', account.type);
      localStorage.setItem('token', JSON.stringify(account));

      if (account.resetpassword == true) {
        this.router.navigate(['/resetpassword']).then(() => {
          window.location.reload();
        });
      }
      else {
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      }
    }
    else {
      this.msg = 'Invalid username and/or password';
    }
  }
}
