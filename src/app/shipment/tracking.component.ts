import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { RestfulService } from '../restful.service';
import { BASEURL } from '../constants';
import {Shipment} from '../shipment/shipment';
import {ExcelService} from '../excel.service';
import {Warehouse} from '../warehouse/warehouse';
import {Account} from '../account/account';
import {TrackEvents} from './track-events';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: []
})
export class TrackingComponent implements OnInit {
  msg: string;
  url: string;
  Form: FormGroup;
  shipmentid: FormControl;
  show: boolean;
  routeColumns: string[] = ['currentWarehouse', 'reached'];
  routeSource: MatTableDataSource<TrackEvents>;
  @ViewChild(MatSort, null) sort: MatSort;
  constructor(private restService: RestfulService, private builder: FormBuilder) {
    this.url = BASEURL + 'shipments';
    this.show = false;
    this.shipmentid = new FormControl('', Validators.compose([Validators.required]));
  }

  ngOnInit() {
    this.Form = this.builder.group({ shipmentid: this.shipmentid});
  }
  getRoutes(): void {
    this.msg = 'loading Tracking details from server...';
    this.restService.load(this.url + '/search/getShipmentByid?id=' + this.Form.get('shipmentid').value).subscribe(
      proPayload => {
        if (proPayload._embedded.shipments[0] !== undefined) {
          this.routeSource = new MatTableDataSource(proPayload._embedded.shipments[0].trackEvents);
          this.routeSource.sort = this.sort;
          this.msg = 'Tracking details loaded';
          this.show = true;
        } else { this.show = false; this.msg = 'Tracking details not found.';}
      },
      err => {this.msg += `Error occurred - Tracking details not loaded - ${err.status} - ${err.statusText}`;
      });
  }

}
