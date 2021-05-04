import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatInputModule, MatCardModule } from '@angular/material';
import { AppRoutingModule } from '../app-routing.module';
import { LoginComponent } from './login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    AppRoutingModule
  ]
})
export class LoginModule { }
