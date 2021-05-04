import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Shipment} from './shipment';
import {Warehouse} from '../warehouse/warehouse';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidateAmount} from '../validators/amount.validator';
import {ValidatePhone} from '../validators/phone.validator';
import {ValidateInt} from '../validators/int.validator';
import {Products} from './products';
import {TrackEvents} from './track-events';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Account} from '../account/account';

@Component({
  selector: 'app-shipment-detail',
  templateUrl: './shipment-detail.component.html',
  styles: []
})
export class ShipmentDetailComponent implements OnInit {
// setter
  selectedProduct: Products;
  productsColumns: string[] = ['name', 'qty', 'price'];
  productSource: MatTableDataSource<Products>;
  selectedRoute: TrackEvents;
  routeColumns: string[] = ['currentWarehouse', 'reached'];
  routeSource: MatTableDataSource<TrackEvents>;
  @ViewChild(MatSort, null) sort: MatSort;
  @Input() selectedShipment: Shipment;
  @Input() warehouses: Warehouse[];
  @Input() linkedWarehouses: Warehouse[];
  @Input() hasRights: boolean;
  @Input() account: Account;
  @Input() shipments: Shipment[];
  @Output() cancelled = new EventEmitter();
  @Output() saved = new EventEmitter();
  @Output() deleted = new EventEmitter();
  shipmentForm: FormGroup;
  productForm: FormGroup;
  id: FormControl;
  senderName: FormControl;
  senderPhone: FormControl;
  receiverName: FormControl;
  receiverPhone: FormControl;
  cityStart: FormControl;
  cityEnd: FormControl;
// private Set<Products> products;
  nameP: FormControl;
  qtyP: FormControl;
  priceP: FormControl;
  lengthP: FormControl;
  widthP: FormControl;
  heightP: FormControl;
  weightP: FormControl;
// private Set<Products> products;
  length: FormControl;
  width: FormControl;
  height: FormControl;
  weight: FormControl;
  description: FormControl;
  hazardLevel: FormControl;
  dateSent: FormControl;
  dateArrived: FormControl;
  vehicleNumber: FormControl;
//  private Set<TrackEvents> trackEvents;
//  private Set<TrackEvents> trackEvents;
  warehouseFromid: FormControl;
  warehouseToid: FormControl;
  paid: FormControl;
  beginAddress: FormControl;
  afterAddress: FormControl;
  gst: FormControl;
  amount: FormControl;
  qrcode: FormControl;
  qrcodetxt: FormControl;
  constructor(private builder: FormBuilder) {
    this.id = new FormControl('', Validators.compose([this.uniqueCodeValidator.bind(this), Validators.required]));
    this.senderName = new FormControl('', Validators.compose([Validators.required]));
    this.senderPhone = new FormControl('', Validators.compose([Validators.required, ValidatePhone]));
    this.receiverName = new FormControl('', Validators.compose([Validators.required]));
    this.receiverPhone = new FormControl('', Validators.compose([Validators.required, ValidatePhone]));
    this.cityStart = new FormControl('', Validators.compose([Validators.required]));
    this.cityEnd = new FormControl('', Validators.compose([Validators.required]));
   // this.lenght = new FormControl('', Validators.compose([Validators.required]));
   // this.width = new FormControl('', Validators.compose([Validators.required]));
   // this.height = new FormControl('', Validators.compose([Validators.required]));
   // this.weight = new FormControl('', Validators.compose([Validators.required]));
    this.description = new FormControl('', Validators.compose([Validators.required]));
  //  this.hazardLevel = new FormControl('', Validators.compose([Validators.required]));
    this.dateSent = new FormControl('', Validators.compose([Validators.required]));
    this.dateArrived = new FormControl('', Validators.compose([Validators.required]));
    this.vehicleNumber = new FormControl('', Validators.compose([Validators.required]));
    this.warehouseFromid = new FormControl('', Validators.compose([Validators.required]));
    this.warehouseToid = new FormControl('', Validators.compose([Validators.required]));
  //  this.paid = new FormControl('', Validators.compose([Validators.required]));
  //  this.beginAddress = new FormControl('', Validators.compose([Validators.required]));
  //  this.afterAddress = new FormControl('', Validators.compose([Validators.required]));
    this.gst = new FormControl('', Validators.compose([Validators.required]));
    this.amount = new FormControl('', Validators.compose([Validators.required, ValidateAmount]));
  //  this.qrcode = new FormControl('', Validators.compose([Validators.required]));
  //  this.qrcodetxt = new FormControl('', Validators.compose([Validators.required]));
    // product
    // tslint:disable-next-line:max-line-length
    this.selectedProduct = {id: null, height: null, length: null, name: null, price: null, qty: null, shipmentid: null, weight: null, width: null};
    this.nameP = new FormControl('', Validators.compose([Validators.required]));
    this.priceP = new FormControl('', Validators.compose([Validators.required, ValidateAmount]));
    this.qtyP = new FormControl('', Validators.compose([Validators.required, ValidateInt]));
    // tslint:disable-next-line:max-line-length
    this.selectedRoute = {id: null, time: null, date: null, currentWarehouse: null, currentWarehouseid: null, reached: null, shipmentid: null};
  }

  ngOnInit() {
    if (this.selectedShipment.id) {
      this.productSource = new MatTableDataSource(this.selectedShipment.products);
      this.productSource.sort = this.sort;
      this.routeSource = new MatTableDataSource<TrackEvents>(this.selectedShipment.trackEvents);
      this.routeSource.sort = this.sort;
    }
    this.productForm = this.builder.group({
      nameP: this.nameP,
      qtyP: this.qtyP,
      priceP: this.priceP,
      lengthP: this.lengthP,
      widthP: this.widthP,
      heightP: this.heightP,
      weightP: this.weightP,
    });
    this.shipmentForm = this.builder.group({
      id: this.id,
      senderName: this.senderName,
      senderPhone: this.senderPhone,
      receiverName: this.receiverName,
      receiverPhone: this.receiverPhone,
      cityStart: this.cityStart,
      cityEnd: this.cityEnd,
      length: this.length,
      width: this.width,
      height: this.height,
      weight: this.weight,
      description: this.description,
      hazardLevel: this.hazardLevel,
      dateSent: this.dateSent,
      dateArrived: this.dateArrived,
      vehicleNumber: this.vehicleNumber,
  //  private Set<TrackEvents> trackEvents;
      warehouseFromid: this.warehouseFromid,
      warehouseToid: this.warehouseToid,
      paid: this.paid,
      beginAddress: this.beginAddress,
      afterAddress: this.afterAddress,
      gst: this.gst,
      amount: this.amount,
      qrcode: this.qrcode,
      qrcodetxt: this.qrcodetxt
    });
    this.shipmentForm.patchValue({
      id: this.selectedShipment.id,
      senderName: this.selectedShipment.senderName,
      senderPhone: this.selectedShipment.senderPhone,
      receiverPhone: this.selectedShipment.receiverPhone,
      receiverName: this.selectedShipment.receiverName,
      cityStart: this.selectedShipment.cityStart,
      cityEnd: this.selectedShipment.cityEnd,
      length: this.selectedShipment.length,
      width: this.selectedShipment.width,
      height: this.selectedShipment.height,
      weight: this.selectedShipment.weight,
      description: this.selectedShipment.description,
      hazardLevel: this.selectedShipment.hazardLevel,
      dateSent: this.selectedShipment.dateSent,
      dateArrived: this.selectedShipment.dateArrived,
      vehicleNumber: this.selectedShipment.vehicleNumber,
      //  private Set<TrackEvents> trackEvents;
      warehouseFromid: this.selectedShipment.warehouseFromid,
      warehouseToid: this.selectedShipment.warehouseToid,
      paid: this.selectedShipment.paid,
      beginAddress: this.selectedShipment.beginAddress,
      afterAddress: this.selectedShipment.afterAddress,
      gst: this.selectedShipment.gst,
      amount: this.selectedShipment.amount,
      qrcode: this.selectedShipment.qrcode,
      qrcodetxt: this.selectedShipment.qrcodetxt
    });
  }
  select(pro: Products) {
    this.selectedProduct = pro;
    this.productForm.patchValue({
      nameP:  this.selectedProduct.name,
      qtyP:   this.selectedProduct.qty,
      priceP: this.selectedProduct.price,
      lengthP: this.selectedProduct.length,
      widthP:  this.selectedProduct.width,
      heightP: this.selectedProduct.height,
      weightP: this.selectedProduct.weight,
    });
  }
  deleteProduct() {
    this.selectedShipment.products = this.selectedShipment.products.filter(pro => pro.id !== this.selectedProduct.id);
    this.productSource = new MatTableDataSource(this.selectedShipment.products);
    this.productSource.sort = this.sort;
    this.cancelProduct();
  }
  cancelProduct() {
    // tslint:disable-next-line:max-line-length
    this.selectedProduct = {id: null, height: null, length: null, name: null, price: null, qty: null, shipmentid: null, weight: null, width: null};
    this.productForm.reset();
  }
  updateSelectedProduct() {
    this.selectedShipment.products.map(pro => {
      if (pro.name === this.productForm.get('nameP').value) {
        pro.qty = this.productForm.get('qtyP').value;
        pro.price = this.productForm.get('priceP').value;
        pro.length = this.productForm.get('lengthP').value;
        pro.width = this.productForm.get('widthP').value;
        pro.height = this.productForm.get('heightP').value;
        pro.weight = this.productForm.get('weightP').value;
      }
    });
    this.productSource = new MatTableDataSource(this.selectedShipment.products);
    this.productSource.sort = this.sort;
    this.cancelProduct();
  }
  addSelectedProduct() {
    if (this.shipmentForm.get('id').value) {
      this.selectedProduct.id = 0;
      this.selectedProduct.shipmentid = this.shipmentForm.get('id').value;
      this.selectedProduct.name = this.productForm.get('nameP').value;
      this.selectedProduct.qty = this.productForm.get('qtyP').value;
      this.selectedProduct.price = this.productForm.get('priceP').value;
      this.selectedProduct.length = this.productForm.get('lengthP').value;
      this.selectedProduct.width = this.productForm.get('widthP').value;
      this.selectedProduct.height = this.productForm.get('heightP').value;
      this.selectedProduct.weight = this.productForm.get('weightP').value;
      this.selectedShipment.products.push(this.selectedProduct);
      this.selectedShipment.products = this.selectedShipment.products.filter(pro => pro.name !== null );
      this.productSource = new MatTableDataSource(this.selectedShipment.products);
      this.productSource.sort = this.sort;
      this.cancelProduct();
    }
  }
  reachedRoute() {
    this.selectedShipment.trackEvents.map(t => {
      if (this.selectedRoute.currentWarehouseid === t.currentWarehouseid) {
        if (t.reached === true) { t.reached = false; } else if (t.reached === false) { t.reached = true; }
      }
    });
    this.routeSource = new MatTableDataSource(this.selectedShipment.trackEvents);
    this.routeSource.sort = this.sort;
    // tslint:disable-next-line:max-line-length
    this.selectedRoute = {id: null, time: null, date: null, currentWarehouse: null, currentWarehouseid: null, reached: null, shipmentid: null};
  }
  selectRoute(route: TrackEvents) {
    this.selectedRoute = route;
    this.shipmentForm.patchValue({
      warehouseToid: this.selectedRoute.currentWarehouseid
    });
    // this.reached = false;
  }
  deleteRoute() {
    // tslint:disable-next-line:max-line-length
    this.selectedShipment.trackEvents = this.selectedShipment.trackEvents.filter(pro => pro.currentWarehouseid !== this.shipmentForm.get('warehouseToid').value);
    this.routeSource = new MatTableDataSource(this.selectedShipment.trackEvents);
    this.routeSource.sort = this.sort;
  }
  addSelectedRoute() {
    // tslint:disable-next-line:max-line-length
    if (this.shipmentForm.get('id').value && !this.selectedShipment.trackEvents.find(t => t.currentWarehouseid === this.shipmentForm.get('warehouseToid').value) ) {
      // tslint:disable-next-line:max-line-length
      this.selectedRoute = {id: null, time: null, date: null, currentWarehouse: null, currentWarehouseid: null, reached: null, shipmentid: null};
      this.selectedRoute.id = 0;
      this.selectedRoute.reached = false;
      this.selectedRoute.shipmentid = this.shipmentForm.get('id').value;
      this.selectedRoute.currentWarehouse = this.linkedWarehouses.find(war => war.id === this.shipmentForm.get('warehouseToid').value).name;
      this.selectedRoute.currentWarehouseid = this.shipmentForm.get('warehouseToid').value;
      this.selectedShipment.trackEvents.push(this.selectedRoute);
      this.selectedShipment.trackEvents = this.selectedShipment.trackEvents.filter(pro => pro.currentWarehouse !== null );
      this.routeSource = new MatTableDataSource(this.selectedShipment.trackEvents);
      this.routeSource.sort = this.sort;
      // tslint:disable-next-line:max-line-length
      this.selectedRoute = {id: null, time: null, date: null, currentWarehouse: null, currentWarehouseid: null, reached: null, shipmentid: null};
    }
  }
  updateSelectedShipment() {
    this.selectedShipment.id = this.shipmentForm.get('id').value;
    this.selectedShipment.senderName = this.shipmentForm.get('senderName').value;
    this.selectedShipment.senderPhone = this.shipmentForm.get('senderPhone').value;
    this.selectedShipment.receiverName = this.shipmentForm.get('receiverName').value;
    this.selectedShipment.receiverPhone = this.shipmentForm.get('receiverPhone').value;
    this.selectedShipment.cityStart = this.shipmentForm.get('cityStart').value;
    this.selectedShipment.cityEnd = this.shipmentForm.get('cityEnd').value;
    this.selectedShipment.length = this.shipmentForm.get('length').value;
    this.selectedShipment.width = this.shipmentForm.get('width').value;
    this.selectedShipment.height = this.shipmentForm.get('height').value;
    this.selectedShipment.weight = this.shipmentForm.get('weight').value;
    this.selectedShipment.description = this.shipmentForm.get('description').value;
    this.selectedShipment.hazardLevel = this.shipmentForm.get('hazardLevel').value;
    this.selectedShipment.dateSent = this.shipmentForm.get('dateSent').value;
    this.selectedShipment.dateArrived = this.shipmentForm.get('dateArrived').value;
    this.selectedShipment.vehicleNumber = this.shipmentForm.get('vehicleNumber').value;
    //  private Set<TrackEvents> trackEvents;
    this.selectedShipment.warehouseFromid = this.shipmentForm.get('warehouseFromid').value;
    // tslint:disable-next-line:max-line-length
    this.selectedShipment.warehouseToid = this.shipmentForm.get('warehouseToid').value; // this.selectedShipment.trackEvents[this.selectedShipment.trackEvents.length - 1].currentWarehouseid;
    this.selectedShipment.paid = this.shipmentForm.get('paid').value;
    this.selectedShipment.beginAddress = this.shipmentForm.get('beginAddress').value;
    this.selectedShipment.afterAddress = this.shipmentForm.get('afterAddress').value;
    this.selectedShipment.gst = this.shipmentForm.get('gst').value;
    this.selectedShipment.amount = this.shipmentForm.get('amount').value;
    this.selectedShipment.qrcode = this.shipmentForm.get('qrcode').value;
    this.selectedShipment.qrcodetxt = this.shipmentForm.get('qrcodetxt').value;
    this.saved.emit(this.selectedShipment);
  }
uniqueCodeValidator(control) {
    /**
     * uniqueCodeValidator - needed access to products property so not
     * with the rest of the validators
     */
    if (this.shipments) {
      return this.shipments.find(p => p.id === control.value && !this.selectedShipment.id) ? {idExists: true} : null;
    }
  }// uniqueCodeValidator
}
