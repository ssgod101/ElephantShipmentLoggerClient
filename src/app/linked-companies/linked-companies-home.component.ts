import {Component, OnInit, ViewChild} from '@angular/core';
import {Company} from "../company/company";
import {Account} from "../account/account";
import {RestfulService} from "../restful.service";
import {BASEURL} from "../constants";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {Warehouse} from "../warehouse/warehouse";

@Component({
  selector: 'app-linked-companies-home',
  templateUrl: './linked-companies-home.component.html',
  styles: []
})
export class LinkedCompaniesHomeComponent implements OnInit {
  companies: Company[];
  selectedWarehouses: Warehouse[];
  selectedCompany: Company;
  hideEditForm: boolean;
  isOwner: boolean;
  msg: string;
  account: Account;
  displayedColumns: string[] = ['name'];
  dataSource: MatTableDataSource<Company>;
  @ViewChild(MatSort, null) sort: MatSort;
  constructor(private restService: RestfulService) {
    this.hideEditForm = true;
  }

  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('token'));
    this.isOwner = false;
    if (this.account.type === 'Owner'){
      this.isOwner = true;
      this.msg = 'loading linked companies from server...';
      this.restService.load(BASEURL + 'companies/search/getLinkedCompanies?companyid='+this.account.companyid).subscribe(
        cpayload => {
          this.companies = cpayload._embedded.companies;
          this.msg = 'companies loaded';
          this.dataSource = new MatTableDataSource(this.companies);
          this.dataSource.sort = this.sort;
        }, err => {
          this.companies = [];
          this.msg = `Error - linked companies not loaded - ${err.status} - ${err.statusText}`;
        }
      );
    }
    else{this.msg = 'You must be the Owner to access this page!';}
  }
  select(company: Company){
    this.selectedCompany = company;
    this.msg = 'loading company data...';
    this.restService.load(BASEURL + 'warehouses/search/getCompanyWarehouses?companyid=' + this.selectedCompany.id).subscribe(
      wpayload => {
        this.selectedWarehouses = wpayload._embedded.warehouses;
        this.msg = `Company ${company.name} selected`;
        this.hideEditForm = !this.hideEditForm;
      },err => {
        this.msg = `Error - company data not loaded - ${err.status} - ${err.statusText}`;
      }
    );
  }
  cancel(msg?: string){
    this.msg = '';
    this.hideEditForm = !this.hideEditForm;
  }
  attemptUnlink(company: Company){
    //this.msg = 'feature not implemented!';
    this.restService.delete(BASEURL + 'unlinkcompanies?&c='+this.account.companyid+'&u='+company.id).subscribe(
      dpayload => {
        if(dpayload === 1){
          this.msg = 'Successfully unlinked with company '+company.name+'!';
          this.companies = this.companies.filter(c => c.id !== company.id);
          this.dataSource = new MatTableDataSource(this.companies);
          this.dataSource.sort = this.sort;
        }else{
          this.msg = 'Problem unlinking with company '+company.name+'!';
        }
      }, err => {
        this.msg = `Error - link with company ${company.name} not deleted - ${err.status} - ${err.statusText}`;
      }
    );
    this.hideEditForm = !this.hideEditForm;
  }
}
