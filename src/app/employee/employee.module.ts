import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeHomeComponent } from './employee-home.component';
import { EmployeeDetailComponent } from './employee-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import {
  MatSelectModule, MatButtonModule, MatInputModule, MatToolbarModule,
  MatIconModule, MatCardModule, MatTooltipModule, MatListModule, MatTableModule,
  MatSortModule, MatExpansionModule
} from '@angular/material';

@NgModule({
  declarations: [EmployeeHomeComponent, EmployeeDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatTooltipModule,
    MatListModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule
  ]
})
export class EmployeeModule { }
