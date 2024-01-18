import { NotificationService } from 'src/app/services/Notification.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-side-nav',
  templateUrl: './notification-side-nav.component.html'
  })
export class NotificationSideNavComponent implements OnInit {
  notificationList: any = [];
  display:boolean = false;
  @Input() isOpen:boolean = false;
  constructor(private notificationService:NotificationService) { }

  ngOnInit() {
    this.display = this.isOpen;
    this.getNotificationMessage();
  }
  getNotificationMessage()
  {
    this.notificationService.getNotification()
    .subscribe({
      next:(result) => {
        this.notificationList = result;
      }, error:(error) => {
      }});
  }
  clearNotification()
  {
    this.notificationService.clearNotifications()
    .subscribe({
      next:(result) => {
        this.notificationList = result;
      }, error:(error) => {
      }});
  }
  sidenavClosed()
  {
    this.isOpen=false;
  }
}
