import {Component, Input, Output, EventEmitter, OnInit, ViewChild} from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {Warehouse} from './warehouse';
import {ValidateAmount} from '../validators/amount.validator';
import {Rate} from './rate';
import {MatSort, MatTableDataSource} from '@angular/material';
import { Account } from '../account/account';

@Component({
  selector: 'app-warehouse-detail',
  templateUrl: './warehouse-detail.component.html'
})
export class WarehouseDetailComponent implements OnInit {
  selectedRate: Rate;
  ratesColumns: string[] = ['toWarehouse', 'ratePerCubicFeet', 'ratePerKg'];
  ratesSource: MatTableDataSource<Rate>;
  @ViewChild(MatSort, null) sort: MatSort;
  @Input() warehouses: Warehouse[];
  @Input() selectedWarehouse: Warehouse;
  @Output() cancelled = new EventEmitter();
  @Output() deleted = new EventEmitter();
  @Output() saved = new EventEmitter();
  warehouseForm: FormGroup;
  rateForm: FormGroup;
  // companyid: FormControl;
  name: FormControl;
  address1: FormControl;
  city: FormControl;
  province: FormControl;
  country: FormControl;
  toWarehouseid: FormControl;
  ratePerCubicFeet: FormControl;
  ratePerKg: FormControl;
 account: Account;
 hasRights: boolean;
  constructor(private builder: FormBuilder) {
    this.selectedRate = {id: null, warhouseid: null, toWarehouseid: null, toWarehouse: null, ratePerCubicFeet: null, ratePerKg: null};
    // this.companyid = new FormControl('', Validators.compose([Validators.required]));
    this.name = new FormControl('', Validators.compose([Validators.required]));
    this.address1 = new FormControl('', Validators.compose([Validators.required]));
    this.city = new FormControl('', Validators.compose([Validators.required]));
    this.province = new FormControl('', Validators.compose([Validators.required]));
    this.country = new FormControl('', Validators.compose([Validators.required]));
    this.toWarehouseid = new FormControl('', Validators.compose([Validators.required]));
    this.ratePerCubicFeet = new FormControl('', Validators.compose([Validators.required, ValidateAmount]));
    this.ratePerKg = new FormControl('', Validators.compose([Validators.required, ValidateAmount]));
  }
  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('token'));
    if (this.account.type === 'Owner') {this.hasRights = true; } else {this.hasRights = false; }
    if (this.selectedWarehouse.id) {
      this.selectedWarehouse.rates.map(rate => {
        rate.toWarehouse = this.warehouses.find(war => war.id === rate.toWarehouseid).name;
      });
      this.ratesSource = new MatTableDataSource(this.selectedWarehouse.rates);
      this.ratesSource.sort = this.sort;
    }
    this.rateForm = this.builder.group({
      toWarehouseid: this.toWarehouseid,
      ratePerCubicFeet: this.ratePerCubicFeet,
      ratePerKg: this.ratePerKg
    });
    this.warehouseForm = this.builder.group({
      // companyid: this.companyid,
      name: this.name,
      address1: this.address1,
      city: this.city,
      province: this.province,
      country: this.country
    });
    this.warehouseForm.patchValue({
      // companyid: this.selectedWarehouse.companyid,
      name: this.selectedWarehouse.name,
      address1: this.selectedWarehouse.address,
      city: this.selectedWarehouse.city,
      province: this.selectedWarehouse.province,
      country: this.selectedWarehouse.country
    });
  } // ngOnInit
  select(rate: Rate) {
    this.selectedRate = rate;
    this.rateForm.patchValue({
      toWarehouseid: this.selectedRate.toWarehouseid,
      ratePerCubicFeet: this.selectedRate.ratePerCubicFeet,
      ratePerKg: this.selectedRate.ratePerKg
    });
  }
deleteRate() {
    this.selectedWarehouse.rates = this.selectedWarehouse.rates.filter(rate => rate.toWarehouseid !== this.selectedRate.toWarehouseid);
    this.ratesSource = new MatTableDataSource(this.selectedWarehouse.rates);
    this.ratesSource.sort = this.sort;
    this.cancelRate();
}
cancelRate() {
   this.selectedRate = {id: null, warhouseid: null, toWarehouseid: null, toWarehouse: null, ratePerCubicFeet: null, ratePerKg: null};
   this.rateForm.reset();
}
updateSelectedRate() {
  this.selectedWarehouse.rates.map(rate => {
    if (rate.toWarehouseid === this.rateForm.get('toWarehouseid').value) {
      rate.ratePerCubicFeet = this.rateForm.get('ratePerCubicFeet').value;
      rate.ratePerKg = this.rateForm.get('ratePerKg').value;
    }
  });
  this.cancelRate();
}
  addSelectedRate() {
    if ( !this.selectedWarehouse.rates.find(r => r.toWarehouseid === this.rateForm.get('toWarehouseid').value)) {
      this.selectedRate.id = 0;
      this.selectedRate.toWarehouseid = this.rateForm.get('toWarehouseid').value;
      this.selectedRate.toWarehouse = this.warehouses.find(war => war.id === this.selectedRate.toWarehouseid).name;
      this.selectedRate.ratePerCubicFeet = this.rateForm.get('ratePerCubicFeet').value;
      this.selectedRate.ratePerKg = this.rateForm.get('ratePerKg').value;
      this.selectedWarehouse.rates.push(this.selectedRate);
      this.ratesSource = new MatTableDataSource(this.selectedWarehouse.rates);
      this.ratesSource.sort = this.sort;
    }
        this.cancelRate();
  }
  updateSelectedWarehouse() {
    // this.selectedWarehouse.companyid = this.warehouseForm.value.companyid;
    this.selectedWarehouse.name = this.warehouseForm.get('name').value;
    this.selectedWarehouse.address = this.warehouseForm.get('address1').value;
    this.selectedWarehouse.city = this.warehouseForm.get('city').value;
    this.selectedWarehouse.province = this.warehouseForm.get('province').value;
    this.selectedWarehouse.country = this.warehouseForm.get('country').value;
    this.saved.emit(this.selectedWarehouse);
  }
}
