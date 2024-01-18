import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { MessageService } from "primeng/api";
import { RepositoryConstants } from "../../common/constants";
import { HelperService } from "../../services/helper.service";
import { AccountService } from "../../services/account.service";
import { DocumentService } from "../../services/document.service";
import { FeaturesEnum } from "../../services/permission.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { ITab } from 'projects/ng-neptune/src/lib/Tab/tab.model';
import { MatMenuTrigger } from "@angular/material/menu";

@Component({
  selector: "repository-list",
  templateUrl: "./repository-list.component.html",
  styleUrls: ["./repository-list.component.scss"],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.None,
})
export class RepositoryListComponent implements OnInit {
  @ViewChild("tRecordTrigger") menuTrigger: MatMenuTrigger;
  feature: typeof FeaturesEnum = FeaturesEnum;
  pipelineList: any = [];
  closeResult: string;
  pagerLength: any;
  dataTable: any;
  blockedTable: boolean = false;
  totalRecords: number;
  globalFilter: string = "";
  paginationFilterClone: any = {};
  searchWord: string;
  displayUploadDocument: boolean = false;
  numbers: string[];
  output: string[];
  loading = false;
  documents = [];
  prevSearch: string;
  folderType:string = RepositoryConstants.sharedFolderType;
  searchPhrase = "";
  showDocFilters = false;
  enableAdvancedFilters = false;
  hasAdvancedFilters = false;
  ResetAdvFilters = false;
  documentFilters;
  IsOpenDocument = false;
  documentId = 0;

  filteredFileFormats = [];
  filteredDocTypes = [];
  filteredSubDocTypes = [];
  filteredtoDate:Date;
  filteredfromDate:Date;
  filteredFirms: [];
  filteredFunds: [];
  filteredPortfolioComapanies: [];
  filteredDeals: [];
  advancedFilters = [];
  docTableHeaders = [];
  selectedDocuments = [];
  restoreDocument:any =undefined;
  isDeleteDocumentConfirmed = false;
  isRestoreDocumentConfirmed = false;
  fileDeleted = false;
  checkAll = false;
  links = [];
  selectedIndex: number = 0;
  selectedSubIndex: number = -1;
  isLoader: boolean = false;
  parentFolderType = undefined;
  isPermanentDelete:boolean = false;
  deletedialogMessage:string = "Are you sure you want to delete the selected document(s)? ";
  permdeletedialogMessage:string = "This action cannot be undone, the document(s) once deleted cannot be recovered.";
  deletedialogMessage1 = "The deleted documents can be restored from Recycle Bin within next 45 days"
  permdeletedialogMessage1 = "Are you sure you want to delete the selected document(s) permanently?";
  updatePopularTags = false;
  lastUpdatedOn : Date;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  tabList: ITab[] = [];
  tabName: string = "Shared Folder";
  subTabName: string = "Uploaded Files";
  subTabList: { active: boolean; name: string; }[];
  isRestoreDisableEnable = false;
  isTabClicked: boolean = false;
  constructor(
    private router: Router,
    protected changeDetectorRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private accountService: AccountService,
    private helperService: HelperService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {
  }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.links.push({name:RepositoryConstants.sharedFolderType,active: true,subLinks:[RepositoryConstants.uploadedFolderType,RepositoryConstants.finalFolderType]});
    this.links.push({name:RepositoryConstants.recycledFolderType,active: false,subLinks:[]});
    this.folderType = RepositoryConstants.uploadedFolderType;
    this.getHeaders(this.folderType);
    this.getAllDocuments();
    this.getSubTabList();
    this.tabList = this.links
  }

  getSubTabList() {
    this.subTabList = [
        {
            active: true,
            name: RepositoryConstants.uploadedFolderType
        }
        , {
            active: false,
            name: RepositoryConstants.finalFolderType
        }
    ];
}
onTabClick(tab: ITab) {
  this.showInfo(tab.name);
  this.tabName = tab.name;
  this.tabList?.forEach(element => {
    if(element.name == tab.name){
      element.active = true;
    }else{
      element.active = false;
    }
  });
  this.getSubTabList();
}
onSubTabClick(tab: ITab) {
  if (tab != null || tab != undefined) {
      this.setActiveSubTab(tab.name);
  }
  this.showInfo(tab.name)
}
  getHeaders(folderType:string) {
    let headers = null;
    if(folderType == RepositoryConstants.sharedFolderType){
      headers = [
        { field: 'name', header: 'Document Name', sort: false, valueCustomClass: 'textEllipsis',headerWidthClass:'docNameHeaderCellWidth', valueWidthClass:'docNameHeaderCellWidth' },
        { field: 'documentTypeName', header: 'Type', sort: false, valueCustomClass: '', headerWidthClass:'', valueWidthClass:'' },
        { field: 'createdOn', header: 'Uploaded On', sort: false, valueCustomClass: 'uploadedOn' , headerWidthClass:'', valueWidthClass:''},
        { field: 'dateOfDocument', header: 'Document Date', sort: false, valueCustomClass: '', headerWidthClass:'', valueWidthClass:'' },
        { field: 'uploadedBy', header: 'Uploaded By', sort: false, valueCustomClass: 'status' , headerWidthClass:'', valueWidthClass:''},
        { field: 'status', header: 'Status', sort: false, valueCustomClass: '' , headerWidthClass:'', valueWidthClass:''},
        { field: 'assignedToNames', header: 'Assignees', sort: false, valueCustomClass: '' , headerWidthClass:'assigneeswidth', valueWidthClass:'assigneeswidth'},
        { field: 'comment', header: 'Comments', sort: false, valueCustomClass: 'comments' , headerWidthClass:'comments', valueWidthClass:''},
      ];
    }
    else if(folderType == RepositoryConstants.recycledFolderType){
      headers = [
        { field: 'name', header: 'Document Name', sort: false, valueCustomClass: 'textEllipsis',headerWidthClass:'docNameHeaderCellWidth', valueWidthClass:'docNameHeaderCellWidth' },
        { field: 'documentTypeName', header: 'Type', sort: false, valueCustomClass: '', headerWidthClass:'', valueWidthClass:'' },
        { field: 'createdOn', header: 'Uploaded On', sort: false, valueCustomClass: 'uploadedOn' , headerWidthClass:'', valueWidthClass:''},
        { field: 'dateOfDocument', header: 'Document Date', sort: false, valueCustomClass: '', headerWidthClass:'', valueWidthClass:'' },
        { field: 'uploadedBy', header: 'Uploaded By', sort: false, valueCustomClass: 'uploadedBy' , headerWidthClass:'', valueWidthClass:''},
        { field: 'status', header: 'Status', sort: false, valueCustomClass: '' , headerWidthClass:'', valueWidthClass:''},
        { field: 'assignedToNames', header: 'Assignees', sort: false, valueCustomClass: '' , headerWidthClass:'assigneeswidth', valueWidthClass:'assigneeswidth'},
        { field: 'comment', header: 'comments', sort: false, valueCustomClass: 'comments' , headerWidthClass:'comments', valueWidthClass:''},
      ];
    }
    else if(folderType == RepositoryConstants.uploadedFolderType || folderType == RepositoryConstants.finalFolderType ){
      headers = [
        { field: 'name', header: 'Document Name', sort: false, valueCustomClass: 'textEllipsis',headerWidthClass:'docNameHeaderCellWidth', valueWidthClass:'docNameHeaderCellWidth' },
        { field: 'documentTypeName', header: 'Type', sort: false, valueCustomClass: '', headerWidthClass:'', valueWidthClass:'' },
        { field: 'dateOfDocument', header: 'Date', sort: false, valueCustomClass: '', headerWidthClass:'', valueWidthClass:'' },
        { field: 'modifiedOn', header: 'Modified on', sort: false, valueCustomClass: '', headerWidthClass:'', valueWidthClass:'' },
        { field: 'uploadedBy', header: 'Uploaded By', sort: false, valueCustomClass: 'uploadedBy' , headerWidthClass:'', valueWidthClass:''},
        { field: 'assignedToNames', header: 'Assignees', sort: false, valueCustomClass: '' , headerWidthClass:'assigneeswidth', valueWidthClass:'assigneeswidth'},
        { field: 'status', header: 'Status', sort: false, valueCustomClass: '' , headerWidthClass:'', valueWidthClass:''},
        { field: 'comment', header: 'Comments', sort: false, valueCustomClass: 'comments' , headerWidthClass:'comments', valueWidthClass:''}

      ];
    }

    this.docTableHeaders = headers;
  }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  getContains = (string, substring) => {
    return string.toLowerCase().indexOf(substring.toLowerCase()) !== -1;
  };
  search = (event) => {
    this.loading = true;
    this.documentService.Suggest(event.query).subscribe(
      (result) => {
        this.output = JSON.parse(JSON.stringify(result));
        this.output = this.output.filter((c) => this.getContains(c, event.query));
        this.loading = false;
      }
    );
  };

  ResetDocuments = (event) => {
    if (event.target.value.trim().length === 0) {
      this.searchPhrase = event.target.value.trim();
      if(this.documentFilters !== undefined) {
        this.GetDocuments();
      } else{
        this.documentFilters = undefined;
        this.ResetAdvFilters = true;
        this.getAllDocuments();
      }
    }
  }

  ResetSearch() {
    this.searchPhrase = "";
    (document.getElementsByTagName("input")[0] as HTMLInputElement).value = "";
    this.hasAdvancedFilters = false;
    this.ResetAdvFilters = true;
    this.documentFilters = undefined;
    this.getAllDocuments();
  }

  OnSearchItemSelected = (event) => {
    if (this.prevSearch !== event.target.value.trim()) {
      this.searchPhrase = event.target.value.trim();
      if(this.documentFilters !== undefined) {
        this.GetDocuments();
      } else{
        this.ResetAdvFilters = true;
        this.isTabClicked = true;
        this.getAllDocuments(event.target.value.trim());
      }

      this.prevSearch = event.target.value.trim();
    }
  };
  SelectedSearchItem = (event) => {
    this.isTabClicked = true;
    this.getAllDocuments(event);
  }
  openUpload() {
    this.displayUploadDocument = true;
  }

  onCancel(status: any) {
    this.displayUploadDocument = false;
  }

  onSave(status: any) {
    this.documents = [];
    this.displayUploadDocument = false;
    this.searchWord = "";
    this.hasAdvancedFilters = false;
    this.searchPhrase = "";
    this.ResetAdvFilters = true;
    this.documentFilters = undefined;
    this.getAllDocuments();
    this.changeDetectorRef.detectChanges();
    this.fileDeleted = false;
    this.updatePopularTags = true;

    this.toastrService.success("Document(s) uploaded successfully","",{positionClass:"toast-center-center"});

  }

  onDelete(Response) {
    this.displayUploadDocument = false;
    this.changeDetectorRef.detectChanges();
    this.toastrService.success(Response,"",{positionClass:"toast-center-center"});
  }

  onDocumentInfoEvent(id: any) {
    this.documentService.RequestDownload(id).subscribe(
      (response) => {
        this.documentService.downloadFile(response);
      }
    );
  }

  setLastUpdateOn() {
    let docs = this.documents.filter(x => x.modifiedOn !== null && x.modifiedOn !== undefined);
    if (docs !== undefined && docs.length > 0){
      let date = new Date(Math.max.apply(null, this.documents.map(function(e) {
        return new Date(e.modifiedOn);
      })));
      this.lastUpdatedOn =  this.documents[0].createdOn > date ? this.documents[0].createdOn : date;
    } else {
      this.lastUpdatedOn = this.documents.length > 0 ? this.documents[0].createdOn : new Date();
    }
  }

  getAllDocuments(term?: string,loading?:boolean) {
    this.loading = true
    this.checkAll = false;
    let filters = this.documentFilters === undefined ? null : this.documentFilters.advancedFilter;
    this.documentService.getAllDocuments({ SearchPhrase: term, advancedFilter: filters,folderName:this.folderType,isPageLoad:this.isTabClicked }).subscribe(
      (result) => {
        this.documents = JSON.parse(JSON.stringify(result));
        this.loading = false;
        this.setLastUpdateOn();
        if(this.getIsRecycleBin()){
          this.documents.forEach((obj) => {
            obj.action = 'Restore';
            return obj;
          });
        }
        if (this.documents.length > 0 && this.isTabClicked) {
          const folderName = this.documents.find(doc => doc.folderName === RepositoryConstants.Uploaded || doc.folderName === RepositoryConstants.Final)?.folderName;
          switch (folderName) {
              case RepositoryConstants.Uploaded:
                this.setActiveSubTab(RepositoryConstants.uploadedFolderType);
                  break;
              case RepositoryConstants.Final:
                  this.setActiveSubTab(RepositoryConstants.finalFolderType);
                  break;
          }
      } else {
          this.setActiveSubTab(this.subTabName);
      }
        this.isTabClicked = false;
      },
      (error) => {
        this.loading = false;
        this.isTabClicked = false;
      }
    );
  }
  setActiveSubTab(tabName: string) {
    this.subTabList?.forEach((row) => (row.active = false));
    if(tabName === RepositoryConstants.uploadedFolderType){
      this.subTabName = RepositoryConstants.uploadedFolderType;
      this.subTabList[0].active = true;
    }
    else{
      this.subTabList[1].active = true;
      this.subTabName = RepositoryConstants.finalFolderType;
    }
  }

  showFilterElement()  {
    if(this.documents.length > 0 && (this.searchPhrase.length !== 0 || this.hasAdvancedFilters)) {
      return true;
    }
    else {
      return false;
    }
  }

  showNoDocsElement()  {
    this.checkAll = false;
    if(this.documents.length < 1 && this.searchPhrase.length === 0 && !this.hasAdvancedFilters && this.folderType === RepositoryConstants.sharedFolderType) {
      return true;
    }
    else {
      return false;
    }
  }

  showNoResultWhenSearchedElement()  {
    return (this.documents.length < 1 && (this.searchPhrase.length !== 0 || this.hasAdvancedFilters));
  }

  showNoResultWhenSearchedElement1()  {
    this.checkAll = false;
    if(this.documents.length < 1 && (this.searchPhrase.length !== 0 || this.hasAdvancedFilters || !this.showNoDocsElement())) {
      return true;
    }
    else {
      return false;
    }
  }

  showLastUpdatedElement()  {
    if((this.searchPhrase.length === 0 && !this.hasAdvancedFilters) && this.documents.length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  openFiltersPopover () {
    this.showDocFilters = true;
    this.enableAdvancedFilters = true;
  }

  closeFiltersPopover (event:any) {
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
  }

  GetDocumentsByFilter(Filters:any) {
    this.ResetAdvFilters = false;
    this.documentFilters = Filters.documentFilters;
    this.filteredFileFormats = Filters.FileFormats;
    this.filteredDocTypes = Filters.docTypes;
    this.filteredSubDocTypes = Filters.subDocTypes;
    this.filteredtoDate = Filters.toDate;
    this.filteredfromDate = Filters.fromDate;
    this.filteredFirms = Filters.firms;
    this.filteredFunds = Filters.funds;
    this.filteredPortfolioComapanies = Filters.portfolioComapanies;
    this.filteredDeals = Filters.deals;
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
    this.advancedFilters = Filters.documentFilters.advancedFilter;
    this.GetDocuments();
    this.hasAdvancedFilters = true;
  }

  GetDocuments () {
    this.checkAll = false;
    this.loading = true;
    this.documentService.getAllDocuments({ SearchPhrase: this.searchPhrase, advancedFilter: this.documentFilters.advancedFilter,folderName:this.folderType }).subscribe(
      (result) => {
        this.documents = JSON.parse(JSON.stringify(result));
        this.loading = false;
        this.setLastUpdateOn();
        if(this.getIsRecycleBin()){
          this.documents.forEach((obj) => {
            obj.action = 'Restore';
            return obj;
          });
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  openDocument(docId) {
    this.documentId = docId;
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
    this.selectedDocuments = [];
    this.IsOpenDocument = true;
  }

  closeDocument() {
    this.IsOpenDocument = false;
    if(this.documentFilters !== undefined ) {
      this.GetDocuments();
    } else if(this.searchPhrase !== "") {
      this.getAllDocuments(this.searchPhrase);
    } else {
      this.getAllDocuments();
    }
  }

  clearAllFilters(){
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
    this.hasAdvancedFilters = false;
    this.documentFilters = undefined;
    this.filteredFileFormats = [];
    this.filteredDocTypes = [];
    this.filteredSubDocTypes = [];
    this.filteredfromDate = undefined;
    this.filteredtoDate = undefined;
    this.filteredFirms = [];
    this.filteredFunds = [];
    this.filteredPortfolioComapanies = [];
    this.filteredDeals = [];
    this.selectedDocuments = [];
    if(this.searchPhrase !== "") {
      this.getAllDocuments(this.searchPhrase);
    } else {
      this.getAllDocuments();
    }
  }

  resetEnableAdvancedFilters () {
    if (!this.showDocFilters) {
      this.enableAdvancedFilters = false;
    }
  }

  onClosePopover () {
    this.showDocFilters = false;
    this.enableAdvancedFilters = false;
  }

  handleDocumentSelection(documents){
    this.selectedDocuments = this.documents.filter(x => x.isChecked === true);
    this.isRestoreDisableEnable=this.selectedDocuments.length>0?true:false;
  }

  OnDeleteDocument(isPermanent:boolean) {
    this.isDeleteDocumentConfirmed = true;
    this.isPermanentDelete = isPermanent;
  }

  OnCancelDeleteDocument() {
    this.isDeleteDocumentConfirmed = false;
    this.isPermanentDelete = false;
  }

  deleteSelectedDocuments() {
    this.fileDeleted = true;
    this.loading = true;
    this.documentService
    
    .MoveToRecycleBin(JSON.stringify(this.selectedDocuments), this.isPermanentDelete)
    .subscribe((data) => {
      this.onDelete(data);
      this.checkAll = false;
      this.updatePopularTags = true;
      this.loading = false;
      if(this.documentFilters !== undefined ) {
        this.GetDocuments();
      } else if(this.searchPhrase !== "") {
        this.getAllDocuments(this.searchPhrase);
      } else {
        this.getAllDocuments();
      }
      this.selectedDocuments = [];
    });
    this.isDeleteDocumentConfirmed = false;
    this.isPermanentDelete = false;
  }

  getIsRecycleBin(){
    return (this.folderType == RepositoryConstants.recycledFolderType);
  }

  showInfo(type:string){
    this.isRestoreDisableEnable = false;
    this.folderType = type;
    if (type == RepositoryConstants.sharedFolderType)
      this.folderType = RepositoryConstants.uploadedFolderType;
    this.selectedDocuments = [];
    this.getHeaders(type);
    this.getAllDocuments(this.searchPhrase, false);
  }

  getFolderIcons(name:string){
    if(name==RepositoryConstants.sharedFolderType){
      return this.getIcons("folder");
    }
    if(name==RepositoryConstants.recycledFolderType){
      return this.getIcons("delete");
    }
    return this.getIcons("image");
  }

  private getIcons(name:string){
    return this.helperService.getstaticIconPath(name);
  }

  // Restore Documents

  RestoreSingleDocument(items:any){
    this.restoreDocument = items;
    this.isRestoreDocumentConfirmed = true;
  }

  OnRestoreDocument() {
    this.isRestoreDocumentConfirmed = true;
  }

  OnCancelRestoreDocument() {
    this.isRestoreDocumentConfirmed = false;
  }

  RestoreSelectedDocuments() {
    this.loading = true;
    let selected_doc = []
    if (this.restoreDocument != undefined) {
      selected_doc.push(this.restoreDocument);
      this.selectedDocuments = this.selectedDocuments.filter(item => item.id !== this.restoreDocument.id);
    }
    else
      selected_doc = this.selectedDocuments;
    this.restoreDocument = undefined;
    if (selected_doc.length > 0) {
      this.documentService.RestoreDocuments(JSON.stringify(selected_doc))
        .subscribe((data) => {
          this.loading = false;
          this.onDelete(data);
          this.checkAll = false;
          if (this.documentFilters !== undefined) {
            this.GetDocuments();
          } else if (this.searchPhrase !== "") {
            this.getAllDocuments(this.searchPhrase);
          } else {
            this.getAllDocuments();
          }
          if (this.restoreDocument == undefined)
            this.selectedDocuments = [];
        }, _error => {
          this.loading = false;
        });
      this.isRestoreDocumentConfirmed = false;
      this.isRestoreDisableEnable = false;
    } else {
      this.loading = false;
    }
  }

  resetUpdatePopularTags () {
    this.updatePopularTags = false;
  }

}
