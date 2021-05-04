import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ShipmentHomeComponent } from './shipment/shipment-home.component';
import { WarehouseHomeComponent } from './warehouse/warehouse-home.component';
import { HomeComponent } from './home/home.component';
import { WarehouseSearchHomeComponent } from './warehouse-search/warehouse-search-home.component';
import { ProfileComponent } from './profile/profile.component';
import {ReportComponent} from './report/report.component';
import {NotificationHomeComponent} from "./notification/notification-home.component";
import {LinkedCompaniesHomeComponent} from "./linked-companies/linked-companies-home.component";
import {TrackingComponent} from './shipment/tracking.component';
import { EmployeeHomeComponent } from "./employee/employee-home.component";

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'resetpassword', component: ResetPasswordComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'employees', component: EmployeeHomeComponent, canActivate: [AuthGuard] },
  { path: 'shipment', component: ShipmentHomeComponent, canActivate: [AuthGuard] },
  { path: 'tracking', component: TrackingComponent},
  { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },
  { path: 'warehouses', component: WarehouseHomeComponent, canActivate: [AuthGuard] },
  { path: 'searchwarehouses', component: WarehouseSearchHomeComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationHomeComponent, canActivate: [AuthGuard]},
  { path: 'linkedcompanies', component: LinkedCompaniesHomeComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
