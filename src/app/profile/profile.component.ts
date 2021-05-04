import { Component, OnInit, } from '@angular/core';
import { BASEURL } from '../constants';
import { Account } from "../account/account";
import { RestfulService } from "../restful.service";
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  hideEditForm: boolean;
  msg: string;
  confirmation: string;
  account: Account;
  username: string;
  company: string;
  companyrole: string;
  name: string;
  email: string;
  phonenumber: string;
  wage: string;

  constructor(private restService: RestfulService, public app: AppComponent) {
    this.hideEditForm = true;
  }

  ngOnInit() {
    this.confirmation = '';
    this.account = JSON.parse(localStorage.getItem('token'));
    this.username = this.account.id;
    this.restService.load(BASEURL + 'companies/' + this.account.companyid).subscribe(
      company => {
        this.company = company.name;
      });
    this.companyrole = this.account.type;
    this.name = this.account.name;
    this.email = this.account.email;
    this.phonenumber = this.account.phonenumber;
    this.wage = '$' + this.account.wage + this.account.wageunit;
  }

  editProfileOnOff() {
    this.msg = '';
    this.hideEditForm = !this.hideEditForm;
  }

  userConfirmation() {
    if (this.confirmation === '') {
      this.confirmation = "Are you sure you would like to delete your account and the company? You will be logged out."
    }
    else {
      this.confirmation = "";
    }
  }

  deleteAccountCompany() {
    let employees: Account[];
    this.confirmation = "";

    this.restService.delete(BASEURL + 'companies/' + 'search/deleteOne?companyid=' + this.account.companyid)
      .subscribe(payload => {
        if (payload === 1) { // server returns # rows deleted
          this.msg = `Account/Company deleted`;
          this.app.deleteLogout();
        } else {
          this.msg = 'Account/Company not deleted - Server problem';
        }
      });
  }

  updateProfile(acc: Account) {
    this.account = acc;

    this.restService.update(BASEURL + 'accounts/' + this.account.id, this.account).subscribe( payload => {
        if (payload.id != '') {
          localStorage.setItem('token', JSON.stringify(this.account));
          this.msg = 'Profile updated successfully';
        } else {
          this.msg = 'Profile not updated - Server problem';
        }
        this.hideEditForm = !this.hideEditForm;
      });

    this.name = this.account.name;
    this.email = this.account.email;
    this.phonenumber = this.account.phonenumber;
    this.wage = '$' + this.account.wage + this.account.wageunit;
  }
}
