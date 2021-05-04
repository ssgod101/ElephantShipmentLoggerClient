import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Company} from "../company/company";
import {Warehouse} from "../warehouse/warehouse";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-linked-companies-detail',
  templateUrl: './linked-companies-detail.component.html',
  styles: []
})
export class LinkedCompaniesDetailComponent implements OnInit {
  @Input() selectedCompany: Company;
  @Input() selectedWarehouses: Warehouse[];
  @Output() cancelled = new EventEmitter();
  @Output() unlink = new EventEmitter();
  displayedColumns: string[] = ['name', 'address', 'city'];
  dataSource: MatTableDataSource<Warehouse>;
  @ViewChild(MatSort, null) sort: MatSort;
  constructor() { }

  ngOnInit() {
    this.dataSource = new MatTableDataSource<Warehouse>(this.selectedWarehouses);
    this.dataSource.sort = this.sort;
  }

  startUnlinkProcess(){
    this.unlink.emit(this.selectedCompany);
  }
}
