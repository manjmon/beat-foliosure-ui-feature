import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import {
  NgForm,
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Message } from "primeng/api/message";
import { MessageService } from "primeng/api";
import { FundService } from "../../services/funds.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
import { M_Datatypes, FundTrackRecordStatic, NumberDecimalConst } from "src/app/common/constants";
import * as moment from 'moment';
@Component({
  selector: "savefundTrackRecord",
  templateUrl: "./fund-trackRecord.component.html",
  styleUrls:["./fund-trackRecord.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddFundTrackRecordComponent),
      multi: true,
    },
    MessageService,
  ],
})
export class AddFundTrackRecordComponent
  implements OnInit ,ControlValueAccessor{
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  @Input() trackRecordList: any = {};
  @Output() onSave = new EventEmitter<any>();
  saveText: string = "Create";
  resetText: string = "Reset";
  id: string;
  msgs: Message[] = [];
  @ViewChild("f") userFrm: NgForm;
  loading: boolean = false;
  yearOptions: any = [];
  mDataTypes = M_Datatypes;
  FundTrackRecordStaticinfo = FundTrackRecordStatic;
  NumberDecimalConst = NumberDecimalConst;
  quarterOptions: any = [
    { value: "Q1", text: "Q1" },
    { value: "Q2", text: "Q2" },
    { value: "Q3", text: "Q3" },
    { value: "Q4", text: "Q4" },
  ];
  isupdate: boolean = false;
  isLoader:boolean=false;
  msgTimeSpan: number;
  private _model: any = {};
  customModel: any = {};
  modelClone: any = {};
  get model(): any {
    return this._model;
  }
  @Input()
  set model(model: any) {
    this._model = model;
    this.modelClone = JSON.parse(JSON.stringify(this.model));
    if (
      model.encryptedFundTrackRecordId != "" &&
      model.encryptedFundTrackRecordId != null
    ) {
      this.saveText = "Update";
      this.resetText = "Reload";
      this.isupdate = true;
      this.validateSelectedQuarter();
    }
  }   
  customFieldsData=[];
  fundtrackData = [];
  headerText = "";
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
  constructor(
    private toastrService: ToastrService,
    private _avRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private miscService: MiscellaneousService,
    private messageService: MessageService,
    private _fundService: FundService,
    protected changeDetectorRef: ChangeDetectorRef
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.yearOptions = this.miscService.bindYearList();
  }
  ngOnInit() {
    this.toastrService.overlayContainer = this.toastContainer;
    this.isLoader=true;
    this._fundService.getFundTrackRecordConfiguration(this.model).subscribe({next:result => {
      if (result != null) {
        this.headerText = result.headerText;
        this.fundtrackData = result.trackRecordDyanmicAddEditData;
        this.customFieldsData = result.trackRecordDyanmicAddEditData.filter(x => x.name === 'Customfield');
        this.isLoader = false;
      } else
        this.isLoader = false;
    },error:error=>{
      this.isLoader=false;
    }})
  }
  calculateDPI() {
    if (
      this.hasValueInNumber(this.model.totalInvestedCost) &&
      this.hasValueInNumber(this.model.totalRealizedValue)
    ) {
      this.model.dpi =
        this.model.totalRealizedValue / this.model.totalInvestedCost;
      this.model.dpi = (this.model.dpi == Infinity) ? null : this.model.dpi;
      this.model.dpi = isNaN(this.model.dpi) ? 0 : this.model.dpi;
    }
    else
      this.model.dpi =null;
  }
  calculateRVPI() {
    if (
      this.hasValueInNumber(this.model.totalInvestedCost) &&
      this.hasValueInNumber(this.model.totalUnRealizedValue)
    ) {
      this.model.rvpi =
        this.model.totalUnRealizedValue / this.model.totalInvestedCost;
      this.model.rvpi = (this.model.rvpi == Infinity) ? null : this.model.rvpi;
      this.model.rvpi = isNaN(this.model.rvpi) ? 0 : this.model.rvpi;
    }
    else
      this.model.rvpi =null;
  }
  onClose()
  {
    this.activeModal.close();
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
  onInvestmentCostChange() {
    this.calculateGrossMultiple();
    this.calculateDPI();
    this.calculateRVPI();
  }

  onRealizedValueChange() {
    this.calculateTotalValue();
    this.calculateDPI();
  }

  onUnRealizedValueChange() {
    this.calculateTotalValue();
    this.calculateRVPI();
  }

  calculateGrossMultiple() {
    if (
      this.model.totalValue != null &&
      this.model.totalInvestedCost != null &&
      this.model.totalInvestedCost > 0
    ) {
      this.model.grossMultiple =
        this.model.totalValue / this.model.totalInvestedCost;
    }
    else
      this.model.grossMultiple = null;
  }

  calculateTotalValue() {
    if (
      this.hasValueInNumber(this.model.totalRealizedValue) ||
      this.hasValueInNumber(this.model.totalUnRealizedValue)
    ) {
      this.model.totalValue =
        parseFloat(this.model.totalRealizedValue != null ? this.model.totalRealizedValue : 0) +
        parseFloat(this.model.totalUnRealizedValue != null ? this.model.totalUnRealizedValue : 0);
      this.calculateGrossMultiple();
    }
    else {
      this.model.totalValue = null;
      this.model.grossMultiple = null;
    }
  }

  calculateRealizedValue() {
    if (
      this.hasValueInNumber(this.model.totalValue) &&
      this.hasValueInNumber(this.model.totalUnRealizedValue)
    ) {
      this.model.realizedValue =
        this.model.totalValue - this.model.totalUnRealizedValue;
    }
    else
      this.model.realizedValue =null;
  }

  calculateUnRealizedValue() {
    if (
      this.hasValueInNumber(this.model.totalValue) &&
      this.hasValueInNumber(this.model.totalRealizedValue)
    ) {
      this.model.unrealizedValue =
        this.model.totalValue - this.model.totalRealizedValue;
    }
    else
      this.model.unrealizedValue = null;
  }

  hasValueInNumber(val: any) {
    if (val != null && val != undefined && val !== "") {
      return true;
    }
    return false;
  }

  validateSelectedQuarter() {
    if (
      this.model.quarter != null &&
      this.model.quarter != "" &&
      this.model.year != undefined &&
      this.model.year != null &&
      this.model.year.toString().length == 4
    ) {
      let quarterDate = this.miscService.getQuarterLastDateByQuarter(
        this.model.quarter,
        this.model.year
      );

      let currentQuarter = this.miscService.getQuarterLastDate(new Date());

      if (currentQuarter < quarterDate) {
        this.model.valuationDate = undefined;
        this.miscService.showInlineMessage(
          this.messageService,
          "error",
          "Selected quarter should not be greater than current quarter."
        );
        return;
      }

      this.model.valuationDate = quarterDate;
      this.messageService.clear();
    }
  }

  save(form: any) {
    if (this.customFieldsData.length > 0) {
      this.customFieldsData.forEach(element => {
        element.year = this.model.year;
        element.quarter = this.model.quarter;
      });
      this.customFieldsData.forEach(element => {
        if (element.dataType == 6) {
          if (element.value == null || element.value == 'Invalid date') {
            element.value=null;
          } else {
            element.value = element.value != null ? moment(element.value).format('MM/DD/YYYY') : element.value;
          }
        }
      });
    }
    this.model.encryptedFundDetailsID = this.id;
    this.model.fundTrackRecordConfigurationData=this.customFieldsData;
    if (this.model.valuationDate == undefined) {
      this.toastrService.error("Please select valid year and quarter.", "", { positionClass: "toast-center-center" });
      return;
    }

    let localModel = this.model;
    let matchingRecords =this.trackRecordList?.length >0 ? this.trackRecordList?.filter(function (
      element: any,
      index: any
    ) {
      return (
        element.Quarter == localModel.quarter &&
        element.Year == localModel.year &&
        element.encryptedFundTrackRecordId !=
        localModel.encryptedFundTrackRecordId
      );
    }):null;
    if (matchingRecords != null && matchingRecords.length > 0) {
      this.toastrService.error("The year and quarter pair already exist for this fund.", "", { positionClass: "toast-center-center" });
      return;
    }
    this.messageService.clear();
    this.loading = true;
    this.model.grossIRR = this.model.grossIRR == "" ? null : this.model.grossIRR;
    this.model.netIRR = this.model.netIRR == "" ? null : this.model.netIRR;
    this.model.netMultiple = this.model.netMultiple == "" ? null : this.model.netMultiple;
    this._fundService.saveFundTrackRecord(this.model).subscribe({next:
      (data) => {
        if (data.code == "OK") {
          this.toastrService.success("Fund track record updated successfully", "", { positionClass: "toast-center-center" });
          this.onSave.emit(true);
          this.activeModal.close();
          this.formReset(form);
        } else {
          this.toastrService.error(data.message, "", { positionClass: "toast-center-center" });
        }
        this.loading = false;
      },
      error:(error) => {
        this.toastrService.error("error", "", { positionClass: "toast-center-center" });
        this.loading = false;
      }
  });
  }

  formReset(f: any) {
    f.resetForm();
    this.messageService.clear();
    this.changeDetectorRef.detectChanges();
    setTimeout(
      function (local: any) {
        local.model = JSON.parse(JSON.stringify(local.modelClone));
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
  registerOnTouched() { }
}
