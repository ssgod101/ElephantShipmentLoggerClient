import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule, MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatTooltipModule, MatIconModule,
  MatListModule, MatFormFieldModule, MatInputModule,MatTableModule,
  MatSortModule, MatExpansionModule, MatOptionModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NotificationHomeComponent } from './notification-home.component';



@NgModule({
  declarations: [NotificationHomeComponent],
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
export class NotificationModule { }
