import { DocumentService } from "./../../services/document.service";
import { FirmService } from "src/app/services/firm.service";
import { FundService } from "src/app/services/funds.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { DealService } from "src/app/services/deal.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { HelperService } from "src/app/services/helper.service";
import { Inject,Component, ElementRef, EventEmitter, Output, ViewChild, OnInit, TemplateRef } from "@angular/core";
@Component({
  selector: "add-repository",
  templateUrl: "./add-repository.component.html",
  styleUrls: ["./add-repository.component.scss"],
})
export class AddRepositoryComponent implements OnInit {
  //modalRef: BsModalRef;
  config = {
    backdrop: false,
    ignoreBackdropClick: true,
    animated: false,
  };
  fileAdded: boolean = false;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  @Output() onSave = new EventEmitter<any>();
  @Output() onCancel = new EventEmitter<any>();

  newDocument: Document = new Document();
  newDocuments = [];
  documentTypes: any[] = [];
  documentSubTypes: any[] = [];
  firms: any[] = [];
  funds: any[] = [];
  porfoliocompanies: any[] = [];
  deals: any[] = [];
  maxDateValue: Date;
  docSavedStatus = "";
  myAppUrl: string = "";
  encodedFileNames = [];
  validationError: string = "";
  disableSaveButton: boolean = true;
  uploadedFilesCount = 0;
  renameInProgress: boolean = false;
  isRetry: boolean = false;
  failedFilesCount = 0;
  loading:boolean = false;

  @ViewChild("fileDropRef") fileDropEl: ElementRef;
  files: any[] = [];
  fileToBeDeleted: any;
  confirmDiscard: boolean = false;
  confirmDelete: boolean = false;
  allfiletypes: Array<string>=[];
  constructor(
    private documentService: DocumentService,
    private helperService: HelperService,
    private firmService: FirmService,
    private fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService,
    private dealService: DealService,
    private toastrService: ToastrService,
    private http: HttpClient,

    //private modalService: BsModalService,
    @Inject("BASE_URL") baseUrl: string
  ) {
    this.myAppUrl = baseUrl;
  }

  //https://www.freakyjolly.com/angular-allow-only-numbers-or-alphanumeric-in-input-restrict-other-characters-using-keypress-event/#.X6ugEC8RrRY
  keyPressAlphaNumeric(event: any) {
    let inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  ngOnInit() {
    this.loading = true;
    this.maxDateValue = new Date();
    this.toastrService.overlayContainer = this.toastContainer;
    this.documentService.getAllDocumentTypes(0).subscribe(
      (result) => {
        this.loading = false;
        this.documentTypes = JSON.parse(JSON.stringify(result));
      },
      (error) => {
        this.loading = false;
      }
    );
    this.loading = true;
    this.firmService.getFirmList({}).subscribe(
      (result) => {
        this.loading = false;
        if (result.body != null) this.firms = result.body.firmList;
      },
      (error) => {
        this.loading = false;
      }
    );
    this.loading = true;
    this.fundService.getFundsData({}).subscribe(
      (result) => {
        this.loading = false;
        if (result!= null && result.length >0) 
          this.funds = result;
      },
      (error) => {
        this.loading = false;
      }
    );
    this.loading = true;
    this.portfolioCompanyService.getPortfolioCompanyList({}).subscribe(
      (result) => {
        this.loading = false;
        if (result.body != null)
          this.porfoliocompanies = result.body.portfolioCompanyList;
      },
      (error) => {
        this.loading = false;
      }
    );
    this.loading = true;
    this.dealService.getDealDropDown().subscribe((result) => {
      this.loading = false;
      if (result!= null && result.length >0) 
      this.deals = result;
    });
    this.allfiletypes=[];
    this.documentService.getRestrictFileTypes("RepositorySection").subscribe((res:any)=>{
      this.allfiletypes.push(res[0]);
      
    })
  }

  openModal(template: TemplateRef<any>, file: any) {
    if (this.files.length > 0 || !this.IsModalEmpty()) this.confirmDiscard = true;
    else {
      this.onCancel.emit();
      this.Reset();
    }
  }
  openDelete(file: string) {
    this.confirmDelete = true;
    this.fileToBeDeleted = file;
  }

  upload(file: any, index: any, isretry: boolean = false) {
    if (isretry) {
      this.failedFilesCount -= 1;
      this.files[index].retry = false;
      this.files[index].imagePath = this.getFileIcons(this.files[index].name);
      this.files[index].fileNameClass = "name nepOption";
      this.isRetry = (this.files.find((x) => x.retry) !== undefined);
    }
    const formData = new FormData();
    formData.append("file", file);

    this.http
      .post(this.myAppUrl + "api/file", formData, {
        reportProgress: true,
        observe: "events",
        responseType: "text",
      })
      .pipe(
        map((event: any) => {
          if (event.type == HttpEventType.UploadProgress) {
            let progress = Math.round((100 / event.total) * event.loaded);
            this.files[index].progress = JSON.parse(JSON.stringify(progress));
          } else if (event.type == HttpEventType.Response) {
            if (this.files.find((x) => x.error === "Document name already exists") !== undefined) {
              this.files.forEach((f) => {
                if (f.error !== undefined && f.error != "") {
                  this.validationError = f.error;
                  let image = this.getIcons("error");
                  f.imagePath = image;
                  f.fileNameClass = "name nepOption applyGeyColor";
                  f.isError = false;
                }
              });
              this.disableSaveButton = true;
            } else {
              let hasError = this.files.some((e) => e.error != undefined && e.error != "");
              this.disableSaveButton = hasError || (this.files.find((x) => x.retry) !== undefined);
            }
            this.encodedFileNames.push(file.name);
            if (this.encodedFileNames.length > 1) {
              this.RemoveHtmlValidation();
            }
            this.recreateNewDocument();
            (document.getElementById("uploadedCount") as HTMLInputElement).innerText = `Uploaded (${this.files.length - this.failedFilesCount} out of ${this.files.length})`;
            this.newDocument.Name = file.name.substr(
              0,
              file.name.lastIndexOf(".")
            );
            this.newDocument.Extension = "." + file.name.split(".").pop();
            if (this.files.find((x) => x.progress !== 100) === undefined) {
              if (this.files.length === 1) {
                (document.getElementById(
                  "documentname"
                ) as HTMLInputElement).value = file.name.substr(
                  0,
                  file.name.lastIndexOf(".")
                );
              }
              this.showtoasterOnuploadComplete();
            }
          }
          this.uploadedFilesCount = this.files.length;
        }),
        catchError((err: any) => {
          if (this.files.length >= index + 1) {//If a file is deleted during retry
            this.failedFilesCount += 1;
            (document.getElementById("uploadedCount") as HTMLInputElement).innerText = `Uploaded (${this.files.length - this.failedFilesCount} out of ${this.files.length})`;
            this.isRetry = true;
            this.disableSaveButton = true;
            this.files[index].retry = true;
            this.files[index].progress = 100;
            this.files[index].imagePath = this.getIcons("error");
            this.files[index].fileNameClass = "name nepOption applyGeyColor";
            this.showtoasterOnuploadComplete();
          }
          return throwError(err.message);
        })
      )
      .toPromise();
  }

  showtoasterOnuploadComplete() {
    if (this.isRetry && this.files.length != 1)
      this.toastrService.warning("Only few document(s) uploaded successfully", "", { positionClass: "toast-center-center" });
    else if (!this.isRetry)
      this.toastrService.success("Document uploaded successfully", "", { positionClass: "toast-center-center" });
  }

  recreateNewDocument() {
    this.newDocuments = [];
    if (this.encodedFileNames.length === 1) {
      this.newDocument.Path = this.encodedFileNames[0];
      this.newDocuments.push(this.newDocument);
    } else if (this.encodedFileNames.length > 1) {
      this.encodedFileNames.forEach((newDocName) => {
        let newDoc: Document = JSON.parse(JSON.stringify(this.newDocument));
        newDoc.Path = newDocName;
        newDoc.Name = newDocName.substr(0, newDocName.lastIndexOf("."));
        newDoc.displayName = newDocName.substr(0, newDocName.lastIndexOf("."));
        this.newDocuments.push(newDoc);
      });
    }
  }

  Save() {
    this.recreateNewDocument();
    //Validate Bulk Documents
    if (this.files.length > 1) {
      this.ValidateBulkDocExists(true, -1);
    } else {
      this.AddDocuments();
    }
  }

  //Add Single/Bulk Documents
  AddDocuments() {
    this.loading = true;
    this.documentService.AddDocument(this.newDocuments).subscribe(
      (result) => {
        this.loading = false;
        this.docSavedStatus = result.statusText;
        this.onSave.emit();
        this.Reset();
      },
      (error) => {
        this.loading = false;
        if (error.status === 422) {
          this.validationError = error.error;
          this.disableSaveButton = true;
          this.AddHtmlValidation();
        } else {
          this.docSavedStatus = error.statusText;
          this.onSave.emit();
          this.Reset();
        }
      }
    );
  }

  //HTML validation need to refactor to angular
  AddHtmlValidation() {
    this.validationError = "Name already exists";
    // (document.getElementById("docName") as HTMLInputElement).classList.add(
    //   "applyRedColor"
    // );
    (document.getElementById("docTypeDiv") as HTMLInputElement).classList.add(
      "applyTopMargin"
    );
    // (document.getElementById("documentname") as HTMLInputElement).classList.add(
    //   "applyRedBorderBottom"
    // );
  }

  RemoveHtmlValidation() {
    this.validationError = "";
    // (document.getElementById("docName") as HTMLInputElement).classList.remove(
    //   "applyRedColor"
    // );
    // (document.getElementById(
    //   "documentname"
    // ) as HTMLInputElement).classList.remove("applyRedBorderBottom");
    (document.getElementById(
      "docTypeDiv"
    ) as HTMLInputElement).classList.remove("applyTopMargin");
  }

  getDuplicateFileNames() {
    let duplicateFilesNames = [];
    this.newDocuments.forEach((element) => {
      if (
        this.newDocuments.filter((x) => x.displayName === element.displayName)
          .length > 1
      ) {
        duplicateFilesNames.push(element);
      }
    });
    return duplicateFilesNames;
  }
  //Validate Bulk Upload
  ValidateBulkDocExists(isSave: boolean, index) {
    let duplicateFilesNames = this.getDuplicateFileNames();
    if (duplicateFilesNames.length > 0) {
      this.files.forEach((f, i) => {
        let temp = duplicateFilesNames.find(
          (x) => x.displayName === f.displayName
        );
        if (temp !== undefined) {
          f.error = "Document name already exists";
          let image = this.getIcons("error");
          f.imagePath = image;
          f.fileNameClass = "name nepOption applyGeyColor";
          f.isError = false;
          this.validationError = f.error;
        } else if (i === index) {
          let image = this.getFileIcons(f.name);
          f.error = "";
          f.imagePath = image;
          f.fileNameClass = "name nepOption";
          f.isError = false;
          this.validationError = f.error;
        }
      });
    } else {
      this.loading = true;
      this.documentService.VaidateBulkDocExists(this.newDocuments).subscribe(
        (success) => {
          this.loading = false;
          if (isSave) this.AddDocuments();
          else {
            this.validationError = "";
            this.disableSaveButton = false;
            this.newDocuments = success;
            this.files.forEach((f) =>
              this.newDocuments.forEach((d) => {
                if (f.name == d.path && d.errorMessage == null) {
                  f.error = "";
                  let image = this.getFileIcons(f.name);
                  f.imagePath = image;
                  f.fileNameClass = "name nepOption";
                  f.isError = false;
                }
              })
            );
          }
        },
        (result) => {
          this.loading = false;
          if (result.status === 422) {
            this.newDocuments = result.error;
            this.disableSaveButton = true;
            this.files.forEach((f) =>
              this.newDocuments.forEach((d) => {
                if (f.name == d.path && f.displayName == d.displayName && d.errorMessage == null) {
                  let image = this.getFileIcons(f.name);
                  f.imagePath = image;
                  f.fileNameClass = "name nepOption";
                  f.isError = false;
                  f.error = "";
                }
                else if (f.name == d.path && f.displayName == d.displayName && d.errorMessage != "") {
                  let errorDetails = d.errorMessage;
                  f.error = errorDetails;
                  let image = this.getIcons("error");
                  f.imagePath = image;
                  f.fileNameClass = "name nepOption applyGeyColor";
                  f.isError = false;
                  this.validationError = d.errorMessage;
                }
              })
            );
          } else {
            this.loading = false;
            this.validationError = "";
            this.disableSaveButton = false;
          }
        }
      );
    }
  }

  //Validate Single Upload
  VaidateDocExists() {
    this.loading = true;
    this.documentService.VaidateDocExists(this.newDocument).subscribe(
      () => { },
      (result) => {
        this.loading = false;
        if (result.status === 422) {
          this.validationError = result.error.errorMessage;
          this.disableSaveButton = true;
          this.AddHtmlValidation();
        } else {
          this.validationError = "";
          this.disableSaveButton = false;
          this.RemoveHtmlValidation();
        }
      }
    );
  }

  YesOnCancel() {
    this.loading = true;
    this.confirmDiscard = false;
    this.onCancel.emit();
    this.documentService.DeleteFiles(this.encodedFileNames).subscribe(
      (result) => {
        this.loading = false;
       },
      (error) => {
        this.loading = false;
      }
    );
    this.Reset();
  }

  OnDeleteUploadedFile() {
    let file = this.fileToBeDeleted;
    let index = this.files.indexOf(file);
    this.files[index].progress = 100;
    this.files = this.files.filter((x) => x !== this.fileToBeDeleted);
    let fileName = file.name.substr(0, file.name.lastIndexOf("."));
    let nameofFiles = [fileName];
    if (!file.retry) {
      this.encodedFileNames.splice(index, 1);
      this.loading = true;
      this.documentService.DeleteFiles(nameofFiles).subscribe(
        (result) => {
          this.loading = false;
        },
        (error) => {
          this.loading = false;
        }
      );
    }
    else
      this.failedFilesCount -= 1;
    this.uploadedFilesCount = this.files.length;
    if (this.files.length > 0) {
      (document.getElementById("uploadedCount") as HTMLInputElement).innerText = `Uploaded (${this.files.length - this.failedFilesCount} out of ${this.files.length})`;
      let hasError = this.files.some((e) => e.error != undefined && e.error != "");
      let hasRetry = (this.files.find((x) => x.retry) !== undefined);
      this.isRetry = hasRetry;
      if (!hasError) {
        this.disableSaveButton = hasRetry;
        this.validationError = "";
      }
    }
    if (this.files.length == 1) {
      let image = this.getFileIcons(this.files[0].name);
      this.files[0].imagePath = image;
      this.files[0].fileNameClass = "name nepOption";
      this.files[0].isError = false;
      this.disableSaveButton = false;
      if (this.files[0].error != undefined && this.files[0].error != "") {
        this.disableSaveButton = true;
        this.AddHtmlValidation();
      } else{
        this.validationError = "";
      }
      this.files[0].error = "";//To remove error message from multiple to single upload
    }
    if (this.files.length == 0)
      this.ClearValidation();
    this.fileToBeDeleted = undefined;
    if (this.files.length === 1)
      this.newDocument.Name = this.encodedFileNames[0].substr(0, this.encodedFileNames[0].lastIndexOf("."));
    this.confirmDelete = false;
  }

  NoOnCancel() {
    this.confirmDiscard = false;
    this.confirmDelete = false;
  }

  private Reset() {
    this.newDocument = new Document();
    this.ClearValidation();
  }

  private ClearValidation() {
    this.newDocument.Name = "";
    this.files = [];
    this.encodedFileNames = [];
    this.validationError = "";
    (document.getElementById("uploadedCount") as HTMLInputElement).innerText =
      "";
    this.disableSaveButton = true;
    (document.getElementById(
      "docTypeDiv"
    ) as HTMLInputElement).classList.remove("applyTopMargin");
    (document.getElementById("documentname") as HTMLInputElement).value = "";
    this.isRetry = false;
    this.uploadedFilesCount = 0;
    this.failedFilesCount = 0;
  }

  private IsModalEmpty() {
    if (this.newDocument.Name !== "" ||
      this.newDocument.DocumentType !== 0 ||
      this.newDocument.DateOfDocument !== undefined ||
      this.newDocument.DealId !== 0 ||
      this.newDocument.DocumentSubType !== 0 ||
      this.newDocument.FirmId !== 0 ||
      this.newDocument.FundId !== 0 ||
      this.newDocument.PortfolioCompanyId !== 0 ||
      this.newDocument.Tags !== "") {
      return false;
    } else {
      return true;
    }
  }

  onDocumentTypeChanged() {
    this.newDocument.DocumentSubType = undefined;
    this.documentService
      .getAllDocumentTypes(this.newDocument.DocumentType)
      .subscribe(
        (result) => {
          this.documentSubTypes = JSON.parse(JSON.stringify(result));
        },
        (error) => {
        }
      );
  }

  /**
   * on file drop handler
   */
  onFileDropped($event: any) {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: any) {
    let index = this.files.length;
    for (let item of files) {
      let typeLength = item.name.split('.').length;
      let type = item.name.split('.')[typeLength-1];
      if (this.allfiletypes.toString().toLocaleLowerCase().indexOf(type.toString().toLocaleLowerCase()) === -1) return;
      item.progress = 0;
      item.retry = false;
      item.imagePath = this.getFileIcons(item.name);
      item.isError = false;
      item.displayName = item.name.substr(0, item.name.lastIndexOf("."));
      item.fileNameClass = "name nepOption";
      this.files.push(item);
      this.upload(item, index);
      index++;
    }
    this.fileDropEl.nativeElement.value = "";
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) {
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  documentNameOnBlur() {
    if (this.newDocument.Name === "") {
      this.newDocument.Name = this.files[0].name.substr(
        0,
        this.files[0].name.lastIndexOf(".")
      );
    }
    this.VaidateDocExists();
  }

  documentBulkNameOnBlur(file: any, index: any) {
    this.encodedFileNames = [];
    this.newDocuments.forEach((element: any) => {
      let extension = this.getFileExtension(element.path);
      let name = element.Name != undefined ? element.Name : element.name;
      if (name == file.name.substr(0, file.name.lastIndexOf("."))) {
        element.displayName = file.displayName;
        element.ErrorMessage = "Document name already exists";
      }
      this.encodedFileNames.push(element.displayName + "." + extension);
    });

    this.ValidateBulkDocExists(false, index);
    this.renameInProgress = false;
  }

  private getFileExtension(filename: string) {
    let ext = /^.+\.([^.]+)$/.exec(filename);
    return ext == null ? "" : ext[1];
  }

  getIcons(name: string) {
    return this.helperService.getstaticIconPath(name);
  }

  getFileIcons(filename: string) {
    return this.helperService.getIconFromFileName(filename);
  }

  renameIfError(file: any) {
    if (file.fileNameClass.includes("applyGeyColor") && !file.retry && !this.renameInProgress) {
      file.isError = true;
      this.renameInProgress = true;
    }
  }
}

class Document {
  Name: string = "";
  DateOfDocument: Date;
  DocumentType: number = 0;
  DocumentSubType: number = 0;
  DealId: number = 0;
  FirmId: number = 0;
  FundId: number = 0;
  Path: string = "";
  PortfolioCompanyId: number = 0;
  Tags: string = "";
  Extension: string = "";
  ErrorMessage: string = "";
  displayName: string = "";
}
