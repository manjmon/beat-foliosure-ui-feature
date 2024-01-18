import { Component, OnInit, Input, ViewChild, Inject } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { PrimeNGConfig } from 'primeng/api';
import { OidcConfig } from 'src/app/configuration/oidcConfig';
import { NotificationService } from 'src/app/services/Notification.service';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import * as signalR from '@microsoft/signalr';
import { HelperService } from 'src/app/services/helper.service';
import { UploadService } from 'src/app/services/upload.service';
import { FileStatusService } from 'src/app/services/file-status.service';
import { Router } from '@angular/router';
import {FileStatus} from 'src/app/common/enums';
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { DocumentService } from 'src/app/services/document.service';
import { FeaturesEnum, PermissionService } from 'src/app/services/permission.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  position="left";
  panelOpenState = false;
  isIdsEnabled: boolean;
  appUrl: string = "";
  resetPasswordUrl: any;
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
  @Input() userId: string;
  @Input() userName: string;
  @Input() receiveUploadStatus: number;
  isShow = false;
  uploadedFileList: any;
  isNotify = true;
  isOpenSideNav = false;
  isClicked = false;
  isOpensideNavfiel = false;
  notificationList: any = [];
  toastContainer: ToastContainerDirective;
  feature: typeof FeaturesEnum = FeaturesEnum;
  isUploadDownload:boolean=false;
  pluginStatus:string="";
  isSpin: boolean = false;
  fileStatus = FileStatus;
  isPluginLoader:boolean=false;
  constructor(private identityService: OidcAuthService, private primengConfig: PrimeNGConfig,
    private notificationService: NotificationService, private helperService: HelperService, private uploadService: UploadService,
    private router:Router, private _fileStatusService: FileStatusService,
    @Inject("BASE_URL") baseUrl: string,private toastService: ToastrService,private documentService: DocumentService,private permissionService: PermissionService) {
    this.appUrl = baseUrl;
    this.uploadService.uploadCompleted$().subscribe(() => {
      this.isOpensideNavfiel = true;
      this.imagehandlingarrow();
      this.imagehandlingcircle();
    });
  }
  ngOnInit() {
    this.toastService.overlayContainer = this.toastContainer;
    this.isIdsEnabled = OidcConfig.isIdsEnabled;
    let config = this.identityService.getEnvironmentConfig();
    this.resetPasswordUrl = config.authority+"Manage/ChangePassword";
    this.primengConfig.ripple = true;
    this.getNotificationStatus();
    this.subscribeNotification();
    this.animationSpinnerforInprogress();
    setTimeout(() => {      
      this.getFeatureData();
      }, 1000);
  }
 imagehandlingarrow(){
  if(this.isSpin === true){
    return "assets/dist/images/ColorArrow.svg";
  }
  else {
    return "assets/dist/images/arrow.svg";
  }
 }
 childData($event){
 this.isSpin = $event;
 }
 imagehandlingcircle(){
  if(this.isSpin === true){
    return "assets/dist/images/Animationcircle.svg"
  }
  else{
    return "assets/dist/images/circle.svg";
  }
 }

 animationSpinnerforInprogress(){
  this._fileStatusService.getFileStatus().subscribe({
    next:((result: any) =>{
      this.uploadedFileList = result.data;
      this.isSpin = false;
      if (this.uploadedFileList.filter(x => x.uploadStatus == this.fileStatus.Uploaded || x.uploadStatus == this.fileStatus.Processing).length > 0){
        this.isSpin = true;
      }
       else{
        this.isSpin = false;
       }
    })
  });
 }
  resetPassword(){
    let redirectUrl = encodeURIComponent(window.location.href);
    window.location.href = `${this.resetPasswordUrl}?returnUrl=${redirectUrl}`
  }

  showPopUp() {
    if (this.isShow) {
      this.isShow = false;
    }
    else {
      this.isShow = true;
    }
  }
  getNotificationStatus()
  {
    this.notificationService.getNotificationStatus()
    .subscribe({
      next: (result) => {
        this.isNotify=result;
      },
      error: (e) => {
      },
      complete() {
      },
    });
  }
  subscribeNotification(){
    const token = this.identityService.getToken();
    const connection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.appUrl + 'notify',
      { accessTokenFactory: () => token
     })
      .build();

    connection.start().then(function () {
    }).catch(function (err) {
      return err;
    });

    connection.on("BroadcastMessage", () => {
      this.getNotificationStatus();
    });
  }
  openSideNav() {
    if(this.isOpenSideNav){
      this.isOpenSideNav = false;
    }else{
      this.isOpenSideNav = true;
      this.isOpensideNavfiel = false;
      this.getNotificationMessage();
    }
    
  }
  openSideNavfile(){
    if(this.isOpensideNavfiel){
      this.isOpensideNavfiel = false;
      this._fileStatusService.setFileStatusNavOpened(false);
      this.animationSpinnerforInprogress();
    }else{
      this._fileStatusService.setFileStatusNavOpened(true);
       this.animationSpinnerforInprogress();
      this.isOpensideNavfiel = true;
      this.isOpenSideNav = false;
      this.isClicked = !this.isClicked;
    }
  }
  sidenavClosed()
  {
    this.isOpenSideNav=false;
  }
  getNotificationMessage() {
    this.notificationService.getNotification()
      .subscribe({
        next: (result) => {
          this.notificationList = result;
        },
        error: (error) => {
          // Handle the error here if needed.
        }
      });
  }
  updateNotification(message:any)
  {
    let updateNotification = {"AssignedTo":message.assignedTo,"AssignedFrom":message.assignedFrom};
    this.notificationService.updateNotifications(updateNotification)
    .subscribe({
      next: (result) => {
        if (result)
          this.reloadNotification();
      },
      error: (error) => {
      }
    });
  }
  updateMarkAll()
  {
    this.notificationService.clearAllNotifications()
    .subscribe({
      next:(result) => {
        if (result)
        {
          this.reloadNotification();
        }
      },error: (error) => {
      }});
  }
  clearAll()
  {
    this.notificationService.clearNotifications()
    .subscribe({
     next: (result) => {
        if (result)
        {
          this.reloadNotification();
          this.isOpenSideNav = false;
        }
      },error: (error) => {
      }});
  }
  isExpand(message: any) {
    if (message.isExpanded)
      message.isExpanded = false;
    else
      message.isExpanded = true;
  }
  getFileIcons(filename: string) {
    return this.helperService.getIconFromFileName(filename);
  }
  reloadNotification() {
    this.getNotificationMessage();
    this.getNotificationStatus();
  }

  openDocument(document) {
    this.router.navigateByUrl('/open-document', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/open-document/', document.encryptedDocumentId]);
    });
  }

  isOpenUpload = false;
  setUpload = () => {
    this.isOpenUpload = true;
  }
  download = () => {
    this.isPluginLoader=true;
    this.documentService.getExcelPluginDownload().subscribe({
     next: (response) => {
        this.documentService.downloadFile(response);
        this.toastService.success("Plugin download successful", "", { positionClass: "toast-center-center" });
        this.isPluginLoader=false;
      },error: error=>{
        this.toastService.error("Plugin download failed", "", { positionClass: "toast-center-center" });
        this.isPluginLoader=false;
      }
  });
  }
  closePopup(event:any){
    this.isOpenUpload = event;
  }
  getFeatureData() {
    if (this.permissionService.checkFeaturePermission({ featureId: this.feature.ExcelPlugin, action: "export" })) {
      this.pluginStatus = "Export";
      this.isUploadDownload = false;
    }
  }
  checkStatus = () => {
    if (this.pluginStatus == "Import") {
      this.setUpload();
    } else if (this.pluginStatus == "Export") {
      this.download();
    }
  }
}
