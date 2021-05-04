import {BASEURL} from "../constants";
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import {Notification} from "./notification";
import {RestfulService} from "../restful.service";
import {Account} from "../account/account";

@Component({
  selector: 'app-notification-home',
  templateUrl: './notification-home.component.html',
  styles: []
})
export class NotificationHomeComponent implements OnInit {
  notifications: Array<Notification>;
  hasNotifications: boolean;
  isOwner: boolean;
  account: Account;
  msg: string;
  constructor(private restService:RestfulService) { }

  ngOnInit() {
    this.hasNotifications = false;
    this.isOwner = false;
    this.account = JSON.parse(localStorage.getItem('token'));
    //this.msg = 'Look at me Im a message!'
    this.restService.load(BASEURL+'notifications').subscribe(
      npayload => {
        this.notifications = npayload._embedded.notifications;
        this.notifications = this.notifications.filter(n => n.companyid === this.account.companyid);
        if(this.notifications.length > 0){this.hasNotifications = true;}
        else{this.msg = 'No new notifications yet!';}
        if(this.account.type === 'Owner'){this.isOwner = true;}
        else{this.msg = 'You must be the Owner to access this page!';}
      }
    );
  }

  accept(not: Notification){
    not.resolved = true;
    not.accepted = true;
    this.restService.add(BASEURL + 'linkcompanies', not).subscribe(
      payload => {
        if(payload > 0){
          this.msg = `Link Request from ${not.companyFrom} accepted!`;
          this.notifications = this.notifications.filter(n => n.id !== not.id);
          if(this.notifications.length === 0){
            localStorage.setItem('icon','false');
          }
        }else{
          this.msg = 'Link Request acception failed...'
        }
      }, err => {
        this.msg = `Error - notification not resolved - ${err.status} - ${err.statusText}`;
      }
    );
  }

  decline(not: Notification){
    not.resolved = true;
    not.accepted = false;
    this.restService.delete(BASEURL + 'notifications/search/deleteOne?id='+not.id).subscribe(
      payload => {
        if(payload === 1){
          this.msg = `Link Request from ${not.companyFrom} declined!`;
          this.notifications = this.notifications.filter(n => n.id !== not.id);
          if(this.notifications.length === 0){
            localStorage.setItem('icon','false');
          }
        }else{
          this.msg = 'Link Request decline failed...'
        }
      }, err => {
        this.msg = `Error - notification not resolved - ${err.status} - ${err.statusText}`;
      }
    );
  }

}
