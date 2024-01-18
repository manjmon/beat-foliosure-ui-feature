import { UserIds } from './../../../../portfolioCompany/models/user.model';
import { OidcAuthService } from './../../../../../services/oidc-auth.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { AccountService } from 'src/app/services/account.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { secureRandom } from 'src/app/common/constants';

@Component({
  selector: 'app-add-users',
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.scss']
})
export class AddUsersComponent implements OnInit {
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  defaultPlaceholder = "Browse"
  uploadFilePlaceholder = this.defaultPlaceholder;
  browseicon = true;
  files = [];
  uploadedFiles: any[] = [];
  messages: any[] = [];
  progress: number;
  uploadResultobj: { [k: string]: any } = {};
  FileProgresStatus: string = "Cancel File Progress";
  @ViewChild("fileUploader") fileUploader: any = {};
  value: number = 0;
  cancel: boolean = false;
  ProgressCancel: boolean = true;
  form: FormGroup;
  submitted = false;
  countryList: any[] = [];
  safeHtml: SafeHtml;
  userForm: FormGroup;
  groupList: any[] = [];
  msgTimeSpan: number;
  id: any;
  msgs: Message[] = [];
  title: string = "Create";
  resetText: string = "Reset";
  userStatus: boolean = true;
  selectedUserList: any = {};
  model: any = { isActive: this.userStatus, groupDetails: [] };
  loading = false;
  strModuleType = "UserList";
  interval: any = 0;
  messageClass: string = "bulkMessage";
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  @Output() onUserChanges: EventEmitter<any> = new EventEmitter();
  userModel: UserIds = new UserIds();
  userListIds = [];
  @Input() userInfo =null;
  constructor(private formBuilder: FormBuilder, private sanitizer: DomSanitizer, private toastrService: ToastrService,private oidcAuthService: OidcAuthService,
    private miscService: MiscellaneousService, protected changeDetectorRef: ChangeDetectorRef, private accountService: AccountService, private fileUploadService: FileUploadService) { }

  ngOnInit() {
    this.form = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        emailId: ['', [Validators.required, Validators.email]],
        phoneNo: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
        country: ['', Validators.required],
        organization: ['', [Validators.required, Validators.maxLength(50)]],
        isActive: [false, '']
      }
    );
    this.getCountries();
    this.toastrService.overlayContainer = this.toastContainer;
    this.GetUsersFromBeatIds();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onReset(): void {
    this.submitted = false;
    this.form.reset();
    if (this.files.length > 0) this.deleteiconclick();
    this.changeDetectorRef.detectChanges();
  }
  onSelect(files: any) {
    this.files = files;
    this.uploadedFiles = [];
    this.messages = [];
    if (files[0].size > 20000000) {
      this.uploadResultobj.messageClass = "errorMessage";
      this.uploadResultobj.safeHtml = "File size is greater than 20 MB.";
      this.messages.push(this.uploadResultobj);
      this.fileUploader.files = [];
    } else {
      this.ProgressCancel = true;
      this.value = 0;
      this.cancel = false;
      this.FileProgresStatus = "Cancel File Progress";
      this.uploadFilePlaceholder = files[0].name;
      this.browseicon = false;
    }
  }
  deleteiconclick() {
    this.files = [];
    this.uploadFilePlaceholder = this.defaultPlaceholder;
    this.browseicon = true;
    this.messages = [];
  }
  getCountries() {
    this.miscService.getCountryList().subscribe(result => {
      this.countryList = result["body"];
    }, _error => {
    });
  }
  saveUser(f: any) {
    if (this.form.invalid && this.files.length == 0) {
      return;
    }
    else if (this.form.valid) {
      this.submitted = true;
      this.loading = true;
      this.addUser(f);
    }
    else if (this.files.length > 0) {
      this.loading = true;
      this.onUpload();
    }
    else
      return;
  }
  addUser(f: any) {
    this.model.isActive = this.model.isActive == null ? false : this.model.isActive;
    if (this.title == "Create") {
      this.accountService.addUser(this.model)
        .subscribe(
          data => {
            this.loading = false;        
            if (data.code == 'OK')
            {
              this.toastrService.success('User(s) added successfully', "", { positionClass: "toast-center-center" });
              this.submitted = false;
              this.onUserChanges.emit(true);
              this.formReset(f);
            }
            else
              this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
          },
          error => {
            this.toastrService.error(error.message, "", { positionClass: "toast-center-center" });
            this.loading = false;
            this.submitted = false;
          });
    }
    else if (this.title == "Update") {
      this.accountService.updateUser(this.model)
        .subscribe(
          data => {
            this.loading = false;
            if (data.code == 'OK')
            {
              this.submitted = false;
              this.toastrService.success('User(s) added successfully', "", { positionClass: "toast-center-center" });
              this.onUserChanges.emit(true);
            }
            else
              this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
          },
          error => {
            this.toastrService.error(error.message, "", { positionClass: "toast-center-center" });
            this.loading = false;
            this.submitted = false;
          });
    }
  }

  formReset(_f: any) {
    this.submitted = false;
    this.form.reset();
  }
  downloadTemplate() {
    this.fileUploadService
      .exportTemplates({ moduleType: this.strModuleType, PortfolioCompanyID: null })
      .subscribe(
        (response) => {
          if (response.ok) {
            this.miscService.downloadExcelFile(response);
          } else {
            this.toastrService.error("File is not downloaded.", "", { positionClass: "toast-center-center" });
          }
          this.loading = false;
        },
        (_error) => {
          this.toastrService.error("Something went wrong. Please check the query and try again.", "", { positionClass: "toast-center-center" });
          this.loading = false;
        }
      );
  }
  private uploadFiles(file: any) {
    var local = this;
    this.uploadResultobj = {};
    this.messages = [];
    file.showCancelButton = true;
    this.ProgressCancel = false;
    this.safeHtml = "";
    let ModuleName = "User";
    let strAPIURL = "api/user/import/"+true;
    if (file.length === 0) {
      this.safeHtml = "Error :- No file selected. Please select a file.";
      this.messageClass = "errorMessage";
      this.ProgressCancel = true;
      return;
    }

    this.interval = setInterval(() => {
      this.value = this.value + Math.floor(secureRandom(10)) + 1;
      if (this.value >= 90) {
        this.value = 90;
      }

      try {
        const formData = new FormData();
        formData.append("ModuleName", ModuleName);
        formData.append(file.name, file);
        if (!this.cancel) {
          this.cancel = true;
          this.FileProgresStatus = "File Processing...";
          this.fileUploadService.importBulkData(formData, strAPIURL).subscribe(
            (results) => {
              this.submitted = false;
              this.loading = false;
              this.onUserChanges.emit(true);
              let num = 0;
              for (let result of results["body"]["userStatus"]) {
                try {
                  this.value = 100;
                  this.uploadResultobj = {};
                  clearInterval(this.interval);
                  setInterval(() => {
                    this.ProgressCancel = true;
                  }, 2000);
                  if (
                    result.code != null &&
                    result.code.trim().toLowerCase() == "ok"
                  ) {
                    this.messageClass = "bulkMessage";
                    this.safeHtml =  result.message;
                    this.uploadedFiles.push(file);

                    this.uploadResultobj.messageClass = this.messageClass;
                    this.uploadResultobj.safeHtml = this.safeHtml;
                    this.messages.push(this.uploadResultobj);
                    this.files = [];
                    this.uploadFilePlaceholder = this.defaultPlaceholder;
                    this.browseicon = true;
                  } else if (
                    result.code != null &&
                    result.code.trim().toLowerCase() == "info"
                  ) {
                    this.messageClass = "infoMessage";
                    this.safeHtml =  result.message;
                    this.uploadResultobj.messageClass = this.messageClass;
                    this.uploadResultobj.safeHtml = this.safeHtml;
                    this.messages.push(this.uploadResultobj);
                  } else {
                    if (result.message != null && result.message != "") {
                      if (num == 0) {
                        result.message =
                          "<b>Errors : -</b>  <i>One or more records in the file has invalid data or sheet(s) may be empty. Please upload the file again after correction.</i > <br/>" +
                          result.message;
                      }
                      num = num + 1;

                      this.messageClass = "errorMessage";
                      this.safeHtml = result.message;
                      this.uploadResultobj.messageClass = this.messageClass;
                      this.uploadResultobj.safeHtml = this.safeHtml;
                      this.messages.push(this.uploadResultobj);                   
                    }
                  }
                } catch (e) {
                  this.messageClass = "errorMessage";
                  this.toastrService.error("Please check the file", "", { positionClass: "toast-center-center" });
                  this.value = 100;
                  setInterval(() => {
                    this.ProgressCancel = true;
                  }, 2000);
                }
              }
            },
            (_error) => {
              this.ProgressCancel = false;
              this.loading = false;
              this.submitted = false;
            }
          );
        }
      } catch (e) {
        this.toastrService.error("Please check the file", "", { positionClass: "toast-center-center" });
        this.messageClass = "errorMessage";
        this.loading = false;
        this.submitted = false;
      }
    }, 2000);
  }
  onUpload() {
    for (let file of this.files) {
      this.uploadFiles(file);
    }
  }
  addUserInBeatIds(user: any) {
    this.userModel.country=user.country.country;
    this.userModel.email=user.emailID;
    this.userModel.lastName=user.lastName;
    this.userModel.firstName=user.firstName;
    this.userModel.phoneNumber=user.phoneNumber;
    this.oidcAuthService.addUsersFromBeatIds(this.userModel)
      .subscribe(
        (_result) => {
        },
        _error => {
        });
  }
  updateUserInBeatIds()
  {
    this.oidcAuthService.updateUsersFromBeatIds({})
    .subscribe(
      (_result) => {
        
      },
      _error => {
      });
    
  }
  GetUsersFromBeatIds()
  {
    this.oidcAuthService.getUsersFromBeatIds()
      .subscribe(
        (users:any) => {
          this.userListIds=users;
        },
        _error => {
        });
  }
  isExistUsersInBeatIds()
  {
    this.oidcAuthService.isUserExistFromBeatIds('')
    .subscribe(
      (_result) => {
        
      },
      _error => {
      });
  }
  setActiveUserInBeatIds()
  {
    this.oidcAuthService.setActiveUserInBeatIds('')
    .subscribe(
      (_result) => {
        
      },
      _error => {
      });
  }
  setInActiveUserInBeatIds()
  {
    this.oidcAuthService.setDeActiveUserInBeatIds('')
    .subscribe(
      (_result) => {
        
      },
      _error => {
      });
  }
  uploadUsersForIDs(usersModel:any)
  {
    usersModel.forEach(user => {
      if(user.statusDescription=="")
      {
        this.addUserInBeatIds(user);
      }
    });
  }
}
