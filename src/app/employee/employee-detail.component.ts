import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Account } from '../account/account';
import { BASEURL } from "../constants";
import { RestfulService } from "../restful.service";
import { Warehouse } from "../warehouse/warehouse";


@Component({
  selector: 'app-employee-detail',
  templateUrl: 'employee-detail.component.html'
})
export class EmployeeDetailComponent implements OnInit {
  @Input() currentAccount: Account;
  @Input() selectedAccount: Account;
  @Input() warehouses: Warehouse[];
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();
  accounts: Account[];
  accountForm: FormGroup;
  username: FormControl;
  password: FormControl;
  warehouseid: FormControl;
  type: FormControl;
  name: FormControl;
  email: FormControl;
  phonenumber: FormControl;
  wage: FormControl;
  wageunit: FormControl;
  resetpassword: FormControl;

  constructor(private restService: RestfulService, private builder: FormBuilder) {}

  ngOnInit() {
    this.restService.load(BASEURL + 'accounts').subscribe(
      payload => {
        this.accounts = payload._embedded.accounts;
      });
    if (!this.selectedAccount.id) {
      this.username = new FormControl('', Validators.compose([Validators.required, this.usernameValidator.bind(this)]));
      this.password = new FormControl('', Validators.compose([Validators.required, this.passwordValidator.bind(this)]));
    } else {
      this.password = new FormControl('', Validators.compose([this.passwordValidator.bind(this)]));
    }
    this.warehouseid = new FormControl('', Validators.compose([Validators.required]));
    this.type = new FormControl('', Validators.compose([Validators.required]));
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.email = new FormControl('', Validators.compose([Validators.required, Validators.email]));
    this.phonenumber = new FormControl('', Validators.compose([Validators.required, this.phoneValidator.bind(this)]));
    this.wage = new FormControl('', Validators.compose([Validators.required, this.wageValidator.bind(this)]));
    this.wageunit = new FormControl('', Validators.compose([Validators.required]));
    this.resetpassword = new FormControl('', Validators.compose([Validators.required]));
    if (!this.selectedAccount.id) {
      this.accountForm = this.builder.group({
        username: this.username,
        password: this.password,
        warehouseid: this.warehouseid,
        type: this.type,
        name: this.name,
        email: this.email,
        phonenumber: this.phonenumber,
        wage: this.wage,
        wageunit: this.wageunit,
        resetpassword: this.resetpassword
      });
    } else {
      this.accountForm = this.builder.group({
        password: this.password,
        warehouseid: this.warehouseid,
        type: this.type,
        name: this.name,
        email: this.email,
        phonenumber: this.phonenumber,
        wage: this.wage,
        wageunit: this.wageunit,
        resetpassword: this.resetpassword
      });
    }
    this.accountForm.patchValue({
      warehouseid: this.selectedAccount.warehouseid,
      type: this.selectedAccount.type,
      name: this.selectedAccount.name,
      email: this.selectedAccount.email,
      phonenumber: this.selectedAccount.phonenumber,
      wage: this.selectedAccount.wage,
      wageunit: this.selectedAccount.wageunit
    });

    if (this.selectedAccount.resetpassword) {
      this.accountForm.patchValue({
        resetpassword: 'Yes'
      });
    }
    else {
      this.accountForm.patchValue({
        resetpassword: 'No'
      });
    }
  }

  updateSelectedAccount() {
    if (!this.selectedAccount.id) {
      this.selectedAccount.id = this.accountForm.get('id').value;
      this.selectedAccount.password = this.accountForm.get('password').value;
    } else if (this.accountForm.get('password').value != "") {
      this.selectedAccount.password = this.accountForm.get('password').value;
    }
    this.selectedAccount.warehouseid = this.accountForm.get('warehouseid').value;
    this.selectedAccount.type = this.accountForm.get('type').value;
    this.selectedAccount.name = this.accountForm.get('name').value;
    this.selectedAccount.email = this.accountForm.get('email').value;
    this.selectedAccount.phonenumber = this.accountForm.get('phonenumber').value;
    this.selectedAccount.wage = this.accountForm.get('wage').value;
    this.selectedAccount.wageunit = this.accountForm.get('wageunit').value;
    this.selectedAccount.resetpassword = this.accountForm.get('resetpassword').value;
    this.saved.emit(this.selectedAccount);
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
