import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Account } from '../account/account';
import { RestfulService } from '../restful.service';
import { BASEURL } from '../constants';
import { Warehouse } from "../warehouse/warehouse";

@Component({
  selector: 'app-employee-home',
  templateUrl: 'employee-home.component.html'
})
export class EmployeeHomeComponent implements OnInit {
  accounts: Account[];
  currentAccount: Account;
  selectedAccount: Account;
  emptyAccount: Account;
  warehouses: Warehouse[];
  displayedColumns: string[] = ['id', 'name', 'role'];
  hideEditForm: boolean;
  msg: string;
  todo: string;
  dataSource: MatTableDataSource<Account>;
  @ViewChild(MatSort, null) sort: MatSort;

  constructor(private restService: RestfulService) {
    this.hideEditForm = true;
    this.currentAccount = JSON.parse(localStorage.getItem('token'));
    this.emptyAccount = {
      id: null, companyid: null, warehouseid: null, password: '', type: '', name: '', email: '', phonenumber: '', wage: null, wageunit: '',
      resetpassword: true
    };
  }

  ngOnInit() {
    if (this.currentAccount.type === 'Owner') {
      this.restService.load(`${BASEURL}companies/${this.currentAccount.companyid}/accounts`).subscribe(payload => {
          this.accounts = payload._embedded.accounts.filter(acc => acc.id !== this.currentAccount.id);
          this.dataSource = new MatTableDataSource(this.accounts);
          this.dataSource.sort = this.sort;
        },
        err => {this.msg = `Error - employees not loaded - ${err.status} - ${err.statusText}`;
        });
      this.restService.load(`${BASEURL}companies/${this.currentAccount.companyid}/warehouses`).subscribe(payload => {
        this.warehouses = payload._embedded.warehouses;
      });
    }
    else if (this.currentAccount.type === 'Administrator') {
      this.restService.load(`${BASEURL}companies/${this.currentAccount.companyid}/accounts`).subscribe(payload => {
          this.accounts = payload._embedded.accounts.filter(acc => acc.id !== this.currentAccount.id && acc.type === "Associate" &&
            acc.warehouseid === this.currentAccount.warehouseid);
          this.dataSource = new MatTableDataSource(this.accounts);
          this.dataSource.sort = this.sort;
        },
        err => {this.msg = `Error - employees not loaded - ${err.status} - ${err.statusText}`;
        });
      this.restService.load(`${BASEURL}companies/${this.currentAccount.companyid}/warehouses`).subscribe(payload => {
        this.warehouses = payload._embedded.warehouses.filter(wh => wh.id === this.currentAccount.warehouseid);
      });
    }
  }

  select(account: Account) {
    this.todo = 'update';
    this.selectedAccount = account;
    this.msg = `${account.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  }

  cancel(msg?: string) {
    this.msg = '';
    this.hideEditForm = !this.hideEditForm;
  }

  save(account: Account) {
    (this.accounts.find(acc => acc.id === account.id)) ? this.update(account) : this.add(account);
  }

  update(account: Account) {
    this.msg = 'Updating...';
    this.restService.update(`${BASEURL}accounts/${account.id}`, account).subscribe( payload => {
        if (payload.id !== '') {
          this.accounts = this.accounts.map(acc => acc.id === account.id ? ( Object as any ).assign({}, acc, payload) : acc);
          this.msg = `${account.name} updated`;
          this.dataSource.data = this.accounts;
          this.dataSource.sort = this.sort;
        } else {
          this.msg = `${account.name} not updated - Server problem`;
        }
      },
      err => {
        this.msg = `Error - ${account.name} not updated - ${err.status} - ${err.statusText}`;
      }
    );
    this.hideEditForm = !this.hideEditForm;
  }

  add(account: Account) {
    this.msg = 'Adding...';
    this.restService.add(`${BASEURL}accounts`, account).subscribe(payload => {
        if (payload.id !== '') {
          this.accounts = [...this.accounts, payload];
          account.id = payload.id;
          this.msg = `${account.name} added`;
          this.dataSource.data = this.accounts;
          this.dataSource.sort = this.sort;
        } else {
          this.msg = `${account.name} not added - server error`;
        }
      },
      err => {
        this.msg = `Error - ${account.name} not added - ${err.status} - ${err.statusText}`;
      }
    );
    this.hideEditForm = !this.hideEditForm;
  }

  newAccount() {
    this.selectedAccount = this.emptyAccount;
    this.msg = 'New Employee';
    this.hideEditForm = !this.hideEditForm;
  }

  delete(account: Account) {
    this.restService.delete(`${BASEURL}accounts/search/deleteOne?accountid=${account.id}`).subscribe(payload => {
          if (payload === 1) {
            this.msg = `${account.name} deleted`;
            this.accounts = this.accounts.filter(acc => acc.id !== account.id);
            this.dataSource.data = this.accounts;
            this.dataSource.sort = this.sort;
          } else {
            this.msg = `${account.name} not deleted`;
          }
          this.hideEditForm = !this.hideEditForm;
        },
        err => {
          this.msg = `Error - ${account.name} not deleted - ${err.status} - ${err.statusText}`;
        });
  }
}
