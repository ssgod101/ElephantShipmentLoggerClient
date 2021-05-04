import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Account } from "../account/account";
import { RestfulService } from "../restful.service";
import { AuthService } from "../auth.service";
import { BASEURL } from '../constants';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styles: []
})
export class ResetPasswordComponent implements OnInit {
  msg: string;
  account: Account;
  resetPasswordForm: FormGroup;
  password: FormControl;

  constructor(private restService: RestfulService, private builder: FormBuilder, private router: Router, public authService: AuthService) {
    this.password = new FormControl('', Validators.compose([Validators.required, this.passwordValidator.bind(this)]));
  }

  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('token'));

    this.resetPasswordForm = this.builder.group({
      password: this.password
    });
  }

  changePassword() {
    this.account.password = this.password.value;
    this.account.resetpassword = false;

    this.restService.update(BASEURL + 'accounts/' + this.account.id, this.account).subscribe( payload => {
        if (payload.id != '') {
          localStorage.setItem('token', JSON.stringify(this.account));
          localStorage.setItem('needsReset', "false");
          localStorage.setItem('msg', `Password changed successfully`);

          this.router.navigate(["/"]).then(() => {
            window.location.reload();
          });
        } else {
          this.msg = 'Password not updated - Server problem';
        }
      },
      err => {
        this.msg = `Error - password not updated - ${err.status} - ${err.statusText}`;
      }
    );
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"]).then(() => {
      window.location.reload();
    });
  }

  passwordValidator(control) {
    return control.value.length < 8 ? {invalidPassword: true} : null;
  }
}
