import { Component, Input, EventEmitter, OnInit, Output, OnChanges, SimpleChanges, ChangeDetectorRef, ViewChild, QueryList, ViewChildren } from '@angular/core';
import { isNumeric } from '@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric';
import { PeriodTypeFilterOptions, NumberDecimalConst } from "src/app/common/constants";
import { EsgService } from "../../../services/esg.services";
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ErrorMessage, FinancialValueUnitsEnum } from 'src/app/services/miscellaneous.service';
import { KpitablefiltersComponent } from "../../kpitablefilters/kpitablefilters.component";
import { isUndefined } from 'mathjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-esg-datatable',
  templateUrl: './esg-datatable.component.html',
  styleUrls: ['./esg-datatable.component.scss']
})
export class EsgDatatableComponent implements OnInit, OnChanges {

  @Output() refreshEsgData: EventEmitter<boolean> = new EventEmitter(false);
  @Output() showFootNote: EventEmitter<boolean> = new EventEmitter(false);
  @Input() selectedSubpageData: any;
  @Input() selectedCompany: any;
  @Input() typeField: string;
  NumberDecimalConst = NumberDecimalConst;
  @Input() companyDetails: any;
  unitOfCurrency = FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands];
  currencyCode: string;
  ifNoDataAvailable: boolean = true;
  reservedChevIconSpace: boolean = false;
  Columns: any = [];
  frozenCols: any = [
    { field: "kpiName", header: "KPI" }
  ];
  esgPeriodData: any = [];
  quarterlyColumns: any = [];
  annuallyColumns: any = [];
  subscriptions: any = [];
  isLoading: boolean = false;
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('esgMenuTrigger') menuTrigger: MatMenuTrigger;
  esgKpiValueUnit: any;
  searchFilter: any = null;
  isLoader: boolean;
  esgKPIMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "month", order: -1 },
  ];
  modelESGKpi: any = {};
  @Input() model;
  tableResult = [];
  tableResultClone = [];
  tableColumns = [];
  tableFrozenColumns = [];
  esgKPIFilterCols = [];
  infoUpdatePopUpVisible: boolean = false;
  confirmUpdatePopUp: boolean = false;
  isEsgDataUpdated: boolean = false;
  defaultFinancialValueUnit: any = FinancialValueUnitsEnum.Thousands;
  @ViewChildren(KpitablefiltersComponent) preferenFilterForm: QueryList<KpitablefiltersComponent>;
  updateModel: any = {};


  constructor(private toastrService: ToastrService, private _esgService: EsgService, protected changeDetectorRef: ChangeDetectorRef) {

  }


  ngOnInit() {
    this.currencyCode = this.companyDetails?.reportingCurrencyDetail?.currencyCode ?? "";
    this.changeDetectorRef.detectChanges();
  }

  getCompanyKpiValueByEsgModuleId(searchfilter?: any) {
    let requestBody = this.applyFilterBody(searchfilter);
    this.isLoading = true;
    this._esgService.getCompanyKpiValueByEsgModuleId(requestBody).subscribe({
      next: (_res => {
        this.isLoading = false;
        let dat = _res['esgKpiList'] || [];
        this.annuallyColumns = [];
        this.quarterlyColumns = [];
        this.Columns = [];
        this.formatKpiDataTable([...dat], _res.headers);
      }),
      error: (error) => {
        this.isLoading = false;
        this.annuallyColumns = [];
        this.quarterlyColumns = [];
        this.Columns = [];
        this.formatKpiDataTable([], []);
      }
    });

  }

  formatKpiDataTable(data: any[], headers: any) {
    this.esgPeriodData = [...data];
    if (this.esgPeriodData?.length > 0 && this.esgPeriodData.some(x => x.kpiData?.length > 0)) {
      this.ifNoDataAvailable = false;
      this.showFootNote.emit(true);
    } else {
      this.ifNoDataAvailable = true;
      this.showFootNote.emit(false);
    }
    (this.esgPeriodData || []).forEach(x => {
      x?.kpiData.forEach((dat) => {
        const headerField = !(dat.quarter) ? `${dat.year}` : `${dat.quarter} ${dat.year}`;
        x[headerField] = dat.kpiValue;
      });
    });
    headers.forEach(element => {
      const headerArr = element.header.split(" ");
      switch (headerArr.length) {
        case 1:
          this.Columns.push({
            field: element.field,
            header: element.header,
            year: headerArr[0],
            quarter: headerArr[0]
          });
          break;
        case 2:
          this.Columns.push({
            field: element.field,
            header: element.header,
            year: headerArr[1],
            quarter: headerArr[0]
          });
          break;
        default:
          break;
      }
    });
    if (this.Columns.length > 0) {
      this.ifNoDataAvailable = false;
    } else {
      this.ifNoDataAvailable = true;
    }
    this.sortTableColumns();

  }

  sortTableColumns = () => {
    if ((this.quarterlyColumns || []).length > 0) {
      this.quarterlyColumns = this.quarterlyColumns
        .sort((firstItem, secondItem) => {
          if (firstItem.quarter < secondItem.quarter) return -1;
          if (firstItem.quarter > secondItem.quarter) return 1;
        })
        .sort((firstItem, secondItem) => {
          if (firstItem.year < secondItem.year) return -1;
          if (firstItem.year > secondItem.year) return 1;
        });
    }
    if ((this.annuallyColumns || []).length > 0) {
      this.annuallyColumns = this.annuallyColumns.sort((firstItem, secondItem) => {
        if (firstItem.year < secondItem.year) return -1;
        if (firstItem.year > secondItem.year) return 1;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["typeField"]) {
      this.getCompanyKpiValueByEsgModuleId(this.searchFilter);
    }
    if (changes["companyDetails"]) {
      this.currencyCode = this.companyDetails?.reportingCurrencyDetail?.currencyCode ?? "";
    }
    if (changes["selectedSubpageData"]) {
      this.preferenFilterForm?.first.onSubmit({
        submitter: { name: "Reset" }
      });
      if (!(this.selectedSubpageData?.subPageId)) {
        this.Columns = [];
        this.esgPeriodData = [];
        this.ifNoDataAvailable = true;

        return;
      }

      this.getCompanyKpiValueByEsgModuleId();
    }

  }

  viewQuarterlyData(x: boolean) {
    if (x) {
      this.Columns = [...this.quarterlyColumns];
    }
    else {
      this.Columns = [...this.annuallyColumns];
    }

    if (this.Columns.length > 0) {
      this.ifNoDataAvailable = false;
    } else {
      this.ifNoDataAvailable = true;
    }
  }

  isStaticCloumnHeader(val: any) {
    const staticFields = this.frozenCols.map(x => x.field);
    return staticFields.indexOf(val) == -1;
  }

  isNumberCheck(str: any) {
    return isNumeric(str);
  }

  applyFilterBody(searchFilter: any) {
    let filterbody = {
      CompanyId: this.selectedCompany?.portfolioCompanyID.toString(),
      portfolioCompanyID: this.selectedCompany?.portfolioCompanyID.toString(),
      SubPageModuleId: this.selectedSubpageData?.subPageId,
      searchFilter: searchFilter,
      isAnnually: true,
      isQuarterly: false,
      unit: FinancialValueUnitsEnum.Thousands,
    };

    if (searchFilter == null) {
      let sortOrder =
        [
          { field: "year", order: 1 },
          { field: "quarter", order: 1 },
        ]
        ;
      let _searchFilter = {
        sortOrder: sortOrder,
        periodType: "1 YR (Last 1 year)",
      };
      filterbody.searchFilter = _searchFilter;
    } else {
      filterbody.unit = !(this.esgKpiValueUnit) ? FinancialValueUnitsEnum.Thousands : this.esgKpiValueUnit.typeId;
      
    }
    switch (this.typeField) {
      case PeriodTypeFilterOptions.Quarterly: {
        filterbody.isQuarterly = true;
        filterbody.isAnnually = false
        break;
      }
      case PeriodTypeFilterOptions.Annual: {
        filterbody.isQuarterly = false;
        filterbody.isAnnually = true;
        break;
      }
    }
    return filterbody;
  }

  kpiTable_GlobalFilter(event) {
    this.esgKpiValueUnit = event?.UnitType == undefined ? {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
    } : event?.UnitType;
    this.searchFilter = event;
    this._esgService.setQueryFilter(this.searchFilter);
    this.getCompanyKpiValueByEsgModuleId(this.searchFilter);
    this.menuTrigger.closeMenu();
  }
  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  onTableDataEditInit(rowData: any, column: any) {
    if (isUndefined(this.esgKpiValueUnit) || Number(this.esgKpiValueUnit?.typeId) != FinancialValueUnitsEnum.Absolute)
      this.infoUpdatePopUpVisible = true;
    else {
      this.updateModel.colName = column.field;
      this.updateModel.header = column.header;
      this.updateModel.unit = rowData.kpiInfo;
      this.updateModel.rowName = rowData.kpiName;
      this.updateModel.kpiId = rowData.kpiId;
      this.updateModel.previousVal = rowData[column.field];
      let objIndex = this.esgPeriodData.findIndex((obj => obj.kpiId == this.updateModel.kpiId));
      this.esgPeriodData[objIndex][`${column.field} editable`] = true;
    }
  }

  closeInfoPopUp() {
    this.infoUpdatePopUpVisible = false;
  }

  validateMaxLength(event: any) {
    if (!Number.isInteger(Number(event.target.value))) {
      if (event.target.value.length == 21) return false;
    }else{
      if (event.target.value.length == 16) return false;
    }
    return true;
  }

  onColumnEditComplete(index: any, col: any, rowData: any, event) {
    let prevVal = this.updateModel.previousVal;
        rowData[col.field] = event.target.value !== "" ? event.target.value : null;
        let currVal = rowData[col.field];
        if (!this.confirmUpdatePopUp && currVal != prevVal) {
          this.updateModel.updatedVal = rowData[col.field] === "" ? undefined : rowData[col.field];
          this.confirmUpdatePopUp = true;
        }
    else
      this.onEsgDataUpdateCancel("");
  }

  onEsgDataUpdateCancel(event: any) {
    let objIndex = this.esgPeriodData.findIndex((obj => obj.kpiId == this.updateModel.kpiId));
    this.esgPeriodData[objIndex][this.updateModel.colName] = this.updateModel.previousVal;
    this.clearCellEdit();
  }

  clearCellEdit() {
    let objIndex = this.esgPeriodData.findIndex((obj => obj.kpiId == this.updateModel.kpiId));
    this.esgPeriodData[objIndex][`${this.updateModel.colName} editable`] = false;
    this.confirmUpdatePopUp = false;
    this.updateModel = {};
  }

  validateNumber(event: any) {
    if (event.which != 15) {
      let ex: RegExp = new RegExp(/^-*\d*(?:[.,]\d{1,10})?$/);
      if (!ex.test(event.target.value)) {
        if (!Number.isInteger(Number(event.target.value))) {
          event.target.value = parseFloat(event.target.value).toFixed(2);
        }
      }
    }
  }

  onColumnEdit(event: any) {
    event.target.blur();
  }

  onEsgDataUpdate(event: any) {
    let requestModel = {
      EncryptedCompanyId: this.selectedCompany?.encryptedPortfolioCompanyId ?? null,
      EsgModuleId: this.selectedSubpageData?.subPageId ?? 0,
      KpiId: this.updateModel.kpiId ?? 0,
      KpiInfo: this.updateModel.unit ?? null,
      OldValue: this.updateModel.previousVal ?? null,
      UpdatedValue: ((this.updateModel?.updatedVal == null || this.updateModel?.updatedVal == undefined) ? null : this.updateModel?.updatedVal.toString()),
      QuarterAndYear: this.updateModel?.header ?? null,
    };
    this._esgService.updateEsgKpiData(requestModel).subscribe({
      next: (result => {
        if (result.code === "OK") {
          this._esgService.setEsgDataUpdatedFlag(true);
          this.getCompanyKpiValueByEsgModuleId(this.searchFilter);
          this.confirmUpdatePopUp = false;
          this.updateModel = {};
          this.successToaster();
        }
        else {
          this._esgService.setEsgDataUpdatedFlag(false);
          this.onEsgDataUpdateCancel("");
          this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
        }
      }),
      error: (error) => {
        this._esgService.setEsgDataUpdatedFlag(false);
        this.onEsgDataUpdateCancel("");
        this.toastrService.error(ErrorMessage.SomethingWentWrong, "", { positionClass: "toast-center-center" });
      }
    });
  }

  successToaster() {
    this.toastrService.success("Entry updated successfully", "", { positionClass: "toast-center-center" });
  }
}
