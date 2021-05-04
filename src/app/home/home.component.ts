import { Component, OnInit } from '@angular/core';
import { Account } from '../account/account';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {
  msg: string;
  account: Account;
  constructor() { }

  ngOnInit() {
    this.msg = localStorage.getItem('msg');
    localStorage.removeItem('msg');
    this.account = JSON.parse(localStorage.getItem('token'));

    if (this.msg == null) {
      this.msg = `Welcome ${this.account.name}!`;
    }
  }
}
