import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatTooltipModule, MatIconModule,
  MatListModule, MatFormFieldModule, MatInputModule,MatTableModule,
  MatSortModule, MatExpansionModule, MatOptionModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WarehouseSearchHomeComponent } from './warehouse-search-home.component';
import { WarehouseSearchDetailComponent } from './warehouse-search-detail.component';



@NgModule({
  declarations: [WarehouseSearchHomeComponent, WarehouseSearchDetailComponent],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatExpansionModule,
    MatOptionModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSelectModule,
    MatIconModule,
    ReactiveFormsModule
  ]
})
export class WarehouseSearchModule { }
