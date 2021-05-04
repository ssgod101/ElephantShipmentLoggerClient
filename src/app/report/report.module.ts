import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ReportComponent } from './report.component';
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



@NgModule({
  declarations: [ReportComponent],
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
export class ReportModule { }
