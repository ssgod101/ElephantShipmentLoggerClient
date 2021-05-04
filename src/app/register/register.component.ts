import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Account } from '../account/account';
import { Company } from '../company/company';
import { RestfulService } from '../restful.service';
import { BASEURL } from '../constants';
import { Router } from "@angular/router";
import { AuthService } from "../auth.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit {
  msg: string;
  accounts: Account[];
  registerForm: FormGroup;
  username: FormControl;
  password: FormControl;
  companyname: FormControl;
  name: FormControl;
  email: FormControl;
  phone: FormControl;
  wage: FormControl;
  wageunit: FormControl;

  constructor(private restService: RestfulService, private builder: FormBuilder, private router: Router, public authService: AuthService) {
    this.msg = '';
    this.username = new FormControl('', Validators.compose([Validators.required, this.usernameValidator.bind(this)]));
    this.password = new FormControl('', Validators.compose([Validators.required, this.passwordValidator.bind(this)]));
    this.companyname = new FormControl('', Validators.compose([Validators.required]));
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.email = new FormControl('', Validators.compose([Validators.required, Validators.email]));
    this.phone = new FormControl('', Validators.compose([Validators.required, this.phoneValidator.bind(this)]));
    this.wage = new FormControl('', Validators.compose([Validators.required, this.wageValidator.bind(this)]));
    this.wageunit = new FormControl('', Validators.compose([Validators.required]));
    this.authService.logout();
  }

  ngOnInit() {
    this.restService.load(BASEURL + 'accounts').subscribe(
      accPayload => {
        this.accounts = accPayload._embedded.accounts;
      },
      err => {this.msg = `Error occurred - Cannot load existing accounts - ${err.status} - ${err.statusText}`;
      });

    this.registerForm = this.builder.group({
      username: this.username,
      password: this.password,
      companyname: this.companyname,
      name: this.name,
      email: this.email,
      phone: this.phone,
      wage: this.wage,
      wageunit: this.wageunit
    });
  }

  registerAccount() {
    let company: Company = {
      id: null,
      name: this.companyname.value,
      accounts: null
    };

    this.restService.add(BASEURL + 'companies', company).subscribe(
      payload => {
        if (payload.id > 0) {
          let account: Account = {
            id: this.username.value,
            companyid: payload.id,
            warehouseid: null,
            password: this.password.value,
            type: 'Owner',
            name: this.name.value,
            email: this.email.value,
            phonenumber: this.phone.value,
            wage: this.wage.value,
            wageunit: this.wageunit.value,
            resetpassword: false
          };

          this.restService.add(BASEURL + 'accounts', account).subscribe(
            payload2 => {
              if (payload2.id != '') {
                this.accounts = [...this.accounts, account];
                account.id = payload2.id;
                localStorage.setItem('msg', `Account created successfully`);
                this.router.navigate(['/login']);
              } else {
                this.msg = 'Account not created - server error';
              }
            },
            err => {
              this.msg = `Error - account not created - ${err.status} - ${err.statusText}`;
            }
          );
        } else {
          this.msg = 'Company not created - server error';
        }
      },
      err => {
        this.msg = `Error - company not created - ${err.status} - ${err.statusText}`;
      }
    );
  }

  usernameValidator(control) {
    if (control.value.length < 4) {
      return control.value.length < 4 ? {invalidUsername: true} : null;
    }
    else if (this.accounts) {
      return this.accounts.find(acc => acc.id === control.value) ? {usernameExists: true} : null;
    }
  }

  passwordValidator(control) {
    return control.value.length < 8 ? {invalidPassword: true} : null;
  }

  phoneValidator(control) {
    const PHONE_REGEXP = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
    return !PHONE_REGEXP.test(control.value) ? {invalidPhone: true} : null;
  }

  wageValidator(control) {
    const DECIMAL_REGEXP = /^\d+(\.\d{1,2})?$/i;
    return !DECIMAL_REGEXP.test(control.value) ? {invalidWage: true} : null;
  }
}
