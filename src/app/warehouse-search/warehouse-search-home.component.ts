import {BASEURL} from "../constants";
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import {Warehouse} from "../warehouse/warehouse";
import {RestfulService} from "../restful.service";
import {Company} from "../company/company";
import {Account} from "../account/account";
import {Notification} from "../notification/notification";

@Component({
  selector: 'app-warehouse-search-home',
  templateUrl: './warehouse-search-home.component.html',
  styles: []
})
export class WarehouseSearchHomeComponent implements OnInit, OnDestroy {
  warehouseSearchForm: FormGroup;
  country: FormControl;
  province: FormControl;
  city: FormControl;
  private subscription: Subscription;
  companies: Array<Company>;
  linkedCompanies: Array<Company>;
  warehouses: Array<Warehouse>;
  notifications: Array<Notification>;
  warehousecountries: Array<string>;
  countryprovinces: Array<string>;
  provincecities: Array<string>;
  warehouseResults: Warehouse[];
  selectedCountry: string;
  selectedProvince: string;
  selectedCity: string;
  selectedWarehouse: Warehouse;
  pickedCountry: boolean;
  pickedProvince: boolean;
  pickedCity: boolean;
  hideEditForm: boolean;
  hasRights: boolean;
  account: Account;
  dataSource: MatTableDataSource<Warehouse>;
  displayedColumns: string[] = ['name', 'address', 'city'];
  @ViewChild(MatSort, null) sort: MatSort;
  msg: string;
  url: string;
  constructor(private builder: FormBuilder, private restService: RestfulService) {
    this.hideEditForm = true;
    this.hasRights = false;
    this.url = BASEURL + 'warehouses';
    this.pickedCountry = false;
    this.pickedProvince = false;
    this.pickedCity = false;
  } // constructor
  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('token'));
    if (this.account.type === 'Owner' || this.account.type === 'Administrator') {this.hasRights = true; } else {this.hasRights = false; }
    this.msg = '';
    this.country = new FormControl('');
    this.province = new FormControl('');
    this.city = new FormControl('');
    this.warehouseSearchForm = this.builder.group({
      country: this.country,
      province: this.province,
      city: this.city
    });
    this.onPickCountry();
    this.onPickProvince();
    this.onPickCity();
    this.msg = 'loading server data...';
    this.restService.load(BASEURL + 'warehouses').subscribe(
      warehousePayload => {
        this.warehouses = warehousePayload._embedded.warehouses;
        this.msg = 'warehouses loaded';
        this.loadCountries();
        this.dataSource = new MatTableDataSource<Warehouse>(this.warehouseResults);
        this.dataSource.sort = this.sort;
        this.restService.load(BASEURL + 'companies').subscribe(
          comPayload => {
            this.companies = comPayload._embedded.companies;
            // this.msg = 'server data loaded';
            this.restService.load(BASEURL + 'notifications').subscribe(
              nPayLoad => {
                this.notifications = nPayLoad._embedded.notifications;
                this.msg = 'server data loaded';
                this.restService.load(BASEURL + 'companies/'+this.account.companyid+'/linkedCompanies').subscribe(
                  lPayLoad => {
                    this.linkedCompanies = lPayLoad._embedded.companies;
                    this.msg = 'server data loaded';
                  },err => {this.msg += ` Error occurred - linked company data not loaded - ${err.status} - ${err.statusText}`;}
                );
              }, err => {this.msg += ` Error occurred - notification data not loaded - ${err.status} - ${err.statusText}`;}
            );
          }, err => {this.msg += ` Error occurred - company data not loaded - ${err.status} - ${err.statusText}`;}
        );
      }, err =>{this.msg += ` Error occurred - warehouses not loaded - ${err.status} - ${err.statusText}`;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  select(warehouse: Warehouse){
    this.selectedWarehouse = warehouse;
    this.msg = `Warehouse ${warehouse.name} selected`;
    this.hideEditForm = !this.hideEditForm;
  }

  onPickCountry(): void {
    this.subscription = this.warehouseSearchForm.get('country').valueChanges.subscribe(val => {
      this.selectedProvince = null;
      this.selectedCity = null;
      this.selectedCountry = val;
      this.loadCountryProvinces();
      this.pickedCity = false;
      this.pickedProvince = false;
      this.pickedCountry = true;
      //this.hasCities = false;
      this.msg = 'choose city of warehouse';
      this.warehouseResults = [];
      this.dataSource.data = this.warehouseResults;
      this.dataSource.sort = this.sort;
    });
  }

  onPickProvince(): void {
    const xsubscr = this.warehouseSearchForm.get('province').valueChanges.subscribe(val => {
      this.selectedProvince = val;
      this.selectedCity = null;
      this.loadProvinceCities();
      this.pickedProvince = true;
      this.pickedCity = false;
      //this.hasCities = false;
      this.warehouseResults = [];
      this.dataSource.data = this.warehouseResults;
      this.dataSource.sort = this.sort;
    });
    this.subscription.add(xsubscr);
  }

  onPickCity(): void {
    const xsubscr = this.warehouseSearchForm.get('city').valueChanges.subscribe(val => {
      this.selectedCity = val;
      this.loadWarehouseResults();
      this.pickedCity = true;
    });
    this.subscription.add(xsubscr);
  }

  loadCountries(): void {
    this.warehousecountries = [];
    this.warehousecountries = [...new Set(this.warehouses.map(item => item.country))];
  }
  loadCountryProvinces(): void {
    this.countryprovinces = [];
    this.countryprovinces = [...new Set(this.warehouses.filter(ex => ex.country === this.selectedCountry).map(item => item.province))];

  }
  loadProvinceCities(): void {
    this.provincecities = [];
    this.provincecities = [...new Set(this.warehouses.filter(ex => ex.country === this.selectedCountry && ex.province === this.selectedProvince).map(item => item.city))];
  }
  loadWarehouseResults():void{
    this.warehouseResults = [];
    this.warehouseResults = this.warehouses.filter(ex => ex.country === this.selectedCountry && ex.province === this.selectedProvince && ex.city === this.selectedCity);
    this.dataSource.data = this.warehouseResults;
    this.dataSource.sort = this.sort;
  }

  cancel(msg?: string){
    this.hideEditForm = !this.hideEditForm;
  }
  attemptLink(data: object){
    //this.msg = this.account.type;
    if(this.account.type === "Owner"){
      let values = Object.keys(data).map(k => data[k]);
      let selected : Company = values[0];
      let current : Company = values[1];
      let newNotification : Notification;
      newNotification = {
        id: 0,
        companyid: selected.id,
        companyidFrom: current.id,
        companyFrom: current.name,
        resolved: false,
        accepted: false,
        message: current.name + " has sent a link request to your company.",
        dateSent: new Date()
      };
      if(this.notifications.find(n => n.companyid === selected.id && n.companyidFrom === current.id && n.resolved === false)){
        this.msg = "You have already sent a link request to this company. Response is still pending.";
        this.hideEditForm = !this.hideEditForm;
      }else if(this.notifications.find(n => n.companyid === current.id && n.companyidFrom === selected.id && n.resolved === false)){
        this.msg = "This company has already sent a link request to your company. Please check notifications in order to accept/decline request.";
        this.hideEditForm = !this.hideEditForm;
      }else{
        this.hideEditForm = !this.hideEditForm;
        this.msg = "Sending link request to " + selected.name;
        this.restService.add(BASEURL + "notifications", newNotification).subscribe(
          notPayLoad => {
            if(notPayLoad.id > 0){
              this.notifications = [...this.notifications, notPayLoad];
              this.msg = "Successfully sent link request to " + selected.name;
            }else{
              this.msg = "Error: Failed to send link request to " + selected.name;
            }
          }, err => {
            this.msg = "Error: Failed to send link request to " + selected.name;
          }
        );
      }
    }else{
      this.msg = "Link request failed: This feature can only be used by the owner of the company";
      this.hideEditForm = !this.hideEditForm;
    }
  }

}
