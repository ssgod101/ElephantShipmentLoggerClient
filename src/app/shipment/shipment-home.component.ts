import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { RestfulService } from '../restful.service';
import { BASEURL } from '../constants';
import {Shipment} from './shipment';
import {Warehouse} from '../warehouse/warehouse';
import { Account } from '../account/account';
import {Products} from './products';
import {TrackEvents} from './track-events';
@Component({
  selector: 'app-shipment-home',
  templateUrl: './shipment-home.component.html',
  styles: []
})
export class ShipmentHomeComponent implements OnInit {
  getWarhouseid: number;
  products: Products[];
  routes: TrackEvents[];
  shipments: Shipment[];
   warehouses: Array<Warehouse>;
   linkedWarehouses: Array<Warehouse>;
   currentWarhouse: string;
   hasRights: boolean;
  selectedShipment: Shipment;
  account: Account;
  hideEditForm: boolean;
  msg: string;
  todo: string;
  url: string;
  emptyWarehouse: Warehouse;
  displayedColumns: string[] = ['id', 'name', 'receiverName'];
  dataSource: MatTableDataSource<Shipment>;
  @ViewChild(MatSort, null) sort: MatSort;
  constructor(private restService: RestfulService) {
    this.hideEditForm = true;
    this.url = BASEURL + 'shipments';
    this.emptyWarehouse = {id: null, address: '', name: '', city: '', province: '', country: '', companyid: null, rates: null};
    // tslint:disable-next-line:max-line-length
    this.products = [ {id: null, height: null, length: null, name: null, price: null, qty: null, shipmentid: null, weight: null, width: null}];
    this.routes = [{ id: null, time: null, date: null, currentWarehouse: null, currentWarehouseid: null, reached: null, shipmentid: null}];
  }
  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('token'));
    if (this.account.type === 'Owner') {this.hasRights = true; } else {this.hasRights = false; }
    this.msg = 'loading warehouses from server...';
    // this.restService.load(BASEURL + 'warehouses/search/getLinkedWarehouses?companyid=' + this.account.companyid).subscribe(
    this.restService.load(BASEURL + 'warehousesget?&id=' + this.account.companyid).subscribe(
      warPayload => {
        this.linkedWarehouses = warPayload;
        this.warehouses = this.linkedWarehouses.filter(w => w.companyid === this.account.companyid);
        this.msg = 'warehouses loaded';
        this.msg = 'loading shipments from server...';
        if (this.account.type === 'Owner') {
          this.restService.load(this.url + '/search/getShipmentByCompanyid?companyid=' + this.account.companyid).subscribe(
            proPayload => {
              this.shipments = proPayload._embedded.shipments;
              this.msg = 'shipments loaded';
              this.dataSource = new MatTableDataSource(this.shipments);
              this.dataSource.sort = this.sort;
            },
            err => {this.msg += `Error occurred - shipments not loaded - ${err.status} - ${err.statusText}`;
            });
        } else {
          this.currentWarhouse = this.warehouses.find(war => war.id === this.account.warehouseid).name;
          this.restService.load(this.url + '/search/getShipmentByWarehouseFromid?warehouseFromid=' + this.account.warehouseid).subscribe(
            proPayload => {
              this.shipments = proPayload._embedded.shipments;
              this.msg = 'shipments loaded';
              this.dataSource = new MatTableDataSource(this.shipments);
              this.dataSource.sort = this.sort;
            },
            err => {this.msg += `Error occurred - shipments not loaded - ${err.status} - ${err.statusText}`;
            });
        }
        },
      err => {this.msg += `Error occurred - warehouses not loaded - ${err.status} - ${err.statusText}`;
      });
  }
  getWarhouse() {
     this.dataSource = new MatTableDataSource(this.shipments.filter(s => s.warehouseFromid === this.getWarhouseid));
     this.dataSource.sort = this.sort;
  }
  select(shipment: Shipment) {
    this.todo = 'update';
    this.selectedShipment = shipment;
    this.msg = `${shipment.id} selected`;
    this.hideEditForm = !this.hideEditForm;
  } // select
  /**
   * cancelled - event handler for cancel button
   */
  cancel(msg?: string) {
    this.restService.load(this.url).subscribe(
      payload => {
        this.shipments = payload._embedded.products;
        this.msg = 'Operation Cancelled!';
        this.dataSource.data = this.shipments;
        this.dataSource.sort = this.sort;
      },
      err => {this.msg += `Error occurred - products not loaded - ${err.status} - ${err.statusText}`;
      });
    this.hideEditForm = !this.hideEditForm;
  } // cancel
  /**
   * update - send changed update to service update local array
   */
  update(shipment: Shipment) {
    this.msg = 'Updating...';
    this.restService.update(this.url + '/' + shipment.id, shipment).subscribe( payload => {
        if (payload.id !== '') {
          // update local array using ? operator
          this.shipments = this.shipments.map(pro => pro.id === shipment.id ? ({...pro, payload}) : pro);
         // this.msg = `Shipment ${shipment.id} updated!`;
          this.msg = `Shipment ${shipment.id} updated$!`;
          this.restService.load(this.url + '/search/getShipmentByCompanyid?companyid=' + this.account.companyid).subscribe(
            proPayload => {
              this.shipments = proPayload._embedded.shipments;
              this.msg = 'shipments loaded';
              this.dataSource = new MatTableDataSource(this.shipments);
              this.dataSource.sort = this.sort;
            },
            err => {this.msg += `Error occurred - shipments not loaded - ${err.status} - ${err.statusText}`;
            });
          this.shipments.find(s => s.id === shipment.id).trackEvents.map(t => {
            console.log(t.id + ' ' + t.currentWarehouse + ' ' + t.shipmentid );
          })
          this.dataSource.data = this.shipments;
          this.dataSource.sort = this.sort;
        } else {
          this.msg = 'Shipment not updated! - Server problem';
        }
      },
      err => {
        this.msg = `Error - shipment not updated - ${err.status} - ${err.statusText}`;
      }
    );
    this.hideEditForm = !this.hideEditForm;
  } // update
  /**
   * save - determine whether we're doing and add or an update
   */
  save(shipment: Shipment) {
    (this.shipments.find(p => p.id === shipment.id)) ? this.update(shipment) : this.add(shipment);
  } // save   this.products.find(p => p.id === control.value && !this.selectedProduct.id) ? {idExists: true} : null;
  /**
   * add - send shipment to service, receive newid back
   */
  add(shipment: Shipment) {
    this.msg = 'Adding...';
    this.restService.add(this.url, shipment).subscribe(
      payload => {
        if (payload.id !== '') { // server returns new id
          this.shipments = [...this.shipments, shipment]; // add shipment to current array using spread
          shipment.id = payload.id;
          this.msg = `Product ${shipment.id} added!`;
          this.dataSource.data = this.shipments;
          this.dataSource.sort = this.sort;
        } else {
          this.msg = 'shipment not added! - server error';
        }
      },
      err => {
        this.msg = `Error - shipment not added - ${err.status} - ${err.statusText}`;
      }
    );
    this.hideEditForm = !this.hideEditForm;
  } // add
  /**
   * newShipment - create new shipment instance
   */
  newShipment() {
    // tslint:disable-next-line:max-line-length
    this.selectedShipment = { id: null, companyid: null, warehouseFromid : null, warehouseToid: null, description: '', senderName: '', receiverName: '',
      senderPhone: '', receiverPhone: '', amount: null, gst: '', cityStart: '', cityEnd: '', length: null, width: null, height: null,
      weight: null, hazardLevel: '', dateSent: null, dateArrived: null, vehicleNumber: '', paid: null, beginAddress: '',
      afterAddress: '', qrcode: '', qrcodetxt: '', products: this.products, trackEvents: this.routes};
    this.msg = 'New shipment';
    this.hideEditForm = !this.hideEditForm;
  } // newShipment
  /**
   * delete - send shipment id to service for deletion and remove from local collection
   */
  delete(shipment: Shipment) {
    this.msg = 'Deleting...';
    this.restService.delete(`${this.url}/search/deleteOne?shipmentid=${shipment.id}`).subscribe(
      payload => {
        if (payload === 1) { // server returns # rows deleted
          this.msg = `Shipment ${shipment.id} deleted!`;
          this.shipments = this.shipments.filter(exp => exp.id !== shipment.id);
          this.dataSource.data = this.shipments;
          this.dataSource.sort = this.sort;
        } else {
          this.msg = 'Shipment not deleted! - server error';
        }
      },
      err => {
        this.msg = `Error - warehouses not deleted - ${err.status} - ${err.statusText}`;
      }
    );
    this.hideEditForm = !this.hideEditForm;
  } // delete
}
