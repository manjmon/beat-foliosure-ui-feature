import { Component, OnInit, OnChanges, ChangeDetectorRef, SimpleChanges, Input, QueryList, ViewChildren } from '@angular/core';
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { ImpliedEvService } from "src/app/services/implied-ev.service";
import { NumberDecimalConst } from "src/app/common/constants";
import { AdjustmentType } from "../../../shared/adjustment-types";
import { ValuationType } from "../../../shared/valuation-type.enum";
import { ValuationCalclation } from "../../../shared/valuation-calculation";
import { ToastrService } from "ngx-toastr";
import { ImpliedEvValue, ImpliedEvFinalValue } from "src/app/components/Valuation-Model/interface/interface"
import { ValuationModelService } from "src/app/services/valuation-model.service"
import { ValuationChangesGuard } from "../../../shared/valuation-changes-guard";
import { TypeAheadControlComponent } from "src/app/components/custom-controls/typeahead-control.component";

@Component({
  selector: 'app-adjustment-details',
  templateUrl: './adjustment-details.component.html',
  styleUrls: ['./adjustment-details.component.scss']
})
export class AdjustmentDetailsComponent implements OnInit, OnChanges {

  @Input() selectedCompany: any;
  @Input() quarterAndYear: any;
  valuationType: typeof ValuationType = ValuationType;
  valuationCalclation: typeof ValuationCalclation = ValuationCalclation;
  copmValues: any;
  adjustmentType: typeof AdjustmentType = AdjustmentType;
  rowHeader: any;
  frozenColsCompValue: any = [{ field: 'Comps Value', header: 'Comps Value' }];
  frozenColsKpi: any = [{ field: "TargetCompanyKPI", header: "Target Company  Metrics" }];
  frozenColumnsFinal: any = [{ field: "CalculatedValues", header: "Calculated Values" }];
  NumberDecimalConst = NumberDecimalConst;
  disableCalculate = true;
  selectedAdjustmentType = 100;
  adjustmentFactor: number;
  txtAdjFactorDisabled = true;
  transactionSelected: any;
  selectedTabName: number = this.valuationType.TradingComps;
  valuationId: number;
  valuationReportId: string;
  selectedKpi: any;
  kpiValuesToBeSent = [];
  finalValueToBeSent = [];
  targetCompanyKpiData: any = [];
  finalImpliedEvData: any = [];
  selectedAttribute: string;
  selectedYear: string;
  canDeactivateStatus: boolean = true;
  selectedKpiName: string;
  dropdownvalue: any = []
  savedAdjustmentFactor: {
    hasValue: boolean,
    adjType: number,
    adjFactor: any
  };
  kpiFirstName: string;
  kpiLastName: string;
  unSelectedRecords: {
    recordIds: [],
    kpiId: number
  }[];
  loading: boolean = false;
  impliedEvOriginalDS: any;
  adjustmentTypes = [
    {
      name: "At Par",
      id: this.adjustmentType.AtPar,
    },
    {
      name: "Discount",
      id: this.adjustmentType.Discount,
    },
    {
      name: "Premium",
      id: this.adjustmentType.Premium,
    }
  ];
  subscriptions: any = [];
  isUnsavedData: boolean = false;
  internalSelectedTab: any;
  checkBoxList: any[] = [];
  dropdownValuesArray: any[] = [];
  equityValuationSaveRequest: any;
  isEquityDataSaved: boolean = false;
  haschange:boolean= false;
  onClickbtn:boolean = true;
  @ViewChildren(TypeAheadControlComponent) childrenDdlComponent: QueryList<TypeAheadControlComponent>;

  constructor(private toastrService: ToastrService, protected changeDetectorRef: ChangeDetectorRef, private _impliedEvService: ImpliedEvService, private _valuationModelService: ValuationModelService,
    private _valuationChangesGuard: ValuationChangesGuard) {
    this.subscriptions.push(this._impliedEvService.checkBoxState$.subscribe((checked: boolean) => {
      let selectedAttribute=this.equityValuationSaveRequest?.AttributeType
      if (!checked && selectedAttribute!='' ) {
        this.isUnsavedData = true;
        this.disableCalBtnEventHandler(false);
        this._impliedEvService.setCheckBoxStateSubject(true);
        setTimeout(() => {
          this.updateCompsTableValues(this.adjustmentFactor)
        }, 500);
      }
      else if ((!checked) && (selectedAttribute == '')) {
        this.disableCalBtnEventHandler(true);
        setTimeout(() => {
          this.updateCompsTableValues(this.adjustmentFactor)
        }, 500);
      }
    }));
  this.subscriptions.push(this._impliedEvService.getTransactionSelectedTab().subscribe(tab => {
      if (tab != null) {
        this.selectedTabName = tab.id;
      }
    }));

    this.subscriptions.push(this._impliedEvService.getInternalSelectedTabName().subscribe(tab => {
      this.internalSelectedTab = tab;
    }));
  }

  getValue(value) {
    return [null, "NA", "", undefined].includes(value) ? 0 : value;
  }

  ngOnInit(): void {
    this.getVAluationIds();
    
    this.subscriptions.push(this._impliedEvService.getdropdownValues().subscribe(selectedKpi => {
      this.selectedKpi = selectedKpi;
      this.selectedKpiName = selectedKpi['kpiName'];
      this.updateCompsTableValues(this.adjustmentFactor);
    }));
    this.copmValues = this.getImpliedEvValue();
    this.getSelectedKpiRenamePeriod();
    this.subscriptions.push(this._impliedEvService.getHeaders().subscribe(headers => {
      this.rowHeader = headers;
      this.createDataRow();
      if (this.checkIfUnsaveChangesAvailable()) {
        this.applyUnsavedChanges();
      }
      else {
        this.getSavedImpledEvDetails().then(res => {
          this.updateCompsTableValues(this.adjustmentFactor);
        });
      }
    }));

    this.subscriptions.push(this._impliedEvService.getsEquityValuation().subscribe(result => {
      if (result !== null || result !== undefined) {
        let request = {
          ValuationId: this.valuationId === undefined ? result.valuationId : this.valuationId,
          KpiId: this.selectedKpi === undefined ? 0 : this.selectedKpi['kpiId'],
          NetDebt: this.getValue(result.netDebt),
          PrefferedEquity: this.getValue(result.preferredEquity),
          MinorityInterest: this.getValue(result.minorityInterest),
          Other: this.getValue(result.otherValue),
          FundOwnership: this.getValue(result.fundOwnership),
          AttributeType: [null, "NA", "", undefined].includes(result.selectedAttribute?.header) ? "" : result.selectedAttribute?.header,
          AttributeValue: this.getValue(result?.finalvalue),
          AttributeYear: this.getValue(result.selectedYear?.year),
          CompanyEquityValue: this.getValue(result.grandTotal),
          FairValue: this.getValue(result.GetFinalfairValue),
        }
        this.equityValuationSaveRequest = request;
      }
      
    }));
  }

  applyUnsavedChanges() {
    let tempEVData = JSON.parse(localStorage.getItem("tempEVData"));
    if (tempEVData != null || tempEVData != undefined) {
      if (tempEVData.kpiId === this.selectedKpi['kpiId']) {
        this.copmValues = tempEVData.copmValues;
        this.adjustmentFactor = tempEVData.adjustmentFactor;
        this.selectedAdjustmentType = tempEVData.selectedAdjustmentType;
        this.targetCompanyKpiData = tempEVData.targetCompanyKpiData;
        this.finalImpliedEvData = tempEVData.finalImpliedEvData;
        setTimeout(() => {
          this.disableCalculate = tempEVData.disableCalculate;
        }, 100);
        this.checkBoxList = tempEVData.checkBoxList;
      }
      this.disabledAdjustmentFactor();
      this.enableAdjustmentFactor();
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.internalSelectedTab.id !== this.valuationType.Valuations && this.isUnsavedData) {
      this.saveUnsavedDataTemporary();
    }
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  saveUnsavedDataTemporary() {
    let tempEVData = {
      copmValues: this.copmValues,
      adjustmentFactor: this.adjustmentFactor,
      selectedAdjustmentType: this.selectedAdjustmentType,
      targetCompanyKpiData: this.targetCompanyKpiData,
      finalImpliedEvData: this.finalImpliedEvData,
      disableCalculate: this.disableCalculate,
      checkBoxList: [],
      kpiId: this.selectedKpi['kpiId']
    }
    localStorage.setItem("tempEVData", JSON.stringify(tempEVData));
  }

  removeTempUnsavedData() {
    localStorage.removeItem("tempEVData");
  }

  prepareGetTargetKpiModel() {
    let kpiName = (this.selectedKpi['kpiName'] || "") === "CF" ? "cash at the end of the year" : this.selectedKpi['kpiName'];
    let requestModel = {
      CompanyId: this.selectedCompany?.companyId,
      AsOnMonthLTM: this.valuationCalclation.prepareAsOnMonth(this.quarterAndYear, "LTM"),
      AsOnMonthNTM: this.valuationCalclation.prepareAsOnMonth(this.quarterAndYear, "NTM"),
      ModuleId: this.valuationCalclation.getfinancialkpi.find(f => f.financial == this.selectedKpi['kpiName'])?.moduleId ?? 0,
      KpiName: kpiName,
      Headers: this.rowHeader
    };
    return requestModel;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["adjustmentTableValues"]) {
      this.calculateFinalImpliedEvValues()
    }
  }

  resetAdjustmentComp() {
    this.selectedAdjustmentType = this.adjustmentType.AtPar;
    this.adjustmentFactor = null;
    this.copmValues = [];
    this.targetCompanyKpiData = [];
  }

  getUnselectedRecords() {
    this._impliedEvService.getUnselectedRecords().subscribe(response => {
      this.unSelectedRecords = response == null ? [] : response;
    });
  }

  getSavedImpledEvDetails(): Promise<boolean> {
    this.savedAdjustmentFactor = {
      hasValue: false, adjFactor: null, adjType: this.adjustmentType.AtPar
    };
    this.loading = true;
    return new Promise<boolean>((resolve, reject) => {
      this._impliedEvService.getEmpliedEvDetails(this.valuationId, this.valuationReportId, this.selectedKpi['kpiId']).subscribe(response => {
        if (response.hasDetails) {
          this.impliedEvOriginalDS = response;
          this.selectedAdjustmentType = response.adjustmentType;
          this.adjustmentFactor = response.adjustmentFactor == 0 ? null : response.adjustmentFactor;
          this.savedAdjustmentFactor = {
            hasValue: true, adjFactor: response.adjustmentFactor == 0 ? null : response.adjustmentFactor, adjType: response.adjustmentType
          };
          this.updateCompsTableValues(this.adjustmentFactor);
          this.disabledAdjustmentFactor();
          const emptyObjectTCK = new Object();
          this.targetCompanyKpiData = [];
          let request = this.prepareGetTargetKpiModel();
          this._impliedEvService.getTargetKpiValue(request).subscribe(res => {
            response?.targetCompanyKpi?.values?.forEach((kpi) => {
              emptyObjectTCK[kpi.periodName] = kpi.value;
              if ((kpi.periodName === "LTM" || kpi.periodName === "NTM" || kpi.periodName.includes("E")) && (kpi.value === null || kpi.value === '' || kpi.value === undefined || kpi.value === "NA")) {
                if (res[kpi.periodName] === null || res[kpi.periodName] === "null" || res[kpi.periodName] === "") {
                  emptyObjectTCK[kpi.periodName] = "NA";
                }
                else {
                  emptyObjectTCK[kpi.periodName] = res[kpi.periodName];
                }
              }
            });
          });
          this.targetCompanyKpiData.push(emptyObjectTCK);
          this.finalImpliedEvData = [];
          response?.finalValues?.forEach((finalValue) => {
            const emptyObjectFD = new Object();
            emptyObjectFD["title"] = finalValue.title;
            finalValue?.values?.forEach(fv => {
              emptyObjectFD[fv.periodName] = fv.value;
            });
            this.finalImpliedEvData.push(emptyObjectFD);
          });
        }
        else {
          this.copmValues = this.getImpliedEvValue();
          this.selectedAdjustmentType = this.adjustmentType.AtPar;
          this.adjustmentFactor = null;
          if (this.targetCompanyKpiData) {
            let request = this.prepareGetTargetKpiModel();
            this._impliedEvService.getTargetKpiValue(request).subscribe(res => {
              this.rowHeader.forEach((head) => {
                if (head.field === "LTM" || head.field === "NTM" || head.field.includes("E")) {
                  if (res[head.field] === null || res[head.field] === "null" || res[head.field] === "") {
                    this.targetCompanyKpiData[0][head.field] = "NA";
                  }
                  else {
                    this.targetCompanyKpiData[0][head.field] = res[head.field];
                  }
                };
              });
            });
          }
          if (this.finalImpliedEvData) {
            this.finalImpliedEvData.forEach(x => {
              let res = ValuationCalclation.getfinancialkpi.find(f => f.financial == this.selectedKpi['kpiName']);
              x['title'] = x['title'].includes('Mean') ? res.ImpliedEvMeanName : res.ImpliedEvMedianName;
              this.rowHeader.forEach((head) => {
                x[head.field] = '';
              });
            });
          }
        }
        this.disabledAdjustmentFactor();
        this.loading = false;
        resolve(true);
      });
    });
  }

  getVAluationIds() {
    this._impliedEvService.getValuationId().subscribe(response => {
      this.valuationId = response['id'];
      this.valuationReportId = response['reportId'];
    });
  }

  IsEditMode(): boolean {
    let res: boolean = true;
    if (this.selectedAdjustmentType === this.adjustmentType.AtPar) {
      res = false;
    }
    else if (this.adjustmentFactor > 0 && (this.selectedAdjustmentType === this.adjustmentType.Discount
      || this.selectedAdjustmentType === this.adjustmentType.Premium)) {
      res = false;
    }

    if (this.disableCalculate) {
      this.disableCalculate = res;
    }
    return this.disableCalculate;
  }

  validateAdjustmentField(): boolean {
    let res: boolean = false;
    if (this.selectedAdjustmentType === this.adjustmentType.AtPar) {
      res = true;
    }
    else if (this.adjustmentFactor > 0 && (this.selectedAdjustmentType === this.adjustmentType.Discount
      || this.selectedAdjustmentType === this.adjustmentType.Premium)) {
      res = true;
    }
    return res;
  }

  getImpliedEvValue() {
    return this._impliedEvService.getCopmValues();
  }

  onAdjustmentTypeChanged() {
    this.isUnsavedData = true;
    document.getElementById('lblMessage').innerHTML = "";
    let txt = document.getElementById('txtadjfactor') as HTMLInputElement;

    let lblAsterik = document.getElementById('lblAsterik');
    this.disabledAdjustmentFactor();

    this.adjustmentFactor = null;
    if (this.selectedAdjustmentType == this.adjustmentType.AtPar) {
      this.copmValues = this.getImpliedEvValue();
      this.txtAdjFactorDisabled = true;
      lblAsterik.style.setProperty("display", "none");
    }
    else {
      this.txtAdjFactorDisabled = false;
      lblAsterik.style.setProperty("display", "block");
      lblAsterik.style.setProperty("color", "red");
      this.copmValues = this.getImpliedEvValue();
      if (this.savedAdjustmentFactor?.hasValue && this.savedAdjustmentFactor?.adjType === this.selectedAdjustmentType) {
        this.adjustmentFactor = Number(parseFloat(this.savedAdjustmentFactor.adjFactor).toFixed(1));
      }
      else {
        txt.value = '';
      }
    }
    this.updateCompsTableValues(this.adjustmentFactor);
  }

  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  disabledAdjustmentFactor() {
    let txtpercentage = document.getElementById('txtadjfactor');
    let divpercentage = document.getElementById('divadjustment');
    let lblAsterik = document.getElementById('lblAsterik');
    if (this.selectedAdjustmentType == this.adjustmentType.AtPar) {
      if (txtpercentage !== null) {
        txtpercentage.className = "textbox-disable";
        txtpercentage.className = 'form-control';
        txtpercentage.style.setProperty("cursor", "not-allowed");
        txtpercentage.setAttribute("disabled", "true");
      }
      if (divpercentage !== null) {
        divpercentage.className = "textbox-disable";
      }
      if (lblAsterik !== null) {
        lblAsterik.style.setProperty("display", "none");
      }
      this.disableCalculate = this.validateAdjustmentField();
    }
    else {
      this.disableCalculate = true;
      if (txtpercentage !== null) {
        txtpercentage.className = '';
        txtpercentage.className = 'form-control';
        txtpercentage.style.setProperty("cursor", "auto");
        txtpercentage.removeAttribute("disabled");
      }
      if (divpercentage !== null) {
        divpercentage.className = '';
      }
      if (lblAsterik !== null) {
        lblAsterik.style.setProperty("display", "block");
        lblAsterik.style.setProperty("color", "red");
      }
    }
  }

  validateAdjustmentFactor(event: any) {
    this.isUnsavedData = true;
    let currentValue = event.target.value;
    const regExp = /^-?\d+(?:,\d+)*(?:\.\d+)?$/;
    if (!regExp.test(currentValue)) {
      this.disableCalculate = true;
      this._valuationModelService.setRedirectionStatus(this.disableCalculate);
      event.target.value =  currentValue.replace(/[^-\d.]/g, '');
      this.updateCompsTableValues(this.adjustmentFactor);
      this.adjustmentFactor = null;
      return false;
    }
    currentValue = parseFloat(event.target.value);
    if ((this.selectedAdjustmentType == this.adjustmentType.Discount && currentValue > 100) || currentValue < 0) {
      this.adjustmentFactor = null;
      event.target.value = null;
      if (this.savedAdjustmentFactor.hasValue && this.savedAdjustmentFactor.adjType === this.selectedAdjustmentType) {
        this.adjustmentFactor = this.savedAdjustmentFactor.adjFactor;
        event.target.value = parseFloat(this.savedAdjustmentFactor.adjFactor).toFixed(1);
      }
      this.updateCompsTableValues(this.adjustmentFactor);
      return false;
    }
    else {
      this.adjustmentFactor = event.target.value;
      event.target.value = parseFloat(event.target.value).toFixed(1);
      this.disableCalculate = false;
      let selectedAttribute = this.equityValuationSaveRequest?.AttributeType
      if (this.adjustmentFactor && selectedAttribute != '') {
        this.disableCalBtnEventHandler(false);
      }
      else if (this.adjustmentFactor && selectedAttribute == '') {
        this.disableCalBtnEventHandler(true);
      }
      if (this.adjustmentFactor)
        this._valuationModelService.setRedirectionStatus(this.disableCalculate);
      this.updateCompsTableValues(this.adjustmentFactor);
      return true;
    }
  }

  disableCalBtnEventHandler(event: boolean) {
    let validateAdjustmentField = !this.validateAdjustmentField();
    this.disableCalculate = event || validateAdjustmentField;
    this._valuationModelService.setRedirectionStatus(this.disableCalculate);

  }

  createDataRow() {
    this.targetCompanyKpiData = [];
    this.dropdownValuesArray = [];
    this.rowHeader = this.rowHeader.map((item, index) => ({
      header: item.header,
      field: item.field,
      editable: true,
    }));
    const emptyObject = new Object();
    this.rowHeader.forEach((itemValue) => {
      emptyObject[itemValue.header] = null;
    });

    this.targetCompanyKpiData.push(emptyObject);
    this.calculateFinalImpliedEvValues();
  }
  validateMaxLength(event: any): boolean {
    if (!Number.isInteger(Number(event.target.value))) {
      if (event.target.value.length == 21) return false;
    } else {
      if (event.target.value.length == 16) return false;
    }
    return true;
  }

  setNAValue(event, colIndex: number, col: any, rowIndex: number) {
    this.targetCompanyKpiData[rowIndex][col] = event.target.value == '' ? 'NA' : event.target.value;
  }

  onKpiInputChangeEvent(event: any, colIndex: any, col: any, rowIndex: number) {
   
    this.isUnsavedData = true;
    this.setNAValue(event, colIndex, col, rowIndex);
    this.calculateFinalImpliedEvValues();
    let txtValue = event.target.value;
    let selectedAttribute=this.equityValuationSaveRequest?.AttributeType
    if ((txtValue && txtValue.length > 0) && (selectedAttribute != '')) {
      this.disableCalBtnEventHandler(false);
    }
    else if ((txtValue && txtValue.length > 0) && (selectedAttribute == '')) {
      this.disableCalBtnEventHandler(true);
    }
    else {
      if ((Object.values(this.targetCompanyKpiData[0]) || []).some(x => x != null)) {
        this.disableCalBtnEventHandler(false);
      }
    }
  }
  getSelectedKpiRenamePeriod() {
    let res = ValuationCalclation.getfinancialkpi.find(f => f.financial == this.selectedKpi['kpiName']);
    let selectedKpiName = res.kpiName;
    let kpiPcf = this.valuationCalclation.getfinancialkpi[5].kpiName;
    let kpiPe = this.valuationCalclation.getfinancialkpi[6].kpiName;
    let kpiPb = this.valuationCalclation.getfinancialkpi[7].kpiName;

    if (selectedKpiName != kpiPcf && selectedKpiName != kpiPe && selectedKpiName != kpiPb) {
      if (selectedKpiName !== undefined) {
        let period = selectedKpiName.split('/');
        if (period !== undefined) {
          let FirstName = period[0].concat("/");
          let LastName = period[1];
          this.kpiFirstName = FirstName;
          this.kpiLastName = LastName;
        }
      }
    }
    else {
      this.kpiFirstName = null;
      this.kpiLastName = null;
    }
  }
  calculateFinalImpliedEvValues() {
    this.getSelectedKpiRenamePeriod();
    let finalImpliedEvData = [];
    let res = ValuationCalclation.getfinancialkpi.find(f => f.financial == this.selectedKpi['kpiName']);
    const targetFinalObject = this.targetCompanyKpiData[0];
    if (!targetFinalObject) return;
    const adjustmentTableValues = this.copmValues;
    const local = this;
    if (!targetFinalObject) return;
    (adjustmentTableValues || []).forEach(function (item) {
      let tempObj = {};
      Object.keys(targetFinalObject).forEach(key => {
        tempObj[key] = null;
        let targetValue = targetFinalObject[key];
        let adjustedValue = item[key];
        if (local.isNumberCheck(targetValue) && local.isNumberCheck(adjustedValue)) {
          let calculatedVal = adjustedValue * targetValue;
          tempObj[key] = calculatedVal;
        }
      });
      switch (item.title) {
        case "Mean - Overall":
          tempObj['title'] = res?.ImpliedEvMeanName;
          break;
        case "Median - Overall":
          tempObj['title'] = res?.ImpliedEvMedianName; break;
      }

      finalImpliedEvData.push(tempObj);

    });
    this.finalImpliedEvData = finalImpliedEvData;
    this.kpiValuesToBeSent = targetFinalObject;
    this.finalValueToBeSent = this.finalImpliedEvData;
    this._impliedEvService.setUpdatedFinalImpliedEvData(this.finalImpliedEvData);
    return this.finalImpliedEvData;
  }

  calculateImpliedEVSave = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      this.updateCompsTableValues(this.adjustmentFactor);
      //maping response to request
      this.getUnselectedRecords();
      let isKpiIdChanged = this.impliedEvOriginalDS?.kpiId !== this.selectedKpi['kpiId'];
      let impliedEvRequestModel = {
        hasDetails: false,
        valuationId: this.valuationId,
        kpiId: this.selectedKpi['kpiId'],
        valuationReportId: this.valuationReportId,
        adjustmentType: this.selectedAdjustmentType,
        adjustmentFactor: this.adjustmentFactor ? this.adjustmentFactor : 0,
        targetCompanyKpi: {
          kpi: this.selectedKpi['kpiName'],
          values: []
        },
        finalValues: [],
        unselectedRecordId: this.unSelectedRecords?.find(x => x.kpiId === this.selectedKpi['kpiId'])?.recordIds ?? []
      };

      let tempEVData = JSON.parse(localStorage.getItem("tempEVData"));
      if (tempEVData != null || tempEVData != undefined) {
        if (tempEVData.kpiId === this.selectedKpi['kpiId']) {
          this.calculateFinalImpliedEvValues();
          impliedEvRequestModel.unselectedRecordId = tempEVData?.checkBoxList.filter(x => !x["checked"]).map(x => x["id"]);
        }
      }

      if (this.kpiValuesToBeSent) {
        (this.selectedKpi['kpiData'] || []).forEach(element => {
          let prevKpiVal = this.impliedEvOriginalDS?.hasDetails ? this.impliedEvOriginalDS?.targetCompanyKpi.values.find(x => x.periodName === element.PeriodName) : null;
          let valueObj: ImpliedEvValue = {
            id: isKpiIdChanged ? 0 : (prevKpiVal === null ? 0 : prevKpiVal?.id),
            dataType: element.DataType,
            periodName: element.PeriodName,
            year: element.Year,
            value: (this.kpiValuesToBeSent[element.PeriodName])?.toString() ? (this.kpiValuesToBeSent[element.PeriodName])?.toString() : ""
          };
          impliedEvRequestModel.targetCompanyKpi.values.push(valueObj);
        });
        this.finalValueToBeSent.forEach(element => {
          const finalValueObj: ImpliedEvFinalValue = {
            title: element.title,
            values: []
          };
          let prevFinalTitle = this.impliedEvOriginalDS?.hasDetails ? this.impliedEvOriginalDS?.finalValues.find(x => x.title === element.title) : null;
          (this.selectedKpi['kpiData'] || []).forEach(childElem => {
            let prevFinalVal = prevFinalTitle == null ? null : prevFinalTitle.values.find(x => x.periodName === childElem.PeriodName)
            let valueObj: ImpliedEvValue = {
              id: isKpiIdChanged ? 0 : (prevFinalVal === null ? 0 : prevFinalVal?.id),
              dataType: childElem.DataType,
              periodName: childElem.PeriodName,
              year: childElem.Year,
              value: (element[childElem.PeriodName])?.toString() ? (element[childElem.PeriodName])?.toString() : ""
            };
            finalValueObj.values.push(valueObj);
          });
          impliedEvRequestModel.finalValues.push(finalValueObj);
        });
      }
      this._impliedEvService.saveImpliedEvValue(impliedEvRequestModel).subscribe(result => {
        this.removeTempUnsavedData();
        this.isUnsavedData = false;
        let resp = result;
        if (resp) {
          this.getSavedImpledEvDetails().then(res => { });
          this.resetCheckBox();
        }
        this._valuationModelService.setRedirectionStatus(true);
        this._impliedEvService.setClearCheckBoxListFlag(true);
      });
      resolve(true);
    });

  }

  saveEquityValuation = (): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
      if (this.equityValuationSaveRequest) {
        this._impliedEvService.getEquityValuation(this.equityValuationSaveRequest).subscribe({
          next: (data: boolean) => {
            if (data) {
              this.isEquityDataSaved = true;
              localStorage.removeItem("tempEquityValueData");
              this._valuationModelService.setRedirectionStatus(true);

              resolve(true);
            }
          }
        });
      }
    });
  }

  calculateImpliedEV() {
    this.loading = true;
    Promise.all([this.calculateImpliedEVSave(), this.saveEquityValuation()]).then((results) => {
      if (results[0] && results[1]) {
        this.toastrService.success(`Changes have been successfully saved`, "", { positionClass: "toast-center-center" });
      }
      else {
        this.toastrService.error(`Changes have not been saved. Something went wrong.`, "", { positionClass: "toast-center-center" });
      }
    });
    
    this.loading = false;
  }

  resetCheckBox() {
    let rIds = [];
    this.unSelectedRecords.map(x => x.recordIds).forEach((r) => r.forEach(element => {
      if (element !== '') {
        rIds.push(element);
      }
    }));
    this._impliedEvService.getRawDataTradingComps().subscribe(raw => {
      raw.forEach(row => {
        row.ValuationData.forEach(element => {
          element.IsSelected = true;
          if (rIds.includes(element.Id)) {
            element.IsSelected = false;
          }
        });
      });
    });
  }

  checkIfUnsaveChangesAvailable(): boolean {
    let tempEVData = JSON.parse(localStorage.getItem("tempEVData"));
    if (tempEVData != null || tempEVData != undefined) {
      return true;
    }
    else {
      return false;
    }
  }

  updateCompsTableValues(adjFactor) {
    adjFactor = parseFloat(adjFactor);
    let valationValue = this.getImpliedEvValue();
    this.copmValues = valationValue;
    if (adjFactor > 0) {
      this.rowHeader.forEach(header => {
        valationValue.map(x => {
          if (x[header.field] !== 'NA') {
            if (this.selectedAdjustmentType == this.adjustmentType.Discount) {
              x[header.field] = x[header.field] * ((100 - adjFactor) / 100);
            }
            if (this.selectedAdjustmentType == this.adjustmentType.Premium) {
              x[header.field] = x[header.field] * ((100 + adjFactor) / 100);
            }
          }
        })
      });
      this.copmValues = valationValue;
    }
    setTimeout(() => {
      this.calculateFinalImpliedEvValues();
    }, 1000);
  }

  disabledAdjustmentFactorPageLoad() {
    let txtpercentage = document.getElementById('txtadjfactor');
    let divpercentage = document.getElementById('divadjustment');
    let lblAsterik = document.getElementById('lblAsterik');
    if (this.selectedAdjustmentType == 100) {
      txtpercentage.className = "textbox-disable";
      divpercentage.className = "textbox-disable";
      txtpercentage.className = 'form-control';
      txtpercentage.style.setProperty("cursor", "not-allowed");
      lblAsterik.style.setProperty("display", "none");
      this.disableCalculate = true;
    }
  }

  enableAdjustmentFactor() {
    let txtpercentage = document.getElementById('txtadjfactor');
    let divpercentage = document.getElementById('divadjustment');
    let lblAsterik = document.getElementById('lblAsterik');
    if (this.adjustmentFactor > 0 && (this.selectedAdjustmentType === this.adjustmentType.Discount
      || this.selectedAdjustmentType === this.adjustmentType.Premium)) {
      this.disableCalculate = true;
      this.txtAdjFactorDisabled = false;
      txtpercentage.className = '';
      divpercentage.className = '';
      txtpercentage.className = 'form-control';
      txtpercentage.style.setProperty("cursor", "auto");
      lblAsterik.style.setProperty("display", "block");
      lblAsterik.style.setProperty("color", "red");
    }
  }

  disableSaveButtonEventHandler(event) {
    this.disableCalculate = event;
  }
}
