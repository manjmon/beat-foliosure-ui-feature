﻿import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  ControlValueAccessor,
  NgForm,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Message } from "primeng/api/message";
import { MessageService } from "primeng/api";
import { DealService } from "../../services/deal.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { M_Datatypes, DealTrackRecordStatic, NumberDecimalConst } from "src/app/common/constants";
import * as moment from "moment";
@Component({
  selector: "savePortfolioFundHolding",
  templateUrl: "./portfolio-fundHolding.component.html",
  styleUrls:["./portfolio-fundHolding.component.scss"],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SavePortfolioFundHoldingComponent),
      multi: true,
    },
    MessageService,
  ],
})
export class SavePortfolioFundHoldingComponent
  implements OnInit, ControlValueAccessor {
  @Input() fundHoldingList: any = {};
  @Input() masterModel: any = {};
  @Input() dealModel: any = {};
  @Output() onSave = new EventEmitter<any>();
  yearRange: string = "";
  isupdate: boolean = false;
  saveText: string = "Create";
  isLoader: boolean = false;
  resetText: string = "Reset";
  id: string;
  DealTrackRecordStaticinfo = DealTrackRecordStatic;
  datatypes = M_Datatypes;
  msgs: Message[] = [];
  @ViewChild("f") userFrm: NgForm;
  loading: boolean = false;
  yearOptions: any = [];
  NumberDecimalConst = NumberDecimalConst;
  quarterOptions: any = [
    { value: "Q1", text: "Q1" },
    { value: "Q2", text: "Q2" },
    { value: "Q3", text: "Q3" },
    { value: "Q4", text: "Q4" },
  ];
  private _model: any = {};
  msgTimeSpan: number;
  modelClone: any = {};
  customFieldsDataClone=[];
  today: Date;
  customModel: any = {};
  valuationDate:any =null;
  get model(): any {
    // transform value for display
    return this._model;
  }
  headerText = "";
  @Input()
  set model(model: any) {
    this._model = model;
    this.customModel.dealId = this.model.dealID;
    if (this.model.fundHoldingStatusID != undefined)
      this.customModel.fundHoldingStatusID = this.model.fundHoldingStatusID;
    if (this.model.portfolioCompanyFundHoldingID != undefined)
      this.customModel.portfolioCompanyFundHoldingID = this.model.portfolioCompanyFundHoldingID;
    if (this.model.portfolioCompanyID != undefined)
      this.customModel.portfolioCompanyID = this.model.portfolioCompanyID;
    if (this.model.investementDate != null) {
      this.model.investementDate = new Date(this.model.investementDate);
      this.customModel.investementDate = new Date(this.model.investementDate);
    }

    if (this.model.valuationDate != null) {
      this.model.valuationDate = new Date(this.model.valuationDate);
      this.customModel.valuationDate = new Date(this.model.valuationDate);

    }
    this.modelClone = JSON.parse(JSON.stringify(this.model));
    if (model.portfolioCompanyFundHoldingID > 0) {
      this.saveText = "Update";
      this.resetText = "Reload";
      this.isupdate = true;
    }
  }
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  customFieldsData = [];
  statictrackData = [];
  constructor(
    private toastrService: ToastrService,
    private _avRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private miscService: MiscellaneousService,
    private messageService: MessageService,
    private _dealService: DealService,
    protected changeDetectorRef: ChangeDetectorRef,
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    let year = new Date();
    this.today = year;
    this.yearRange = "2000:" + year.getFullYear();
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.yearOptions = this.miscService.bindYearList();
    this.isupdate = false;
  }
  numbersOnlyValidator(event: any) {
    const pattern = /^[0-9\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9\-]/g, "");
    }
  }
  decimalnumbersOnlyValidator(event: any) {
    const pattern = /^[0-9,.\-]*$/;
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9,.\-]/g, "");
    }
  }
  isNumberKey(evt, obj) {
    let charCode = (evt.which) ? evt.which : evt.keyCode
    let value = obj.value;
    let dotcontains = value.indexOf(".") != -1;
    if (dotcontains)
      if (charCode == 46) return false;
    if (charCode == 46) return true;
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;
    return true;
  }
  ngOnInit() {
   this.getDealDetails();
  }
  getDealDetails() {
    this.isLoader = true;
    if (this.customModel.dealID == undefined)
      this.customModel.dealID = this.model.dealId;
    this.toastrService.overlayContainer = this.toastContainer;
    this._dealService.getDealsTradingRecordsEditAddConfiguration(this.customModel).subscribe((result: any) => {
      if (result != null) {
        if (this.customModel.portfolioCompanyFundHoldingID != 0 && this.customModel.portfolioCompanyFundHoldingID != undefined) {
          this.customModel = result.portfolioCompanyFundHoldingList[0];
          this.customModel.valuationDate = this.customModel.valuationDate !=null ?moment(this.customModel.valuationDate).format('MM/DD/YYYY'):'NA';
          this.modelClone = JSON.parse(JSON.stringify(this.customModel));
          this.isupdate = true;
          this.calculateDPI();
          this.calculateRVPI();
        }
        else{
          this.customModel.investementDate = null;
        }
        this.headerText = result.headerText;
        this.statictrackData = result.trackRecordDyanmicAddEditData;
        this.customFieldsDataClone=JSON.parse(JSON.stringify(this.statictrackData));
        this.customFieldsData = result.trackRecordDyanmicAddEditData.filter(x => x.name === 'Customfield');
      }
    })
  }
  save(form: any) {
    if (this.customFieldsData.length > 0) {
      this.customFieldsData.forEach(element => {
        element.year = this.customModel.year;
        element.quarter = this.customModel.quarter;
      });
    }
    this.customModel.dealTrackRecordConfigurationData = this.customFieldsData;
    if (this.customModel.valuationDate == undefined) {
      this.toastrService.error("Please select valid year and quarter later than investment date.", "", { positionClass: "toast-center-center" });
      return;
    }
    else
      this.customModel.valuationDate = moment.utc(this.customModel.valuationDate);
    let localModel = this.customModel;
    let matchingRecords = this.fundHoldingList.filter(function (
      element: any,
      index: any
    ) {
      return (
        element.Quarter == localModel.quarter + " " + localModel.year &&
        (localModel.portfolioCompanyFundHoldingID == undefined ||
          localModel.portfolioCompanyFundHoldingID == null ||
          element.portfolioCompanyFundHoldingID !=
          localModel.portfolioCompanyFundHoldingID)
      );
    });
    if (matchingRecords != null && matchingRecords.length > 0) {
      this.toastrService.error("The year and quarter pair already exist for this deal", "", { positionClass: "toast-center-center" });
      return;
    }
    this.messageService.clear();
    this.loading = true;
    this._dealService.savePortfolioCompanyFundHolding(this.customModel).subscribe({
      next:(data) => {
        if (data.code == "OK") {
          this.onSave.emit(data);
          this.formReset(form);
          this.toastrService.success("Fund holding details added successfully", "", { positionClass: "toast-center-center" });
        } else {
          this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
        }
        this.loading = false;
      },
      error:(error) => {
        this.loading = false;
        this.toastrService.error(error, "", { positionClass: "toast-center-center" });
      }
  });

  }

  calculateValuationDate() {
    if (
      this.customModel.quarter != null &&
      this.customModel.quarter != "" &&
      this.customModel.year != undefined &&
      this.customModel.year != null &&
      this.customModel.year.toString().length == 4
    ) {
      let quarterDate = this.miscService.getQuarterLastDateByQuarter(
        this.customModel.quarter,
        this.customModel.year
      );

      let currentQuarter = this.miscService.getQuarterLastDate(new Date());

      if (currentQuarter < quarterDate) {
        this.customModel.valuationDate = undefined;
        this.miscService.showInlineMessage(
          this.messageService,
          "error",
          "Valuation date should not be greater than current quarter's last date."
        );
        return;
      }

      if (quarterDate >= new Date(this.dealModel.investmentDate)) {
        this.customModel.valuationDate = moment(quarterDate).format('MM/DD/YYYY');
        this.messageService.clear();
      } else {
        this.customModel.valuationDate = undefined;
        this.miscService.showInlineMessage(
          this.messageService,
          "error",
          "Valuation date should not be less than investment date."
        );
      }
    }
  }

  onInvestmentCostChange() {
    this.calculateTotalValue();
    this.calculateGrossMultiple();
    this.calculateDPI();
    this.calculateRVPI();
  }

  onRealizedValueChange() {
    this.calculateTotalValue();
    this.calculateDPI();
    this.calculateRVPI();
    this.calculateGrossMultiple();
  }

  onUnRealizedValueChange() {
    this.calculateTotalValue();
    this.calculateRVPI();
    this.calculateDPI();
    this.calculateGrossMultiple();
  }

  calculateGrossMultiple() {
    if (
      this.customModel.totalValue != null &&
      this.customModel.investmentCost != null &&
      this.customModel.investmentCost > 0
    ) {
      this.customModel.grossMultiple =
        this.customModel.totalValue / this.customModel.investmentCost;
    }
    else
      this.customModel.grossMultiple = null;
  }

  calculateTotalValue() {
    if (
      this.hasValueInNumber(this.customModel.realizedValue) ||
      this.hasValueInNumber(this.customModel.unrealizedValue)
    ) {
      this.customModel.totalValue =
        parseFloat(this.customModel.realizedValue != null ? this.customModel.realizedValue : 0) +
        parseFloat(this.customModel.unrealizedValue != null ? this.customModel.unrealizedValue : 0);
      this.calculateGrossMultiple();
    }
    else
      this.customModel.totalValue = null;

  }

  calculateRealizedValue() {
    if (
      this.hasValueInNumber(this.customModel.totalValue) &&
      this.hasValueInNumber(this.customModel.unrealizedValue)
    ) {
      this.customModel.realizedValue =
        this.customModel.totalValue - this.customModel.unrealizedValue;
    }
    else
      this.customModel.realizedValue = null;
  }

  calculateUnRealizedValue() {
    if (
      this.hasValueInNumber(this.customModel.totalValue) &&
      this.hasValueInNumber(this.customModel.realizedValue)
    ) {
      this.customModel.unrealizedValue =
        this.customModel.totalValue - this.customModel.realizedValue;
    }
    else
      this.customModel.unrealizedValue = null;
  }
  calculateDPI() {
    if (
      this.hasValueInNumber(this.customModel.investmentCost) &&
      this.hasValueInNumber(this.customModel.realizedValue)
    ) {
      this.customModel.dpi =
        this.customModel.realizedValue / this.customModel.investmentCost;
      this.customModel.dpi = (this.customModel.dpi == Infinity) ? null : this.customModel.dpi;
      this.customModel.dpi = isNaN(this.customModel.dpi) ? 0 : this.customModel.dpi;
    }
    else
      this.customModel.dpi = null;

  }
  calculateRVPI() {
    if (
      this.hasValueInNumber(this.customModel.investmentCost) &&
      this.hasValueInNumber(this.customModel.unrealizedValue)
    ) {
      this.customModel.rvpi =
        this.customModel.unrealizedValue / this.customModel.investmentCost;
      this.customModel.rvpi = (this.customModel.rvpi == Infinity) ? null : this.customModel.rvpi;
      this.customModel.rvpi = isNaN(this.customModel.rvpi) ? 0 : this.customModel.rvpi;
    }
    else
      this.customModel.rvpi = null;
  }

  hasValueInNumber(val: any) {
    if (val != null && val != undefined && val !== "") {
      return true;
    }
    return false;
  }

  formReset(f: any) {
    f.resetForm();
    this.messageService.clear();
    this.changeDetectorRef.detectChanges();
    setTimeout(
      function (local: any) {
        local.customModel = JSON.parse(JSON.stringify(local.modelClone));
        local.statictrackData= JSON.parse(JSON.stringify(local.customFieldsDataClone));
        local.customFieldsData = local.statictrackData.filter(x => x.name === 'Customfield');
      },
      0,
      this
    );
  }

  writeValue(value: any) {
    if (value !== undefined && value != null) {
      this.model = value;
    }
  }

  propagateChange = (_: any) => { };

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  registerOnTouched() { 
    //existing functionality
  }
}
