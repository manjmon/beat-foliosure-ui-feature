import { AfterViewInit, ChangeDetectorRef, Component,ElementRef, Input, OnInit, Output,EventEmitter,ViewChild } from "@angular/core";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { LazyLoadEvent } from "primeng/api";
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from "rxjs/operators";
import { DealTrackRecordStatic,FundTrackRecordStatic, M_Datatypes, NumberDecimalConst } from "src/app/common/constants";
import { AccountService } from "../../../services/account.service";
import { DealService } from "../../../services/deal.service";
import { FundService } from "../../../services/funds.service";
import {
  FinancialValueUnitsEnum,
  MiscellaneousService
} from "../../../services/miscellaneous.service";
import { ReportService, ReportType } from "../../../services/report.service";
import { AddFundTrackRecordComponent } from "./../fund-trackRecord.component";

@Component({
  selector: "app-trackrecords",
  templateUrl: "./trackrecords.component.html",
  styleUrls: ["./trackrecords.component.scss"],
})
export class TrackrecordsComponent implements OnInit,AfterViewInit {
  @Input() isOpenTrackRecord:boolean = false;
  @Input() isUpdated:boolean = false;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  DealTrackRecordInfo = DealTrackRecordStatic;
  FundTrackRecordStatic=FundTrackRecordStatic;
  NumberDecimalConst = NumberDecimalConst;
  Mdatatypes=M_Datatypes;
  @Output() onPickedHeaderText=new EventEmitter<any>();
  id: any;
  dataTable: any;
  deals: any = [];
  fundTrackRecords: any = [];
  fundTrackRecordsold: any = [];
  fundTrackRecordsClone: any[] = [];
  portfolioCompanyFundHolding: any = [];
  portfolioCompanyFundHoldingClone: any[] = [];
  pagerLength: any;
  geographicLocation: any = { isHeadquarter: false };
  model: any = {};
  fundTrackRecordModel: any = {};
  loading = false;
  blockedDealsTable: boolean = false;
  isExportLoading: boolean = false;
  totalDealRecords: number;
  blockedTrackRecordTable: boolean = false;
  blockedPortfolioCompanyFundHoldingTable: boolean = false;
  totalTrackRecords: number;
  totalPortfolioCompanyFundHoldingRecords: number;
  msgTimeSpan: any;
  globalFilter: string = "";
  globalFilterTrack: string = "";
  currentFundHoldingQuarter: string;
  currentFundHoldingYear: number;
  displayCompanyFundHoldingsDialog: boolean = false;
  trackRecordValueUnit: any;
  showTrackRecordValueDecimals: boolean = true;
  holdingValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Millions;
  showHoldingValueDecimals: boolean = true;
  funddynamicCoulmns = [];
  frozenFundTrackTableColumns=[];
  fundTrakRecordMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  fundHoldingMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  noRecords: boolean = false;
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('tRecordTrigger') menuTrigger: MatMenuTrigger; 
  @ViewChild("gbTrackRecord") gbTrackRecord: ElementRef;
  @Output() onClosePopUpClick: EventEmitter<any> = new EventEmitter();
  @Input() isOpenAdd:boolean = false;
  unitTypeList = [
    {
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute],
    },
    {
      typeId: FinancialValueUnitsEnum.Thousands,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Thousands],
    },
    {
      typeId: FinancialValueUnitsEnum.Millions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Millions],
    },
    {
      typeId: FinancialValueUnitsEnum.Billions,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Billions],
    },
  ];
  isLazyLoad: boolean = false;
  sideNavWidth:any ="";
  constructor(
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private fundService: FundService,
    protected changeDetectorRef: ChangeDetectorRef,
    private _dealService: DealService,
    private reportService: ReportService,
    private _avRoute: ActivatedRoute,
    private modalService: NgbModal
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
    this.pagerLength = this.miscService.getSmallPagerLength();
  }
  sourceURL: any;
  ngOnInit() {
    this.trackRecordValueUnit=this.unitTypeList[2];
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    if (this.id != undefined) {
      this.getFundDetails();
    }
    this.noRecords = false;
  }
  getSideNavWidth()
  {
    this.sideNavWidth = "calc(100% - " + this.miscService.getSideBarWidth() + ")";
  }
  onResized($event)
  {
    this.getSideNavWidth();
  }
  ngAfterViewInit() {   
    if (this.uiuxMenu != undefined) {
    (this.uiuxMenu as any).closed = this.uiuxMenu.closed 
     	 this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  configureMenuClose(old: MatMenu['closed']): MatMenu['closed'] {
    const upd = new EventEmitter();
    feed(upd.pipe(
      filter(event => {
        if (event === 'click') {
          return false;
        }
        return true;
      }),
    ), old);
    return upd;
  }
exportFundHoldingValues() {
  let event = { first: 0, rows: 10, globalFilter: this.gbTrackRecord?.nativeElement.value || "", sortField: "year-quarter", multiSortMeta: this.fundHoldingMultiSortMeta, sortOrder: -1 };
  let filter = {
    currency: this.model?.currencyDetail?.currencyCode,
    valueType: this.trackRecordValueUnit?.unitType,
    showDecimalPlace: this.showHoldingValueDecimals
  };
  let queryParams = Object.assign({}, { FundDetailsID: this.model.fundID },
    { paginationFilter: event },
    filter);
  this.isExportLoading = true;
  this.fundService
    .GetPortfolioCompanyFundHolding(queryParams)
    .subscribe({
      next:(response) => {
        this.miscService.downloadExcelFile(response);
        this.isExportLoading = false;
      },
      error:(error) => {
        this.isExportLoading = false;
      }
});
}
  getFundDetails() {
    this.loading = true;
    this.fundService
      .getFundById({ EncryptedFundId: this.id, PaginationFilter: null })
      .subscribe({
        next:(result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.model = resp.fundDetails.fundList[0];
            if(this.isLazyLoad)
              this.getFundTrackRecords(null);
            this.getChartData();
            this.fundTrackRecordModel.fundDetailsID = this.model.fundID;
            this.loading = false;
          } 
          this.loading = false;
        },
        error:(error) => {
          this.loading = false;
        }
  });
  }


  getFundTrackRecords(event: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        FilterWithoutPaging: true,
        multiSortMeta: this.fundTrakRecordMultiSortMeta,
      };
    }

    this.blockedTrackRecordTable = true;
    this.fundService
      .getFundTrackRecordList({
        fundDetailsID: this.model.fundID,
        paginationFilter: event
      })
      .subscribe({next:
        (result) => {
          if (result != null) {
            this.funddynamicCoulmns = result.dynamicCoulmns;
            this.fundTrackRecords = result.trackRecordDyanmicData;
            this.fundTrackRecordsClone = JSON.parse(
              JSON.stringify(this.fundTrackRecords)
            );
            this.funddynamicCoulmns = result?.dynamicCoulmns?.filter(
              (x) =>
                x.name != "Quarter"
            );
            let fundColumn = result?.dynamicCoulmns?.find(
              (x) => x.name == "Quarter"
            );
            this.frozenFundTrackTableColumns = [
              {
                field: fundColumn?.displayName,
                header: fundColumn?.name
              }
            ];
            if (this.funddynamicCoulmns.length > 0)
              this.funddynamicCoulmns.push({ name: 'Action', displayName: 'Action' })
            this.onPickedHeaderText.emit(result.headerText);
            this.fundTrackRecordsold = result.result.fundTrackRecordList;
            this.convertTrackRecordValueUnits();
          }
          else {
            this.fundTrackRecords = [];
            this.totalTrackRecords = 0;
          }
          this.blockedTrackRecordTable = false;
        },
        error:(error) => {
          this.blockedTrackRecordTable = false;
        }
  });
  }

  convertTrackRecordValueUnits() {
    setTimeout(
      function (local: any) {
        local.fundTrackRecords = [];
        local.fundTrackRecordsClone.forEach(function (value: any) {
          let valueClone = JSON.parse(JSON.stringify(value));
          local.funddynamicCoulmns.forEach((element: any) => {
          switch (+local?.trackRecordValueUnit.typeId) {
            case FinancialValueUnitsEnum.Absolute:
              break;
            case FinancialValueUnitsEnum.Thousands:
              if (element.name == FundTrackRecordStatic.TotalInvestedCost)
                valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000).toFixed(2):valueClone[element.displayName];

                if (element.name == FundTrackRecordStatic.TotalRealizedValue)
                valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000).toFixed(2):valueClone[element.displayName];

                if (element.name == FundTrackRecordStatic.TotalUnRealizedValue)
                valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000).toFixed(2):valueClone[element.displayName];

              if (element.name == FundTrackRecordStatic.TotalValue)
                valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName];
              if (element.name == FundTrackRecordStatic.Customfield) {
                (M_Datatypes.CurrencyValue == element.dataType 
                ) ? (valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName]) : null;
              }
              break;
            case FinancialValueUnitsEnum.Millions:

              if (element.name == FundTrackRecordStatic.TotalInvestedCost)
                valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000).toFixed(2):valueClone[element.displayName];

                if (element.name == FundTrackRecordStatic.TotalRealizedValue)
                valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000).toFixed(2):valueClone[element.displayName];

                if (element.name == FundTrackRecordStatic.TotalUnRealizedValue)
                valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000).toFixed(2):valueClone[element.displayName];

                if (element.name == FundTrackRecordStatic.TotalValue)
                valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000).toFixed(2):valueClone[element.displayName];
                if (element.name == FundTrackRecordStatic.Customfield) {
                  (M_Datatypes.CurrencyValue == element.dataType 
                  ) ? (valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName]) : null;
                }
              break;
            case FinancialValueUnitsEnum.Billions:
              if (element.name == FundTrackRecordStatic.TotalInvestedCost)
              valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000000).toFixed(2):valueClone[element.displayName];

              if (element.name == FundTrackRecordStatic.TotalRealizedValue)
              valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000000).toFixed(2):valueClone[element.displayName];

              if (element.name == FundTrackRecordStatic.TotalUnRealizedValue)
              valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000000).toFixed(2):valueClone[element.displayName];

              if (element.name == FundTrackRecordStatic.TotalValue)
              valueClone[element.displayName] = valueClone[element.displayName]!="NA"?(valueClone[element.displayName]/ 1000000000).toFixed(2):valueClone[element.displayName];
              if (element.name == FundTrackRecordStatic.Customfield) {
                (M_Datatypes.CurrencyValue == element.dataType 
                ) ? (valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName]) : null;
              }
              break;
          }
        });
          local.fundTrackRecords.push(valueClone);
        });
      },
      10,
      this
    );
  }
  portfolioCompanyFundHoldingColumns = [];
  headerText = "";
  getPortfolioCompanyFundHoldingList(event: any) {
    this.portfolioCompanyFundHolding = [];
    this.noRecords = false
    if (event == null) {
      event = {
        first: 0,
        rows: 2,
        globalFilter: null,
        FilterWithoutPaging: true,
        multiSortMeta: this.fundHoldingMultiSortMeta,
      };
    }

    this.blockedPortfolioCompanyFundHoldingTable = true;
    this._dealService
      .getPortfolioCompanyFundHolding({
        quarter: this.currentFundHoldingQuarter,
        year: this.currentFundHoldingYear,
        fundIds: [this.fundTrackRecordModel.fundDetailsID],
        DealID: this.model.dealID,
        paginationFilter: event,
      })
      .subscribe({
       next:(result) => {
          if (result != null) {
            this.portfolioCompanyFundHolding = result.trackRecordDyanmicData;
            this.portfolioCompanyFundHoldingColumns = result.dynamicCoulmns;
            this.portfolioCompanyFundHoldingClone = JSON.parse(JSON.stringify(this.portfolioCompanyFundHolding));
            this.headerText = result.dealtradingheaderText;
            this.convertFundHoldingValueUnits();
          } else {
            this.portfolioCompanyFundHolding = [];
            this.totalPortfolioCompanyFundHoldingRecords = 0;
            this.noRecords = false
          }
          this.blockedPortfolioCompanyFundHoldingTable = false;
        },
        error:(error) => {
          this.blockedPortfolioCompanyFundHoldingTable = false;
        }
  });
  }

  convertFundHoldingValueUnits() {
		setTimeout(function (local: any) {
			local.portfolioCompanyFundHolding = [];
			local.portfolioCompanyFundHoldingClone.forEach(function (value: any) {
				let valueClone = JSON.parse(JSON.stringify(value));
				local.portfolioCompanyFundHoldingColumns.forEach((element: any) => {
					switch (local.trackRecordValueUnit.typeId) {
						case FinancialValueUnitsEnum.Absolute:
							break;
						case FinancialValueUnitsEnum.Thousands:
							if (element.name == DealTrackRecordStatic.InvestmentCost)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.RealizedValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.UnrealizedValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.TotalValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.Customfield) {
								(M_Datatypes.CurrencyValue == element.dataType
								) ? (valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName]) : null;
							}
							break;
						case FinancialValueUnitsEnum.Millions:
							if (element.name == DealTrackRecordStatic.InvestmentCost)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.RealizedValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.UnrealizedValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.TotalValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.Customfield) {
								(M_Datatypes.CurrencyValue == element.dataType 
								) ? (valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName]) : null;
							}
								break;
						case FinancialValueUnitsEnum.Billions:
							if (element.name == DealTrackRecordStatic.InvestmentCost)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.RealizedValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.UnrealizedValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.TotalValue)
								valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName];
							if (element.name == DealTrackRecordStatic.Customfield) {
								(M_Datatypes.CurrencyValue == element.dataType 
								) ? (valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName]) : null;
							}							
								break;
					}
				});
				local.portfolioCompanyFundHolding.push(valueClone);
			});
		}, 10, this)

	}
  loadFundHoldingsLazy(event: LazyLoadEvent) {
    if (this.displayCompanyFundHoldingsDialog) {
      this.getPortfolioCompanyFundHoldingList(event);
    }
  }


  loadTrackRecordsLazy(event: LazyLoadEvent) {
    if (this.model.fundID){
      this.isLazyLoad = false;
      this.getFundTrackRecords(event);
    }else{
      this.isLazyLoad = true;
    }
  }
  modalOption: NgbModalOptions = {};
  currentModelRef: any;
  open(trackRecordModel: any) {
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    if (trackRecordModel.encryptedFundTrackRecordId != undefined)
      trackRecordModel = this.fundTrackRecordsold.filter(x => x.encryptedFundTrackRecordId == trackRecordModel.encryptedFundTrackRecordId)[0];
    let copy = JSON.parse(JSON.stringify(trackRecordModel));
    this.currentModelRef = this.modalService.open(
      AddFundTrackRecordComponent,
      this.modalOption
    );
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.trackRecordList = this.fundTrackRecords;
    this.currentModelRef.componentInstance.onSave.subscribe((status: any) => {
      this.close(status);
    });
  }
  close(status: any) {
    this.getFundTrackRecords(null);
    this.currentModelRef.close();
  }
  openFunHoldingDetailForQuarter(fundTrackRecord: any) {
    this.currentFundHoldingQuarter = fundTrackRecord.Quarter;
    this.currentFundHoldingYear = fundTrackRecord.Year;
    this.displayCompanyFundHoldingsDialog = true;
    this.getPortfolioCompanyFundHoldingList(null);
  }

  sectorwiseHoldingValues: any;
  sectorwiseHoldingValues_AsOfDate: any;
  fundPerformanceData: any;
  fundPerformanceData_AsOfDate: any;
  chartDataLoading: boolean = false;
  getChartData() {
    this.chartDataLoading = true;
    let reportModel = {
      fundIds: [{ fundID: this.model.fundID }],
      selectedReportTypes: [
        ReportType.QuarterlyTVPI_IRR_FundDetails,
        ReportType.SectorwiseValues_FundDetails,
      ],
    };
    this.reportService.getReportData(reportModel).subscribe({next:
      (result) => {
        let local = this;
        result["body"]?.forEach(function (report: any) {
          if (report.ReportType == ReportType.QuarterlyTVPI_IRR_FundDetails) {
            local.fundPerformanceData = report.Results;
            local.fundPerformanceData_AsOfDate = local.fundPerformanceData
              .map(function (e: any) {
                return e.ValuationDate;
              })
              .sort()
              .reverse()[0];
          }

          if (report.ReportType == ReportType.SectorwiseValues_FundDetails) {
            local.sectorwiseHoldingValues = report.Results;
            local.sectorwiseHoldingValues_AsOfDate = local.sectorwiseHoldingValues
              .map(function (e: any) {
                return e.AsofDate;
              })
              .sort()
              .reverse()[0];
          }
        });
        this.chartDataLoading = false;
      },
      error:(error) => {
        this.chartDataLoading = false;
      }
  });
  }

 
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe({
    next: data => to.next(data),
    error: err => to.error(err),
    complete: () => to.complete(),
  });
}