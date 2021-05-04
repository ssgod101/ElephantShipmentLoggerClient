import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCardModule, MatMenuModule, MatToolbarModule, MatIconModule,
  MatListModule , MatTooltipModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './home/home.module';
import { LoginModule } from './login/login.module';
import { RegisterModule } from './register/register.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { ShipmentModule } from './shipment/shipment.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { WarehouseSearchModule } from './warehouse-search/warehouse-search.module';
import { ProfileModule } from './profile/profile.module';
import { ReportModule } from './report/report.module';
import { NotificationModule } from "./notification/notification.module";
import { LinkedCompaniesModule } from "./linked-companies/linked-companies.module";
import { EmployeeModule } from "./employee/employee.module";


@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTooltipModule,
    MatInputModule,
    HomeModule,
    LoginModule,
    RegisterModule,
    ResetPasswordModule,
    ProfileModule,
    ShipmentModule,
    ReportModule,
    WarehouseModule,
    WarehouseSearchModule,
    NotificationModule,
    LinkedCompaniesModule,
    EmployeeModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
