import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  MatExpansionModule
} from '@angular/material';
import { WarehouseHomeComponent } from './warehouse-home.component';
import { WarehouseDetailComponent } from './warehouse-detail.component';

@NgModule({
  declarations: [WarehouseHomeComponent, WarehouseDetailComponent],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
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
    MatExpansionModule
  ]
})
export class WarehouseModule { }
