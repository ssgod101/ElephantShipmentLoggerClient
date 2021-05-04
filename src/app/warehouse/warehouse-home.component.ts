  import {Component, OnInit, ViewChild } from '@angular/core';
  import { MatTableDataSource } from '@angular/material';
  import { MatSort } from '@angular/material/sort';
  import { Warehouse} from './warehouse';
  import { RestfulService } from '../restful.service';
  import { BASEURL } from '../constants';
  import { Account } from '../account/account';


  @Component({
    selector: 'app-warehouse-home',
    templateUrl: './warehouse-home.component.html',
    styles: []
  })
  export class WarehouseHomeComponent implements OnInit {
    warehouses: Warehouse[];
    linkedWarehouses: Warehouse[];
    selectedWarehouse: Warehouse;
    hideEditFrom: boolean;
    msg: string;
    todo: string;
    url: string;
    emptyWarehouse: Warehouse;
    account: Account;
    displayedColumns: string[] = ['name', 'address', 'city'];
    dataSource: MatTableDataSource<Warehouse>;
    @ViewChild(MatSort, null) sort: MatSort;
    hasRights: boolean;
    constructor(private restService: RestfulService) {
      this.hideEditFrom = true;
      this.url = BASEURL + 'warehouses';
     // this.emptyWarehouse = {id: null, address: '', name: '', city: '', province: '', country: '', companyid: null, rates: null};
    }

    ngOnInit() {
      this.account = JSON.parse(localStorage.getItem('token'));
      if (this.account.type === 'Owner') {this.hasRights = true; } else {this.hasRights = false; }
      this.msg = 'loading warehouses from server...';
     // const value: number = 1;
      this.restService.load(BASEURL + 'warehousesget?&id=' + this.account.companyid).subscribe(
      // this.restService.load(BASEURL + 'warehouses/search/getLinkedWarehouses?companyid=' + this.account.companyid).subscribe(
        warPayload => {
          this.linkedWarehouses = warPayload;
          this.warehouses = this.linkedWarehouses.filter(w => w.companyid === this.account.companyid);
          this.msg = 'warehouses loaded';
          this.dataSource = new MatTableDataSource(this.warehouses);
          this.dataSource.sort = this.sort;
        },
        err => {
          this.warehouses = [];
          this.linkedWarehouses = [];
          this.msg = `Error - warehouses not loaded - ${err.status} - ${err.statusText}`;
        });
    } // ngOnInit
    select(warehouse: Warehouse) {
      this.todo = 'update';
      this.selectedWarehouse = warehouse;
      this.msg = `${warehouse.name} selected`;
      this.hideEditFrom = !this.hideEditFrom;
    }
    cancel(msg?: string) {
      if (msg) {
        this.msg = 'Operation Cancelled';
      }
      this.hideEditFrom = !this.hideEditFrom;
    }
    save(warehouse: Warehouse) {
      (warehouse.id) ? this.update(warehouse) : this.add(warehouse);
    } // save
    add(warehouse: Warehouse) {
      warehouse.id = 0;
      warehouse.companyid = this.account.companyid;
      this.restService.add(BASEURL + 'warehousesadd', warehouse).subscribe(payload => {
        if (payload.id > 0) {
          this.warehouses = [...this.warehouses, payload];
          warehouse.id = payload.id;
          this.dataSource = new MatTableDataSource(this.warehouses);
          this.dataSource.sort = this.sort;
          this.msg = `Warehouse ${payload.id} added!`;
        } else {
          this.msg = 'Warehouse not addded!';
        }
        this.hideEditFrom = !this.hideEditFrom;
      }, err => {
        this.msg = `Error - warehouse not added - ${err.status} - ${err.statusText}`;
      });
    } // add
    delete(warehouse: Warehouse) {
      this.restService.delete(BASEURL + 'warehouses/search/deleteOne?warehouseid=' + warehouse.id)
        .subscribe(payload => {
            if (payload === 1) { // server returns # rows deleted
              this.msg = `Warehouse ${warehouse.id} deleted!`;
              this.warehouses = this.warehouses.filter(war => war.id !== warehouse.id);
              this.dataSource = new MatTableDataSource(this.warehouses);
              this.dataSource.sort = this.sort;
            } else {
              this.msg = 'Warehouse not deleted!';
            }
            this.hideEditFrom = !this.hideEditFrom;
          },
          err => {
            this.msg = `Error - warehouse not deleted - ${err.status} - ${err.statusText}`;
          });
    }
    newWarehouse() {
      this.selectedWarehouse = {id: null, address: '', name: '', city: '', province: '', country: '', companyid: null, rates: [] };
      this.msg = 'New warehouse';
      this.hideEditFrom = !this.hideEditFrom;
    }
    update(warehouse: Warehouse) {
      this.restService.update(BASEURL + 'warehousesupdate', warehouse).subscribe( payload => {
          if (payload > 1) {
            // update local array using ? operator with data returned from the server
            this.warehouses = this.warehouses.map(emp => emp.id === warehouse.id ? ( Object as any ).assign({}, emp, payload) : emp);
            this.msg = `Warehouse ${warehouse.id} updated!`;
          } else {
            this.msg = 'Warehouse not updated! - server error';
          }
          this.hideEditFrom = !this.hideEditFrom;
        },
        err => {
          this.msg = `Error - warehouse not updated - ${err.status} - ${err.statusText}`;
        });
    }// update
  } // WarehouseHomeComponent
