import { Component, OnInit,Output, Input, Inject, EventEmitter } from '@angular/core';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import * as signalR from '@microsoft/signalr';
import { UploadService} from 'src/app/services/upload.service';
import { FileStatusService } from 'src/app/services/file-status.service';
import { BehaviorSubject, Observable } from 'rxjs';
import {FileStatus,FileUploadModule} from 'src/app/common/enums';
import { Router } from '@angular/router';
import { FileUploadStatus } from 'src/app/common/constants';

@Component({
  selector: "app-file-status-side-nav",
  templateUrl: "./file-status-side-nav.component.html",
  styleUrls: ["./file-status-side-nav.component.scss"],
})
export class FileStatusSideNavComponent implements OnInit {
  private statusSubject = new BehaviorSubject<number>(0);
  status$: Observable<number> = this.statusSubject.asObservable();
  @Input() isOpensideNavfield: boolean;
  @Output() cancelledSpin = new EventEmitter<boolean>();
  appUrl: string = "";
  uploadedFileList: any;
  fileStatus = FileStatus;
  FileUploadModule = FileUploadModule;
  imageSource: any;
  connectionId: string;
  hubConnection: signalR.HubConnection;
  userId: string;
  constructor(
    private ids: OidcAuthService,
    private identityService: OidcAuthService,
    @Inject("BASE_URL") baseUrl: string,
    private _fileStatusService: FileStatusService,
    private uploadService: UploadService,
    private router: Router
  ) {
    this.appUrl = baseUrl;
    this.startFileStatusHub();
  }

  ngOnInit(): void {
    let userPermission = localStorage.getItem(
      `${this.ids.environment}_userPermissions`
    );
    if (userPermission !== null && userPermission !== "") {
      let userPermissionParsed = JSON.parse(userPermission);
      if (userPermissionParsed.length > 0) {
        let userId = userPermissionParsed[0].userID;
        if (userId > 0) {
          this.userId = userId;
        }
      }
    }
  }
  startFileStatusHub() {
    const token = this.identityService.getToken();
    const hubConnection = new signalR.HubConnectionBuilder()
      .configureLogging(signalR.LogLevel.Information)
      .withUrl(this.appUrl + FileUploadStatus.FileUploadNotification, {
        accessTokenFactory: () => token,
      }) // Use the URL you configured in Startup.cs
      .build();

    this.hubConnection = hubConnection;

    hubConnection.onreconnected((connectionId) => {
      this.connectionId = connectionId;
      if (this.userId !== undefined || this.userId !== "") {
        this.sendDataToClient(this.connectionId, this.userId);
      }
    });

    hubConnection
      .start()
      .then(() => {
        // Retrieve the initial connection ID
        this.connectionId = hubConnection.connectionId;
        if (this.userId !== undefined || this.userId !== "") {
          this.sendDataToClient(this.connectionId, this.userId);
        }
      })
      .catch((err) => {});

    hubConnection.on(FileUploadStatus.FileUploadFileStatusUpdated, (data) => {
      this.uploadedFileList = data;
      this.spinEmitcontrolFunction();
    });

    this._fileStatusService.getFileStatusNavOpened().subscribe({
      next: (result: boolean) => {
        if (result) {
          if (this.userId !== undefined || this.userId !== "") {
            this.sendDataToClient(this.connectionId, this.userId);
          }
        }
      },
    });

    this._fileStatusService.getFileStatus().subscribe({
      next: (result: any) => {
        this.uploadedFileList = result.data;
      },
    });
  }

  sendDataToClient(connectionId: string, message: string) {
    let args = [];
    args.push(connectionId);
    args.push(message);

    // Invoke the server method to send data to a specific client
    this.hubConnection
      .invoke<any>(FileUploadStatus.FileUploadInvokeFileStatusByUserId, connectionId + " :: " + message)
      .then(() => {})
      .catch((error) => {});
  }

  removeFilename(fileId: string) {
    this._fileStatusService.cancelFile(fileId).subscribe({
      next: (res) => {
        this.startFileStatusHub();
        if (
          this.uploadedFileList.filter(
            (x) =>
              x.uploadStatus == this.fileStatus.Processing ||
              x.uploadStatus == this.fileStatus.Uploaded
          ).length == 1
        )
          this.cancelledSpin.emit(false);
      },
    });
  }

  truncateFileName(fileName: string, maxLength: number) {
    fileName = fileName.trim();
    if (fileName.length <= maxLength) {
      return fileName;
    } else {
      const shortFilename = fileName.slice(0, maxLength - 5); // Leave space for "...."
      const extension = fileName.split(".").pop();
      return `${shortFilename}...${extension}`;
    }
  }

  getFileStatusIcon(status: number) {
    switch (status) {
      case this.fileStatus.Uploaded:
      case this.fileStatus.Processing:
        return FileUploadStatus.FileUploadProcessImage;
      case this.fileStatus.Successful:
        return FileUploadStatus.FileUploadSuccessImage;
      case this.fileStatus.Failed:
      case this.fileStatus.Cancelled:
        return FileUploadStatus.FileUploadFailedImage;
      default:
        break;
    }
  }

  spinEmitcontrolFunction() {
    if (
      this.uploadedFileList.some(
        (x) =>
          x.uploadStatus === this.fileStatus.Uploaded ||
          x.uploadStatus === this.fileStatus.Processing
      )
    ) {
      this.cancelledSpin.emit(true);
    } else {
      this.cancelledSpin.emit(false);
    }
  }
  uploadProgress(status: number) {
    if (
      status !== this.fileStatus.Failed &&
      status !== this.fileStatus.Successful &&
      status !== this.fileStatus.Cancelled
    ) {
      return FileUploadStatus.FileUploadNotificIconImage;
    }
  }

  removecross(status: number) {
    if (
      status !== this.fileStatus.Uploaded &&
      status !== this.fileStatus.Processing
    ) {
      return FileUploadStatus.FileUploadCrossGreyImage;
    }
  }

  getFileStatusText(status: number) {
    switch (status) {
      case this.fileStatus.Uploaded:
      case this.fileStatus.Processing:
        return FileUploadStatus.UploadinProgress;
      case this.fileStatus.Successful:
        return FileUploadStatus.UploadSuccessful;
      case this.fileStatus.Failed:
        return FileUploadStatus.UploadFailed;
      case this.fileStatus.Cancelled:
        return FileUploadStatus.UploadCancelled;
      default:
        break;
    }
  }
  clearFiles() {
    this.uploadedFileList = this.uploadedFileList.filter(
      (x) => x.uploadStatus === this.fileStatus.Uploaded || x.uploadStatus === this.fileStatus.Processing
    );
    this._fileStatusService.clearALlFileStatus().subscribe();
  }

  redirectFileUploadError(tab: any) {

debugger;
console.log("1111111111111111111111111111",tab);
const fileId = tab.fileId.split(".");
fileId.pop();
this.router.navigateByUrl(FileUploadStatus.FileUploadFileuploadStatus , { skipLocationChange: true }).then(() => {
  let path = tab != null ? `${FileUploadStatus.FileUploadFileuploadStatus}/${fileId}` : FileUploadStatus.FileUploadFileuploadStatus;
  this.router.navigate([path], {
    state: {
      data: {
        featureId: tab != null ? tab.featureId : null,
        fileId: tab != null ? tab.fileId : null,
      },
    }
  });
});
  }
}
