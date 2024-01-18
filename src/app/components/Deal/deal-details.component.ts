import { ChangeDetectorRef, Component, OnInit, ViewChildren, ViewChild, QueryList, ElementRef, ViewEncapsulation,EventEmitter } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Message } from "primeng/api/message";
import { MessageService,LazyLoadEvent } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { DealService } from "../../services/deal.service";
import { FinancialValueUnitsEnum, MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { SavePortfolioFundHoldingComponent } from "./portfolio-fundHolding.component";
import { DealTrackRecordStatic,M_Datatypes,CommonPCConstants,NumberDecimalConst } from "src/app/common/constants";
import { isNumeric } from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { OverlayContainer } from "@angular/cdk/overlay";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { Observable, Subject,Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { ToastContainerDirective, ToastrService } from "ngx-toastr";
@Component({
  selector: "deal-details",
  templateUrl: "./deal-details.component.html",
  providers: [SavePortfolioFundHoldingComponent, MessageService],
  styleUrls: ["./deal-details.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DealDetailsComponent implements OnInit {
  feature: typeof FeaturesEnum = FeaturesEnum;
  NumberDecimalConst = NumberDecimalConst;
  financialValueUnits: typeof FinancialValueUnitsEnum = FinancialValueUnitsEnum;
  DealTrackRecordInfo = DealTrackRecordStatic;
  M_DatatypesEnum = M_Datatypes;
  msgs: Message[] = [];
  id: any;
  dataTable: any;
  masterFundHoldingModel: any = {};
  blockedPortfolioCompanyFundHoldingTable: any = [];
  portfolioCompanyFundHolding: any[] = [];
  portfolioCompanyFundHoldingClone: any[] = [];
  totalPortfolioCompanyFundHoldingRecords: any;
  blockedPortfolioCompanyProfitabilityTable: any = [];
  portfolioCompanyProfitability: any = [];
  portfolioCompanyProfitabilityClone: any[] = [];
  totalPortfolioCompanyProfitabilityRecords: any;
  model: any = {};
  fundHoldingModel: any = {};
  loading = false;
  pagerLength: any;
  msgTimeSpan: number;
  holdingValueUnit: FinancialValueUnitsEnum = FinancialValueUnitsEnum.Millions;
  showHoldingValueDecimals: boolean = true;
  profitabilityValueUnit: FinancialValueUnitsEnum =
    FinancialValueUnitsEnum.Absolute;
  showProfitabilityValueDecimals: boolean = true;
  profitabilityMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  fundHoldingMultiSortMeta: any[] = [
    { field: "year", order: -1 },
    { field: "quarter", order: -1 },
  ];
  dealData = [];
  pageDetails = { displayName: "" };
  isProfitability: boolean = true;
  isExportLoading: boolean = false;
  isLazyLoad: boolean = false;
  isdownloadfilter: boolean = true;
  isConfirmPopUp: boolean = false;
  selectedFundHolding: any = null;
  @ViewChildren("tblFundHolding") tblFundHolding: QueryList<ElementRef>;
  @ViewChild("tblportfolioCompanyFundHoldingColumns")
  tblportfolioCompanyFundHoldingColumns: ElementRef;
  @ViewChild("menu") uiuxMenu!: MatMenu;
  @ViewChild("menu1") uiuxMenu1!: MatMenu;
  @ViewChild("tRecordTrigger") menuTrigger: MatMenuTrigger;
  @ViewChild(ToastContainerDirective, {})
  toastContainer: ToastContainerDirective;
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
  frozenDealTableColumns = [];
  trackRecordValueUnit: any;
  profitabilityValueUnit1: any;

  constructor(
	private toastrService: ToastrService,
    private overlayContainer: OverlayContainer,
    private accountService: AccountService,
    private miscService: MiscellaneousService,
    private dealService: DealService,
    protected changeDetectorRef: ChangeDetectorRef,
    private _avRoute: ActivatedRoute,
    private modalService: NgbModal,
    private portfolioCompanyService: PortfolioCompanyService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
    this.pagerLength = this.miscService.getSmallPagerLength();
    this.trackRecordValueUnit = this.unitTypeList[2];
    this.profitabilityValueUnit1 = this.unitTypeList[2];
    this.msgTimeSpan = this.miscService.getMessageTimeSpan();
  }
  sourceURL: any;

  ngOnInit() {
	this.toastrService.overlayContainer = this.toastContainer;
    this.trackRecordValueUnit = this.unitTypeList[2];
    this.profitabilityValueUnit1 = this.unitTypeList[2];
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    if (this.id != undefined) {
      this.getDealDetails();
    }
    this.checkHost();
  }
  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
      (this.uiuxMenu as any).closed = this.uiuxMenu.closed
      this.configureMenuClose(this.uiuxMenu.closed);
      (this.uiuxMenu1 as any).closed = this.uiuxMenu1.closed
      this.configureMenuClose(this.uiuxMenu1.closed);
    }
  }
  configureMenuClose(old: MatMenu["close"]): MatMenu["close"] {
    const upd = new EventEmitter();
    feed(
      upd.pipe(
        filter((event) => {
          if (event === "click") {
            return false;
          }
          this.isdownloadfilter = true;
          return true;
        })
      ),
      old
    );
    return upd;
  }
  checkHost() {
    if (window.location.host == CommonPCConstants.TaaboHost || window.location.host == CommonPCConstants.ExeterHost || window.location.host == CommonPCConstants.LarissaHost || window.location.host == CommonPCConstants.MonmouthHost || window.location.host == CommonPCConstants.PizarroHost)
      this.isProfitability = false;
  }
  getDealDetails() {
    this.loading = true;
    this.getMasterPortfolioFundHoldingModel();
    this.dealService
      .getDealsPageConfiguration({
        encryptedDealID: this.id,
        includeAllDetails: true,
        includeAllPageConfiguration: false,
      })
      .subscribe({
       next:(result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.model = resp.dealDetails.dealList[0];
            if (this.isLazyLoad) this.getPortfolioCompanyFundHoldingList(null);
            this.dealData = resp.staticFieldValueList;
            localStorage.setItem("headerName", this.dealData[0].value);
            if (document.getElementById("HeaderNameID")) {
              this.miscService.getTitle(this.dealData[0]?.value);
            }
            this.fundHoldingModel.dealID = this.model.dealID;
            this.fundHoldingModel.investementDate = new Date(
              this.model.investmentDate
            );
            this.loading = false;
            this.pageDetails =
              resp.pageDetails !== undefined
                ? resp.pageDetails
                : this.pageDetails;
          } else {
            if (result.message != "") {
              this.msgs = this.miscService.showAlertMessages(
                "error",
                resp?.status?.message
              );
            }
          }
          this.loading = false;
        },
        error:(error) => {
          this.loading = false;
        }
  });
  }
  portfolioCompanyFundHoldingColumns = [];
  headerText = "";
  getPortfolioCompanyFundHoldingList(event: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: "year-quarter",
        multiSortMeta: this.fundHoldingMultiSortMeta,
        sortOrder: -1,
        filterWithoutPaging:true
      };
    }
    this.blockedPortfolioCompanyFundHoldingTable = true;
    this.dealService
      .getPortfolioCompanyFundHolding({
        DealID: this.model.dealID,
        paginationFilter: event,
      })
      .subscribe({
        next:(result) => {
          if (result != null) {
            this.portfolioCompanyFundHolding = result.trackRecordDyanmicData;
            this.portfolioCompanyFundHoldingColumns = result?.dynamicCoulmns?.filter((x) => x.name != "Quarter");
            let dealColumn = result?.dynamicCoulmns?.find(
              (x) => x.name == "Quarter"
            );
            this.frozenDealTableColumns = [
              {
                field: dealColumn?.displayName,
                header: dealColumn?.name,
              },
            ];
            if (this.portfolioCompanyFundHoldingColumns.length > 0) {
              this.portfolioCompanyFundHoldingColumns.push({
                name: "Action",
                displayName: "Action",
              });
              this.portfolioCompanyFundHoldingClone = JSON.parse(
                JSON.stringify(this.portfolioCompanyFundHolding)
              );
              this.headerText = result.dealtradingheaderText;
              this.convertToMillions();
            }
          } else {
            this.portfolioCompanyFundHolding = [];
            this.totalPortfolioCompanyFundHoldingRecords = 0;
          }
          this.blockedPortfolioCompanyFundHoldingTable = false;
        },
        error:(error) => {
          this.blockedPortfolioCompanyFundHoldingTable = false;
        }
  });
  }

  convertToMillions() {
    setTimeout(
      function (local: any) {
        local.portfolioCompanyFundHolding = [];
        local.portfolioCompanyFundHoldingClone.forEach(function (value: any) {
          let valueClone = JSON.parse(JSON.stringify(value));
          local.portfolioCompanyFundHoldingColumns.forEach((element: any) => {
            if (element.name == DealTrackRecordStatic.InvestmentCost)
              valueClone[element.displayName] =
                valueClone[element.displayName] != "NA"
                  ? (valueClone[element.displayName] / 1000000).toFixed(2)
                  : valueClone[element.displayName];
            if (element.name == DealTrackRecordStatic.RealizedValue)
              valueClone[element.displayName] =
                valueClone[element.displayName] != "NA"
                  ? (valueClone[element.displayName] / 1000000).toFixed(2)
                  : valueClone[element.displayName];
            if (element.name == DealTrackRecordStatic.UnrealizedValue)
              valueClone[element.displayName] =
                valueClone[element.displayName] != "NA"
                  ? (valueClone[element.displayName] / 1000000).toFixed(2)
                  : valueClone[element.displayName];
            if (element.name == DealTrackRecordStatic.TotalValue)
              valueClone[element.displayName] =
                valueClone[element.displayName] != "NA"
                  ? (valueClone[element.displayName] / 1000000).toFixed(2)
                  : valueClone[element.displayName];
            if (element.name == DealTrackRecordStatic.Customfield) {
              M_Datatypes.CurrencyValue == element.dataType
                ? (valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000).toFixed(2)
                      : valueClone[element.displayName])
                : null;
            }
          });
          local.portfolioCompanyFundHolding.push(valueClone);
        });
      },
      10,
      this
    );
  }
  convertFundHoldingValueUnits() {
    setTimeout(
      function (local: any) {
        local.portfolioCompanyFundHolding = [];
        local.holdingValueUnit = local.trackRecordValueUnit.typeId;
        local.portfolioCompanyFundHoldingClone.forEach(function (value: any) {
          let valueClone = JSON.parse(JSON.stringify(value));
          local.portfolioCompanyFundHoldingColumns.forEach((element: any) => {
            switch (+local.holdingValueUnit) {
              case FinancialValueUnitsEnum.Absolute:
                break;
              case FinancialValueUnitsEnum.Thousands:
                if (element.name == DealTrackRecordStatic.InvestmentCost)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.RealizedValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.UnrealizedValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.TotalValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.Customfield) {
                  M_Datatypes.CurrencyValue == element.dataType
                    ? (valueClone[element.displayName] =
                        valueClone[element.displayName] != "NA"
                          ? (valueClone[element.displayName] / 1000).toFixed(2)
                          : valueClone[element.displayName])
                    : null;
                }
                break;
              case FinancialValueUnitsEnum.Millions:
                if (element.name == DealTrackRecordStatic.InvestmentCost)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.RealizedValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.UnrealizedValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.TotalValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000).toFixed(2)
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.Customfield) {
                  M_Datatypes.CurrencyValue == element.dataType
                    ? (valueClone[element.displayName] =
                        valueClone[element.displayName] != "NA"
                          ? (valueClone[element.displayName] / 1000000).toFixed(
                              2
                            )
                          : valueClone[element.displayName])
                    : null;
                }
                break;
              case FinancialValueUnitsEnum.Billions:
                if (element.name == DealTrackRecordStatic.InvestmentCost)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000000).toFixed(
                          2
                        )
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.RealizedValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000000).toFixed(
                          2
                        )
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.UnrealizedValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000000).toFixed(
                          2
                        )
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.TotalValue)
                  valueClone[element.displayName] =
                    valueClone[element.displayName] != "NA"
                      ? (valueClone[element.displayName] / 1000000000).toFixed(
                          2
                        )
                      : valueClone[element.displayName];
                if (element.name == DealTrackRecordStatic.Customfield) {
                  M_Datatypes.CurrencyValue == element.dataType
                    ? (valueClone[element.displayName] =
                        valueClone[element.displayName] != "NA"
                          ? (
                              valueClone[element.displayName] / 1000000000
                            ).toFixed(2)
                          : valueClone[element.displayName])
                    : null;
                }
                break;
            }
          });
          local.portfolioCompanyFundHolding.push(valueClone);
        });
      },
      10,
      this
    );
  }

  exportFundHoldingValues() {
    let event = {
      first: 0,
      rows: 10,
      globalFilter:
        this.tblportfolioCompanyFundHoldingColumns.nativeElement.value || "",
      sortField: "year-quarter",
      multiSortMeta: this.fundHoldingMultiSortMeta,
      sortOrder: -1,
    };

    let filter = {
      currency: this.model?.currencyDetail?.currencyCode,
      valueType: this.financialValueUnits[this.holdingValueUnit],
      showDecimalPlace: this.showHoldingValueDecimals,
    };

    let queryParams = Object.assign(
      {},
      { DealID: this.model.dealID },
      { paginationFilter: event },
      filter
    );
    this.isExportLoading = true;
    this.dealService.GetPortfolioCompanyFundHolding(queryParams).subscribe({
      next:(response) => {
        this.miscService.downloadExcelFile(response);
        this.isExportLoading = false;
      },
      error:(error) => {
      this.isExportLoading = false;
      }
  });
  }

  getPortfolioCompanyProfitabilityList(event: any) {
    if (event == null) {
      event = {
        first: 0,
        rows: 10,
        globalFilter: null,
        sortField: "year-quarter",
        multiSortMeta: this.profitabilityMultiSortMeta,
        sortOrder: -1,
      };
    }

    this.blockedPortfolioCompanyProfitabilityTable = true;
    this.portfolioCompanyService
      .getPortfolioCompanyProfitabilityList({
        encryptedDealId: this.id,
        paginationFilter: event,
      })
      .subscribe({
        next:(result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.portfolioCompanyProfitability =
              resp.portfolioCompanyProfitabilityList;
            this.portfolioCompanyProfitabilityClone = JSON.parse(
              JSON.stringify(this.portfolioCompanyProfitability)
            );
            this.totalPortfolioCompanyProfitabilityRecords = resp.totalRecords;
          } else {
            this.portfolioCompanyProfitability = [];
            this.totalPortfolioCompanyProfitabilityRecords = 0;
          }
          this.blockedPortfolioCompanyProfitabilityTable = false;
        },
        error:(error) => {
          this.blockedPortfolioCompanyProfitabilityTable = false;
        }
  });
  }

  convertProfitabilityValueUnits() {
    setTimeout(
      function (local: any) {
        local.portfolioCompanyProfitability = [];
        local.profitabilityValueUnit = local.profitabilityValueUnit1.typeId;
        local.portfolioCompanyProfitabilityClone.forEach(function (value: any) {
          let valueClone = JSON.parse(JSON.stringify(value));
          switch (+local.profitabilityValueUnit) {
            case FinancialValueUnitsEnum.Absolute:
              break;
            case FinancialValueUnitsEnum.Thousands:
              valueClone.ebitda = (valueClone.ebitda / 1000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000).toFixed(2);
              break;
            case FinancialValueUnitsEnum.Millions:
              valueClone.ebitda = (valueClone.ebitda / 1000000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000000).toFixed(2);
              break;
            case FinancialValueUnitsEnum.Billions:
              valueClone.ebitda = (valueClone.ebitda / 1000000000).toFixed(2);
              valueClone.netDebt = (valueClone.netDebt / 1000000000).toFixed(2);
              valueClone.revenue = (valueClone.revenue / 1000000000).toFixed(2);
              break;
          }
          local.portfolioCompanyProfitability.push(valueClone);
        });
      },
      10,
      this
    );
  }

  loadPortfolioFundHoldingLazy(event: LazyLoadEvent) {
    if (this.model.dealID) {
      this.isLazyLoad = false;
      this.getPortfolioCompanyFundHoldingList(event);
    } else {
      this.isLazyLoad = true;
    }
  }

  loadPortfolioProfitabilityLazy(event: LazyLoadEvent) {
    this.getPortfolioCompanyProfitabilityList(event);
  }

  getMasterPortfolioFundHoldingModel() {
    this.dealService.GetMasterPortfolioFundHoldingModel().subscribe({
      next:(result) => {
        this.masterFundHoldingModel = result["body"];
      },
      error:(error) => {
        this.loading = false;
      }
  });
  }
  modalOption: NgbModalOptions = {};
  currentModelRef: any;
  open(fundHoldingModel: any) {
    this.modalOption.backdrop = "static";
    this.modalOption.keyboard = false;
    this.modalOption.size = "lg";
    this.modalOption.windowClass = "xlModal";
    let copy = JSON.parse(JSON.stringify(fundHoldingModel));
    this.currentModelRef = this.modalService.open(
      SavePortfolioFundHoldingComponent,
      this.modalOption
    );
    this.currentModelRef.componentInstance.model = copy;
    this.currentModelRef.componentInstance.fundHoldingList =
      this.portfolioCompanyFundHolding;
    this.currentModelRef.componentInstance.masterModel =
      this.masterFundHoldingModel;
    this.currentModelRef.componentInstance.dealModel = this.model;
    this.currentModelRef.componentInstance.onSave.subscribe((data: any) => {
      this.close(data);
    });
  }

  close(data: any) {
    this.getPortfolioCompanyFundHoldingList(null);
    this.currentModelRef.close();
    this.msgs = this.miscService.showAlertMessages("success", data.message);
  }

  isNumberCheck(str: any) {
    return isNumeric(str);
  }
  openConfirmPopUp(fundHolding: any) {
    this.selectedFundHolding = fundHolding;
    this.isConfirmPopUp = true;
  }
  OnDeleteTrackRecord($event) {
    this.dealService.deleteTrackRecord(this.selectedFundHolding?.dealId,this.selectedFundHolding?.
		portfolioCompanyFundHoldingID).subscribe({
    next:(result) => {
		this.isConfirmPopUp = false;
		this.selectedFundHolding = false;
		this.toastrService.success("Deal track record deleted successfully", "", {
			positionClass: "toast-center-center",
		  });
		this.getPortfolioCompanyFundHoldingList(null);
      },
    error:(error) => {
		this.isConfirmPopUp = false;
		this.toastrService.error("Unable to delete deal track record for this quarter !", "", {
			positionClass: "toast-center-center",
		  });
      }
  });
  }
  OnCancelDeleteTrackRecord($event) {
    this.isConfirmPopUp = false;
  }
}

function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe({
    next: data => to.next(data),
    error: err => to.error(err),
    complete: () => to.complete(),
  });
}
