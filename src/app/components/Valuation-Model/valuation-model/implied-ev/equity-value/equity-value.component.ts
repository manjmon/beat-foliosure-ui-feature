import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ValuationCalclation } from "../../../shared/valuation-calculation";
import { ImpliedEvService } from "src/app/services/implied-ev.service";
import { ValuationType } from "../../../shared/valuation-type.enum";
import { ValuationModelService } from "src/app/services/valuation-model.service"
import { ToastrService } from "ngx-toastr";
import { FormBuilder } from '@angular/forms';
import { Constants } from 'src/app/common/constants';
@Component({
  selector: 'app-equity-value',
  templateUrl: './equity-value.component.html',
  styleUrls: ['./equity-value.component.scss']
})
export class EquityValueComponent implements OnInit {
  @Input() rowHeader: any;
  @Input() finalImpliedEvData: any = [];
  @Input() selectedKpi: any;
  @Input() valuationId: number;
  @Input() isEquityDataSaved: boolean;
  @Output() disableSaveButton: EventEmitter<boolean> = new EventEmitter();
  selectedAttribute: any;
  selectedYear: any;
  canDeactivateStatus: boolean = true;
  dropdownvalue: any = []
  dropdownValuesArray: any[] = [];
  yearsWithE: string[] = [];
  finalvalue: any = '';
  isYearDropdownEnabled: boolean = false;
  netDebt: any = '';
  otherValue: any = '';
  preferredEquity: any = '';
  minorityInterest: any = '';
  total: number;
  grandTotal: any = '';
  FinalfairValue: any = '';
  GetFinalfairValue: any = '';
  inputCompanyFairValue: any = '';
  equityTitle1: string;
  equityTitle2: string;
  tooltip1: string;
  valuationCalclation: typeof ValuationCalclation = ValuationCalclation;
  subscriptions: any = [];
  internalSelectedTab: any;
  valuationType: typeof ValuationType = ValuationType;
  isUnsavedData: boolean = false;
  originalsSet: boolean = false;
  originalNetDebt: any;
  originalMinorityInterest: any;
  originalPreferredEquity: any;
  originalOtherValue: any;
  calculateFairValueForEquity: any;
  fundOwnership: any;
  fundOwnerShiptitle: string;
  showEditHeader: boolean = false;
  contentTitle: string = Constants.ContentTitle;
btndisable:boolean;
  companyEquityHeaders: any = [];
  companyEquityHeadersActual: any = [];
  constructor(private _impliedEvService: ImpliedEvService, private _valuationModelService: ValuationModelService, private toastrService: ToastrService, private fb: FormBuilder,) {
    this.subscriptions.push(this._impliedEvService.getInternalSelectedTabName().subscribe(tab => {
      this.internalSelectedTab = tab;
      if (this.internalSelectedTab.id === this.valuationType.Valuations && this.checkIfUnsaveChangesAvailable()) {
        this._valuationModelService.setRedirectionStatus(false);
      }
      else {
        this._valuationModelService.setRedirectionStatus(true);
      }
    }));

  }

  ngOnInit(): void {
    this.subscriptions.push(this._impliedEvService.getHeaders().subscribe(headers => {
      this.rowHeader = headers;
      this.getDynamicDropdownValues(this.rowHeader);
      this.filterYearsWithE();
    }));
    this.subscriptions.push(this._impliedEvService.getUpdatedFinalImpliedEvData().subscribe(finalImpliedEvData => {
      this.finalImpliedEvData = finalImpliedEvData;
      if (this.selectedAttribute !== null) {
        this.extractDataByDropdownValue(this.selectedAttribute);
        if (this.selectedKpi['kpiName'] === 'CF' || this.selectedKpi['kpiName'] === 'Net Income' || this.selectedKpi['kpiName'] === 'Book Value') {
          this.GetFinalfairValue = (this.finalvalue * this.fundOwnership) / 100;
        }
        else {
          this.GetFinalfairValue = Number.isNaN((this.fundOwnership * this.grandTotal)) ? 0 : (this.fundOwnership * this.grandTotal) / 100;
        }
        let value = this.selectedAttribute === undefined ? null : this.selectedAttribute["header"].split(" - ");
        if (value != null && !this.selectedAttribute["header"].includes("LTM") && !this.selectedAttribute["header"].includes("NTM")) {
          if (value.length == 2) {
            let finalvalue = this.finalImpliedEvData.find(x => x.title.includes(value[1]));
            let finalvalues = this.selectedYear === undefined ? null : (finalvalue[this.selectedYear['yearEstimated']]);
            this.finalvalue = finalvalues === null ? "NA" : finalvalues;
            this.total = parseFloat((this.netDebt || 0)) + parseFloat((this.preferredEquity || 0)) + parseFloat((this.minorityInterest || 0)) + parseFloat((this.otherValue || 0));
            this.getCompanyEquityValueCalculation();
            this.getFinalfairValue();
          }
        }
      }
    }));
    this.subscriptions.push(this._impliedEvService.getdropdownValues().subscribe(selectedKpi => {
      this.selectedKpi = selectedKpi;
      this.resetAllData();
      if (this.selectedKpi !== null || this.selectedKpi !== undefined) {
        let res = ValuationCalclation.getfinancialkpi.find(f => f.financial == this.selectedKpi['kpiName']);
        this.equityTitle1 = res.ImpliedEvCal;
        this.equityTitle2 = res.CompanyValue;
        this.tooltip1 = res.titlevalue;
        this.fundOwnerShiptitle = res.fundownershipev;
        if (!this.checkIfUnsaveChangesAvailable()) {
          this.getEquityData();
          this.getEquityCalculation();
        }
      }
    }));

    if (this.checkIfUnsaveChangesAvailable()) {
      this.applyUnsavedEquityData();
    }
    else {
      this.getEquityCalculation();
    }
    this.getCompanyEquityHeader();



  }

  ngOnDestroy() {
    if (this.isEquityDataSaved) {
      this.isUnsavedData = false;
    }
    if (this.internalSelectedTab.id !== this.valuationType.Valuations && this.isUnsavedData) {
      this.saveUnsavedEquityDataTemporary();
    }
    // prevent memory leak when component destroyed
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  saveUnsavedEquityDataTemporary() {
    let tempEquityValueData = this.gatherData();
    localStorage.setItem("tempEquityValueData", JSON.stringify(tempEquityValueData));
  }

  checkIfUnsaveChangesAvailable(): boolean {
    let tempEquityValueData = JSON.parse(localStorage.getItem("tempEquityValueData"));
    if (tempEquityValueData != null && tempEquityValueData != undefined) {
      return true;
    }
    else {
      return false;
    }
  }

  resetAllData() {
    this.selectedAttribute = null;
    this.selectedYear = null;
    this.finalvalue = null;
    this.grandTotal = null;
    this.GetFinalfairValue = null;
    this.netDebt = null;
    this.preferredEquity = null;
    this.minorityInterest = null;
    this.otherValue = null;
    this.inputCompanyFairValue = null;
    this.fundOwnership = null;
  }

  applyUnsavedEquityData() {
    let tempEquityValueData = JSON.parse(localStorage.getItem("tempEquityValueData"));
    if (tempEquityValueData != null || tempEquityValueData != undefined) {
      if (tempEquityValueData.kpiId === this.selectedKpi['kpiId']) {
        this.selectedAttribute = tempEquityValueData.selectedAttribute;
        this.selectedYear = tempEquityValueData.selectedYear;
        this.finalvalue = tempEquityValueData.finalvalue;
        this.grandTotal = tempEquityValueData.grandTotal;
        this.GetFinalfairValue = tempEquityValueData.GetFinalfairValue;
        this.netDebt = tempEquityValueData.netDebt;
        this.preferredEquity = tempEquityValueData.preferredEquity;
        this.minorityInterest = tempEquityValueData.minorityInterest;
        this.otherValue = tempEquityValueData.otherValue;
        this.inputCompanyFairValue = tempEquityValueData.fundOwnership;
        this.fundOwnership = tempEquityValueData.fundOwnership
        setTimeout(() => {
          this.disableSaveButton.emit(false);
        }, 100);

        if (this.selectedAttribute !== null && (this.selectedAttribute["header"] === 'Estimate - Mean' || this.selectedAttribute["header"] === 'Estimate - Median')) {
          this.isYearDropdownEnabled = true;
        }
      }
    }
   }

  getEquityData() {
    this._impliedEvService.getEquityValue(this.valuationId, this.selectedKpi['kpiId']).subscribe({
      next: (data: any) => {
        if (data.isData) {
          if (data.data?.attributeType) {
            this.selectedAttribute = { "header": data.data?.attributeType };
          }
          if (data.data?.attributeYear > 0) {
            this.isYearDropdownEnabled = true;
            this.selectedYear = { "year": data.data?.attributeYear, "yearEstimated": data.data?.attributeYear + 'E' };
          }
          this.finalvalue = this.getValue(data.data?.attributeValue) ? 'NA' : data.data?.attributeValue;
          this.grandTotal = this.getValue(data.data?.companyEquityValue) ? '' : data.data?.companyEquityValue;
          this.GetFinalfairValue = this.getValue(data.data?.fairValue) ? '' : data.data?.fairValue;
        }
        else {
          this.selectedAttribute = null;
          this.selectedYear = null;
          this.isYearDropdownEnabled = false;
          this.finalvalue = null;
          this.grandTotal = null;
          this.GetFinalfairValue = null;
        }
        this._impliedEvService.setEquityValuation(this.gatherData());
      },
    });
  }

  getValue(value) {
    return [null, "NA", "", undefined, 0].includes(value);
  }

  getEquityCalculation() {
    this._impliedEvService.getEquityCalculation(this.valuationId).subscribe({
      next: (data: any) => {
        if (data.isData) {
          this.netDebt = this.getValue(data.data?.netDebt) ? null : data.data?.netDebt;
          this.preferredEquity = this.getValue(data.data?.prefferedEquity) ? null : data.data?.prefferedEquity;
          this.minorityInterest = this.getValue(data.data?.minorityInterest) ? null : data.data?.minorityInterest;
          this.otherValue = this.getValue(data.data?.other) ? null : data.data?.other;
          this.inputCompanyFairValue = this.getValue(data.data?.fundOwnership) ? null : data.data?.fundOwnership;
          this.fundOwnership = this.getValue(data.data?.fundOwnership) ? null : data.data?.fundOwnership;
        }
        else {
          this.netDebt = null;
          this.preferredEquity = null;
          this.minorityInterest = null;
          this.otherValue = null;
          this.inputCompanyFairValue = null;
        }
        this._impliedEvService.setEquityValuation(this.gatherData());
      }
    });
  }

  gatherData() {
    return {
      valuationId: this.valuationId,
      selectedAttribute: this.selectedAttribute,
      selectedYear: this.selectedYear,
      finalvalue: this.finalvalue === null ? '' : this.finalvalue,
      grandTotal: this.grandTotal,
      GetFinalfairValue: this.GetFinalfairValue,
      netDebt: this.netDebt,
      preferredEquity: this.preferredEquity,
      minorityInterest: this.minorityInterest,
      otherValue: this.otherValue,
      fundOwnership: this.fundOwnership,
      kpiId: this.selectedKpi === undefined ? 0 : this.selectedKpi['kpiId']
    };
  }

  getDynamicDropdownValues(header: any) {
    this.dropdownValuesArray = [];
    const alreadyAddedE = new Set();
    header.forEach(item => {
      if (item.header === "LTM") {
        this.dropdownValuesArray.push({ header: 'LTM - Mean' });
        this.dropdownValuesArray.push({ header: 'LTM - Median' });
      }
      if (item.header === "NTM") {
        this.dropdownValuesArray.push({ header: 'NTM - Mean' });
        this.dropdownValuesArray.push({ header: 'NTM - Median' });
      }
      if (item.header.includes("E") && !alreadyAddedE.has("E")) {
        this.dropdownValuesArray.push({ header: 'Estimate - Mean' });
        this.dropdownValuesArray.push({ header: 'Estimate - Median' });
        alreadyAddedE.add("E");
      }
    });
    return this.dropdownValuesArray;
  }

  filterYearsWithE() {
    this.yearsWithE = this.rowHeader.filter(item => item.header.includes('E'))
      .map(item => ({ year: item.header.match(/\d{4}/)[0], yearEstimated: item.header }))
  }

  onYearValueChange() {
    let value = this.selectedAttribute === undefined ? null : this.selectedAttribute["header"].split(" - ");
    if (value != null && !this.selectedAttribute["header"].includes("LTM") && !this.selectedAttribute["header"].includes("NTM")) {
      if (value.length == 2) {
        let finalvalue = this.finalImpliedEvData.find(x => x.title.includes(value[1]));
        let finalvalues = (finalvalue[this.selectedYear['yearEstimated']]);
        this.finalvalue = finalvalues === null ? "NA" : finalvalues;
        this.disableSaveButton.emit(false);
        this._impliedEvService.setEquityValuation(this.gatherData());
        this.isUnsavedData = true;
        this.total = parseFloat((this.netDebt || 0)) + parseFloat((this.preferredEquity || 0)) + parseFloat((this.minorityInterest || 0)) + parseFloat((this.otherValue || 0));
        this.getCompanyEquityValueCalculation();
        this.getFinalfairValue();
      }
      else {
        this.isUnsavedData = false;
      }
    }
  }
  onAttibutTypeClear() {
    this.disableSaveButton.emit(true);
    this.finalvalue = null;
    this.selectedYear = null;
    this.grandTotal = null;
    this._impliedEvService.setEquityValuation(this.gatherData());
    this._valuationModelService.setRedirectionStatus(false);

  }

  onAttibutYearClear() {
    this.disableSaveButton.emit(true);
    this.finalvalue = null;
    this.selectedYear = null;
    this.grandTotal = null;
    this._impliedEvService.setEquityValuation(this.gatherData());
    this._valuationModelService.setRedirectionStatus(false);

  }


  onAttributeValueChange() {
    if (this.selectedAttribute["header"] === 'Estimate - Mean' || this.selectedAttribute["header"] === 'Estimate - Median') {
      this.isYearDropdownEnabled = true;
      this.finalvalue = null;
      this.selectedYear = null;
      this.disableSaveButton.emit(true);
    } else {
      this.extractDataByDropdownValue(this.selectedAttribute);
      this.isYearDropdownEnabled = false;
      this.selectedYear = null;
      this.disableSaveButton.emit(false);
    }
    this.getComapnyEquityCalculation()
    this.getCompanyEquityValueCalculation();
    this.getFinalfairValue();
    this._impliedEvService.setEquityValuation(this.gatherData());
    this._valuationModelService.setRedirectionStatus(false);
    this.isUnsavedData = true;
  }

  extractDataByDropdownValue(selectedAttribute) {
    let value = selectedAttribute === undefined ? null : selectedAttribute["header"].split(" - ");
    if (value != null) {
      if (value.length == 2) {
        let finalvalue = this.finalImpliedEvData.find(x => x.title.includes(value[1]));
        let finalvalues = (finalvalue[value[0]])
        this.finalvalue = finalvalues === null ? "NA" : finalvalues;
        this.total = parseFloat((this.netDebt || 0)) + parseFloat((this.preferredEquity || 0)) + parseFloat((this.minorityInterest || 0)) + parseFloat((this.otherValue || 0));
        if (this.total > 0) {
          this.grandTotal = (this.finalvalue + this.total);
        }
        this.getCompanyEquityValueCalculation();
      }
    }
  }

  getCompanyEquityValueCalculation() {
    if (this.finalvalue !== 'NA' && this.finalvalue !== null && this.finalvalue != '' && this.total !== null && this.total !== undefined) {
      this.grandTotal = (this.finalvalue + this.total);
      this._impliedEvService.setEquityValuation(this.gatherData());
    }
    else {
      this.grandTotal = 'NA';
    }
  }

  getFinalfairValue() {
    if (this.selectedKpi['kpiName'] === 'CF' || this.selectedKpi['kpiName'] === 'Net Income' || this.selectedKpi['kpiName'] === 'Book Value') {
      this.GetFinalfairValue = (this.finalvalue * this.fundOwnership) / 100;
    }
    else {
      this.GetFinalfairValue = Number.isNaN((this.fundOwnership * this.grandTotal)) ? 0 : (this.fundOwnership * this.grandTotal) / 100;
    }
    this.isUnsavedData = true;
    this._impliedEvService.setEquityValuation(this.gatherData());
  }

  validateFundOwnership(event: any) {
    this.fundOwnership = parseFloat(event.target.value);
    if (this.fundOwnership > 0) {
      if (this.fundOwnership > 100) {
        this.inputCompanyFairValue = null;
        this.GetFinalfairValue = null;
        this.fundOwnership = null;
        event.target.value = null;

      }
      else {
        this.fundOwnership = event.target.value;
        event.target.value = parseFloat(event.target.value).toFixed(1);
        this.validateSaveBtn();
        this.disableSaveButton.emit(false);
        this.getFinalfairValue();
        this._valuationModelService.setRedirectionStatus(false);

      }

    }
    else {
      this.GetFinalfairValue = null;
      this.inputCompanyFairValue = null;
      this.fundOwnership = null;
      event.target.value = null;
      this.disableSaveButton.emit(false);
    }
  }

  getNetDebtValue(event: any) {
    let currentValue = event.target.value;
    this.netDebt = currentValue.replaceAll(',', '');
    const regExp = /^-?\d+(?:,\d+)*(?:\.\d+)?$/;
    if (currentValue !== '' && !regExp.test(currentValue)) {
      event.target.value = currentValue.replace(/[^-\d.]/g, '');
      this.netDebt = null;
    }
    else {
      event.target.value = parseFloat(this.netDebt).toFixed(1);
      this.getComapnyEquityCalculation();
    }
    this._valuationModelService.setRedirectionStatus(false);

  }
  getPreferrdValue(event: any) {
    let currentValue = event.target.value;
    this.preferredEquity = currentValue.replaceAll(',', '');
    const regExp = /^-?\d+(?:,\d+)*(?:\.\d+)?$/;
    if (currentValue !== '' && !regExp.test(currentValue)) {
      event.target.value =  currentValue.replace(/[^-\d.]/g, '');
      this.preferredEquity = null;
    }
    else {
      event.target.value = parseFloat(this.preferredEquity).toFixed(1);
      this._valuationModelService.setRedirectionStatus(false);

      this.getComapnyEquityCalculation();
    }
  }
  getMinorityValue(event: any) {
    let currentValue = event.target.value;
    this.minorityInterest = currentValue.replaceAll(',', '');
    const regExp = /^-?\d+(?:,\d+)*(?:\.\d+)?$/;
    if (currentValue !== '' && !regExp.test(currentValue)) {
      event.target.value = currentValue.replace(/[^-\d.]/g, '');
      this.minorityInterest = null;
    }
    else {
      event.target.value = parseFloat(this.minorityInterest).toFixed(1);
      this._valuationModelService.setRedirectionStatus(false);

      this.getComapnyEquityCalculation();
    }
  }
  getOtherValue(event: any) {
    let currentValue = event.target.value;
    this.otherValue = currentValue.replaceAll(',', '');
    const regExp = /^-?\d+(?:,\d+)*(?:\.\d+)?$/;
    if (currentValue !== '' && !regExp.test(currentValue)) {
      event.target.value = currentValue.replace(/[^-0-9.-]/g, '');
      this.otherValue = null;
    }
    else {
      event.target.value = parseFloat(this.otherValue).toFixed(1);
      this.getComapnyEquityCalculation();
    }
    this._valuationModelService.setRedirectionStatus(false);

  }

  getComapnyEquityCalculation() {
    if (!isNaN(this.netDebt) || !isNaN(this.preferredEquity) || !isNaN(this.minorityInterest) || !isNaN(this.otherValue)) {
      this.total = parseFloat((this.netDebt || 0)) + parseFloat((this.preferredEquity || 0)) + parseFloat((this.minorityInterest || 0)) + parseFloat((this.otherValue || 0));
      this.getCompanyEquityValueCalculation();
      this.getFinalfairValue();
      this.validateSaveBtn();
    }

    else {
      this.grandTotal = null;
      this.getFinalfairValue();

    }
    if (
      (this.netDebt !== undefined && this.netDebt !== null) &&
      (this.preferredEquity !== undefined && this.preferredEquity !== null) &&
      (this.minorityInterest !== undefined && this.minorityInterest !== null) &&
      (this.otherValue !== undefined && this.otherValue !== null)
    ) {
      this.isUnsavedData = true;
      this.validateSaveBtn();
    }
    else {
      this.isUnsavedData = false;
    }
    this._impliedEvService.setEquityValuation(this.gatherData());
    if (!this.getValue(this.selectedAttribute) && !(this.selectedAttribute["header"] === 'Estimate - Mean' || this.selectedAttribute["header"] === 'Estimate - Median')) {
      this.disableSaveButton.emit(false);
    }
  }

  validateSaveBtn() {
    if ((!this.getValue(this.selectedAttribute) && !(this.selectedAttribute["header"] === 'Estimate - Mean' || this.selectedAttribute["header"] === 'Estimate - Median'))
      || (!this.getValue(this.selectedAttribute) && (this.selectedAttribute["header"] === 'Estimate - Mean' || this.selectedAttribute["header"] === 'Estimate - Median') && (!this.getValue(this.selectedYear)))) {
      this.disableSaveButton.emit(false);
    }
  }

  showequityheaderpopup() {
    this.showEditHeader = true;
    this.btndisable=true;
    this.getCompanyEquityHeader()
  }
  hideequityheaderpopup() {
    this.showEditHeader = false;
  }
  
  getCompanyEquityHeader() {
    this._impliedEvService.getCompanyEquityHeaders(this.valuationId).subscribe({
      next: (result: any) => {              
        this.companyEquityHeaders=JSON.parse(JSON.stringify(result));
        this.companyEquityHeadersActual=result;
        this.btndisable=true;
      }
    });
  }
  updateCompanyEquityHeader(companyEquityHeader: any) {
    companyEquityHeader = companyEquityHeader.filter((item) => {     
          item.valuationId = this.valuationId;
       return item;
   });
    this._impliedEvService.updateCompanyEquityHeaders(companyEquityHeader).subscribe({
      next: (result: any) => {
        this.showEditHeader = false;
        this.getCompanyEquityHeader();
        this.toastrService.success(Constants.HeaderSuccessMessage, "", { positionClass: "toast-center-center" });
      },

    });
  }

  setDisablebutton(){

     let equityDeatils = this.companyEquityHeaders;
     const netDebt=equityDeatils[0].headerAliasName==undefined?false:equityDeatils[0].headerAliasName;
      const preferredEquity=equityDeatils[1].headerAliasName==undefined?false:equityDeatils[1].headerAliasName;
     const minorityInterest=equityDeatils[2].headerAliasName==undefined?false:equityDeatils[2].headerAliasName;
     const other=equityDeatils[3].headerAliasName==undefined?false:equityDeatils[3].headerAliasName;

     if(this.companyEquityHeadersActual[0].headerAliasName=="" || this.companyEquityHeadersActual[1].headerAliasName=="" || this.companyEquityHeadersActual[2].headerAliasName=="" || this.companyEquityHeadersActual[3].headerAliasName=="")
     {
      this.btndisable = true;
     }
    else{
     if(netDebt==this.companyEquityHeadersActual[0].headerAliasName &&preferredEquity==this.companyEquityHeadersActual[1].headerAliasName&&minorityInterest === this.companyEquityHeadersActual[2].headerAliasName && other === this.companyEquityHeadersActual[3].headerAliasName){
        this.btndisable = true;
      }else{
        this.btndisable = false;
      }
    }
    
  }

}