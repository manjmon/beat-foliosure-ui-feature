import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { DatePipe} from '@angular/common';
import { Component, OnInit, ViewChild, AfterViewInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { MultiSelect } from 'primeng/multiselect';
import { Table } from 'primeng/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { GetReportTemplateActions, GetReportTemplatePreferenceOptions, GetTemplateUnits, ReportTemplatePreferenceConstants } from 'src/app/common/constants';
import { InternalReportService } from 'src/app/services/internal-report.service';
@Component({
  selector: "app-internal-report",
  templateUrl: "./internal-report.component.html",
  styleUrls: [
    "./internal-report.component.scss",
    "./../LpTemplateConfiguration/LpTemplateConfiguration.component.scss",
    "./../kpi/porfolio-company-info/porfolio-company-info.component.scss",
  ],
})
export class InternalReportComponent implements OnInit, AfterViewInit {
  myControl = new FormControl('');
  isCompanyPopup: boolean = false;
  selectConfirmCompany = null;
  @ViewChild('section') multiselect: MultiSelect;
  selectedRadio: string = "";
  title: string = "Save as";
  isLoader: boolean = false;
  selectedItem: any = null;
  preferenceConstants: any = null;
  templateList: any[] = [];
  selectedAction: any = null;
  isAction: boolean = false;
  actionList: any[] = [];
  selectedCopyToCompanyList: any[] = [];
  portfolioCompanyList: any[] = [];
  companyList: any[] = [];
  filteredCompanyList: any[] = [];
  company: string = null;
  selectedCompany: any;
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  headers = [
    { field: "checkbox", header: "checkbox" },
    { header: "Line Item", field: "KPI" },
    { header: "Section", field: "moduleName" },
  ];
  kpiMappingList: any[] = [];
  isCopyToAll: boolean = false;
  preferenceList: any[] = [];
  @ViewChild("menu") uiuxMenu!: MatMenu;
  @ViewChild("tRecordTrigger") menuTrigger: MatMenuTrigger;
  selectedPreference: any = null;
  fundList: any[] = [];
  moduleList: any[] = [];
  dataTypeList: any[] = [];
  periodTypeList: any[] = [];
  periodList: any[] = [];
  templatePreferenceList: any[] = [];
  selectedFund: any[] = [];
  selectedDataType: any[] = [];
  selectedCalculation: any[] = [];
  selectedPeriodType: any[] = [];
  selectedPeriod: any[] = null;
  selectedExcelTemplate: any = null;
  selectedModule: any = [];
  calculationList: any[] = [];
  configurationItem: any = null;
  checkAll: boolean = false;
  isPopup: boolean = false;
  disableRenameConfirmButton: boolean = true;
  modalTitle: string = "";
  isExist: boolean = false;
  isTemplateExist: boolean = false;
  defaultTemplate = "New Template";
  savePopUp: boolean = false;
  disableConfirmSave: boolean = true;
  saveBtn: boolean = true;
  disableBtn: boolean = false;
  templateName: string = "";
  configurationModel: any = null;
  companyFilterArgs: any = null;
  dragNodeExpandOverArea: string;
  moduleFilterArgs: any = null;
  renameTemplateValue: any = null;
  newTemplateName: any = null;
  @ViewChild('tblKpi', { static: true }) public table: Table;
  @ViewChild("checkAllBox") checkAllBox;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  isMapBtn: boolean = true;
  originalKpiMappingList: any = null;
  groupForm: FormGroup;
  originalCompanyList = [];
  isApply: boolean = false;
  originalPreferences: any[] = [];
  yearRange: any = null;
  dateRange: any[];
  startPeriod = "";
  endPeriod = "";
  selectedUnit: any = null;
  unitList: any = [];
  @ViewChild('myCalendar', { static: true }) datePicker;
  datePickerCalendar: any;
  selectedGroup: boolean = false;
  dropNode: any = [];
  originalKpiMappingListObject: any = null;
  dropNodeType: any;
  selectAllIntermidiateStatus: boolean = false;
  constructor(
    private fb: FormBuilder,
    private toasterService: ToastrService,
    private internalReportService: InternalReportService,
    private datePipe: DatePipe
  ) {
    this.groupForm = this.fb.group({
      selectedCities: ["", Validators.nullValidator],
    });
    this.yearRange = "2000:2050";
  }

  ngOnInit(): void {
    this.getAll();
    this.preferenceConstants = ReportTemplatePreferenceConstants;
    this.toasterService.overlayContainer = this.toastContainer;
    this.unitList = GetTemplateUnits();
    this.selectedUnit = this.unitList[2];
  }
  getAll() {
    this.getConfiguration();
    this.getPreference();
    this.setTemplateSetting();
  }
  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
      let menuClosed = (this.uiuxMenu as any).closed;
      (this.uiuxMenu as any).closed = menuClosed =
        this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  configureMenuClose(old: MatMenu["closed"]): MatMenu["closed"] {
    const upd = new EventEmitter();
    feed(
      upd.pipe(
        filter((event) => {
          if (event === "click") {
            return false;
          }
          return true;
        })
      ),
      old
    );
    return upd;
  }
  getCompany(companies) {
    this.portfolioCompanyList = companies;
    this.filterCompanies();
  }
  getAllConfig() {
    this.isLoader = true;
    this.internalReportService.getAllConfig(this.selectedItem?.templateId == undefined ? 0 : this.selectedItem?.templateId).subscribe({next:(result) => {
      if (result != null) {
        this.originalPreferences = JSON.parse(JSON.stringify(result));
        this.isLoader = false;
        let companies = result.companyInformation;
        this.originalCompanyList = JSON.parse(JSON.stringify(result?.companyInformation));
        this.getCompany(companies);
        this.setDefaultPreferenceValue(result);
        this.hidePreference();
      }
    }, error:(_error) => {
      this.isLoader = false;
    }});
  }
  setDefaultPreferenceValue(result: any) {
    this.selectedFund = this.configurationItem?.fundDetails?.filter(x => result?.fundIds?.split(',')?.some(fundId => fundId == x.fundID));
    this.selectedModule = result?.kpiModules;
    this.selectedCalculation = result?.calculations;
    this.selectedPeriodType = result?.periodTypeConfigs?.sort((a, b) => a.periodId - b.periodId);
    this.selectedExcelTemplate = result?.internalExcelTemplates?.length > 0 ? result.internalExcelTemplates[0] : this.configurationItem?.internalExcelTemplates[0];
    this.selectedDataType = result?.valueTypes != null ? result.valueTypes : [];
    this.dateRange = result.startPeriod != null ? [new Date("01-" + result.startPeriod + ""), result.endPeriod != null ? new Date("01-" + result.endPeriod + "") : ''] : null;
    this.startPeriod = result.startPeriod;
    this.endPeriod = result.endPeriod;
    this.selectedUnit = this.unitList.find(x => x.value == this.selectedItem?.currencyUnit);
    this.selectedGroup = result?.isGrouping;
    this.apply();
  }
  setCheckBoxAll() {
    let filterKpiMappingList = this.filterKpiMappingList();
    if (this.validateUnCheckKpi(filterKpiMappingList,false)) {
      this.checkAll = true;
      this.checkAllBox.checked = true;
    }
    else {
      this.checkAll = false;
      this.checkAllBox.checked = false;
    }
    let isCheckAllChild = filterKpiMappingList?.filter(x => x.isSelected);
    if(!this.validateUnCheckKpi(filterKpiMappingList,false) && isCheckAllChild.length>0){
      this.selectAllIntermidiateStatus = true;
    }else{
      this.selectAllIntermidiateStatus = false;
    }
  }
  onDragEnd(rowData, event) {
    rowData.isSelected = true;
    rowData.intermediateStatus =  false;
    if (rowData?.children?.length > 0) {
      rowData?.children?.forEach(element => {
        element.isSelected = true;
      });
    }
    let rowDataIndex = this.kpiMappingList.indexOf(rowData);
    this.kpiMappingList.splice(rowDataIndex, 1);
    if (this.dragNodeExpandOverArea == "above" && this.dropNodeType=='Parent') {
      this.kpiMappingList.splice(this.kpiMappingList.indexOf(this.dropNode), 0, rowData);
    }
    else {
      this.kpiMappingList.splice(this.kpiMappingList.indexOf(this.dropNode) + 1, 0, rowData);
    }
    this.setCheckBoxAll();
  }
  handleDragOver( event: any) {
    const percentageY = event.offsetY / event.target.clientHeight;
    if (percentageY < 0.50) {
      this.dragNodeExpandOverArea = 'above';
    } 
    else {
      this.dragNodeExpandOverArea = 'below';
    }
  }
  handleDrop(rowData: any,type:any) {
    this.dropNodeType=type;
    this.dropNode = rowData;
  }
  validateUnCheckKpi(data: any,status:any) {
    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].isSelected == status) {
          return false
        }
        if (data[i]?.children?.length > 0) {
          for (let j = 0; j < data[i].children.length; j++) {
            if (data[i].children[j].isSelected == status) {
              return false
            }
          }
        }
      }
      return true
    }
  }
  checkIntermidiateState(rowData:any){
    let isCheckAllChild = rowData?.children.filter(x => x.isSelected);
    if (isCheckAllChild.length != rowData.children.length   && isCheckAllChild.length > 0) {
      rowData.intermediateStatus  =true;
      
    }else{
      rowData.intermediateStatus  =false;
    }
    return rowData;
  }
  handleCheckBox(rowData: any, $event: any, childData: any) {
    let filterKpiMappingList = this.filterKpiMappingList();
    if (childData == "") {
      rowData.isSelected = $event.checked;
      if (rowData?.children?.length > 0) {
        rowData?.children.forEach(element => {
          element.isSelected = $event.checked;
        });
      }
    } else {
      if ($event.checked) {
        rowData.isSelected = $event.checked;
        childData.isSelected = $event.checked;
      } else {
        childData.isSelected = $event.checked;
        let isCheckAllChilddata = rowData?.children.filter(x => !x.isSelected);
        if (isCheckAllChilddata.length == rowData.children.length) {
          rowData.isSelected = $event.checked;
        }
      }
      this.checkIntermidiateState(rowData);
    }
    if ($event.checked && this.validateUnCheckKpi(filterKpiMappingList,false)) {
      this.checkAll = true;
      this.checkAllBox.checked = true;
    }
    else {
      this.checkAll = false;
      this.checkAllBox.checked = false;
    }
    let isCheckAllChild = filterKpiMappingList?.filter(x => x.isSelected);
    if(!this.validateUnCheckKpi(filterKpiMappingList,false) && isCheckAllChild.length>0){
      this.selectAllIntermidiateStatus = true;
    }else{
        this.selectAllIntermidiateStatus = false;
    }
    this.setTick(rowData);
    this.getCompare();
    this.getButtonStatus();
  }
  setTick(rowData: any) {
    let companyList = this.filteredCompanyList.find(x => x.portfolioCompanyID == rowData.portfolioCompanyID);
    let filteredList = this.kpiMappingList.filter(x => x.isSelected);
    if (filteredList.length > 0)
      companyList.tick = true;
    else
      companyList.tick = false;
  }
  handleHeaderCheckBox($event: any) {
    this.selectAllIntermidiateStatus = false;
    this.setCheckAll($event.checked);
    this.setTick(this.selectedCompany);
    this.getCompare();
    this.getButtonStatus();
  }
  handleRowCheckBox(event: any, rowData: any, type: any) {
    if (type == "Parent") {
      rowData.isSelected = event.checked;
      if (rowData.children.length > 0) {
        rowData.children.forEach(element => {
          element.isSelected = event.checked;
        });
      }
    } else {
      rowData.isSelected = event.checked;
    }
    this.setTick(rowData);
    this.getCompare();
    this.getButtonStatus();
  }
  setCheckAll(status: boolean) {
    this.kpiMappingList.forEach(item => {
      item.isSelected = status;
      if (item.children.length > 0) {
        item.children.forEach(child => {
          child.isSelected = status;
        });
      }
    });
  }
  radioBtnClick(_value: number) {
    if (this.templateName == "") {
      this.checkIfTemplateExist(this.selectedItem?.templateName);
    }
    else {
      this.checkIfTemplateExist(this.templateName);
    }
    if ((this.isTemplateExist && this.selectedRadio == "U" || !this.isTemplateExist && this.selectedRadio == "U") || (!this.isTemplateExist && this.selectedRadio == "N")) {
      this.disableConfirmSave = false;
    }
    else {
      this.disableConfirmSave = true;
    }
  }
  getActions() {
    this.actionList = GetReportTemplateActions().filter(x => x.status != "A" && x.status != "I");
  }
  onTemplateChange($event: any) {
    this.isExist = false;
    let value = $event.target.value;
    this.checkIfExist(value);
    if ((value == undefined || value == '' || value == this.selectedItem?.templateName) || this.isExist)
      this.disableRenameConfirmButton = true;
    else {
      this.disableRenameConfirmButton = false;
    }
    this.renameTemplateValue = value;
  }
  onTemplateInputChange($event: any) {
    this.isTemplateExist = false;
    let value = $event.target.value == "" || $event.target.value == undefined ? this.selectedItem?.templateName : $event.target.value;
    this.templateName = value;
    this.checkIfTemplateExist(value);
    this.newTemplateName = value;
    if ((this.isTemplateExist && this.selectedRadio == "U" || !this.isTemplateExist && this.selectedRadio == "U") || (!this.isTemplateExist && this.selectedRadio == "N")) {
      this.disableConfirmSave = false;
    }
    else {
      this.disableConfirmSave = true;
    }
  }
  checkIfExist(value: string) {
    let item = this.configurationItem?.internalReportList.filter(x => x.templateName == value);
    if (item.length > 0) {
      this.isExist = true;
    }
    else {
      this.isExist = false;
    }
  }
  checkIfTemplateExist(value: string) {
    let item = this.configurationItem?.internalReportList.filter(x => x.templateName == value);
    if (item.length > 0) {
      this.isTemplateExist = true;
    }
    else {
      this.isTemplateExist = false;
    }
  }
  getTemplateActionsByActive() {
    let actions = GetReportTemplateActions();
    this.actionList = actions.filter(x => x.status != "A");
  }
  getTemplateActions() {
    let actions = GetReportTemplateActions();
    this.actionList = actions.filter(x => x.status != "I" && x.status != "A");
  }
  getPreference() {
    this.preferenceList = GetReportTemplatePreferenceOptions();
    this.selectedPreference = this.preferenceList[0];
    if (this.selectedExcelTemplate?.name == 'Valuation Template') {
      this.preferenceList = this.preferenceList.filter(x => x.name != 'Data Type' && x.name != 'Calculations' && x.name != 'Period Type');
    } else {
      this.preferenceList = this.preferenceList.filter(x => x.name != 'Group');
    }
  }
  hidePreference() {
    this.preferenceList = GetReportTemplatePreferenceOptions();
    if (this.selectedExcelTemplate?.name == 'Valuation Template') {
      this.preferenceList = this.preferenceList.filter(x => x.name != 'Data Type' && x.name != 'Calculations' && x.name != 'Period Type');
    }
    else {
      this.preferenceList = this.preferenceList.filter(x => x.name != 'Group');
    }
  }
  setCopyToAll() {
    if (this.isCopyToAll) {
      this.isCopyToAll = false;
    }
    else {
      this.isCopyToAll = true;
    }
    this.getButtonStatus();
  }
  setPreference(preference: any) {
    this.preferenceList.forEach((_item, index) => {
      this.preferenceList[index].isActive = false;
    });
    preference.isActive = true;
    this.selectedPreference = preference;
  }
  deleteItemTemplate(_option: any, $event: any) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  selectCompany(company: any) {
    this.getCompare();
    this.selectConfirmCompany = company;
    if (!this.isMapBtn) {
      this.isCompanyPopup = true;
    }
    else {
      this.onSelectCompany(null);
    }

  }
  onDiscard(_$event) {
    this.isCompanyPopup = false;
  }
  onSelectCompany(_$event) {
    let company = JSON.parse(JSON.stringify(this.selectConfirmCompany));
    this.checkAll = false;
    this.checkAllBox.checked = false;
    let status = this.getStatus();
    let index = this.filteredCompanyList.findIndex(x => x.portfolioCompanyID == this.selectedCompany?.portfolioCompanyID);
    if (index > -1) {
      this.filteredCompanyList[index].editable = false;
      this.filteredCompanyList[index].tick = status;
    }
    this.filteredCompanyList.forEach(x => x.editable = false);
    company.editable = true;
    let newIndex = this.filteredCompanyList.findIndex(x => x.portfolioCompanyID == this.selectConfirmCompany?.portfolioCompanyID);
    if (newIndex > -1) {
      this.filteredCompanyList[newIndex].editable = true;
    }
    this.selectedCompany = company;
    this.getKpis();
    this.getButtonStatus();
    this.isCompanyPopup = false;
    this.selectConfirmCompany = null;
  }
  getButtonStatus() {
    if (this.selectedCopyToCompanyList.length > 0) {
      this.isCopyToAll = false;
    }
    if (this.selectedExcelTemplate?.name == 'Quarterly Template') {
      if (this.isApply && this.dateRange?.length > 0 && this.selectedDataType?.length > 0 && this.selectedPeriodType?.length > 0 && (JSON.stringify(this.filteredCompanyList) != JSON.stringify(this.originalCompanyList) || this.isCopyToAll || this.selectedCopyToCompanyList.length > 0)) {
        let status = false;
        this.saveBtn = status;
      }
      else {
        this.saveBtn = true;
      }
    }
    else {
      if (this.isApply && this.dateRange?.length > 0 && (JSON.stringify(this.filteredCompanyList) != JSON.stringify(this.originalCompanyList) || this.isCopyToAll || this.selectedCopyToCompanyList.length > 0)) {
        let status = false;
        this.saveBtn = status;
      }
      else {
        this.saveBtn = true;
      }
    }
  }
  getStatus() {
    let item = JSON.parse(this.originalKpiMappingList)?.filter(x => x.isSelected);
    if (item?.length > 0) {
      return true;
    }
    return false;
  }
  setInActive(company: any) {
    this.filteredCompanyList.forEach(
      (row) =>
        !row.editable && row.portfolioCompanyID != company.portfolioCompanyID
    );
  }
  filterItem(value: string) {
    if (value == "") {
      this.assignCopy();
    }
    this.filteredCompanyList = this.portfolioCompanyList.filter((item) =>
      item.companyName.toLowerCase().includes(value.toLowerCase())
    );
  }
  assignCopy() {
    this.filteredCompanyList = Object.assign([], this.companyList);
  }
  filterCompanies() {
    this.filteredCompanyList = this.portfolioCompanyList;
    if (
      this.filteredCompanyList != undefined &&
      this.filteredCompanyList != null &&
      this.filteredCompanyList.length > 0
    ) {
      if (this.selectedCompany == null || this.selectedCompany == undefined) {
        this.filteredCompanyList[0]["editable"] = true;
        this.selectedCompany = this.filteredCompanyList[0];
      }
      else {
        let index = this.filteredCompanyList.findIndex(x => x.portfolioCompanyID == this.selectedCompany.portfolioCompanyID);
        if (index > -1) {
          this.filteredCompanyList[index]["editable"] = true;
        }
      }
    }
  }
  templateChangeEvent()
  {
    this.selectedCalculation = [];
  }
  dateRangeSelected()
  {
    if(this.dateRange.length >0 && this.dateRange[1] == null)
    {
      this.dateRange = null;
    }
  }
  setCompanyList() {
    let companyList = this.configurationItem?.companyDetails;
    companyList.forEach(function (e) {
      if (typeof e === "object") {
        e["editable"] = false;
        e["tick"] = false;
      }
    });
    this.portfolioCompanyList = companyList;
    this.filterCompanies();

  }
  getConfiguration() {
    this.isLoader = true;
    this.internalReportService.getInternalReportConfiguration().subscribe({
      next:(result) => {
        if (result != null) {
          this.configurationItem = result;
          if (result?.internalReportList.length > 0) {
            if (this.newTemplateName != null) {
              let item = result?.internalReportList.find(x => x.templateName == this.newTemplateName);
              if (item != undefined && item != null) {
                this.selectedItem = item;
              }
              else {
                this.selectedItem = this.selectedItem != null && this.selectedItem != undefined ? this.selectedItem : result?.internalReportList[0];
              }
            }
            else {
              this.selectedItem = this.selectedItem != null && this.selectedItem != undefined ? this.selectedItem : result?.internalReportList[0];
            }
            this.newTemplateName = null;
          }
          this.configurationItem.valueTypes.forEach(function (e) {
            e["isActive"] = false;
          });
          this.getAllConfig()
        }
        this.isLoader = false;
      },
      error:(_error) => {
        this.isLoader = false;
      }
  });
  }
  updateTemplate() {
    this.isLoader = true;
    this.internalReportService.updateTemplate({ templateId: this.selectedItem.templateId, templateName: this.renameTemplateValue }).subscribe({
      next:(result) => {
        this.isLoader = false;
        if (result) {
          this.selectedItem.templateName = this.renameTemplateValue;
          this.toasterService.success(`Selected template renamed successfully`, "", { positionClass: "toast-center-center" });
          this.clearTemplate();
        }
        else {
          this.toasterService.error('Unable to rename template!', "", { positionClass: "toast-center-center" });
        }
      },
      error:(_error) => {
        this.isLoader = false;
        this.isPopup = false;
      }
  });
  }
  deleteTemplate() {
    this.isLoader = true;
    this.internalReportService.deleteTemplate(this.selectedItem.templateId).subscribe({
      next:(result) => {
        this.isLoader = false;
        if (result) {
          this.toasterService.success(`Selected template deleted successfully`, "", { positionClass: "toast-center-center" });
          this.clearTemplate();
          this.clearSaveTemplate();
          this.getAll();
        }
        else {
          this.toasterService.error('Unable to delete template!', "", { positionClass: "toast-center-center" });
        }
      },
      error:(_error) => {
        this.isLoader = false;
        this.isPopup = false;
      }
  });
  }
  clearTemplate() {
    this.renameTemplateValue = null;
    this.isPopup = false;
    this.disableRenameConfirmButton = true;
    this.selectedAction = null;
    this.selectedItem = null;
  }
  clearSaveTemplate() {
    this.savePopUp = false;
    this.disableConfirmSave = true;
    this.configurationModel = null;
    this.selectedRadio = null;
    this.saveBtn = true;
    this.companyFilterArgs = null;
    this.moduleFilterArgs = null;
    this.selectedCopyToCompanyList = [];
    this.filteredCompanyList = [];
    this.isCopyToAll = false;
    this.kpiMappingList = [];
    this.originalCompanyList = [];
    this.originalKpiMappingList = null;
    this.originalKpiMappingListObject = null;
    if (this.checkAllBox != undefined) {
      this.checkAllBox.checked = false;
    }
    this.company = "";
  }
  setValueTypes() {
    // existing functionality
  }
  getCompare() {
    if (this.originalKpiMappingListObject == JSON.stringify(this.kpiMappingList))
      this.isMapBtn = true;
    else
      this.isMapBtn = false;
  }
  expandedRows: {} = {};
  getKpis() {
    this.isLoader = true;
    this.internalReportService.getInternalReportKpis(this.selectedCompany.portfolioCompanyID, this.selectedItem?.templateId == undefined ? 0 : this.selectedItem?.templateId).subscribe({
      next:(result) => {
        let filterKpiMappingList = result.filter(x => x.parentKPIID == null || x.parentKPIID == 0);

        this.kpiMappingList = filterKpiMappingList;
        this.kpiMappingList.forEach(item => {
          item.children = [];
          let filterChild = result.filter(x => x.parentKPIID == item.kpiId && x.moduleId == item.moduleId);
          if (filterChild.length > 0) {
            item.children = filterChild
          }
          item  =  this.checkIntermidiateState(item);
        });
        const thisRef = this;
        this.kpiMappingList.forEach(function (kpi) {
          thisRef.expandedRows[kpi.key] = true;
        });
        this.originalKpiMappingListObject = JSON.stringify(this.kpiMappingList);
        this.originalKpiMappingList = JSON.stringify(result);
        this.isLoader = false;
        this.setCheckBoxAll();
        this.getCompare();
      },
      error:(_error) => {
        this.isLoader = false;
      }
  });
  }
  resetKpis() {
    this.kpiMappingList = JSON.parse(this.originalKpiMappingList);
    this.setCheckBoxAll();
    this.getCompare();
    this.setTick(this.selectedCompany);
  }
  closePanel() {
    this.datePickerCalendar = JSON.stringify(this.datePicker);
    this.menuTrigger.closeMenu();
  }
  setTemplateSetting() {
    this.companyFilterArgs = null;
    this.moduleFilterArgs = null;
    this.clearSaveTemplate();
    this.getAllConfig();
  }
  executeAction(Obj) {
    this.selectedItem = Obj;
    this.isPopup = true;
    this.modalTitle = "Delete Template"
    this.disableRenameConfirmButton = false;
  }
  OnUpdateTemplate(_$event) {
    this.deleteTemplate();
  }
  OnCancel(_$event) {
    this.isPopup = false;
    this.selectedAction = this.actionList[0];
  }
  apply() {
    this.datePickerCalendar = JSON.stringify(this.datePicker);
    this.isApply = true;
    this.closePanel();
    if (this.selectedFund?.length > 0 && this.isApply) {
      let fundIds = JSON.parse(JSON.stringify(this.selectedFund));
      let companyDetails = this.configurationItem?.companyDetails?.filter(x => fundIds?.some(item => item.fundID == x.fundID))?.map(x => x.portfolioCompanyID);
      this.companyFilterArgs = companyDetails?.join(",").split(",");
      if (this.companyFilterArgs == '' || this.companyFilterArgs == undefined || this.companyFilterArgs == null) {
        this.kpiMappingList = [];
        this.checkAllBox.checked = false;
      }
      else {
          if(this.selectedCompany == undefined && this.selectedCompany ==""){
            let companies = this.configurationItem?.companyDetails?.filter(x => x.portfolioCompanyID == companyDetails[0]);
            this.selectedCompany = companies.length > 0 ? companies[0] : []
          } else{
            let filteredCompanyList = this.filteredCompanyList?.filter(item => this.companyFilterArgs?.some(x=>x == item.portfolioCompanyID?.toString()));
            let validateExistingCompany = filteredCompanyList?.filter(x=>x.portfolioCompanyID==this.selectedCompany?.portfolioCompanyID);
            if(validateExistingCompany?.length == 0){
            this.selectedCompany = filteredCompanyList.length > 0 ? filteredCompanyList[0] : []
            }
          }
        this.getKpis();
      }
    }
    else {
      this.companyFilterArgs = null;
      if (this.kpiMappingList.length == 0) {
        this.getKpis();
      }
    }
    if (this.selectedModule.length > 0 && this.isApply) {
      let moduleIds = this.selectedModule?.map(x => x.moduleID).join(',');
      this.moduleFilterArgs = moduleIds;
    }
    else {
      this.moduleFilterArgs = null;
    }
    this.setCheckBoxAll();
    this.getButtonStatus();
  }
  filterKpiMappingList() {
    if (this.selectedModule && this.selectedModule.length > 0) {
      return this.kpiMappingList?.filter(x => this.moduleFilterArgs?.split(',')?.some(moduleID => moduleID == x.moduleId));
    } else {
      return this.kpiMappingList;
    }
  }
  confirmSave() {
    this.isLoader = true;
    this.setConfigurationModel();
    this.internalReportService.addOrUpdateTemplate(this.configurationModel).subscribe({
      next:(result) => {
        this.isLoader = false;
        if (result) {
          if (this.selectedRadio == "U") {
            this.toasterService.success(`Internal Report template  updated successfully`, "", { positionClass: "toast-center-center" });
          }
          if (this.selectedRadio == "N") {
            this.toasterService.success(`Internal Report template  created successfully`, "", { positionClass: "toast-center-center" });
          }
          this.clearSaveTemplate();
          this.getAll();
        }
        else {
          this.toasterService.error('Unable to update template!', "", { positionClass: "toast-center-center" });
        }
      },
      error:(_error) => {
        this.isLoader = false;
        this.isPopup = false;
      }
  });
  }
  save() {
    this.title = "Save"
    this.newTemplateName = this.selectedItem?.templateName;
    if (this.selectedItem?.isDefault) {
      this.selectedRadio = "N";
      this.disableConfirmSave = true;
      this.savePopUp = true;
    }
    else {
      this.selectedRadio = "U";
      this.confirmSave();
    }
  }
  saveAs() {
    this.selectedRadio = "N";
    this.title = "Save As";
    this.disableConfirmSave = true;
    this.savePopUp = true;
    this.newTemplateName = this.selectedItem?.templateName;
  }
  resetAll() {
    this.clearSaveTemplate();
    this.getAllConfig();
  }
  onClose() {
    this.disableConfirmSave = true;
    this.savePopUp = false;
    this.isTemplateExist = false;
    this.selectedRadio = null;
  }
  reset() {
    this.datePickerCalendar = JSON.stringify(this.datePicker);
    this.isApply = false;
    this.selectedFund = [];
    this.selectedDataType = [];
    this.selectedCalculation = [];
    this.selectedPeriodType = [];
    this.selectedModule = [];
    this.companyFilterArgs = null;
    this.moduleFilterArgs = null;
    this.dateRange = null;
    this.selectedUnit = this.unitList[2];
    this.apply();
  }
  convertTransformDate(date) {
    return this.datePipe.transform(date, 'MMM yyyy');
  }
  setConfigurationModel() {
    this.configurationModel = null;
    if (this.dateRange != null && this.dateRange?.length > 0) {
      this.startPeriod = this.convertTransformDate(this.dateRange[0]);
      this.endPeriod = this.convertTransformDate(this.dateRange[1]);
      let configModel = {
        TemplateId: this.selectedItem?.templateId,
        TemplateName: this.newTemplateName,
        Status: this.selectedRadio,
        CopyToCompanies: this.selectedCopyToCompanyList?.map(x => x.portfolioCompanyID),
        FromCompanyId: this.selectedCompany?.portfolioCompanyID,
        KpiMapping: this.getMappedKpiList(),
        IsCopyToAll: this.isCopyToAll,
        CurrencyUnit: this.selectedUnit?.value,
        IsGrouping: this.selectedGroup,
        Preferences: {
          FundIds: this.selectedFund?.map(x => x.fundID).join(","),
          ModuleIds: this.selectedModule?.map(x => x.moduleID),
          DataTypes: this.selectedDataType?.map(x => x.valueTypeID),
          Calculations: this.selectedCalculation?.map(x => x.calculationId),
          PeriodTypes: this.selectedPeriodType?.map(x => x.periodId),
          ExcelTemplates: this.selectedExcelTemplate?.templateId,
          StartPeriod: this.startPeriod,
          EndPeriod: this.endPeriod
        }
      };
      this.configurationModel = configModel;
    }
    else {
      this.toasterService.error('Period Date is incorrect', "", { positionClass: "toast-center-center" });
    }
  }
  setOption() {
    this.selectedPreference = this.preferenceList[0];
    this.isApply = false;
  }
  getMappedKpiList() {
    let childSelectedData = this.kpiMappingList;
    if (childSelectedData.length > 0) {
      let indexSelected = 1;
      childSelectedData.forEach(function (kpi) {
        if (kpi.isSelected) {
          kpi.MappingDisplayOrder = indexSelected;
          indexSelected = indexSelected + 1;
        }
        if (kpi.children.length > 0) {
          kpi.children.forEach(element => {
            if (element.isSelected) {
              element.MappingDisplayOrder = indexSelected;
              childSelectedData.push(element);
              indexSelected = indexSelected + 1;
            }
          });
        }
      });
      this.kpiMappingList = childSelectedData;
    }
    return this.kpiMappingList?.filter(x => x.isSelected)?.map(({ kpiId, mappingId, moduleId, MappingDisplayOrder }) => ({ kpiId, mappingId, moduleId, MappingDisplayOrder }));
  }
  delete($event: any) {
    $event.preventDefault();
    $event.stopPropagation();
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe({
    next: data => to.next(data),
    error: err => to.error(err),
    complete: () => to.complete(),
  });
}