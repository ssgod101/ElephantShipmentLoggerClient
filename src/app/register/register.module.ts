import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatInputModule, MatCardModule, MatSelectModule } from '@angular/material';
import { AppRoutingModule } from '../app-routing.module';
import { RegisterComponent } from './register.component';

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    AppRoutingModule
  ]
})
export class RegisterModule { }
