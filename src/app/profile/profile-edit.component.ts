import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Account } from '../account/account';
import { BASEURL } from '../constants';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styles: []
})
export class ProfileEditComponent implements OnInit {
  @Output() update = new EventEmitter();
  @Output() cancel = new EventEmitter();
  account: Account;
  editProfileForm: FormGroup;
  password: FormControl;
  name: FormControl;
  email: FormControl;
  phone: FormControl;
  wage: FormControl;
  wageunit: FormControl;

  constructor(private builder: FormBuilder) {
    this.account = JSON.parse(localStorage.getItem('token'));
    this.password = new FormControl('', Validators.compose([this.passwordValidator.bind(this)]));
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.email = new FormControl('', Validators.compose([Validators.required, Validators.email]));
    this.phone = new FormControl('', Validators.compose([Validators.required, this.phoneValidator.bind(this)]));
    if (this.account.type === 'Owner') {
      this.wage = new FormControl('', Validators.compose([Validators.required, this.wageValidator.bind(this)]));
      this.wageunit = new FormControl('', Validators.compose([Validators.required]));
    }
  }

  ngOnInit() {
    if (this.account.type === 'Owner') {
      this.editProfileForm = this.builder.group({
        password: this.password,
        name: this.name,
        email: this.email,
        phone: this.phone,
        wage: this.wage,
        wageunit: this.wageunit
      });
      this.editProfileForm.patchValue({
        name: this.account.name,
        email: this.account.email,
        phone: this.account.phonenumber,
        wage: this.account.wage,
        wageunit: this.account.wageunit
      });
    } else {
      this.editProfileForm = this.builder.group({
        password: this.password,
        name: this.name,
        email: this.email,
        phone: this.phone
      });
      this.editProfileForm.patchValue({
        password: this.account.password,
        name: this.account.name,
        email: this.account.email,
        phone: this.account.phonenumber
      });
    }
  }

  editProfile() {
    this.account.password = this.password.value;
    this.account.name = this.name.value;
    this.account.email = this.email.value;
    this.account.phonenumber = this.phone.value;

    if (this.account.type === 'Owner') {
      this.account.wage = this.wage.value;
      this.account.wageunit = this.wageunit.value;
    }

    this.update.emit(this.account);
  }

  passwordValidator(control) {
    return control.value.length < 8 && control.value.length !== 0 ? {invalidPassword: true} : null;
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
