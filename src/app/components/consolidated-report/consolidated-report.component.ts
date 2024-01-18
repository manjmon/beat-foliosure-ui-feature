import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Component, OnInit, ViewChild,AfterViewInit, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ToastContainerDirective, ToastrService } from 'ngx-toastr';
import { MultiSelect } from 'primeng/multiselect';
import { Table } from 'primeng/table';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FinancialsSubTabs, GetDataTypeOptions, GetReportTemplateActions, GetConsolidatedReportTemplatePreferenceOptions, ReportTemplatePreferenceConstants } from 'src/app/common/constants';
import { ConsolidatedReportService } from 'src/app/services/consolidated-report.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';

@Component({
  selector: "app-consolidated-report",
  templateUrl: "./consolidated-report.component.html",
  styleUrls: [    
    "./../internal-report/internal-report.component.scss",
    "./../LpTemplateConfiguration/LpTemplateConfiguration.component.scss",
    "./../kpi/porfolio-company-info/porfolio-company-info.component.scss",
  ],
})
export class ConsolidatedReportComponent implements OnInit, AfterViewInit {
  isCompanyPopup:boolean = false;
  selectConfirmCompany=null;
  @ViewChild('section') multiselect: MultiSelect;
  selectedRadio:string="";
  title: string = "Save as";
  isLoader:boolean = false;
  selectedItem: any = null;
  preferenceConstants: any = null;
  templateList: any[] = [];
  selectedAction: any = null;
  isCheckAll: boolean = false;
  isAction: boolean = false;
  actionList: any[] = [];
  selectedCopyToCompanyList: any[] = [];
  portfolioCompanyList: any[] = [];
  companyList: any[] = [];
  filteredCompanyList: any[] = [];
  company: string=null;
  selectedCompany: any;
  @ViewChild(CdkVirtualScrollViewport)
  viewport: CdkVirtualScrollViewport;
  headers = [
    { field: "checkbox", header: "checkbox" },
    { header: "Data Item", field: "KPI" },
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
  selectedModule:any = [];
  calculationList: any[] = [];
  configurationItem: any = null;
  preferenceDataTypeList:any=[];
  preferenceDataTypePeriodOptions:any[] =[];
  selectedPeriodDataType:any =null;
  selectedPeriodDataTypePeriod:any = null;
  selectedMonth:any =null;
  selectedQuarter:any = null;
  selectedYear:any=null;
  isPopup:boolean = false;
  disableRenameConfirmButton:boolean = true;
  modalTitle:string="";
  isExist: boolean = false;
  isTemplateExist: boolean = false;
  defaultTemplate = "New Template";
  savePopUp:boolean =  false;
  disableConfirmSave:boolean = true;
  saveBtn:boolean = true;
  disableBtn:boolean = true;
  templateName:string ="";
  configurationModel:any=null;
  selectedDataTypePeriod:any = null;
  companyFilterArgs :any = null;
  moduleFilterArgs:any = null;
  renameTemplateValue:any = null;
  newTemplateName:any = null;
  @ViewChild('tblKpi', { static: true }) public table: Table;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  isMapBtn:boolean = true;
  originalKpiMappingList:any =null;
  groupForm: FormGroup;
  originalCompanyList =[];
  isApply:boolean = false;
  periodConfiguration:any = [];
  selectedModuleIds: any[];
  stringModuleIds: string;
  resetBtn: boolean = true;
  originalSelectedFund: any;
  originalSelectedModule: any;
  constructor(
    private fb: FormBuilder,
    private toasterService: ToastrService,
    private portfolioCompanyService: PortfolioCompanyService,
    private ConsolidatedReportService: ConsolidatedReportService
  ) {
    this.groupForm = this.fb.group({
      selectedCities: ["", Validators.nullValidator],
    });
  }

  ngOnInit(): void {
    this.getAll();
    this.preferenceConstants = ReportTemplatePreferenceConstants;
    this.toasterService.overlayContainer = this.toastContainer;
  }
  getAll()
  {
    this.getActions();
    this.getConfiguration();
    this.getPreference();
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
  getAllConfig(){
    this.isLoader = true;
    if(this.selectedItem?.templateId!=undefined  && this.selectedItem?.templateId!=null)
    {
      this.ConsolidatedReportService.getAllConfig(this.selectedItem?.templateId).subscribe({next:(result) => {
        this.isLoader = false;
        if (result != null) {
          this.isLoader = false;
          this.getKpis();
          this.setDefaultPreferenceValue(result);
        }
      },error:(_error)=>{
        this.isLoader = false;
    }});
    }
  }
  setDefaultPreferenceValue(result:any)
  {
      this.selectedFund= this.configurationItem?.fundDetails?.filter(x=>result?.fundIds?.split(',')?.some(fundId=>fundId==x.fundID));
      this.originalSelectedFund =  JSON.stringify(result?.fundIds);
      this.selectedModule = this.configurationItem?.kpiModules?.filter(item => result?.section?.split(',')?.some(x=> x.split('-')[0].replace(/\s/g, "") == 'S'? x.split('-')[1] == item.subPageId:x.split('-')[1] == item.moduleID));
      this.originalSelectedModule=  JSON.stringify(this.configurationItem?.kpiModules?.filter(item => result?.section?.split(',')?.some(x=> x.split('-')[0].replace(/\s/g, "") == 'S'? x.split('-')[1] == item.subPageId:x.split('-')[1] == item.moduleID)));
      this.selectedExcelTemplate = this.configurationItem?.consolidatedExcelTemplates.filter(x=>x.templateId==+result?.excelTemplate)?.length > 0 ? this.configurationItem?.consolidatedExcelTemplates.filter(x=>x.templateId==+result?.excelTemplate)[0] : this.configurationItem?.consolidatedExcelTemplates[0];
      this.selectedDataType = result?.valueTypes!=null ? result.valueTypes:[];
      this.apply();
  }
  saveAs()
  {
    this.selectedRadio ="N";
    this.title ="Save As";
    this.disableConfirmSave = true;
    this.savePopUp =true;
    this.newTemplateName = this.selectedItem?.templateName;
  }
  getFilterKPIMappingLits(){
    if(this.originalKpiMappingList?.length > 0){
      return this.kpiMappingList?.filter(item => this.selectedModule?.some(x=> x.subPageId == item.subPageId && x.moduleID ==0) || this.selectedModule?.some(x=> x.moduleID == item.moduleID && x.subPageId ==0));
    }
  }
  setCheckBoxAll()
  {
    let filterKPIMappingList =this.getFilterKPIMappingLits();
    let selectKPIMappingList = filterKPIMappingList?.filter(x=>!x.isSelected)
    if(filterKPIMappingList?.length != 0 && selectKPIMappingList?.length == 0){
      this.isCheckAll = true;
    }
    else{
      this.isCheckAll = false;
    }
  }
  handleCheckBox(rowData:any,$event:any)
  {
    rowData.isSelected = $event.target.checked;
    if(!$event.target.checked)
    {
      this.isCheckAll = false;
    }else{
      this.setCheckBoxAll();
    }
    this.getButtonStatus();
  }
 
  handleHeaderCheckBox($event:any)
  {
    this.setCheckAll($event.checked);
    this.getButtonStatus();
  }
  setCheckAll(status: boolean) {
    if (this.selectedModule && this.selectedModule.length > 0) {
      this.kpiMappingList.forEach(item => {
        let getstatus = this.selectedModule.some(item1 => item1.subPageId === item.subPageId && item1.moduleID === item.moduleID);
        if (getstatus && status) {
          item.isSelected = status;
        } else {
          item.isSelected = false;
        }
      });
    }
    else {
      this.kpiMappingList.forEach(item => {
        item.isSelected = status;
      });
    }
  }
  radioBtnClick(_value:number)
  {
    if(this.templateName =="")
    {
      this.checkIfTemplateExist(this.selectedItem.templateName);
    }
    else{
      this.checkIfTemplateExist(this.templateName);
    }
    if((this.isTemplateExist && this.selectedRadio =="U" || !this.isTemplateExist && this.selectedRadio =="U") || (!this.isTemplateExist && this.selectedRadio =="N"))
    {
      this.disableConfirmSave = false;
    }
    else{
      this.disableConfirmSave = true;
    }
  }
  getActions() {
    this.actionList = GetReportTemplateActions().filter(x=>x.status!="A" && x.status!="I");
  }
  onTemplateChange($event:any)
  {
    this.isExist = false;
    let value  = $event.target.value;
    this.checkIfExist(value);
    if ((value == undefined || value == '' || value == this.selectedItem?.templateName) || this.isExist)
      this.disableRenameConfirmButton = true;
    else{
      this.disableRenameConfirmButton = false;
    }
    this.renameTemplateValue = value;
  }
  onTemplateInputChange($event:any)
  {
    this.isTemplateExist = false;
    let value  = $event.target.value == "" || $event.target.value == undefined ? this.selectedItem?.templateName : $event.target.value;
    this.templateName = value;
    this.checkIfTemplateExist(value);
    this.newTemplateName = value;
    if((this.isTemplateExist && this.selectedRadio =="U" || !this.isTemplateExist && this.selectedRadio =="U") || (!this.isTemplateExist && this.selectedRadio =="N"))
    {
      this.disableConfirmSave = false;
    }
    else{
      this.disableConfirmSave = true;
    }
  }
  checkIfExist(value:string)
  {
    let item = this.configurationItem?.consolidatedReportList.filter(x=>x.templateName == value);
    if(item.length > 0)
    {
      this.isExist = true;
    }
    else
    {
      this.isExist = false;
    }
  }
  checkIfTemplateExist(value:string)
  {
    let item = this.configurationItem?.consolidatedReportList.filter(x=>x.templateName == value);
    if(item.length > 0)
    {
      this.isTemplateExist = true;
    }
    else
    {
      this.isTemplateExist = false;
    }
  }
  getDataTypePeriodActions()
  {
    this.preferenceDataTypePeriodOptions = GetDataTypeOptions();
    this.preferenceDataTypePeriodOptions[0].isActive = true;
  }
  setDataTypePeriod(dataType:any)
  {
    this.preferenceDataTypePeriodOptions.forEach((_item, index) => {
      this.preferenceDataTypePeriodOptions[index].isActive = false;
    });
    dataType.isActive = true;
    this.selectedDataTypePeriod = dataType;
    this.clearPeriodValue();
    this.getSelectedPeriodValue();
  }
  getTemplateActionsByActive(){
    let actions = GetReportTemplateActions();
    this.actionList = actions.filter(x=>x.status!="A");
  }
  getTemplateActions(){
    let actions = GetReportTemplateActions();
    this.actionList = actions.filter(x=>x.status!="I" && x.status!="A");
  }
  getPreference() {
    this.preferenceList = [];
    this.preferenceList = GetConsolidatedReportTemplatePreferenceOptions();
    this.selectedPreference = this.preferenceList[0];
  }
  setCopyToAll() {
    if (this.isCopyToAll) this.isCopyToAll = false;
    else this.isCopyToAll = true;
  }
  setPreference(preference: any) {
    this.clearPeriodValue();
    this.preferenceList.forEach((_item, index) => {
      this.preferenceList[index].isActive = false;
    });
    preference.isActive = true;
    this.selectedPreference = preference;
    if(this.preferenceConstants?.Periods == preference.name)
    {
      this.setPreferencePeriodTypes();
      this.preferenceDataTypeList =this.selectedDataType?.sort();
      this.setPreferencePeriodOptions();
      this.getSelectedPeriodValue();
    }
  }
  setPreferencePeriodOptions()
  {
    if(this.preferenceDataTypeList?.length > 0)
    {
      this.selectedPeriodDataType = this.preferenceDataTypeList[0];
      this.preferenceDataTypeList[0].isActive = true;
        let options= GetDataTypeOptions();
        this.preferenceDataTypePeriodOptions = options.filter(x=>x.name.includes(FinancialsSubTabs.Actual));
        this.preferenceDataTypePeriodOptions[0].isActive = true;
        if(this.preferenceDataTypeList[0].PreferencesValueTypes?.length >0)
        {
          this.preferenceDataTypeList[0].PreferencesValueTypes[0].isActive = true;
          this.selectedDataTypePeriod = this.preferenceDataTypeList[0].PreferencesValueTypes[0];
        }
    }
  }
  setDataTypeTab(item:any)
  {
    this.preferenceDataTypeList.forEach((_item, index) => {
      this.preferenceDataTypeList[index].isActive = false;
    });
    item.isActive = true;
    this.clearPeriodValue();
    this.selectedPeriodDataType =item;
    if(item.headerValue == FinancialsSubTabs.Actual)
    {
      let options= GetDataTypeOptions();
      this.preferenceDataTypePeriodOptions = options.filter(x=>x.name.includes(FinancialsSubTabs.Actual));
      this.preferenceDataTypePeriodOptions[0].isActive = true;
      this.selectedDataTypePeriod = this.preferenceDataTypePeriodOptions[0];
    }
    else{
      this.preferenceDataTypePeriodOptions = GetDataTypeOptions();
      this.preferenceDataTypePeriodOptions[0].isActive = true;
      this.selectedDataTypePeriod = this.preferenceDataTypePeriodOptions[0];
    }
    this.getSelectedPeriodValue();
  }
  clearPeriodValue()
  {
    this.selectedMonth =null;
    this.selectedQuarter = null;
    this.selectedYear =null;
  }
  selectCompany(company: any) {
    this.selectConfirmCompany = company;
    if(!this.isMapBtn)
    {
      this.isCompanyPopup = true;
    }
    else{
      this.onSelectCompany(null);
    }

  }
  onDiscard(_$event)
  {
      this.isCompanyPopup = false;
  }
  onSelectCompany(_$event)
  {
    let company =JSON.parse(JSON.stringify(this.selectConfirmCompany));
    let index = this.filteredCompanyList.findIndex(x=>x.portfolioCompanyID == this.selectedCompany?.portfolioCompanyID);
    let status = this.getStatus();
    if (index > -1) {
      this.filteredCompanyList[index].editable = false;
      this.filteredCompanyList[index].tick = status;
    }
    company.editable = true;
    let newIndex = this.filteredCompanyList.findIndex(x=>x.portfolioCompanyID == this.selectConfirmCompany?.portfolioCompanyID);
    if (newIndex > -1) {
      this.filteredCompanyList[newIndex].editable = true;
    }
    this.selectedCompany = company;
    this.getKpis();
    this.getButtonStatus();
    this.isCompanyPopup = false;
    this.selectConfirmCompany = null;
  }
  getKPIChangesStatus(){
    let kpiMappingList =  this.kpiMappingList?.filter(x=>x.isSelected);
    let originalKpiMappingList = JSON.parse(this.originalKpiMappingList)?.filter(x=>x.isSelected);
    if(kpiMappingList?.length == originalKpiMappingList?.length){
      return true
    }
    else{
      return false
    }
  }
  getButtonStatus() {
    let sectionStatus = this.getKPIChangesStatus();
    let selectedFund = Array.from(this.selectedFund.map(fund => fund.fundID).values()).join(",");
    let fundStatus = JSON.stringify(selectedFund) == this.originalSelectedFund;
    let preferenceModuleStatus = JSON.stringify(this.selectedModule) == this.originalSelectedModule;
    if (!sectionStatus || !fundStatus || !preferenceModuleStatus) {
      this.resetBtn = false;
      this.saveBtn = false;
      this.disableBtn = false;
    } else {
      this.resetBtn = true;
      this.saveBtn = true;
      this.disableBtn = true;
    }
  }
  getStatus()
  {
    let item =JSON.parse(this.originalKpiMappingList)?.filter(x=>x.isSelected);
    if(item?.length > 0)
    {
      return true;
    }
    return false;
  }

  getConfiguration() {
    this.isLoader = true;
    this.ConsolidatedReportService.getConsolidatedReportConfiguration().subscribe({next:
      (result) => {
        this.isLoader = false;
        if (result != null) {
          this.configurationItem = result;
          if(result?.consolidatedReportList.length > 0)
          {
            if(this.newTemplateName!=null)
            {
              let item = result?.consolidatedReportList.find(x=>x.templateName == this.newTemplateName);
              if(item!=undefined && item!=null)
              {
                this.selectedItem = item;
              }
              else{
                this.selectedItem = this.selectedItem!=null && this.selectedItem!=undefined ? this.selectedItem:result?.consolidatedReportList[0]
              }
            }
            else{
              this.selectedItem = this.selectedItem!=null && this.selectedItem!=undefined ? this.selectedItem:result?.consolidatedReportList[0];
            }
            this.newTemplateName = null;
          }
          this.isLoader = false;
          this.getAllConfig()
        }
      },
      error:(_error) => {
        this.isLoader = false;
      }
  });
  }
  updateTemplate()
  {
    this.isLoader = true;
    this.ConsolidatedReportService.updateTemplate({templateId:this.selectedItem.templateId,templateName:this.renameTemplateValue}).subscribe({next:
      (result) => {
        this.isLoader = false;
        if(result)
        {
          this.selectedItem.templateName = this.renameTemplateValue;
          this.toasterService.success(`Selected template renamed successfully`, "", { positionClass: "toast-center-center" });
          this.clearTemplate();
        }
        else{
          this.toasterService.error('Unable to rename template!', "", { positionClass: "toast-center-center" });
        }
      },
      error:(_error) => {
        this.isLoader = false;
        this.isPopup = false;
      }
  });
  }
  deleteTemplate()
  {
    this.isLoader = true;
    this.ConsolidatedReportService.deleteTemplate(this.selectedItem.templateId).subscribe({next:
      (result) => {
        this.isLoader = false;
        if(result)
        {
          this.selectedItem.templateName = this.renameTemplateValue;
          this.toasterService.success(`Selected template deleted successfully`, "", { positionClass: "toast-center-center" });
          this.clearTemplate();
          this.getAll();
        }
        else{
          this.toasterService.error('Unable to delete template!', "", { positionClass: "toast-center-center" });
        }
      },
      error:(_error) => {
        this.isLoader = false;
        this.isPopup = false;
      }
  });
  }
  clearTemplate()
  {
    this.renameTemplateValue = null;
    this.isPopup = false;
    this.disableRenameConfirmButton = true;
    this.selectedAction = null;
  }
  clearSaveTemplate()
  {
    this.savePopUp =false;
    this.kpiMappingList = [];
    this.originalKpiMappingList = [];
    this.disableConfirmSave = true;
    this.configurationModel =null;
    this.selectedRadio = null;
    this.saveBtn = true;
    this.disableBtn = true;
    this.resetBtn = true;
  }
  getKpis() {
    this.isLoader = true;
    this.ConsolidatedReportService.getConsolidatedReportKpis(this.selectedItem?.templateId).subscribe({
      next:(result) => {
        this.kpiMappingList = result;
        this.originalKpiMappingList = JSON.stringify(result);
        this.isLoader = false;
        this.setCheckBoxAll();
      },
      error:(_error) => {
        this.isLoader = false;
      }
  });
  }
  resetKpis()
  {
    this.kpiMappingList =JSON.parse(this.originalKpiMappingList);
    this.setCheckBoxAll();
  }
  closePanel() {
    this.menuTrigger.closeMenu();
  }
  setTemplateSetting() {
    this.companyFilterArgs =null;
    this.moduleFilterArgs = null;
    this.getAllConfig();
  }
  onSettingsChange()
  {
    this.executeAction(this.selectedAction);
  }
  executeAction(Obj) {
            this.selectedItem = Obj;
            this.isPopup = true;
            this.modalTitle = "Delete Template"
            this.disableRenameConfirmButton = false;
  }
  OnUpdateTemplate(_$event)
  {
      this.deleteTemplate();

  }
  OnCancel(_$event)
  {
     this.isPopup = false;
     this.selectedAction = this.actionList[0];
  }
  apply()
  {
    this.isApply = true;
    this.closePanel();
    this.getButtonStatus();
    if(this.selectedModule && this.selectedModule.length > 0 && this.isApply)
    {
      let selectedModuleIds = [];
      this.selectedModule.forEach(element => {
        if(element.moduleID == 0 ){
          let eleId = "S-"+element.subPageId;
          selectedModuleIds.push(eleId);
        }else{
          let eleId = "M-"+element.moduleID;
          selectedModuleIds.push(eleId);
        }
      });
      this.stringModuleIds= "";
      this.stringModuleIds =Array.from(selectedModuleIds.values()).join(", ")
      this.moduleFilterArgs = this.selectedModule;
    }
    else{
      this.moduleFilterArgs =null;
    }
    this.setCheckBoxAll();
  }
  resetFunds()
  {
    if(this.selectedFund?.length == 0 && this.companyFilterArgs == "")
    {
      this.companyFilterArgs =null;
    }
  }
  confirmSave()
  {
    this.isLoader = true;
    this.setConfigurationModel();
    this.ConsolidatedReportService.addOrUpdateTemplate(this.configurationModel).subscribe({
      next:(result) => {
        this.isLoader = false;
        debugger;
        if(result)
        {
          if(this.selectedRadio =="U")
          {
            this.toasterService.success(`Consolidated Report template  updated successfully`, "", { positionClass: "toast-center-center" });
          }
          if(this.selectedRadio =="N")
          {
            this.toasterService.success(`Consolidated Report template  created successfully`, "", { positionClass: "toast-center-center" });
          }
          this.clearSaveTemplate();
          this.getAll();
        }
        else{
          this.toasterService.error('Unable to update template!', "", { positionClass: "toast-center-center" });
        }
      },
      error:(_error) => {
        this.isLoader = false;
        this.isPopup = false;
      }
  });
  }
  save()
  {
    this.title ="Save"
    if(this.selectedItem?.isDefault)
    {
      this.selectedRadio ="N";
      this.disableConfirmSave = true;
      this.savePopUp =true;
      this.newTemplateName = this.selectedItem?.templateName;
    }
    else{
      this.selectedRadio ="U";
      this.newTemplateName = this.selectedItem?.templateName;
      this.confirmSave();
    }
  }
  resetAll()
  {
    this.clearSaveTemplate();
    this.getAllConfig();
  }
  onClose()
  {
    this.disableConfirmSave = true;
    this.savePopUp = false;
    this.isTemplateExist = false;
    this.selectedRadio =null;
  }
  reset()
  {
    this.isApply = false;
    this.selectedFund =[];
    this.selectedDataType =[];
    this.selectedCalculation =[];
    this.selectedPeriodType =[];
    this.selectedModule =[];
    this.selectedMonth =null;
    this.selectedQuarter =null;
    this.selectedYear =null;
    this.selectedPeriodDataType=null;
    this.selectedPeriodDataTypePeriod= null;
    this.selectedExcelTemplate =null;
    this.preferenceDataTypeList=[];
    this.preferenceDataTypePeriodOptions=[];
    this.companyFilterArgs = null;
    this.moduleFilterArgs =  null;
    this.getKpis();
  }
  setConfigurationModel()
  {
   
    this.configurationModel =null;
    let configModel={
      TemplateId: this.selectedItem?.templateId,
      TemplateName:this.newTemplateName,
      Status:this.selectedRadio,
      ExcelTemplateId:this.selectedExcelTemplate?.templateId,
      KpiMapping:this.getMappedKpiList(),
      Preferences:{
        FundIds:this.selectedFund?.map(x=>x.fundID).join(","),
        ModuleIds:this.selectedModule?.map(x => x.moduleID).join(","),
        Section: this.stringModuleIds? this.stringModuleIds:'' ,
        DataTypes:this.selectedDataType?.map(x=>x.valueTypeID).join(","),
        ExcelTemplates:this.selectedExcelTemplate?.templateId,
      }
    };
    this.configurationModel = configModel;
  }
  setPreferencePeriodTypes()
  {
    let self = this;
    this.selectedDataType?.forEach(function (e) {
      if(e["PreferencesValueTypes"]==undefined)
      {
        e["PreferencesValueTypes"]= JSON.parse(JSON.stringify(self.getPreferenceValueType(e.headerValue)));
      }
      e["isActive"]=false;
    });
  }
  getPreferenceValueType(valueType:string)
  {
    this.getSelectedPeriodTypes();
    let periodTypes=JSON.parse(JSON.stringify(this.selectedPeriodType?.filter(x=>x.periodType!="YTD")));
    if(valueType=="Actual")
    {
        let arrayElement=[];
        let actualObject={
          "Period":periodTypes,
          "isActive":false,
          "name":"Actual Period"
        };
        arrayElement.push(actualObject);
        return arrayElement;
    }
    else{
      let arrayElement=[];
      let actualObject={
        "Period":periodTypes,
        "isActive":false,
        "name":"Actual Period"
      };
      let forecastObject={
        "Period":periodTypes,
        "isActive":false,
        "name":"Future Period"
      };
      arrayElement.push(actualObject);
      arrayElement.push(forecastObject);
      return arrayElement;
    }
  }
  setPeriodInputValue($event:any,periodType:string)
  {
    let periodValue = $event.target.value;
    let selectedDataTypePeriod = this.selectedDataTypePeriod.name;
    let valueType = this.selectedPeriodDataType.headerValue;
    let index= this.preferenceDataTypeList.findIndex(x=>x.headerValue == valueType);
    let childIndex= this.preferenceDataTypeList[index]?.PreferencesValueTypes.findIndex(x=>x.name == selectedDataTypePeriod);
    if (periodType == "Monthly") {
      let monthlyIndex = this.preferenceDataTypeList[index]?.PreferencesValueTypes[childIndex]?.Period?.findIndex((x) => x.periodType == "Monthly");
      this.preferenceDataTypeList[index].PreferencesValueTypes[childIndex].Period[monthlyIndex].periodValue = periodValue;
    }
    if (periodType == "Quarterly") {
      let quarterlyIndex = this.preferenceDataTypeList[index]?.PreferencesValueTypes[childIndex]?.Period?.findIndex(
        (x) => x.periodType == "Quarterly"
      );
     this.preferenceDataTypeList[index].PreferencesValueTypes[childIndex].Period[quarterlyIndex].periodValue = periodValue;
    }
    if (periodType == "Annually") {
      let annuallyIndex = this.preferenceDataTypeList[index]?.PreferencesValueTypes[childIndex]?.Period?.findIndex((x) => x.periodType == "Annually");
      this.preferenceDataTypeList[index].PreferencesValueTypes[childIndex].Period[annuallyIndex].periodValue = periodValue;
    }
  }
  getSelectedPeriodValue()
  {
    let self =this;
    let selectedDataTypePeriod = this.selectedDataTypePeriod?.name;
    let valueType = this.selectedPeriodDataType?.headerValue;
    let index= this.preferenceDataTypeList?.findIndex(x=>x.headerValue == valueType);
    let periods = this.preferenceDataTypeList[index]?.PreferencesValueTypes?.find(x=>x.name == selectedDataTypePeriod);
    periods?.Period?.forEach(item=>{
        if(item.periodType =="Monthly")
        {
          self.selectedMonth = item.periodValue;
        }
        if(item.periodType =="Quarterly")
        {
          self.selectedQuarter = item.periodValue;
        }
        if(item.periodType =="Annually")
        {
          self.selectedYear = item.periodValue;
        }
    });
  }
  getSelectedPeriodTypes()
  {
   return  this.selectedPeriodType?.forEach(function (e) {
    if(e["periodValue"]==undefined)
    {
      e["periodValue"]= 0;
    }
    });
  }
  getMappedKpiList()
  {
    return this.kpiMappingList?.filter(x=>x.isSelected)?.map(({kpiId, mappingId,moduleID,fieldId,subPageId}) => ({kpiId, mappingId,moduleID,fieldId,subPageId}));
  }
  mapKpis()
  {
    this.isLoader = true;
    let configModel={
      TemplateId: this.selectedItem?.templateId,
      TemplateName:this.newTemplateName,
      FromCompanyId:this.selectedCompany?.portfolioCompanyID,
      KpiMapping:this.getMappedKpiList()
    };
    this.ConsolidatedReportService.mapKpis(configModel).subscribe({next:(_result) => {
      this.isLoader = false;
      this.toasterService.success(`Selected Kpi Mapped successfully`, "", { positionClass: "toast-center-center" });
      let index = this.originalCompanyList.findIndex(x=>x.portfolioCompanyID == this.selectedCompany.portfolioCompanyID);
      if(index > -1)
      {
        this.originalCompanyList[index].tick = true;
        this.filteredCompanyList[index].tick = true;
      }
      this.isMapBtn = true;
    },error:(_error)=>{
      this.isLoader = false;
      this.toasterService.error(`Unable to map Kpis!`, "", { positionClass: "toast-center-center" });
    }});
  }

}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe({
    next: data => to.next(data),
    error: err => to.error(err),
    complete: () => to.complete(),
  });
}
