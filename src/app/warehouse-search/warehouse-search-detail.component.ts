import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {Warehouse} from "../warehouse/warehouse";
import {Company} from "../company/company";
import {Account} from "../account/account";

@Component({
  selector: 'app-warehouse-search-detail',
  templateUrl: './warehouse-search-detail.component.html',
  styles: []
})
export class WarehouseSearchDetailComponent implements OnInit {
  @Input() selectedWarehouse: Warehouse;
  @Input() companies: Array<Company>;
  @Input() linkedCompanies: Array<Company>;
  @Output() cancelled = new EventEmitter();
  @Output() link = new EventEmitter();
  hideButton: boolean;
  sameCompany: boolean;
  linkedCompany: boolean;
  account: Account;
  companyname: string;
  selectedCompany: Company;
  sessionCompany: Company;
  constructor() {
  }
  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('token'));
    this.sessionCompany = this.companies.find(c => c.id === this.account.companyid);
    this.selectedCompany = this.companies.find(c => c.id === this.selectedWarehouse.companyid);
    this.companyname = this.selectedCompany.name;
    this.hideButton = false;
    this.sameCompany = false;
    this.linkedCompany = false;
    if(this.account.companyid === this.selectedCompany.id){
      this.hideButton = true;
      this.sameCompany = true;
    }else if(this.linkedCompanies.find(c => c.id === this.selectedCompany.id)){
      this.hideButton = true;
      this.linkedCompany = true;
    }
  }
  startLinkProcess() {
    this.link.emit({selected: this.selectedCompany, current: this.sessionCompany});
  }
}
