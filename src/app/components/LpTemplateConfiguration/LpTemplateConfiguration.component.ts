import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { GetReportTemplateActions, ReportTemplateConstants, TemplateSections } from "src/app/common/constants";
import { ToastrService } from "ngx-toastr";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { TemplateDetails, ItemDetails } from '../LpTemplateConfiguration/LPTemplate.model';
@Component({
  selector: "lp-template-config",
  templateUrl: "./LpTemplateConfiguration.component.html",
  styleUrls: ["./LpTemplateConfiguration.component.scss"]
})
export class LpTemplateConfigurationComponent implements OnInit {
  @ViewChild('hiddenSaveButton', { static: true }) hiddenSaveButton: ElementRef<HTMLButtonElement>;
  activesource: string = '';
  allTemplates = []
  selectedTemplate = { name: "Default Template", id: "" }
  selectedSection = { name: "" }
  masterListClone = [];
  notindexs = [];
  arrayitems = [];
  masteritemCount: number = 0;
  unique_key: number = 0;
  isTemplateNameEmpty: boolean = false;
  issection: boolean = false;
  isexits: boolean = false;
  actions = []
  dargItems = [];
  masterList = [];
  allSections = [];
  kpi_items_DRP = [];
  kPI_LineItems_List: any = {
    CreditKPI: []
  };
  cloneKpiLineItemList: any = {
  };
  filtersMonthly = ['M', 'Y'];
  filtersQuarterly = ['Q', 'Y'];
  selectedAction = { name: ReportTemplateConstants.Action }
  props = ['id', 'name'];
  dragForm: FormGroup;
  templatedetails: TemplateDetails;
  itemsObj: ItemDetails;
  config: Object = {};
  showpopup: boolean = false;
  templateName: string;
  selection: string;
  title: string = "Save as";
  fixedHeight = 600;
  windowHeight = 0;
  isScroll = false;
  disableConfirmSave = true;
  periodTypes = [];
  periodTypesCopy = [];
  periodTypesQuarterly = [];
  periodTypesMonthly = [];
  creditKPI_LineItems = [];
  kpiLineItemTradingRecords: []
  configObj: any = {};
  isPopup: boolean = false;
  isAction: boolean = false;
  isLoader: boolean = false;
  restrictTextKpis = ['Text'];
  default = TemplateSections.Default;
  isArrayOriginalLength = [];
  isCopyArrayOriginalLength = [];
  isOriginalLength: number = 0;
  clonetemplateName: any;
  disableRenameConfirm = true;
  tName: string = "";
  modalTitle = "Confirmation";
  activeTemplateName = this.selectedTemplate.name;
  isPageLoaded: boolean = false;
  isNearBottom: boolean = true;
  tempaddTemplate: string = '';
  sideNavWidth:any ="";
  constructor(private pageConfigurationService: PageConfigurationService, private fb: FormBuilder,
    private toastrService: ToastrService,private miscService: MiscellaneousService, private cdref: ChangeDetectorRef) {
    this.dragForm = this.fb.group({
      filed: '',
      'items': this.fb.array([])
    })
    this.config = {
      controls: []
    }
  }
  ngOnInit() {
    this.isPageLoaded = false;
    this.listOfItemsLoad();
  }
  get controlsValueChanges() {
    return this.dragForm.get('items');
  }
  getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized(_$event)
  {
    this.getSideNavWidth();
  }
  listOfItemsLoad() {
    this.masterListItems();
    this.getAllReportTemplates();
    this.actions = GetReportTemplateActions();
    this.mappingKpis_List();
  }
  uniq(a) {
    return a.sort().filter(function (item, pos, ary) {
      return !pos || item != ary[pos - 1];
    });
  }
  graphLocalValue: string = '';
  onGraphLineItemChange(e, _i, action: string) {
    let graphIdentify: string = action + e.value.id;
    if (e.value.name != "") {
      if (this.isArrayOriginalLength.indexOf(graphIdentify) !== -1) {
        this.uniq(this.isArrayOriginalLength); this.removeArray(this.isArrayOriginalLength, graphIdentify);
      }
      else
        this.isArrayOriginalLength.push(graphIdentify);
    } else {
      this.removeArray(this.isArrayOriginalLength, graphIdentify)
    }
    if (this.graphLocalValue != '') {
      this.removeArray(this.isArrayOriginalLength, this.graphLocalValue);
      if (this.isCopyArrayOriginalLength.indexOf(graphIdentify) !== -1) {
        this.removeArray(this.isArrayOriginalLength, graphIdentify);
      }
    }
    this.graphLocalValue = graphIdentify;
  }
  periodLocalValue: string = '';
  onPeriodChange(e, _i: number, action: string) {
    let periodIdentify: string = action + e.value.name;
    if (e.value.name != "" && e.value.name != 'Select Period') {
      if (this.isArrayOriginalLength.indexOf(periodIdentify) !== -1) {
        this.uniq(this.isArrayOriginalLength);
        this.removeArray(this.isArrayOriginalLength, periodIdentify);
      }
      else
        this.isArrayOriginalLength.push(periodIdentify);
    }
    if (this.periodLocalValue != '') {
      this.removeArray(this.isArrayOriginalLength, this.periodLocalValue);
      if (this.isCopyArrayOriginalLength.indexOf(periodIdentify) !== -1) {
        this.removeArray(this.isArrayOriginalLength, periodIdentify);
      }
    }
    this.periodLocalValue = periodIdentify;
  }
  kpiIdentifyLocalValue = [];
  kpiFinancialsIdentifyLocalValue = [];
  onKpiLineItemChange(e, _i, action: string) {
    if (e.value.length > 0) {
      let ij = 0, len = e.value.length;
      while (ij < len) {
        let kpiIdentify: string = action + e.value[ij].id;
        if (this.isArrayOriginalLength.indexOf(kpiIdentify) !== -1) {
          this.removeArray(this.isArrayOriginalLength, kpiIdentify);
          this.uniq(this.kpiIdentifyLocalValue).forEach(_element => {
            this.removeArray(this.isArrayOriginalLength, kpiIdentify);
            if (this.isCopyArrayOriginalLength.indexOf(kpiIdentify) !== -1) {
              this.removeArray(this.isArrayOriginalLength, kpiIdentify);
            }
          });
        } else
          this.isArrayOriginalLength.push(kpiIdentify);
        this.uniq(this.kpiIdentifyLocalValue).forEach(element => {
          if (this.kpiIdentifyLocalValue.indexOf(element) !== -1) {
            this.removeArray(this.isArrayOriginalLength, element);
            this.removeArray(this.kpiIdentifyLocalValue, element);
          }
          if (this.isCopyArrayOriginalLength.indexOf(kpiIdentify) !== -1) {
            this.removeArray(this.isArrayOriginalLength, kpiIdentify);
          }
        });
        this.kpiIdentifyLocalValue.push(kpiIdentify);
        ij++
      }
    }
  }
  onKpiFinancialsLineItemChange(e, _i, action: string) {
    if (action == 'Company Financials') {
      if (e.value.length > 0) {
        for (let j = 0; j < e.value.length; j++) {
          let kpiFinancialsIdentify: string = e.value[j].financialKpiId;
          if (this.isArrayOriginalLength.indexOf(kpiFinancialsIdentify) !== -1) {
            this.uniq(this.isArrayOriginalLength);
            this.removeArray(this.isArrayOriginalLength, kpiFinancialsIdentify);
          }
          else
            this.isArrayOriginalLength.push(kpiFinancialsIdentify);
          this.uniq(this.kpiFinancialsIdentifyLocalValue).forEach(element => {
            if (this.kpiFinancialsIdentifyLocalValue.indexOf(element) !== -1) {
              this.removeArray(this.isArrayOriginalLength, element);
              this.removeArray(this.kpiFinancialsIdentifyLocalValue, element);
            }
            if (this.isCopyArrayOriginalLength.indexOf(kpiFinancialsIdentify) !== -1) {
              this.removeArray(this.isArrayOriginalLength, kpiFinancialsIdentify);
            }
          });
          this.kpiFinancialsIdentifyLocalValue.push(kpiFinancialsIdentify);
        }
      }
      this.uniq(this.kpiFinancialsIdentifyLocalValue);
    }


  }
  sectionLocalValue: string = '';
  onsectionChange(e, _i: number) {
    let sectionIdentify: string = "S" + e.id;
    if (e.id != 0) {
      if (this.isArrayOriginalLength.indexOf(sectionIdentify) !== -1) {
        this.uniq(this.isArrayOriginalLength); this.removeArray(this.isArrayOriginalLength, sectionIdentify);
      }
      else
        this.isArrayOriginalLength.push(sectionIdentify);
    }
    if (this.sectionLocalValue != '') {
      this.removeArray(this.isArrayOriginalLength, this.sectionLocalValue);
      if (this.isCopyArrayOriginalLength.indexOf(sectionIdentify) !== -1) {
        this.removeArray(this.isArrayOriginalLength, sectionIdentify);
      }
    }
    this.sectionLocalValue = sectionIdentify;
  }
  footValue='';
  footNoteCheck(event, i, name) {
    let value = "";
    value = name == TemplateSections.InvestmentTable ? 'In' :
      name == TemplateSections.OperationalTable ? 'O' :
        name == TemplateSections.ImpactTable ? 'I' :
          name == TemplateSections.CompanyFinancials ? 'C' :
            name == TemplateSections.CompanyTable ? 'Co' :
              name == TemplateSections.CreditTable ? 'Cr' :
                name == TemplateSections.TradingTable ? 'T' : 'NA'
    let valid = value + i + "-" + event.checked;
    if (event.checked || !event.checked) {
      if (this.isArrayOriginalLength.indexOf(valid) !== -1) {
        this.uniq(this.isArrayOriginalLength); this.removeArray(this.isArrayOriginalLength, valid);
      } else
        this.isArrayOriginalLength.push(valid);
    }
    if (this.footValue != '') {
      this.removeArray(this.isArrayOriginalLength, this.footValue);
      if (this.isCopyArrayOriginalLength.indexOf(valid) !== -1) {
        this.removeArray(this.isArrayOriginalLength, valid);
      }
    }
    this.footValue = valid;
  }
  removeArray(arr, what) {
    let a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
      what = a[--L];
      while ((ax = arr.indexOf(what)) !== -1) {
        arr.splice(ax, 1);
      }
    }
    return arr;
  }
  @ViewChild('target') private myScrollContainer: ElementRef;
  scrollToBottom(_el): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight + 550,
      left: 0,
      behavior: 'smooth'
    });
  }
  isUserNearBottom(): boolean {
    const threshold = 150;
    const position = window.scrollY + window.innerHeight;
    const height = document.body.scrollHeight;
    return position > height - threshold;
  }
  getYPosition(e: Event): number {
    return (e.target as Element).scrollTop;
  }
  mappingKpis_List() {
    this.pageConfigurationService.lpreportMappingItems().subscribe((res: any) => {
      if (res != null && res.code == 'OK') {
        this.kPI_LineItems_List = res.body;
        this.cloneKpiLineItemList = res.body;
      }
    });
    this.pageConfigurationService.requestDataFromMultipleSources().subscribe((res: any) => {
      if (res != null) {
        if (res[0]?.code == 'OK')
          this.kpiLineItemTradingRecords = res[0].body.masterKpi;
        if (res[1]?.code == 'OK')
          this.creditKPI_LineItems = res[1].body.masterKpi;
      }
    });
    this.pageConfigurationService.lpReportPeriodTypes().subscribe((res: any) => {
      if (res != null && res?.code == 'OK') {
        this.periodTypes = [];
        this.periodTypesCopy = res.body;
        this.periodTypesQuarterly = this.arrayIncludeFilter(this.filtersQuarterly, res.body);
        this.periodTypesQuarterly = this.arrayNotIncludesFilter(['1 YR (Last 1 year)'], this.periodTypesQuarterly);
        this.periodTypesMonthly = this.arrayIncludeFilter(this.filtersMonthly, res.body);
        this.periodTypesMonthly.splice(0, 0, { name: 'Select Period' });
        this.periodTypesQuarterly.splice(0, 0, { name: 'Select Period' });
      }
    });
  }
  removeControl(index) {
    (this.dragForm.get('items') as FormArray).removeAt(index);
  }
  addFormGroup(i: number): FormGroup {
    return this.fb.group({
      count: new FormControl(i),
      actionname: new FormControl(""),
      justify: new FormControl('left'),
      justifyLogo: new FormControl('left'),
      kpilineitem: new FormControl(""),
      graphlineitem: new FormControl(""),
      period: new FormControl("Select Period"),
      footnote:new FormControl(false)
    });
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
    this.isNearBottom = this.isUserNearBottom();
  }
  Savepopup() {
    this.showpopup = true;
    this.templateName = this.selectedTemplate.name;
    this.tName = JSON.parse(JSON.stringify(this.templateName));
  }

  confirmSave() {
    if (this.templateName == undefined || this.templateName == '') {
      this.isTemplateNameEmpty = true;
      this.SetDisableConfirmSave();
    } else if (this.selection == undefined || this.selection == '') {
      this.issection = true;
    }
    else {
      this.resetupopvalidations();
      this.submitActions(1);
    }
  }

  SetDisableConfirmSave() {
    this.disableConfirmSave = !this.isTemplateNameEmpty && (this.selection === 'U' || this.selection === 'N') ? false : true;
  }
  resetupopvalidations() {
    this.isTemplateNameEmpty = false;
    this.issection = false;
    this.isexits = false;
    this.disableConfirmSave = true;
  }

  ontemplateChange(value: any) {
    this.isexits = false;
    this.templateName = value.target.value;
    if (value.target.value == undefined || value.target.value == '')
      this.isTemplateNameEmpty = true;
    else if (this.userExists(this.templateName)) {
      this.isexits = true;
    }
    else
      this.isTemplateNameEmpty = false;

    this.SetDisableConfirmSave();
    this.setDisableRenameConfirm();
  }

  onClose() {
    this.showpopup = false;
    this.templateName = '';
    this.selection = undefined;
    this.resetupopvalidations();
  }

  get formArray(): FormArray {
    return this.dragForm.get('items') as FormArray;
  }
  justifyLogoLocalValue: string = '';
  justifyLocalValue: string = '';
  patchDynamicFormBlockValue(index, justify, type) {
    if(type == "logo")
    ((this.dragForm.get('items') as FormArray).at(index) as FormGroup).get('justifyLogo').patchValue(justify);
    else
    ((this.dragForm.get('items') as FormArray).at(index) as FormGroup).get('justify').patchValue(justify);
    if (type == "logo")
      this.justifyLogoIsCheckSection(index, justify, type);
    else
      this.justifyIsCheckSection(index, justify, type);
  }
  justifyLogoIsCheckSection(index, justify, type){
    if (type == "logo") {
      let graphIdentify = (type != "logo") ? 'justify' + index.toString() + '-' + justify : 'justifyLogo' + index.toString() + '-' + justify;
      if (justify != "") {
        if (this.isArrayOriginalLength.indexOf(graphIdentify) !== -1) {
          this.uniq(this.isArrayOriginalLength); this.removeArray(this.isArrayOriginalLength, graphIdentify);
        }
        else
          this.isArrayOriginalLength.push(graphIdentify);
      } else {
        this.removeArray(this.isArrayOriginalLength, graphIdentify)
      }
      if (this.justifyLogoLocalValue != '') {
        this.removeArray(this.isArrayOriginalLength, this.justifyLogoLocalValue);
        if (this.isCopyArrayOriginalLength.indexOf(graphIdentify) !== -1) {
          this.removeArray(this.isArrayOriginalLength, graphIdentify);
        }
      }
      this.justifyLogoLocalValue = graphIdentify;
    }
  }
  justifyIsCheckSection(index, justify, type){
    if (type != "logo") {
      let graphIdentify = (type != "logo") ? 'justify' + index.toString() + '-' + justify : 'justifyLogo' + index.toString() + '-' + justify;
      if (justify != "") {
        if (this.isArrayOriginalLength.indexOf(graphIdentify) !== -1) {
          this.uniq(this.isArrayOriginalLength); this.removeArray(this.isArrayOriginalLength, graphIdentify);
        }
        else
          this.isArrayOriginalLength.push(graphIdentify);
      } else {
        this.removeArray(this.isArrayOriginalLength, graphIdentify)
      }
      if (this.justifyLocalValue != '') {
        this.removeArray(this.isArrayOriginalLength, this.justifyLocalValue);
        if (this.isCopyArrayOriginalLength.indexOf(graphIdentify) !== -1) {
          this.removeArray(this.isArrayOriginalLength, graphIdentify);
        }
      }
      this.justifyLocalValue = graphIdentify;
    }
  }
  arrayIncludeFilter(filters, periodTypes) {
    return periodTypes.filter(function (e) {
      return filters.includes(e.status)
    });
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
  isKpiGraph(item) {
    this.kpi_items_DRP = [];
    if (item == TemplateSections.InvestmentGraph) {
      this.kpi_items_DRP = this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.investmentKpi);
      this.periodTypes = [];
      this.periodTypes = this.periodTypesQuarterly;
      return true
    }
    else if (item == TemplateSections.TradingGraph) {
      this.kpi_items_DRP = this.arrayNotIncludesInfo(this.restrictTextKpis, this.kpiLineItemTradingRecords);
      this.periodTypes = [];
      this.periodTypes = this.periodTypesQuarterly;
      return true
    }
    else if (item == TemplateSections.CreditGraph) {
      this.kpi_items_DRP = this.arrayNotIncludesInfo(this.restrictTextKpis, this.creditKPI_LineItems);
      this.periodTypes = [];
      this.periodTypes = this.periodTypesMonthly;
      return true
    }
    else if (item == TemplateSections.OperationalGraph) {
      this.kpi_items_DRP = this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.operationalKpi);
      this.periodTypes = [];
      this.periodTypes = this.periodTypesQuarterly;
      return true
    }
    else if (item == TemplateSections.ImpactGraph) {
      this.kpi_items_DRP = this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.impactKpi);
      this.periodTypes = [];
      this.periodTypes = this.periodTypesQuarterly;
      return true
    }
    else if (item == TemplateSections.CompanyGraph) {
      this.kpi_items_DRP = this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.companyKpi);
      this.periodTypes = [];
      this.periodTypes = this.periodTypesMonthly;
      return true
    }
  }
  isKpilineitemcheck(item) {
    if (item != undefined) {
      switch (item) {
        case TemplateSections.InvestmentTable:
          {
            this.kpi_items_DRP = this.kPI_LineItems_List.investmentKpi;
            this.periodTypes = [];
            this.periodTypes = this.periodTypesQuarterly;
            return true
          }
        case TemplateSections.OperationalTable:
          {
            this.kpi_items_DRP = this.kPI_LineItems_List.operationalKpi;
            this.periodTypes = [];
            this.periodTypes = this.periodTypesQuarterly;
            return true
          }
        case TemplateSections.CreditTable:
          {
            this.kpi_items_DRP = this.creditKPI_LineItems;
            this.periodTypes = this.periodTypesMonthly;
            return true
          }
        case TemplateSections.CompanyTable:
          {
            this.kpi_items_DRP = this.kPI_LineItems_List.companyKpi;
            this.periodTypes = this.periodTypesMonthly;
            return true
          }
        case TemplateSections.TradingTable:
          {
            this.kpi_items_DRP = this.kpiLineItemTradingRecords;
            this.periodTypes = [];
            this.periodTypes = this.periodTypesQuarterly;
            return true
          }
        case TemplateSections.ImpactTable:
          {
            this.kpi_items_DRP = this.kPI_LineItems_List.impactKpi;
            this.periodTypes = [];
            this.periodTypes = this.periodTypesQuarterly;
            return true
          }
        case TemplateSections.CompanyFinancials:
          {
            this.kpi_items_DRP = this.kPI_LineItems_List.financialKpis;
            this.periodTypes = this.periodTypesMonthly;
            return true
          }
        default:
          return false;
      }
    }
    else
      return false
  }

  isJustifysection(index) {
    if (((this.dragForm.get('items') as FormArray).at(index) as FormGroup).get('actionname').value != '')
      return ((this.dragForm.get('items') as FormArray).at(index) as FormGroup).get('actionname').value.name;
    else
      return ''
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.formArray.controls, event.previousIndex, event.currentIndex);
    moveItemInArray(this.dragForm.get('items').value, event.previousIndex, event.currentIndex);
  }

  AddSectionList() {
    if ((<FormArray>this.dragForm.controls?.items)?.length == 0)
      this.unique_key = 0;
    const unique_key = ++this.unique_key;
    if (this.masteritemCount >= unique_key) {
      this.dargItems.push(unique_key);
      ((<FormArray>this.dragForm.controls.items)).push(this.addFormGroup(unique_key));
      this.config['controls'].push({
        actionName: null
      })
      this.scrollToBottom(true);
    }
  }

  masterListItems() {
    this.pageConfigurationService.getLPReportMasterList().subscribe((res: any) => {
      if (res.length > 0) {
        this.masteritemCount = res.length;
         this.masterList = res.filter(x => x.isActive);
        this.allSections = res;
        let defultselect = { id: 0, name: 'Select section', isActive: true };
        this.insertAt(defultselect);
        this.masterListClone = res.filter(x => x.isActive);
        this.selectedSection = this.masterList[0];
        this.removeGraphValidation();
      }
    })
  }

  insertAt(elementsArray) {
    this.allSections.splice(0, 0, elementsArray);
  }

  GetSelectedSectionData(section, i) {
    let res = this.allSections.find(x => x.sectionNumber === i);
    if (res !== undefined) {
      this.allSections.find(x => x.sectionNumber === i).isSelected = false;
      this.allSections.find(x => x.sectionNumber === i).sectionNumber = -1;
    }
    if (section.name !== 'Select section') {
      this.allSections.find(x => x.name === section.name).sectionNumber = i;
      this.allSections.find(x => x.name === section.name).isSelected = true;
      if (section.name.indexOf('Graph') > -1) {
        this.allSections.find(x => x.sectionNumber === i).isSelected = false;
        this.allSections.find(x => x.sectionNumber === i).sectionNumber = -1;
      }
    }
    let sectionOptions = this.allSections.filter(x=>x.isActive);
      let sections = JSON.parse(JSON.stringify(sectionOptions));
      this.masterList = sections.filter(x => !x.isSelected); 
    this.onsectionChange(section, i);
  }
  dummyGetSelectedSectionData(section, i) {
    let res = this.allSections.find(x => x.sectionNumber === i);
    if (res !== undefined) {
      this.allSections.find(x => x.sectionNumber === i).isSelected = false;
      this.allSections.find(x => x.sectionNumber === i).sectionNumber = -1;
    }
    if (section.name !== 'Select section') {
      this.allSections.find(x => x.name === section.name).sectionNumber = i;
      this.allSections.find(x => x.name === section.name).isSelected = true;
      if (section.name.indexOf('Graph') > -1) {
        this.allSections.find(x => x.sectionNumber === i).isSelected = false;
        this.allSections.find(x => x.sectionNumber === i).sectionNumber = -1;
      }
    }
  }
  removeGraphValidation() {
    this.allSections.forEach((o, _i) => {
      if (o.name.indexOf('Graph') > -1) {
        o.isSelected = false;
        o.sectionNumber = -1;
        return o;
      }
    });
  }
  delete(i) {
    this.removeControl(i);
    this.resetSelections(i);
  }
  resetSelections(i) {
    if (this.allSections.find(x => x.sectionNumber === i) !== undefined) {
     
      let sectionOption = this.allSections.find(x => x.sectionNumber === i);
      sectionOption.isSelected = false;
      sectionOption.sectionNumber = -1;
      let sectionOptions = this.allSections.filter(x=>x.isActive);
      let sections = JSON.parse(JSON.stringify(sectionOptions));
      this.masterList = sections.filter(x => !x.isSelected);
    }
  }

  isindexwiseItems(masterList): any[] {
    let result = masterList.filter(function (o1) {
      return !this.notindexs.some(function (o2) {
        return o1.id === o2.id;
      });
    }).map(function (o) {
      return this.props.reduce(function (newo, name) {
        newo[name] = o[name];
        return newo;
      }, {});
    });

    return result;
  }

  removeMasterList(section: any) {
    let index = this.masterList.findIndex(function (o) {
      return o.id === section.id;
    })
    if (index !== -1) this.masterList.splice(index, 1);
  }

  addMasterList(section: any) {
    let index = this.masterList.findIndex(function (o) {
      return o.id === section.id;
    });
    if (index === -1) {
      this.masterList.push(this.masterListClone.filter((o: any) => o.id === section.id)[0])
    }
  }

  radiotextClick(item: any) {
    if (item == '2') {
      this.selection = 'N';
    }
    this.SetDisableConfirmSave();
  }
  getAllReportTemplates() {
    this.isLoader = true;
    let prevSelectedTemplate = this.selectedTemplate;
    this.pageConfigurationService.getAllReportTemplates()
      .subscribe({
        next:(result) => {
          let defaulttemplate = result.filter((el) => {
            return el.name === TemplateSections.Default && el.isActive === false;
          });
          let activetemplate = result.filter((el) => {
            return el.isActive === true;
          })
          if (defaulttemplate != null && defaulttemplate.length > 0) {
            if (activetemplate.length > 0)
              defaulttemplate[0].icon = "FeedbackStarGrey.svg";
            else
              defaulttemplate[0].icon = "FeedbackStarBlue.svg";
            this.allTemplates.push(defaulttemplate[0])
            this.selectedTemplate = defaulttemplate[0];
            this.activeTemplateName = defaulttemplate[0].name;
          }
          if (activetemplate != null && activetemplate.length > 0) {
            if (activetemplate.length > 0)
              activetemplate[0].icon = "FeedbackStarBlue.svg";
            this.allTemplates.push(activetemplate[0]);
            this.selectedTemplate = activetemplate[0];
            this.clonetemplateName = activetemplate[0];
            this.activeTemplateName = activetemplate[0].name;
          }
          let inactivetemplate = result.filter((el) => {
            return el.isActive === false && el.name !== TemplateSections.Default;
          });
          if (inactivetemplate != null && inactivetemplate.length > 0) {
            inactivetemplate.forEach(element => {
              this.allTemplates.push(element)
            });
          }
          if (this.configObj.Status === ReportTemplateConstants.Rename) {
            let template = this.allTemplates.find(x => x.id === prevSelectedTemplate.id)
            this.selectedTemplate = template;
            this.clonetemplateName = template;
            this.activeTemplateName = template.name;
          }
          this.actionsDropDownDisable();
          let selectedSection: any = this.selectedTemplate;
          if (this.tempaddTemplate != '') {
            let obj: any = this.allTemplates.filter(x => x.name === this.tempaddTemplate)[0];
            this.selectedTemplate = { name: obj.name, id: obj.id };
            this.clonetemplateName = this.selectedTemplate;
            this.isCopyArrayOriginalLength = [];
            selectedSection = obj;
          }
          if (this.selectedTemplate.name != TemplateSections.Default)
            this.dynamicallyLoadSelectionitems();
          else
            this.resetcntrl();
          this.actionsDropDownDisable();
          this.isLoader = false;
          if (selectedSection != null) {
            this.statusWiseLoadActions(selectedSection.isActive);
          }
        }, error:_error => {
          this.isLoader = false;
        }});
  }

  resetcntrl() {
    for (let i = 0; i < this.dargItems.length; i++) {
      this.removeControl(this.dargItems[i] - 1);
      this.resetSelections(i);
    }
    const arr = <FormArray>this.dragForm.controls?.items;
    if(arr != undefined)
     arr.controls = []
    let frmArray = this.dragForm?.get('items') as FormArray;
    frmArray.clear();
    this.isOriginalLength = 0;
    this.dynamicallyLoadSelectionitems();
  }
  ischecksections(): boolean {
    this.arrayitems = [];
    if (this.dragForm.get('items')?.value?.length > 0) {
      let controls = [];
      controls = this.dragForm.get('items')?.value;
      controls.forEach((element, index) => {
        if ((element?.actionname != '' && element?.actionname?.name != 'Select section') || (element?.period != 'Select Period' && element?.period != '') || (element?.graphlineitem != '')
        || (element?.justify != '')|| (element?.justifyLogo != '')) {
          this.arrayitems.push(index + 1);
        }
      });
    }
    if (this.arrayitems.length != this.isOriginalLength && (this.arrayitems.length > 0) || (this.isArrayOriginalLength.length > 0))
      return true;
    else return false;
  }

  submitActions(_f: any) {
    if (this.userExists(this.templateName) && this.selection == "N") {
      this.isexits = true;
      return true
    }
    if (this.selection == "U") {
      if (this.clonetemplateName.name != this.templateName) {
        if (this.userExists(this.templateName)) {
          this.isexits = true;
          return true
        }
      }
    }

    if (this.dragForm.get('items').value.length > 0) {
      let controls = [];
      if (this.selection == "N")
        this.tempaddTemplate = this.templateName;
      else
        this.tempaddTemplate = '';
      this.templatedetails = <TemplateDetails>{};
      this.templatedetails.Template = this.templateName;
      this.templatedetails.Selection = this.selection;
      this.templatedetails.Action = this.selectedAction.name;
      if (this.selection != "N")
        this.templatedetails.TemplateId = +this.selectedTemplate.id;
      this.templatedetails.items = [];
      controls = this.dragForm.get('items').value;
      controls.forEach((element, index) => {
        if (element.actionname != '' && element.actionname.name != 'Select section') {
          this.itemsObj = <ItemDetails>{};
          this.itemsObj.id = element.actionname.id;
          this.itemsObj.name = element.actionname.name;
          this.itemsObj.order = index + 1;
          this.itemsObj.oldcount = element.count;
          this.itemsObj.alignment = element.justify;
          this.itemsObj.alignmentLogo = element.justifyLogo;
          if (element.period != '' && element.period != 'Select Period')
            this.itemsObj.period = element.period.name;
          if (element.kpilineitem != '' && element.kpilineitem.length > 0 && element.name !== TemplateSections.CompanyFinancials) {
            let item = '';
            element.kpilineitem.forEach((items, _index) => {
              if (items != undefined)
                item += items.id + ',';
            });
            if (item != '')
              item = item.slice(0, -1);
            this.itemsObj.kpiId = item;
          }
          if (element.kpilineitem != '' && element.kpilineitem.length > 0 && element.actionname.name === TemplateSections.CompanyFinancials) {
            let item = '';
            let financialKpis = '';
            element.kpilineitem.forEach((items, _index) => {
              if (items != undefined)
                financialKpis += items.financialKpiId + ',';
              if (items != undefined)
                item += items.id + ',';
            });
            if (item != '')
              item = item.slice(0, -1);
            if (financialKpis != '')
              financialKpis = financialKpis.slice(0, -1);
            this.itemsObj.kpiId = item;
            this.itemsObj.financialKpis = financialKpis;
          }
          if (element.graphlineitem != '' && element.graphlineitem != null) {
            this.itemsObj.kpiId = element.graphlineitem.id.toString();
          }
          this.itemsObj.footnote = !(element.footnote === undefined||element.footnote === false);
          this.templatedetails.items.push(this.itemsObj);
        }
      });

      if (this.templatedetails.items.length > 0) {
        this.pageConfigurationService.savetemplate(this.templatedetails).subscribe((res: any) => {
          this.resetcntrl();
          let msg = "updated";
          if (this.selection == "N")
            msg = "created";
          if (res.code == "OK")
            this.toastrService.success(`LP Report template ${msg} successfully`, "", { positionClass: "toast-center-center" });
          this.onClose();
          this.allTemplates = [];
          this.getAllReportTemplates();
        })
      } else {
        this.toastrService.error('At least choose one section.!', "", { positionClass: "toast-center-center" });
        this.onClose();
      }
    }
  }
  userExists(templateName) {
      return this.allTemplates.some(function (el) {
      return el.name === templateName;
    });
  }

  deSelecterror(selection) {
    if (selection != undefined)
      this.issection = false
    else
      this.issection = true;
  }

  GetSelectedTemplate(selectedTemplate) {
    if (selectedTemplate != null) {
      this.selectedTemplate = selectedTemplate;
      this.clonetemplateName = selectedTemplate;
      if (this.selectedTemplate.name != TemplateSections.Default) {
        this.resetcntrl();
        this.dynamicallyLoadSelectionitems();
      }
      else
        this.resetcntrl();
      this.actionsDropDownDisable();
      this.statusWiseLoadActions(selectedTemplate.isActive);
    }
  }
  statusWiseLoadActions(status: any) {
    this.actions = [];
    if (!status)
      this.actions = this.arrayNotIncludesFilter(['Set as Inactive'], GetReportTemplateActions());
    else
      this.actions = this.arrayNotIncludesFilter(['Set as Active'], GetReportTemplateActions());
  }
  ExecuteAction(selectedAction: any) {
    let status = selectedAction.status;
    this.tempaddTemplate = '';
    if (this.selectedTemplate.name != TemplateSections.Default && status != "") {
      this.configObj = <any>{};
      this.configObj.TemplateId = this.selectedTemplate.id;
      this.configObj.Status = selectedAction.name;
      this.configObj.TemplateName = this.selectedTemplate.name;
      this.templateName = this.selectedTemplate.name;
      this.tName = this.selectedTemplate.name;
      switch (selectedAction.name) {
        case ReportTemplateConstants.Active: case ReportTemplateConstants.InActive:
          {
            this.isPopup = true;
            this.modalTitle = "Confirmation"
            this.disableRenameConfirm = false;
          }
          break;
        case ReportTemplateConstants.Rename:
          {
            this.isPopup = true;
            this.modalTitle = "Rename template"
          }
          break;
        case ReportTemplateConstants.Delete:
          {
            this.isPopup = true;
            this.modalTitle = "Delete template"
            this.disableRenameConfirm = false;
          }
          break;
        default:
          this.isPopup = false;
      }
    }
  }
  OnConfig(_e: any) {
    this.configurationRequest();
  }
  OnCancel(_e: any) {
    this.isPopup = false;
    this.selectedAction = { name: ReportTemplateConstants.Action };
  }
  configurationRequest() {
    this.configObj.TemplateName = this.templateName;
    this.pageConfigurationService.lptemplateConfig(this.configObj).subscribe((res: any) => {
      this.allTemplates = [];
      this.getAllReportTemplates();
      if (res != null) {
        if (res.code == "OK") {
          this.isPopup = false;
          let status = this.configObj.Status == 'I' ? "inactivated" : "activated"
          if (this.configObj.Status == ReportTemplateConstants.Active)
            this.toastrService.success(`LP Report template ${status} successfully`, "", { positionClass: "toast-center-center" });
          if (this.configObj.Status == ReportTemplateConstants.InActive)
            this.toastrService.success('Default LP Report template activated', "", { positionClass: "toast-center-center" });
          if (this.configObj.Status == ReportTemplateConstants.Rename) {
            this.toastrService.success('Selected template renamed successfully', "", { positionClass: "toast-center" });
          }
          if (this.configObj.Status == ReportTemplateConstants.Delete) {
            this.toastrService.success('Selected template deleted successfully', "", { positionClass: "toast-center" });
          }
          this.selectedAction = { name: ReportTemplateConstants.Action };
        }
      } else
        this.isPopup = false;
    });
  }
  actionsDropDownDisable() {
    this.isAction = false;
    if (this.selectedTemplate.name != null)
      if (this.selectedTemplate.name == TemplateSections.Default)
        this.isAction = true;
  }
  dynamicallyLoadSelectionitems() {
    if (this.selectedTemplate.id != "") {
      this.mappingKpis_List();
      this.isLoader = true;
      this.pageConfigurationService.lpReportSectionItems(this.selectedTemplate.id).subscribe({next:(res: any) => {
        if (res != null) {
          this.templatedetails = res;
          this.isCopyArrayOriginalLength = [];
          this.isLoader = true;
          setTimeout(() => {
            this.dynamicCreateReactiveFormLoadTemplates(res);
          }, 3000);
        }
      }, error:_error => {
        this.isLoader = false;
      }});
    }
  }
  dynamicCreateReactiveFormLoadTemplates(templatedetails) {
    this.dragForm.removeControl("items");
    this.dragForm.addControl("items", this.fb.array([]));
    const items = this.dragForm.controls.items as FormArray;
    if (templatedetails.items != null) {
      if (templatedetails.items.length > 0) {
        this.isOriginalLength = templatedetails.items.length;
        for (let j = 0; j < templatedetails.items.length; j++) {
          let newGroup = this.fb.group({
          });
          let tempArray = new Array();
          let objActionItem: any = this.searchObject(templatedetails.items[j].name, this.allSections, "name");
          this.isCopyArrayOriginalLength.push("S" + objActionItem.id);
          let objPeriod = this.searchObject(templatedetails.items[j].period, this.periodTypesCopy, "name");
          let graphLineItem = '';
          if (objPeriod == undefined)
            objPeriod = { name: 'Select Period' };
          if (objPeriod.name != '' && objPeriod.name != 'Select Period')
            this.isCopyArrayOriginalLength.push(templatedetails.items[j].name + objPeriod.name);
          if (templatedetails.items[j].name == TemplateSections.InvestmentGraph) {
            if (this.kPI_LineItems_List.investmentKpi == undefined) {
              this.kPI_LineItems_List.investmentKpi = this.cloneKpiLineItemList.investmentKpi;
            }
            graphLineItem = this.searchObject(+templatedetails.items[j].kpiid, this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.investmentKpi), "id");
            this.graphLineItemValidation(graphLineItem, objActionItem);
          }
          if (templatedetails.items[j].name == TemplateSections.OperationalGraph) {
            graphLineItem = this.searchObject(+templatedetails.items[j].kpiid, this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.operationalKpi), "id");
            this.graphLineItemValidation(graphLineItem, objActionItem);
          }
          if (templatedetails.items[j].name == TemplateSections.CreditGraph) {
            graphLineItem = this.searchObject(+templatedetails.items[j].kpiid, this.arrayNotIncludesInfo(this.restrictTextKpis, this.creditKPI_LineItems), "id");
            this.graphLineItemValidation(graphLineItem, objActionItem);
          }
          if (templatedetails.items[j].name == TemplateSections.CompanyGraph) {
            graphLineItem = this.searchObject(+templatedetails.items[j].kpiid, this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.companyKpi), "id");
            this.graphLineItemValidation(graphLineItem, objActionItem);
          }
          if (templatedetails.items[j].name == TemplateSections.TradingGraph) {
            graphLineItem = this.searchObject(+templatedetails.items[j].kpiid, this.arrayNotIncludesInfo(this.restrictTextKpis, this.kpiLineItemTradingRecords), "id");
            this.graphLineItemValidation(graphLineItem, objActionItem);
          }
          if (templatedetails.items[j].name == TemplateSections.ImpactGraph) {
            graphLineItem = this.searchObject(+templatedetails.items[j].kpiid, this.arrayNotIncludesInfo(this.restrictTextKpis, this.kPI_LineItems_List.impactKpi), "id");
            this.graphLineItemValidation(graphLineItem, objActionItem);
          }
          if (templatedetails.items[j].kpiid) {
            if (templatedetails.items[j].kpiid.indexOf(',') > -1)
              tempArray = templatedetails.items[j].kpiid.split(",");
            else
              tempArray = Array.from(templatedetails.items[j].kpiid);
          }
          if (templatedetails.items[j].name == TemplateSections.InvestmentTable) {
            tempArray = this.findMultiSelectKPI(tempArray, this.cloneKpiLineItemList.investmentKpi, objActionItem, "N");
            this.isCopyArrayOriginalLength.push('In'+j+'-'+templatedetails.items[j].footNote);
          }
          if (templatedetails.items[j].name == TemplateSections.OperationalTable) {
            tempArray = this.findMultiSelectKPI(tempArray, this.kPI_LineItems_List.operationalKpi, objActionItem, "N");
            this.isCopyArrayOriginalLength.push('O'+j+'-'+templatedetails.items[j].footNote);
          }
          if (templatedetails.items[j].name == TemplateSections.CreditTable) {
            tempArray = this.findMultiSelectKPI(tempArray, this.creditKPI_LineItems, objActionItem, "N");
            this.isCopyArrayOriginalLength.push('Cr'+j+'-'+templatedetails.items[j].footNote);
          }
          if (templatedetails.items[j].name == TemplateSections.CompanyTable) {
            tempArray = this.findMultiSelectKPI(tempArray, this.kPI_LineItems_List.companyKpi, objActionItem, "N");
            this.isCopyArrayOriginalLength.push('Co'+j+'-'+templatedetails.items[j].footNote);
          }
          if (templatedetails.items[j].name == TemplateSections.TradingTable) {
            tempArray = this.findMultiSelectKPI(tempArray, this.kpiLineItemTradingRecords, objActionItem, "N");
            this.isCopyArrayOriginalLength.push('T'+j+'-'+templatedetails.items[j].footNote);
          }
          if (templatedetails.items[j].name == TemplateSections.ImpactTable) {
            tempArray = this.findMultiSelectKPI(tempArray, this.kPI_LineItems_List.impactKpi, objActionItem, "N");
            this.isCopyArrayOriginalLength.push('I'+j+'-'+templatedetails.items[j].footNote);
          }
          if (templatedetails.items[j].name == TemplateSections.CompanyFinancials) {
            tempArray = this.findMultiSelectKPI(tempArray, this.kPI_LineItems_List.financialKpis, objActionItem, "Financial");
            this.isCopyArrayOriginalLength.push('C'+j+'-'+templatedetails.items[j].footNote);
          }         
          this.isCopyArrayOriginalLength.push('justify'+j+'-'+templatedetails.items[j].alignment);
          this.isCopyArrayOriginalLength.push('justifyLogo'+j+'-'+templatedetails.items[j].alignmentLogo);
          newGroup.addControl('count', new FormControl(j + 1));
          newGroup.addControl('justify', new FormControl(templatedetails.items[j].alignment));
          newGroup.addControl('justifyLogo', new FormControl(templatedetails.items[j].alignmentLogo));
          newGroup.addControl('period', new FormControl(objPeriod));
          newGroup.addControl('kpilineitem', new FormControl(tempArray));
          newGroup.addControl('footnote', new FormControl(templatedetails.items[j].footNote));
          newGroup.addControl('graphlineitem', new FormControl(graphLineItem));
          newGroup.addControl('actionname', new FormControl(objActionItem));
          items.push(newGroup);
          this.GetSelectedSectionData(objActionItem, j);
          this.removeGraphValidation();
        }
        this.isLoader = false;
        this.isArrayOriginalLength = [];
        this.ischecksections();
      } else
        this.isLoader = false;
    } else
      this.isLoader = false;
  }
  graphLineItemValidation(graphArray, action) {
    if (graphArray != null && graphArray != undefined) {
      this.isCopyArrayOriginalLength.push(action.name + graphArray.id);
    }
  }
  findMultiSelectKPI(tempArray, kpiarray, action, section) {
    let result = [];
    if (kpiarray != undefined) {
      tempArray.map((item) => {
        const matchedObject = kpiarray.find(
          (option) => option.id === +item
        );
        if (section != "Financial") {
          if (matchedObject != undefined)
            this.isCopyArrayOriginalLength.push(action.name + matchedObject.id)
        }
        else
          this.isCopyArrayOriginalLength.push(matchedObject.financialKpiId)
        result.push(matchedObject);
      });
    }
    return result;
  }
  searchObject(nameKey, myArray=[], searchby) {
    for (let i = 0; i < myArray.length; i++) {
      if (searchby == "name") {
        if (myArray[i].name === nameKey) {
          return myArray[i];
        }
      }
      if (searchby == "id") {
        if (myArray[i].id === nameKey) {
          return myArray[i];
        }
      }
    }
  }
  setDisableRenameConfirm() {
    if (this.templateName !== "" && !this.isexits && this.templateName !== this.tName) {
      this.disableRenameConfirm = false;
    } else {
      this.disableRenameConfirm = true;
    }
  }
}