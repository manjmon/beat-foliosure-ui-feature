import { ChangeDetectorRef, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from "@angular/core";
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators } from '@angular/forms';
import { GetReportTemplateActions, ReportTemplateConstants, TemplateSections, FundEnum } from "src/app/common/constants";
import { ToastrService } from "ngx-toastr";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FundConfigurationdetails, FundReportTemplateDetails } from '../fund-report/fund-report.model';
import { FundReportService } from '../../services/fund-report.service'
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ReportCategory, ReportService } from "src/app/services/report.service";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-fundreport',
  templateUrl: './fund-report.component.html',
  styleUrls: ['./fund-report.component.scss'],
  providers: [DatePipe]
})
export class FundReportComponent implements OnInit {
  fundReportForm: UntypedFormGroup;
  sectionList = [];
  allFeature = [];
  actions = [];
  unique_key: number = 0;
  windowHeight = 0;
  activesource: string = '';
  allTemplates = [];
  isPageLoaded: boolean = false;
  selectedItem = {};
  selectedSection;
  showpopup: boolean = false;
  fund_ReportTemplateDetails: FundReportTemplateDetails;
  fundTemplateName: string;
  selectionradio: string;
  title: string = "Save as";
  issection: boolean = false;
  isTemplateNameEmpty: boolean = false;
  disableConfirmSavebtn = true;
  default = TemplateSections.Default;
  isexits: boolean = false;
  details: FundConfigurationdetails;
  periodList = [];
  configObj: any = {};
  isPopup: boolean = false;
  tempaddTemplate: string;
  modalTitle: string = '';
  disableRenameConfirm = true;
  selectedAction = { name: ReportTemplateConstants.Action }
  activeTemplateName = TemplateSections.Default;
  isAction: boolean = false;
  isLoader: boolean = false;
  currentActiveTemplateName = "";
  configParentFilters: any = {};
  hasMultipleFilters = false;
  @ViewChild('popOver') public popover: NgbPopover;
  isFiltersOpen = false;
  isChartOpen = false;
  filterData: any;
  fundList: any[];
  regionList: any[];
  countryList: any[];
  strategyList: any[];
  masterModel: any = { filterSection: true };
  filterCategories = ["Attribution Type", "Strategies", "Regions", "Countries", "Evaluation Date"];
  activeFilterCategory = "Attribution Type";
  activeFilterList = [];
  ResetAdvFilters = false;
  results = [];
  attributionTypes = [];
  sideNavWidth:any ="";
  @Output() infoButtonClicked = new EventEmitter<void>();
  toggleInfoByClick(): void {
    this.infoButtonClicked.emit();
  }
  constructor(private pageConfigurationService: PageConfigurationService, private fb: UntypedFormBuilder,
    private toastrService: ToastrService, private cdref: ChangeDetectorRef, private service: FundReportService,
    private reportService: ReportService,
    private miscService: MiscellaneousService,
    private datePipe: DatePipe
  ) {
    this.fundReportForm = this.fb.group({
      reportItems: this.fb.array([])
    })
  }
  ngOnInit(): void {
    this.loadFundReportTemplates();
    this.listOfItemsLoad();
    this.filtersMasterList();
  }
  subdrop(event: CdkDragDrop<string[]>, i: number) {
    moveItemInArray(this.getNesteChartdArray(i).controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.getNesteChartdArray(i).value, event.previousIndex, event.currentIndex);
  }
  getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized(_$event)
  {
    this.getSideNavWidth();
  }
  chartarray = [{
    name: 'Capital invested',
    isDisable: false
  }, {
    name: 'Unrealized value',
    isDisable: false
  }, {
    name: 'Realized value',
    isDisable: false
  }, {
    name: 'Total value',
    isDisable: false
  }, {
    name: 'Total value Paid in (TVPI)',
    isDisable: false
  }, {
    name: 'Number of Investments',
    isDisable: false
  }
  ];

  getClasses(value) {
    return { 'some-class': value }
  }
  
  selectFilterCategory(category) {
    this.activeFilterCategory = category;
  }
  closeAttributionFiltersPopover() {
    this.popover.close();
    this.isFiltersOpen = false;
  }
  onCloseFilters() {
    this.isFiltersOpen = false;
  }
  onOpenFilters() {
    this.isFiltersOpen = true;
    this.activeFilterCategory = "Attribution Type";
  }
  onOpenCharts() {
    this.isChartOpen = true;
  }
  onClosecharts() {
    this.isChartOpen = false;
  }
  search(event: any) {
    let prop = 'label';
    if (this.attributionTypes != undefined && this.attributionTypes != null) {
      const cardList = this.fundReportForm.controls.reportItems as UntypedFormArray;
      let alreadySelectAttrTypes = [];
      cardList.value.forEach((_ele, idx) => {
        const row = this.nestedReportItems(idx) as UntypedFormArray;
        row.value.forEach((i) => {
          if (Object.keys(i).filter(x => x.includes("attributionType"))
            && i["attributionType"] != null && i.attributionType.hasOwnProperty("value")) {
            alreadySelectAttrTypes.push(i.attributionType);
          }
        });
      });
      const attributionTypeList = (alreadySelectAttrTypes.length > 0)
        ? this.attributionTypes.filter((item) => {
          let res = alreadySelectAttrTypes.find(i => JSON.stringify(i) == JSON.stringify(item));
          return JSON.stringify(item) != JSON.stringify(res);
        }) : this.attributionTypes;
      this.results = attributionTypeList.filter(function (
        element: any,
        _index: any
      ) {
        return (
          element[prop].toLowerCase().startsWith(event.query.toLowerCase())
        );
      });
    } else {
      this.results = [];
    }
  }
  filtersMasterList() {
    this.reportService.getReportMasterData().subscribe({next:result => {
      let resp = result["body"];
      if (resp != null) {
        this.filterData = resp;
        this.fundList = this.miscService.sortArray(resp.fundList, "fundName");
        this.masterModel.fundList = JSON.parse(JSON.stringify(this.fundList));
        this.strategyList = this.miscService.sortArray(resp.strategyList, "strategy");
        this.masterModel.strategyList = JSON.parse(JSON.stringify(this.strategyList));
        this.regionList = this.miscService.sortArray(resp.regionList, "region");
        this.masterModel.regionList = JSON.parse(JSON.stringify(this.regionList));
        this.countryList = this.miscService.sortArray(resp.regionCountryList, "country");
        this.masterModel.countryList = JSON.parse(JSON.stringify(this.countryList));
        let attributionTypes = this.reportService.ReportTypeList.filter(function (
          ele: any,
          _i: any
        ) {
          return ele.category == ReportCategory.Attribution;
        });
        this.attributionTypes = attributionTypes;
        let filters = {
          label: ['By Sector', 'By Region', 'By Fund', 'By Strategy', 'By Investment Year']
        };
        this.attributionTypes = this.multiFilter(attributionTypes, filters);
      }
    }, error:_error => {
    }})
  }
  onRegionChange(event){
    if (event.value != null && event.value.length > 0) {

      let regionIds = event.value;     

        this.countryList = this.masterModel.countryList.filter(s =>
          regionIds.find(x => x.regionId == s["regionId"]) != null
        );
    }
    else {
      this.countryList = this.masterModel.countryList;
    }
  }
  
  GetRegionIdsByCountryList(regionIds) {    
    this.miscService.getCountryListByRegionIds(regionIds).subscribe({
      next:(data) => {
        this.countryList = data["body"];
      },
      error:(_error) => {
      }
  });
    
  }
  stringIsEmpty(value) {
    return value ? value.trim().length == 0 : true;
  }
  loadFundReportTemplates() {
    this.isLoader = true;
    this.service.getFundReportTemplates().subscribe((res: any) => {
      let filters = {
        isActive: [true]
      };
      let DefaultTemplateFilters = {
        name: ['Default Template']
      };
      let activeFiltered = this.multiFilter(res, filters);
      if (activeFiltered.length == 0) {
        activeFiltered = this.multiFilter(res, DefaultTemplateFilters);
        activeFiltered[0].icon = "FeedbackStarGrey.svg";
      }
      this.selectedItem = activeFiltered[0];
      this.selectedSection = this.selectedItem;

      let defaulttemplate = res.filter((el) => {
        return el.name === TemplateSections.Default && el.isActive === false;
      });
      let activetemplate = res.filter((el) => {
        return el.isActive === true;
      })
      if (defaulttemplate != null && defaulttemplate.length > 0) {
        defaulttemplate[0].icon = "FeedbackStarGrey.svg";
        this.allTemplates.push(defaulttemplate[0])
      }
      if (activetemplate != null && activetemplate.length > 0)
        this.allTemplates.push(activetemplate[0]);
      let inactivetemplate = res.filter((el) => {
        return el.isActive === false && el.name !== TemplateSections.Default;
      });
      if (inactivetemplate != null && inactivetemplate.length > 0) {
        inactivetemplate.forEach(element => {
          this.allTemplates.push(element)
        });
      }
      if (!this.stringIsEmpty(this.currentActiveTemplateName)) {
        let obj: any = this.allTemplates.filter(x => x.name === this.currentActiveTemplateName)[0];
        this.selectedSection = obj;
        this.selectedItem = obj;
      }
      if (this.selectedSection.name != TemplateSections.Default) {
        this.loadFundReportSectionsData();
      }
      else
        this.resetForm();
      this.actionsDropDownDisable();
      if (this.selectedSection != null) {
        this.statusWiseLoadActions(this.selectedSection.isActive);
      }

    });
    this.isLoader = false;
  }
  loadFundReportSectionsData() {
    if (!this.stringIsEmpty(this.selectedSection.name)) {
      this.isLoader = true;
      this.service.getLoadFundReportTemplates(this.selectedSection.id).subscribe({next:(res: any) => {
        if (res != null) {
          this.dynamicCreateReactiveFormLoadTemplates(res);
          this.isLoader = false;
        }
      }, error:_error => {
        this.isLoader = false;
      }});
    }
  }
  dynamicCreateReactiveFormLoadTemplates(fundTemplatedetails) {
    this.fundReportForm.removeControl("reportItems");
    this.fundReportForm.addControl("reportItems", this.fb.array([]));
    this.fundReportForm.removeControl("nestedArray");
    this.fundReportForm.addControl("reportItems", this.fb.array([]));
    const items = this.fundReportForm.controls.reportItems as UntypedFormArray;
    if (fundTemplatedetails.configList != null && fundTemplatedetails.configList.length > 0) {
      for (let j = 0; j < fundTemplatedetails.configList.length; j++) {
        let newGroup = this.fb.group({
        });
        let nestednewGroup = this.fb.group({
        });
        let configDetails = JSON.parse(fundTemplatedetails.configList[j].config);
        if (configDetails == null) {
          configDetails = {
            period: null,
            sectionName: null
          };
        }
        if (configDetails.filters != null) {
          const nestedconfigDetails = JSON.parse(configDetails?.filters);
          nestednewGroup.addControl('attributionType', new UntypedFormControl(nestedconfigDetails?.attributionType));
          nestednewGroup.addControl('strategies', new UntypedFormControl(nestedconfigDetails?.strategies));
          nestednewGroup.addControl('regions', new UntypedFormControl(nestedconfigDetails?.regions));
          nestednewGroup.addControl('countries', new UntypedFormControl(nestedconfigDetails?.countries));
          if (!this.stringIsEmpty(nestedconfigDetails?.evaluationDate))
            nestednewGroup.addControl('evaluationDate', new UntypedFormControl(this.datePipe.transform(nestedconfigDetails?.evaluationDate.slice(0, 10), 'dd-MMM-yyyy')));
          else
            nestednewGroup.addControl('evaluationDate', new UntypedFormControl(''));
          nestednewGroup.addControl('funds', new UntypedFormControl(nestedconfigDetails?.funds));
          nestednewGroup.addControl('chart', new UntypedFormControl(nestedconfigDetails?.chart));
        }
        if (configDetails.charts != null) {
          const nestedconfigcharts = JSON.parse(configDetails?.charts);
          let chartnewarray = this.fb.array([]);
          nestedconfigcharts.forEach((x: any) => {
            chartnewarray.push(this.patchValues(x.label, x.value, x.isDisable));
          });
          newGroup.addControl("charts", chartnewarray);
        }else{
          newGroup.addControl("charts", this.fb.array([]));
        }
        newGroup.addControl('count', new UntypedFormControl(j + 1));
        newGroup.addControl('period', new UntypedFormControl(JSON.parse(configDetails.period)));
        newGroup.addControl('sectionName', new UntypedFormControl(JSON.parse(configDetails.sectionName)));
        newGroup.addControl("nestedArray", this.fb.array([nestednewGroup]));
        items.push(newGroup);
        if (!this.stringIsEmpty(JSON.parse(configDetails.sectionName)?.name))
          this.sectionValidation(j, JSON.parse(configDetails.sectionName).name);
      }
      this.isLoader = false;
    } else
      this.isLoader = false;
  }
  arrayNotIncludesFilter(filters, periodTypes) {
    return periodTypes.filter(function (e) {
      return !filters.includes(e.name)
    });
  }
  arrayNotIncludesInfo(filters, array) {
    if (array != undefined) {
      return array.filter(function (e) {
        return !filters.includes(e.info)
      });
    }
  }
  statusWiseLoadActions(status: any) {
    this.actions = [];
    if (!status)
      this.actions = this.arrayNotIncludesFilter(['Set as Inactive'], GetReportTemplateActions());
    else
      this.actions = this.arrayNotIncludesFilter(['Set as Active'], GetReportTemplateActions());
    let filters = {
      status: ["", "A", "I","D"]
    };
    this.actions = this.multiFilter(this.actions, filters);
  }
  resetSelections(i) {
    if (this.allFeature.find(x => x.sectionNumber === i) !== undefined) {
      this.allFeature.find(x => x.sectionNumber === i).isSelected = false;
      this.allFeature.find(x => x.sectionNumber === i).sectionNumber = -1;
      let sections = JSON.parse(JSON.stringify(this.allFeature));
      this.sectionList = sections.filter(x => !x.isSelected);
    }
  }
  confirmSave() {
    if (this.fundTemplateName == undefined || this.fundTemplateName == '') {
      this.isTemplateNameEmpty = true;
      this.SetDisableConfirmSave();
    } else if (this.selectionradio == undefined || this.selectionradio == '') {
      this.issection = true;
    }
    else {
      this.submit(1);
    }
  }
  onChange(value: any) {
    this.isexits = false;
    this.fundTemplateName = value.target.value;
    if (value.target.value == undefined || value.target.value == '')
      this.isTemplateNameEmpty = true;
    else if (this.checkTemplateExists(value.target.value) && this.selectionradio != "Update") {
      this.isexits = true;
    }
    else
      this.isTemplateNameEmpty = false;
    this.SetDisableConfirmSave();
  }
  checkTemplateExists(templateName: string) {
    return this.allTemplates.some(function (el) {
      return el.name === templateName;
    });
  }
  removeRadioerror(selection) {
    this.isexits = false;
    if (this.fundTemplateName == undefined || this.fundTemplateName == '') {
      this.isTemplateNameEmpty = true;
      this.SetDisableConfirmSave();
    }
    else if (this.checkTemplateExists(this.fundTemplateName) && selection != 'Update') {
      this.isexits = true;
    }
    else if (selection != undefined)
      this.issection = false
    else
      this.issection = true;
  }
  radiobtnClick(item: any) {
    this.selectionradio = item;
    this.SetDisableConfirmSave();
  }
  SetDisableConfirmSave() {
    this.disableConfirmSavebtn = !this.isTemplateNameEmpty && (this.selectionradio === 'Update' || this.selectionradio === 'New') ? false : true;
  }
  onClose() {
    this.showpopup = false;
    this.fundTemplateName = '';
    this.selectionradio = undefined;
  }
  ngAfterViewInit() {
    this.windowHeight = window.innerHeight - 176;
    this.isPageLoaded = true;
    this.cdref.detectChanges();
  }
  @HostListener('window:resize', ['$event'])
  onResize(_event) {
    this.windowHeight = window.innerHeight - 176;
    this.cdref.detectChanges();
  }
  addSectionList() {
    if ((<UntypedFormArray>this.fundReportForm.controls.reportItems).length == 0)
      this.unique_key = 0;
    const unique_key: number = ++this.unique_key;
    ((<UntypedFormArray>this.fundReportForm.controls.reportItems)).push(this.addFundReportFormGroup(unique_key));
    /*Untill Count Matches And Else Revert Graph Label */
    if (this.allFeature != undefined && this.allFeature != null) {
      const cardList = this.fundReportForm.controls.reportItems as UntypedFormArray;
      let alreadySelectAttrTypes = [];
      cardList.value.forEach((_ele, idx) => {
        const row = this.nestedReportItems(idx) as UntypedFormArray;
        row.value.forEach((i) => {
          if (Object.keys(i).filter(x => x.includes("attributionType"))
            && i["attributionType"] != null && i.attributionType.hasOwnProperty("value")) {
            alreadySelectAttrTypes.push(i.attributionType);           
          }
        });
      });
      if (alreadySelectAttrTypes.length == this.attributionTypes.length) {
        this.allFeature.find(x => x.name === FundEnum.AttributionReportGraph).sectionNumber = unique_key;
        this.allFeature.find(x => x.name === FundEnum.AttributionReportGraph).isSelected = true;
      }else{
        this.allFeature.find(x => x.name === FundEnum.AttributionReportGraph).sectionNumber = -1;
        this.allFeature.find(x => x.name === FundEnum.AttributionReportGraph).isSelected = false;
      }
      let sections = JSON.parse(JSON.stringify(this.allFeature));
      this.sectionList = sections.filter(x => !x.isSelected);
    } 
  }
  addFundReportFormGroup(i: number): UntypedFormGroup {
    return this.fb.group({
      count: new UntypedFormControl(i),
      sectionName: new UntypedFormControl(null, Validators.required),
      period: new UntypedFormControl(''),
      nestedArray: this.fb.array([]),
      charts: this.fb.array([]),
    });
  }
  get UntypedFormArray(): UntypedFormArray {
    return this.fundReportForm.get('reportItems') as UntypedFormArray;
  }
  clearFilters(userIndex: number, index: number) {
    this.nestedReportItems(userIndex).at(index).reset();
    this.nestedReportItems(userIndex).at(index).get("attributionType").setValue('');
    this.nestedReportItems(userIndex).at(index).get("attributionType").setValidators(Validators.required);
    this.nestedReportItems(userIndex).at(index).get("attributionType").updateValueAndValidity();
  }
  reportItems(): UntypedFormArray {
    return this.fundReportForm.get('reportItems') as UntypedFormArray;
  }
  get chartsControls(): UntypedFormArray {
    return this.fundReportForm.get("charts") as UntypedFormArray;
  }
  nestedReportItems(parentIndex: number): UntypedFormArray {
    return this.reportItems()
      .at(parentIndex)
      .get('nestedArray') as UntypedFormArray;
  }
  patchDynamicFormBlockValue(index, value: string, _control: string) {
    ((this.fundReportForm.get('reportItems') as UntypedFormArray).at(index) as UntypedFormGroup).get('sectionName').patchValue(value);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.UntypedFormArray.controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.fundReportForm.get('reportItems').value, event.previousIndex, event.currentIndex);
  }
  getNestedPeriodArray(index: number): UntypedFormArray {
    return (this.fundReportForm.get('reportItems') as UntypedFormArray).at(index).get('nestedPeriod') as UntypedFormArray;
  }
  getNestedArray(index: number): UntypedFormArray {
    return (this.fundReportForm.get('reportItems') as UntypedFormArray).at(index).get('nestedArray') as UntypedFormArray;
  }
  getNesteChartdArray(index: number): UntypedFormArray {
    return (this.fundReportForm.get('reportItems') as UntypedFormArray).at(index).get('charts') as UntypedFormArray;
  }
  submit(_f: any) {
    if (this.fundReportForm.get('reportItems').value.length > 0) {
      let controls = [];
      this.fund_ReportTemplateDetails = <FundReportTemplateDetails>{};
      this.fund_ReportTemplateDetails.Template = this.fundTemplateName.trim();
      this.fund_ReportTemplateDetails.Selection = this.selectionradio.trim();
      if (this.selectionradio != "New")
        this.fund_ReportTemplateDetails.FundTemplateId = this.selectedSection.id;
      this.currentActiveTemplateName = this.fundTemplateName.trim();
      this.fund_ReportTemplateDetails.ConfigList = [];
      controls = this.fundReportForm.get('reportItems').value;
      controls.forEach((element, index) => {
        this.configParentFilters = <any>{};
        this.details = <FundConfigurationdetails>{};
        this.details.featureid = element.sectionName.id;
        this.details.featureName = element.sectionName.name;
        this.details.order = index + 1;
        this.details.period = element.period.name;
        this.configParentFilters.period = JSON.stringify(element.period);
        this.configParentFilters.sectionName = JSON.stringify(element.sectionName);
        if (element.nestedArray.length > 0) {
          element.nestedArray.forEach((obj, _i) => {
            this.configParentFilters.filters = JSON.stringify(obj);
          });
        }
        if (element.charts != undefined) {
          if (element.charts.length > 0) {
            this.configParentFilters.charts = JSON.stringify(element.charts);
          }
        }
        this.details.config = JSON.stringify(this.configParentFilters);
        this.fund_ReportTemplateDetails.ConfigList.push(this.details);
      });
      if (this.fund_ReportTemplateDetails.ConfigList.length > 0) {
        this.service.saveFundTemplate(this.fund_ReportTemplateDetails).subscribe((res: any) => {
          let msg = "updated";
          if (this.selectionradio == "New")
            msg = "created";
          if (res != null)
            this.toastrService.success(`Fund Report template ${msg} successfully`, "", { positionClass: "toast-center-center" });
          this.onClose();
          this.fundReportForm.reset()
          this.UntypedFormArray.clear();
          this.allTemplates = [];
          this.loadFundReportTemplates();
        })
      } else {
        this.toastrService.error('At least choose one section.!', "", { positionClass: "toast-center-center" });
        this.onClose();
      }
    }
  }
  resetCntrl() {
    this.resetForm();
    this.loadFundReportSectionsData();
  }
  resetForm() {
    this.fundReportForm.reset()
    this.UntypedFormArray.clear();
  }
  delete(i: any) {
    this.UntypedFormArray.removeAt(i);
    this.resetSelections(i);
  }
  listOfItemsLoad() {
    this.masterListItems();
    this.actions = GetReportTemplateActions();
    this.pageConfigurationService.lpReportPeriodTypes().subscribe((res: any) => {
      if (res != null && res.code == 'OK') {
        let filters = {
          status: ['Y']
        };
        this.periodList = this.multiFilter(res.body, filters);
      }
    });
  }
  masterListItems() {
    this.pageConfigurationService.getFundReportSectionList().subscribe((res: any) => {
      if (res.length > 0) {
        this.sectionList = res;
        this.allFeature = res;
        let defultselect = { id: '', name: 'Select Section' };
        this.insertAt(defultselect);
      }
    })
  }
  reportFilters(): UntypedFormGroup {
    return this.fb.group({
      attributionType: new UntypedFormControl('', Validators.required),
      strategies: new UntypedFormControl(''),
      regions: new UntypedFormControl(''),
      countries: new UntypedFormControl(''),
      funds: new UntypedFormControl(''),
      evaluationDate: new UntypedFormControl(''),
      chart: new UntypedFormControl('')
    });
  }
  insertAt(elementsArray) {
    this.sectionList.splice(0, 0, elementsArray);
  }
  sectionOnChange(index: number, event: any) {
    const nestedIndex = 0;
    const sectionName = event.name;
    this.sectionValidation(index, sectionName);
    switch (sectionName) {
      case FundEnum.StrategyDescription: case FundEnum.SWInvestmentValueChart: case FundEnum.SWTotalValueChart:
      case FundEnum.TrackRecord: case FundEnum.StaticData: case FundEnum.FPChart:
        this.getNestedArray(index).removeAt(nestedIndex);
        break;
      case FundEnum.AttributionReportTable:
        break
      case FundEnum.AttributionReportGraph:
        this.getNestedArray(index).removeAt(nestedIndex);
        this.hasMultipleFilters = true;
        this.getNestedArray(index).push(this.reportFilters());
        this.chartarray.forEach(x => {
          this.getNesteChartdArray(index).push(this.patchValues(x.name, x.name, x.isDisable));
        });
        break;
    }
  }
  sectionValidation(i: number, sectionName: string) {
    let res = this.allFeature.find(x => x.sectionNumber === i);
    if (res !== undefined) {
      this.allFeature.find(x => x.sectionNumber === i).isSelected = false;
      this.allFeature.find(x => x.sectionNumber === i).sectionNumber = -1;
    }
    if (sectionName !== 'Select section') {
      this.allFeature.find(x => x.name === sectionName).sectionNumber = i;
      this.allFeature.find(x => x.name === sectionName).isSelected = true;
      if (sectionName.indexOf(FundEnum.AttributionReportGraph) > -1) {
        this.allFeature.find(x => x.sectionNumber === i).isSelected = false;
        this.allFeature.find(x => x.sectionNumber === i).sectionNumber = -1;
      }
    }
    let sections = JSON.parse(JSON.stringify(this.allFeature));
    this.sectionList = sections.filter(x => !x.isSelected);

    if (this.allFeature != undefined && this.allFeature != null) {
      const cardList = this.fundReportForm.controls.reportItems as UntypedFormArray;
      let alreadySelectallFeature = [];
      cardList.value.forEach((ele, _idx) => {
        if (ele["sectionName"] != null) {
          alreadySelectallFeature.push(ele.sectionName);
        }
      });
    } 
  }
  save() {
    this.showpopup = true;
    this.fundTemplateName = this.selectedSection.name;
  }
  OnConfig(_e: any) {
    this.configurationRequest();
  }
  configurationRequest() {
    this.service.fundtemplateConfig(this.configObj).subscribe((res: any) => {
      this.allTemplates = [];
      this.loadFundReportTemplates();
      if (res != null) {
        this.isPopup = false;
        let status = this.configObj.Status == 'I' ? "inactivated" : "activated"
        if (this.configObj.Status == ReportTemplateConstants.Active)
          this.toastrService.success(`Fund Report template ${status} successfully`, "", { positionClass: "toast-center-center" });
        if (this.configObj.Status == ReportTemplateConstants.InActive)
          this.toastrService.success('Default Fund Report template activated', "", { positionClass: "toast-center-center" });
        if (this.configObj.Status == ReportTemplateConstants.Rename)
          this.toastrService.success('Selected template renamed successfully', "", { positionClass: "toast-center" });
        if (this.configObj.Status == ReportTemplateConstants.Delete)
          this.toastrService.success('Selected template deleted successfully', "", { positionClass: "toast-center" });

        this.selectedAction = { name: ReportTemplateConstants.Action };
      } else
        this.isPopup = false;
    });
  }
  OnCancel(_e: any) {
    this.isPopup = false;
    this.actions = [];
    this.statusWiseLoadActions(this.selectedSection.isActive);
    this.selectedAction = { name: ReportTemplateConstants.Action };
  }
  ExecuteAction(event: any) {
    const selectedAction = event.value;
    let status = selectedAction.status;
    this.tempaddTemplate = '';
    if (this.selectedSection.name != TemplateSections.Default && status != "") {
      this.configObj = <any>{};
      this.configObj.TemplateId = this.selectedSection.id;
      this.configObj.Status = selectedAction.name;
      this.configObj.TemplateName = this.selectedSection.name;
      switch (selectedAction.name) {
        case ReportTemplateConstants.Active: case ReportTemplateConstants.InActive:
          {
            this.isPopup = true;
            this.modalTitle = "Confirmation"
            this.disableRenameConfirm = false;
          }
      }
    }
  }
  templateAction(event: any) {
    const selectedTemplate = event.value;
    if (selectedTemplate != null) {
      this.selectedSection = selectedTemplate;
      this.resetForm();
      if (this.selectedSection.name == TemplateSections.Default)
        this.masterListItems();
      if (this.selectedSection.name != TemplateSections.Default)
        this.loadFundReportSectionsData();
      this.actionsDropDownDisable();
      this.statusWiseLoadActions(selectedTemplate.isActive);
    }
  }
  actionsDropDownDisable() {
    this.isAction = false;
    if (this.selectedSection.name != null)
      if (this.selectedSection.name == TemplateSections.Default)
        this.isAction = true;
  }
  multiFilter(array, filters) {
    const filterKeys = Object.keys(filters);
    return array.filter((item) => {
      return filterKeys.every(key => {
        if (!filters[key].length) return true;
        return filters[key].includes(item[key]);
      });
    });
  }

  multiFilterremove(ary, elem) {
    let i = ary.indexOf(elem);
    if (i >= 0) ary.splice(i, 1);
    return ary;
  }
  // assign the values
  patchValues(label, value, isDisable) {
    return this.fb.group({
      label: label,
      value: value,
      isDisable: isDisable
    })
  }
  objectValues(label, value) {
    return {
      label: label,
      value: value
    }
  }
  isHighlight:number;
  isChartHighlight:number;
  highlightColorChartFilters(i:number){
    this.isChartHighlight=1+i;
  }
  highlightColorAttributionFilters(i:number,_obj:any){
    this.isHighlight=i;
  }
  highlightclear(_i:number){
    this.isHighlight=-1;
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(_event): void {
    this.highlightclear(-1);
    this.isChartHighlight=-1;
  }
}
