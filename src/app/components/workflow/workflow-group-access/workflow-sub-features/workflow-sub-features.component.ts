import { WorkflowAccessService } from './../../../../services/workflow-access.service';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { Table } from 'primeng/table';
import { AccountService } from 'src/app/services/account.service';
import { FeaturesEnum, PermissionService } from 'src/app/services/permission.service';
import { WorkflowFeatureService } from 'src/app/services/workflow-feature.service';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'app-workflow-sub-features',
  templateUrl: './workflow-sub-features.component.html',
  styleUrls: ['./workflow-sub-features.component.scss']
})
export class WorkflowSubFeaturesComponent implements OnInit, AfterViewInit {
  isLoader: boolean = false;
  loading: boolean = false;
  blockedTable: boolean = false;
  isCheckAll: boolean = false;
  @Input() scrollHeight: any;
  @Input() groupId: any;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  @ViewChild(Table) tblSubFeature: Table;
  isDisabledBtn: boolean = true;
  mappedSubFeatureList = [];
  cols: any[];
  selectedFeature: any;
  featureList = [];
  companyId: string = "";
  permissionList: any = [];
  permissionListOriginal: any = [];
  frozenCols: any = [{ field: "checkbox", header: "checkbox" }, { field: "subFeatureName", header: "List of Features" }];
  companyList = [];
  selectedCompany: any;
  permissioncols: any = [
    { field: "canView", header: "View" },
    { field: "canEdit", header: "Edit" },
    { field: "canExport", header: "Export" },
    { field: "canImport", header: "Import" }];
  groupData: any = { groupID: -1 };
  feature: typeof FeaturesEnum = FeaturesEnum;
  selectedCopyToCompanyList = [];
  companyFilterList = [];
  constructor(private toastrService: ToastrService, protected changeDetectorRef: ChangeDetectorRef,
    private accountService: AccountService, private permissionService: PermissionService,
    private workflowFeatureService: WorkflowFeatureService,
    private workflowAccessService: WorkflowAccessService
  ) { }

  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.getAll();
  }
  ngOnChanges() {
    this.getAll();
  }
  getAll() {
    if (this.groupId !== "0" && this.selectedFeature!=undefined && this.selectedCompany!=undefined) {
      this.getUserPermissions();
    }
    else{
      this.getFeatureList();
      this.reload();
    }
  }
  reload() {
    this.permissionList = [];
    this.permissionListOriginal = [];
    this.isDisabledBtn = true;
    this.isLoader = false;
  }
  ngAfterViewInit() {
    this.changeDetectorRef.detectChanges();
  }
  resetSubFeature() {
    this.getUserPermissions();
  }
  mapSubFeature() {
    this.updateUserPermissions();
  }
  GetSelectedFeatureData(event: any) {
    this.selectedFeature = event;
    this.getCompanyList();
  }
  onSelectCompany(companyId: string) {
    this.companyId = companyId;
    this.getUserPermissions();
  }

  getUserPermissions() {
    this.blockedTable = true;
    this.permissionList = [];
    this.isCheckAll = false;
    let permissionModel = {
      FeatureId: this.selectedFeature.id,
      EncryptedGroupId: this.groupId,
      CompanyId: this.selectedCompany.id
    };
    this.permissionService.getSubFeatureByGroup(permissionModel)
      .subscribe(result => {
        let list = result;
        this.permissionList = list;
        this.setDefaultSelectedFeature();
        this.permissionListOriginal = JSON.parse(JSON.stringify(list));
        this.setCheckAll();
        this.selectedCopyToCompanyList = [];
      }, error => {
        this.loading = false;
        this.blockedTable = false;
      });
    this.isDisabledBtn = true;
  }
  setDefaultSelectedFeature() {
    for (let i = 0; i < this.permissionList.length; i++) {
      this.isCheckParent(this.permissionList[i]);
    }
  }
  handleCheckBox(event: any, type: string, rowdata: any) {
    rowdata[type] = event.checked;
    this.isCheckParent(rowdata);
    this.checkAnyDataChange();
  }
  isCheckParent(rowData: any) {
    let count = 0;
    for (let i = 0; i < rowData.enabledActions.length; i++) {
      if (rowData.enabledActions[i]?.action == "Export") {
        rowData["canExport"] ? count++ : count;
      }
      if (rowData.enabledActions[i]?.action == "Import") {
        rowData["canImport"] ? count++ : count;
      }
      if (rowData.enabledActions[i]?.action == "View") {
        rowData["canView"] ? count++ : count;

      }
      if (rowData.enabledActions[i]?.action == "Edit") {
        rowData["canEdit"] ? count++ : count;
      }
    }
    if (count == rowData.enabledActions.length) {
      rowData.isSelected = true;
    }
    else
      rowData.isSelected = false;
  }

  checkAnyDataChange() {
    if (JSON.stringify(this.permissionListOriginal) !== JSON.stringify(this.permissionList)) {
      this.isDisabledBtn = false;
    } else {
      this.isDisabledBtn = true;
    }
    this.setCheckAll();
  }

  isActionHidden(feature: any, action: any) {
    let availableActions = feature.enabledActions.filter(function (val: any) {
      return val.action == action;
    });
    if (availableActions.length > 0) {
      return false;
    }
    else {
      return true;
    }
  }

  updateUserPermissions() {
    let permissionModel = {
      FeatureId: this.selectedFeature.id,
      EncryptedGroupId: this.groupId,
      CompanyId: this.selectedCompany.id,
      UserPermissionModels: this.permissionList,
      CompanyIds: this.selectedCopyToCompanyList.length > 0 ? this.selectedCopyToCompanyList.map(function (object) { return object.id; }) : []
    };
    this.workflowAccessService.updateGroupPermission(permissionModel)
      .subscribe(result => {
        if (result)
          this.toastrService.success("Selected sub features mapped successfully to the selected sub-group", "", { positionClass: "toast-center-center" });
        else
          this.toastrService.error("something went wrong", "", { positionClass: "toast-center-center" });

        this.isDisabledBtn = true;
        this.getUserPermissions();
      }, error => {
        this.isDisabledBtn = true;
        this.getUserPermissions();
        this.toastrService.error("something went wrong", "", { positionClass: "toast-center-center" });
      });
  }
  getFeatureList() {
    this.workflowFeatureService.getFeaturesList(this.groupId)
      .subscribe(result => {
        this.featureList = result;
        this.selectedFeature = this.featureList?.length > 0 && this.featureList?.find(x => x.id == this.feature?.PortfolioCompany);
        this.getCompanyList();
      }, error => {
        this.loading = false;
      });
  }
  getCompanyList() {
    this.workflowFeatureService.getCompanyList(this.selectedFeature?.name)
      .subscribe(result => {
        this.companyList = result;
      }, error => {
        this.reload();
      });
  }
  GetSelectedData(event: any) {
    this.selectedCompany = event;
    this.companyFilterList=this.companyList.filter(company => company.id!=event.id);
    this.selectedCopyToCompanyList = [];
    this.getUserPermissions();
  }
  loadSubFeaturesLazy(event: LazyLoadEvent) {
    this.getUserPermissions();
  }
  selectAll(event: any) {
    for (let i = 0; i < this.permissionList.length; i++) {
      this.permissionList[i].isSelected = event.checked;
      this.permissionList[i].canAdd = this.isActionHidden(this.permissionList[i], "Add") ? this.permissionList[i].canAdd : event.checked;
      this.permissionList[i].canEdit = this.isActionHidden(this.permissionList[i], "Edit") ? this.permissionList[i].canEdit : event.checked;
      this.permissionList[i].canView = this.isActionHidden(this.permissionList[i], "View") ? this.permissionList[i].canView : event.checked;
      this.permissionList[i].canExport = this.isActionHidden(this.permissionList[i], "Export") ? this.permissionList[i].canExport : event.checked;
      this.permissionList[i].canImport = this.isActionHidden(this.permissionList[i], "Import") ? this.permissionList[i].canImport : event.checked;
    }
    this.checkAnyDataChange();
  }
  setSelectedAction(event: any, rowData: any) {
    rowData.isSelected = event.checked;
    rowData.canAdd = this.isActionHidden(rowData, "Add") ? rowData.canAdd : event.checked;
    rowData.canEdit = this.isActionHidden(rowData, "Edit") ? rowData.canEdit : event.checked;
    rowData.canView = this.isActionHidden(rowData, "View") ? rowData.canView : event.checked;
    rowData.canExport = this.isActionHidden(rowData, "Export") ? rowData.canExport : event.checked;
    rowData.canImport = this.isActionHidden(rowData, "Import") ? rowData.canImport : event.checked;
    this.checkAnyDataChange();
  }
  setCheckAll() {
    let checkedList = this.permissionList.filter(x => x.isSelected)?.length;
    if (checkedList == this.permissionList.length)
      this.isCheckAll = true;
    else
      this.isCheckAll = false;
  }
  getCompanySelected()
  {
    if (this.selectedCopyToCompanyList.length > 0) {
      this.isDisabledBtn = false;
    }
    else{
      this.isDisabledBtn = true;
      this.checkAnyDataChange();
    }

  }
}
