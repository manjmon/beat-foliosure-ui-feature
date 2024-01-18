import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { DealService } from "../../../services/deal.service";
import { FirmService } from "../../../services/firm.service";
import { FundService } from "../../../services/funds.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import { AccountService } from "../../../services/account.service";
import { DocumentService } from "../../../services/document.service";
import { FeaturesEnum } from "../../../services/permission.service";
import { Document } from "./document.model";
import { MatChipInputEvent } from "@angular/material/chips";
import { Chips} from "../../../../../projects/ng-neptune/src/lib/chip/chip.component"

@Component({
  selector: "open-document",
  templateUrl: "./open-document.component.html",
  styleUrls: ["./open-document.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class OpenDocumentComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  pipelineList: any = [];
  closeResult: string;
  pagerLength: any;
  dataTable: any;
  blockedTable: boolean = false;
  totalRecords: number;
  globalFilter: string = "";
  paginationFilterClone: any = {};
  @Input() id ='';
  selectedDocument: Document = null;
  PreviousFolder: any = null;
  docData: Document = null;
  editMode = true;
  isDocUpdated = false;
  selectedDocumentType = "";
  documentTypes = [];
  documentSubTypes = [];
  documentSubTypesEnum = [];
  selectedSubDocumentType = "";
  hasDocNameUpdated = false;
  hasTypeUpdated = false;
  hasSubTypeUpdated = false;
  hasDocDateUpdated = false;
  hasFolderUpdated = false;
  hasFirmNameUpdated = false;
  hasFundNameUpdated = false;
  hasPortfolioCompanyNameUpdated = false;
  hasDealNameUpdated = false;
  cancelEditing = false;
  ShowValidation: boolean = false;
  primaryButtonName = "Yes";
  secondaryButtonName = "No";
  modalTitle = "Cancel Editing";
  modalBody1 = "All your changes will be lost.";
  modalBody2 = "Are you sure you want to cancel?";
  cancelDeleteDoc = false;
  deleteModalTitle = "Delete Document";
  deleteModalBody1 = "Are you sure want to delete this document?";
  deleteModalBody2 =
    "The deleted documents can be restored from Recycle Bin within next 45 days";
  firms: any[];
  funds: any[];
  src: any;
  porfoliocompanies: any[];
  deals: any[];
  confirmSave = false;
  confirmChangeFolder = false;
  savePrimaryButtonName = "Confirm";
  saveSecondaryButtonName = "Cancel";
  saveModalTitle = "Save Changes";
  saveModalBody1 = "Are you sure you want to update Document Details?";
  saveModalBody2 = "";
  docNameValidation = "";
  folders: string[] = [];
  documentTags : string[] = [];
  documentError: DocumentError = new DocumentError();
  @Output() closeDocument = new EventEmitter();
  @Output() deleteDocument = new EventEmitter();
  savedTags: string;
  isFolderUpdated = false;
  pdfblobvalue:any;
  loading = true;
  allUsers = [];
  selectedAssignedTo = [];
  userInfo = [];
  showassign = false;
  showatags = false;
  AllStatusTypes = [];
  @ViewChild(Chips) chips:Chips;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  selectDocumentStatus: any = {};
  StatusTypes = [];
  isPreviewMode: boolean = false;
  isEnableView: boolean = false;
  isDownload: boolean = false;
  isPreviewDownload: boolean = false;
  constructor(
    private router: Router,
    protected changeDetectorRef: ChangeDetectorRef,
    private documentService: DocumentService,
    private accountService: AccountService,
    private firmService: FirmService,
    private fundService: FundService,
    private portfolioCompanyService: PortfolioCompanyService,
    private dealService: DealService,
    private toastrService: ToastrService,
    private activatedRoute:ActivatedRoute
  ) {
    if (this.activatedRoute.snapshot.params["id"]) {
      this.id = this.activatedRoute.snapshot.params["id"];
    }
  }
  ngOnInit() {
    let documentId = (this.id == '') ? this.activatedRoute.snapshot.params["id"] : this.id;
    this.id = documentId;
    this.toastrService.overlayContainer = this.toastContainer;
    let local = this;
    this.getDocumentByID(this.id);
    this.getAllStatusTypes();
    this.PdfBlobValue(this.id);
    this.getAllDocTypes();
    this.GetAllSubTypes();
    this.getSectionDetails();
    this.documentService.getFolders().subscribe((result) => {
      local.folders = result;
    });
    this.getAllUsers();
  }

  getAllUsers () {
    this.accountService.getUserList({}).subscribe(
      (result) => {
        this.userInfo = JSON.parse(JSON.stringify(result.body.userList));
        this.userInfo.forEach(user => {
          this.allUsers.push(user.fullName);
        });
        if (this.selectedDocument.assignedToNames !== null) {
          this.selectedAssignedTo = this.selectedDocument.assignedToNames;
        }
      },
      (_error) => {
      }
    );
  }

  getClass(item: any) {
    if (item.name !== undefined && item.name !== null) {
      return item.name.replace(" ", "_");
    }
    return "";
  }

  getAllStatusTypes(){
    this.documentService.getAllDocumentStatus().subscribe(
      (result) => {
        this.AllStatusTypes = JSON.parse(JSON.stringify(result));
        this.StatusTypes = JSON.parse(JSON.stringify(result));
      },
      (_error) => {
      });
  }

  getSubTypes (doctype: string) {
    this.documentService
      .getAllDocumentTypes(doctype)
      .subscribe({
        next: (result) => {
          this.documentSubTypes = result;
        },
        error: (_error) => {
        }
      });
  }

  getAllFirms() {
    this.firmService.getFirmDropDownModel().subscribe(
      (result) => {
        //if (result.body != null) 
        this.firms = result;//.body.firmList;
      },
      (_error) => {
      }
    );
  }

  getAllFunds() {
    this.fundService.getFundsData({}).subscribe(
      (result) => {
        if (result!= null && result.length >0) 
          this.funds = result;
      },
      (_error) => {
      }
    );
  }

  getAllPortfolioCompanies() {
    this.portfolioCompanyService
    .getPortfolioCompany()
    .subscribe((result) => {
        this.porfoliocompanies = result;
    });
  }

  getAllDeals() {
    this.dealService.getDealDropDown().subscribe((result) => {
      if (result!= null && result.length >0) 
      this.deals = result;
    });
  }

  getAllDocTypes() {
    this.documentService
      .getAllDocumentTypes(0)
      .subscribe(
        (result) => (this.documentTypes = JSON.parse(JSON.stringify(result)))
      );
  }
  GetAllSubTypes() {
    this.documentService.getAllSubDocumentTypes().subscribe(
      (result) => {
        this.documentSubTypesEnum = JSON.parse(JSON.stringify(result));
      }
    );
  }
  loadDocSubTypes(id: any) {
    if (id != null && id != undefined && id != ''){
      this.documentSubTypes = this.documentSubTypesEnum.filter(x => x.parentId == id)
    }
  }
  getSectionDetails() {
    this.documentService.getRepositorySectionDetails().subscribe((result) => {
      this.deals = result?.deals || [];
      this.funds = result?.funds || [];
      this.firms = result?.firms || [];
      this.porfoliocompanies = result?.porfoliocompanies || [];
    },
      (_error) => {
        this.deals = [];
        this.funds = [];
        this.firms = [];
        this.porfoliocompanies = [];
      }
    );
  }
  getDocumentByID(_id) {
    this.documentService.getDocumentByID(this.id).subscribe(
      (result) => {
        this.isEnableView = true;
        this.selectedDocument = JSON.parse(JSON.stringify(result));
        this.documentTags=this.selectedDocument?.tags?.split(',') ;
        this.loadDocSubTypes(this.selectedDocument.documentType);
        this.docData = JSON.parse(JSON.stringify(result));
        this.selectDocumentStatus.name = this.selectedDocument.status;
        this.selectDocumentStatus.id = this.selectedDocument.statusId;
        this.selectedDocument.dateOfDocument =
          this.selectedDocument.dateOfDocument !== null
            ? new Date(this.selectedDocument.dateOfDocument)
            : null;
        this.docData.dateOfDocument =
          this.docData.dateOfDocument !== null
            ? new Date(this.docData.dateOfDocument)
            : null;
        this.selectedDocumentType = this.selectedDocument.documentTypeName;
        this.PreviousFolder = result.folderName;
        this.selectedSubDocumentType = this.selectedDocument.documentSubTypeName;
        this.selectedDocument.modifiedOn =
          this.selectedDocument.modifiedOn !== null
            ? this.selectedDocument.modifiedOn
            : this.selectedDocument.createdOn;

        this.docData.modifiedOn =
            this.docData.modifiedOn !== null
              ? this.docData.modifiedOn
              : this.docData.createdOn;
            this.getSubTypes(this.selectedDocument.documentType);
      }
    );
  }

  onEditDocument() {
    this.savedTags = this.selectedDocument.tags;
    this.documentTags = this.selectedDocument.tags!=null ? this.selectedDocument.tags.split(',') : [];
    this.editMode = true;
    this.documentError.Reset();
  }

  hasDocUpdated(event, attribute) {
    if (event === undefined) {
      event = "-";
    } else {
      if(event !== null && event.target !== undefined) {
        event = event.target.value;
      }
    }

    switch (attribute) {
      case "name": {
        this.docNameValidation = "";
        if (this.docData.name !== event) {
          this.hasDocNameUpdated = true;
        } else {
          this.hasDocNameUpdated = false;
        }
        break;
      }
      case "firmName": {
        let updatedName = event !== "-" ? this.firms.filter((x) => x.firmID === event)[0]
          .firmName : event;
        this.selectedDocument.firmName = updatedName;
        if (this.docData.firmName !== updatedName) {
          this.hasFirmNameUpdated = true;
        } else {
          this.hasFirmNameUpdated = false;
        }
        break;
      }

      case "fundName": {
        let updatedName = event !== "-" ? this.funds.filter((x) => x.fundID === event)[0]
          .fundName : event;
        this.selectedDocument.fundName = updatedName;
        if (this.docData.fundName !== updatedName) {
          this.hasFundNameUpdated = true;
        } else {
          this.hasFundNameUpdated = false;
        }
        break;
      }

      case "portfolioCompanyName": {
        let updatedName = event !== "-" ? this.porfoliocompanies.filter(
          (x) => x.portfolioCompanyID === event
        )[0].companyName : event;
        this.selectedDocument.portfolioCompanyName = updatedName;
        if (this.docData.portfolioCompanyName !== updatedName) {
          this.hasPortfolioCompanyNameUpdated = true;
        } else {
          this.hasPortfolioCompanyNameUpdated = false;
        }
        break;
      }

      case "dealName": {
        let updatedName = event !== "-" ? this.deals.filter((x) => x.dealID === event)[0]
          .dealCustomID : event;
        this.selectedDocument.dealName = updatedName;
        if (this.docData.dealName !== updatedName) {
          this.hasDealNameUpdated = true;
        } else {
          this.hasDealNameUpdated = false;
        }
        break;
      }

      case "dateOfDocument": {
        if (this.docData.dateOfDocument !== event) {
          this.hasDealNameUpdated = true;
        } else {
          this.hasDealNameUpdated = false;
        }
        break;
      }

      case "assignedTo":{
        if(this.docData.assignedTo !== this.selectedDocument.assignedTo)
        {
          this.hasDealNameUpdated = true;
        } else {
          this.hasDealNameUpdated = false;
        }
        break;
      }
      case "comment":{
        if(this.docData.comment !== this.selectedDocument.comment)
        {
          this.hasDealNameUpdated = true;
        } else {
          this.hasDealNameUpdated = false;
        }
        break;
      }
    }

    if ( this.selectedDocument.folderName === "Final" &&
      JSON.stringify(this.selectedDocument) !== JSON.stringify(this.docData) &&
      this.docNameValidation === "" && (
         this.selectedDocument.documentType !== undefined && this.selectedDocument.documentType !== "" && this.selectedDocument.documentType !== null
      && this.selectedDocument.documentSubType !== undefined && this.selectedDocument.documentSubType !== "" && this.selectedDocument.documentSubType !== null
      && this.selectedDocument.name !== undefined && this.selectedDocument.name !== ""
      && this.selectedDocument.dateOfDocument !== undefined && this.selectedDocument.dateOfDocument !== null
      && (this.selectedDocument.firmName !== undefined && this.selectedDocument.firmName !== "" && this.selectedDocument.firmName !== "-"
          || this.selectedDocument.fundName !== undefined && this.selectedDocument.fundName !== "" && this.selectedDocument.fundName !== "-"
          ||this.selectedDocument.portfolioCompanyName !== undefined && this.selectedDocument.portfolioCompanyName !== "" && this.selectedDocument.portfolioCompanyName !== "-"
          ||this.selectedDocument.dealName !== undefined && this.selectedDocument.dealName !== "" && this.selectedDocument.dealName !== "-"
         )
      )
    ) {
      this.isDocUpdated = true;
    }
    else if(this.selectedDocument.folderName === "Uploaded" && JSON.stringify(this.selectedDocument) !== JSON.stringify(this.docData)){
      this.isDocUpdated = true;
    }
    else {
      this.isDocUpdated = false;
    }

    this.onItemSelected();
  }

  onDocumentTypeChanged() {
    this.selectedDocument.documentSubType = undefined;
    this.selectedDocument.documentSubTypeName = undefined;
    this.selectedSubDocumentType = undefined;
    this.getSubTypes(this.selectedDocumentType);
    this.selectedDocument.documentType = this.selectedDocumentType;
    this.selectedDocument.documentTypeName =
      DocTypesEnum[this.selectedDocumentType];
    this.hasDocUpdated(DocTypesEnum[this.selectedDocumentType], "type");
    if(this.selectedDocument.folderName === "Final")
      this.documentError.Validated(this.selectedDocument);
  }

  onDocumentSubTypeChanged() {
    this.selectedDocument.documentSubTypeName =
      DocSubTypesEnum[this.selectedSubDocumentType];
    this.selectedDocument.documentSubType = this.selectedSubDocumentType;
    this.hasDocUpdated(
      DocSubTypesEnum[this.selectedSubDocumentType],
      "subtype"
    );
    if(this.selectedDocument.folderName === "Final")
      this.documentError.Validated(this.selectedDocument);
  }

  showCancelModal() {
    if (JSON.stringify(this.selectedDocument) !== JSON.stringify(this.docData)) {
      this.cancelEditing = true;
    } else {
      this.closeDoc();
    }
  }

  onYesDeleteModal() {
    let docList = [];
    docList.push(this.docData);
    this.documentService
      .MoveToRecycleBin(JSON.stringify(docList))
      .subscribe((data) => {
        this.closeDoc();
        this.delDoc(data);
      });

    this.onNoDeleteModal();
  }

  delDoc(response){
    this.router.url.includes("open-document") ? this.router.navigateByUrl('/repository') : this.deleteDocument.emit(response);
  }

  onNoDeleteModal() {
    this.cancelDeleteDoc = false;
  }

  showCancelDeleteModal() {
    this.cancelDeleteDoc = true;
  }

  closeCancelModal() {
    this.cancelEditing = false;
  }

  onCancelEditing() {
    this.editMode = false;
    this.isDocUpdated = false;
    this.closeCancelModal();
    this.selectedDocument = JSON.parse(JSON.stringify(this.docData));
    if(this.docData.dateOfDocument !== null) {
      this.selectedDocument.dateOfDocument = this.convertToUTC(
        this.docData.dateOfDocument
      );
    } else {
      this.selectedDocument.dateOfDocument = null;
    }
    this.selectedDocumentType = this.docData.documentTypeName;
    this.selectedSubDocumentType = this.docData.documentSubTypeName;
    this.docNameValidation = "";
    if(this.isFolderUpdated){
      this.documentService.ChangeFolder(this.selectedDocument).subscribe(
        (_result) => {
          this.isFolderUpdated = false;
          this.PreviousFolder = this.PreviousFolder === "Uploaded" ? "Final" : "Uploaded";
        },
        (_error) => {
        });
    }
    let oldAssignees = this.docData.assignedToNames !== null ? this.docData.assignedToNames : [];
    this.selectedAssignedTo = oldAssignees;
    this.selectDocumentStatus.name = this.docData.status;
    this.selectDocumentStatus.id = this.docData.statusId;
  }

  showSuccessToasterMessage(msg) {
    this.toastrService.success(msg,"",{positionClass:"toast-center-center"});
  }

  onConfirmSave() {
    this.ShowValidation = true;
    this.vaidateDocExists(true);
  }

  onCancelSave() {
    this.confirmSave = false;
  }

  onUpdateDocument() {
    this.confirmSave = false;
    this.selectedDocument.tags = this.documentTags.toString();
    if(this.selectedDocument.dateOfDocument !== null) {
      this.selectedDocument.dateOfDocument =  this.convertToUTC(this.selectedDocument.dateOfDocument);
    }
    this.selectedDocument.modifiedOn = this.convertToUTC(new Date());
    this.documentService
      .UpdatelDocument(this.id, this.selectedDocument)
      .subscribe(
        (result) => {
          this.onUpdateDoc(result);
        },
        (error) => {
          this.onUpdateDoc(error);
        }
      );
    this.isFolderUpdated = false;
  }

  onUpdateDoc(result) {
    if (result.status === 422) {
      this.docNameValidation = result.error;
    } else if (result.statusText === "OK") {
      this.docNameValidation = "";
      this.editMode = true;
      this.showassign = false;
      this.showatags = false;
      this.isDocUpdated = false;
      this.docData = JSON.parse(JSON.stringify(this.selectedDocument));
      let oldAssignees = this.selectedAssignedTo;
      this.docData.assignedToNames = oldAssignees;
      this.docData.dateOfDocument = this.convertToUTC(
        this.selectedDocument.dateOfDocument
      );
      this.showSuccessToasterMessage("Document details updated successfully");
      this.closeDoc();
    }
  }

  convertToUTC(date) {
    if(date !== null) {
      return new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
    } else{
      return date;
    }

  }

  vaidateDocExists(confirmSave) {
    if (this.selectedDocument.name == null) {
      let docName = this.docData.name;
      this.selectedDocument.name = docName;
    } else if (this.selectedDocument.name !== this.docData.name) {
      this.documentService.VaidateDocExists(this.selectedDocument).subscribe(
        () => {},
        (error) => {
          if (error.status === 422) {
            this.docNameValidation = error.error;
            this.isDocUpdated = false;
          } else {
            this.docNameValidation = "";
            if (confirmSave) {
              this.confirmSave = true;
            }
          }
        }
      );
    } else if (confirmSave) {
      this.confirmSave = true;
    }
  }

  onFoldersChanged(_event: any) {
    this.documentService.getFolders().subscribe((result) => {
      this.folders = result.map((s) => s.name);
    });
  }

  OnFoldersSelected(_event: any) {
    if (this.selectedDocument.folderName !== this.PreviousFolder) {
      this.documentError.Validated(this.selectedDocument);
      if (this.documentError.IsError() && this.selectedDocument.folderName === "Final" && this.PreviousFolder === "Uploaded") {
        this.ShowValidation = true;
      } else {
        this.ShowValidation = false;
      }
      this.confirmChangeFolder = true;

    }
  }

  addTagItem(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.documentTags.push(value.trim());
    }
    if (input) {
      input.value = '';
    }
    this.selectedDocument.tags = this.documentTags.toString();
    this.isDocUpdated = true;
  }

  removeTagItem(item: any): void {
    const index = this.documentTags.indexOf(item);

    if (index >= 0) {
      this.documentTags.splice(index, 1);
    }
    this.selectedDocument.tags = this.documentTags.toString();
    this.isDocUpdated = true;
  }

  OnChangeFolderCancelled(_event: any) {
    this.confirmChangeFolder = false;
    this.ShowValidation = false;
    this.documentError.Reset();
    this.selectedDocument.folderName = this.PreviousFolder;
  }
  onChangeFolderApproved(_event: any) {
    this.confirmChangeFolder = false;
    this.documentService.ChangeFolder(this.selectedDocument).subscribe(
      (_result) => {
        this.isFolderUpdated = true;
      },
      (_error) => {
      }
    );
    if (this.selectedDocument.folderName === "Uploaded" && this.PreviousFolder === "Final") {
      this.documentError.Reset();
    }
    this.ShowValidation = false;
    this.PreviousFolder = this.selectedDocument.folderName;
    this.hasDocUpdated(DocTypesEnum[this.selectedDocumentType], "type");
  }

  PdfBlobValue(id:any){
    this.documentService.RequestDownload(id).subscribe(
      (response) => {
        this.pdfblobvalue = response;
        this.loading = false;
      },
      (_error) => {
        this.loading = false;
        this.isPreviewMode = true;
      }
    );
  }

  DownloadFile(isPreviewMode: boolean) {
    if (isPreviewMode) this.isPreviewDownload = true;
    else this.isDownload = true;

    this.documentService
      .RequestDownload(this.selectedDocument.encryptedDocumentId)
      .subscribe({
        next: (response) => {
          this.pdfblobvalue = response;
          this.documentService.downloadFile(this.pdfblobvalue);
          if (isPreviewMode) this.isPreviewDownload = false;
          else this.isDownload = false;
        },
        error: (_error) => {
          if (isPreviewMode) this.isPreviewDownload = false;
          else this.isDownload = false;
        }
      });
  }

  closeDoc() {
    this.router.url.includes("open-document") ? this.router.navigateByUrl('/repository') : this.closeDocument.emit();
  }
  onItemSelected() {
    if(this.selectedDocument.folderName === "Final")
      this.documentError.Validated(this.selectedDocument);
  }
  OnFolderKeyUp() {
    this.documentService.getFolders().subscribe((result) => {
      this.folders = result.map((s) => s.name);
      if (this.selectedDocument.folderName.length === 0) {
        this.selectedDocument.folderName = this.folders.filter(
          (s) => s === this.PreviousFolder
        )[0];
      }
    });
  }

  getAssignees(assigneeList) {
    let assigneeIds = null;
    this.selectedAssignedTo = assigneeList;
    assigneeList.forEach(element => {
      if (assigneeIds === null) {
        assigneeIds = this.userInfo.find(x => x.fullName === element).userID;
      } else{
        assigneeIds = assigneeIds + "," + this.userInfo.find(x => x.fullName === element).userID;
      }
    });
    this.selectedDocument.assignedTo = assigneeIds!=null?assigneeIds.toString():assigneeIds;
    this.hasDocUpdated(undefined,"assignedTo");
  }

  removeAssignedToItem (assignee) {
    this.selectedAssignedTo = this.selectedAssignedTo.filter(x => x !== assignee);
    this.getAssignees(this.selectedAssignedTo)
  }

  onScroll(_event:any) {
    this.chips !== undefined && this.chips.closePanel();
  }

  OnStatusChange (selectDocumentStatus) {
    this.selectedDocument.status = selectDocumentStatus.name;
    this.selectedDocument.statusId = selectDocumentStatus.id;
    this.hasDocUpdated(null,'');
    this.AllStatusTypes = JSON.parse(JSON.stringify(this.StatusTypes));
  }
}

export enum DocTypesEnum {
  "Monitoring" = 1,
  "External" = 2,
  "Quarterly Documents" = 3,
  "Legal Docs (Pre-Invest)" = 4,
}

export enum DocSubTypesEnum {
  "Advsiory Board Material" = 101,
  "Executive Summary" = 201,
  "Presentation" = 301,
  "Reports, Financials and Capital Account" = 302,
  "Non-Disclosure Agreement" = 401,
}
export class DocumentError {
  ShowDocumentNameError: boolean = false;
  ShowDocTypeError: boolean = false;
  ShowSubTypeError: boolean = false;
  showDocumentDateError: boolean = false;
  ShowOtherError: boolean = false;

  public Validated(document: Document) {
    if (document !== undefined) {
      this.Reset();
      if (document.name === null || document.name === undefined)
        this.ShowDocumentNameError = true;
      if (document.documentType === null || document.documentType === undefined)
        this.ShowDocTypeError = true;
      if (
        document.documentSubType === null ||
        document.documentSubType === undefined
      )
        this.ShowSubTypeError = true;
      if (
        document.dateOfDocument === null ||
        document.dateOfDocument === undefined
      )
        this.showDocumentDateError = true;
      if (
        (document.firmId === null || document.firmId === undefined) &&
        (document.fundId === null || document.fundId === undefined) &&
        (document.dealId === null || document.dealId === undefined) &&
        (document.portfolioCompanyId === null ||
          document.portfolioCompanyId === undefined)
      )
        this.ShowOtherError = true;
    }
  }

  public IsError() {
    return (
      this.ShowDocumentNameError ||
      this.ShowDocTypeError ||
      this.ShowSubTypeError ||
      this.showDocumentDateError ||
      this.ShowOtherError
    );
  }
  public Reset() {
    this.ShowDocumentNameError = false;
    this.ShowDocTypeError = false;
    this.ShowSubTypeError = false;
    this.showDocumentDateError = false;
    this.ShowOtherError = false;
  }
}

