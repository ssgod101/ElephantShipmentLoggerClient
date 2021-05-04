import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
// tslint:disable-next-line:max-line-length
import {
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatListModule,
  MatSortModule,
  MatInputModule,
  MatFormFieldModule,
  MatOptionModule,
  MatSelectModule,
  MatTableModule,
  MatToolbarModule,
  MatExpansionModule, MatCheckboxModule
} from '@angular/material';
import { ShipmentDetailComponent } from './shipment-detail.component';
import { ShipmentHomeComponent } from './shipment-home.component';
import {TrackingComponent} from './tracking.component';


@NgModule({
  declarations: [ShipmentDetailComponent, ShipmentHomeComponent, TrackingComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatToolbarModule,
    MatTableModule,
    MatFormFieldModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatListModule,
    MatSortModule,
    MatInputModule,
    BrowserModule,
    MatExpansionModule,
    MatCheckboxModule
  ]
})
export class ShipmentModule { }
