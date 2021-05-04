import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatInputModule, MatCardModule } from '@angular/material';
import { ResetPasswordComponent } from './reset-password.component';



@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
  ]
})
export class ResetPasswordModule { }
