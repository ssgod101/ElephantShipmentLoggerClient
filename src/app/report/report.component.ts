import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { RestfulService } from '../restful.service';
import { BASEURL } from '../constants';
import {Shipment} from '../shipment/shipment';
import {ExcelService} from '../excel.service';
import {Warehouse} from '../warehouse/warehouse';
import {Account} from '../account/account';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: []
})
export class ReportComponent implements OnInit {
  account: Account;
  warehouses: Array<Warehouse>;
  currentWarhouse: string;
  shipments: Shipment[];
  selectedShipments: Shipment[];
  msg: string;
  url: string;
  displayedColumns: string[] = ['id', 'name', 'amount'];
  dataSource: MatTableDataSource<Shipment>;
  @ViewChild(MatSort, null) sort: MatSort;
  getWarhouseid: number;
  hasRights: boolean;
  constructor(private restService: RestfulService, private excelService: ExcelService) {
    this.url = BASEURL + 'shipments';
  }

  ngOnInit() {
    this.account = JSON.parse(localStorage.getItem('token'));
    if (this.account.type === 'Owner') {this.hasRights = true; } else {this.hasRights = false; }
    this.msg = 'loading warehouses from server...';
   // this.restService.load(BASEURL + 'warehouses/search/getLinkedWarehouses?companyid=' + this.account.companyid).subscribe(
    this.restService.load(BASEURL + 'warehouses/search/getCompanyWarehouses?companyid=' + this.account.companyid).subscribe(
      warPayload => {
        this.warehouses = warPayload._embedded.warehouses;
        this.msg = 'warehouses loaded';
        this.msg = 'loading shipments from server...';
        if (this.account.type === 'Owner') {
          this.restService.load(this.url + '/search/getShipmentByCompanyid?companyid=' + this.account.companyid).subscribe(
            proPayload => {
              this.shipments = proPayload._embedded.shipments;
              this.msg = 'reports loaded';
              this.dataSource = new MatTableDataSource(this.shipments);
              this.dataSource.sort = this.sort;
              this.selectedShipments = this.shipments;
            },
            err => {this.msg += `Error occurred - reports not loaded - ${err.status} - ${err.statusText}`;
            });
        } else {
          this.currentWarhouse = this.warehouses.find(war => war.id === this.account.warehouseid).name;
          this.restService.load(this.url + '/search/getShipmentByWarehouseFromid?warehouseFromid=' + this.account.warehouseid).subscribe(
            proPayload => {
              this.shipments = proPayload._embedded.shipments;
              this.msg = 'reports loaded';
              this.dataSource = new MatTableDataSource(this.shipments);
              this.dataSource.sort = this.sort;
              this.selectedShipments = this.shipments;
            },
            err => {this.msg += `Error occurred - reports not loaded - ${err.status} - ${err.statusText}`;
            });
        }
      },
      err => {this.msg += `Error occurred - warehouses not loaded - ${err.status} - ${err.statusText}`;
      });
  }
  getWarhouse() {
    this.dataSource = new MatTableDataSource(this.shipments.filter(s => s.warehouseFromid === this.getWarhouseid));
    this.dataSource.sort = this.sort;
    this.selectedShipments = this.shipments.filter(s => s.warehouseFromid === this.getWarhouseid);
  }
  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.selectedShipments, 'shipments');
  }

}
