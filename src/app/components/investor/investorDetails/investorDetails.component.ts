import { AfterViewInit, Component, EventEmitter, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvestorService } from '../../../services/investor.service';
import {  NumberDecimalConst,  M_Datatypes, FundInvestorConstants, FundTrackRecordStatic, DealTrackRecordStatic, ValuationTable, InvestorCompanyPerformance } from "src/app/common/constants";
import { FinancialValueUnitsEnum, MiscellaneousService } from "../../../services/miscellaneous.service";
import { Message } from "primeng/api/message";
import { LazyLoadEvent } from "primeng/api";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { Subject, Observable, Subscription } from 'rxjs';
import { filter } from "rxjs/operators";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import {isNumeric} from "@angular-devkit/architect/node_modules/rxjs/internal/util/isNumeric";
import { PermissionService } from "src/app/services/permission.service";
@Component({
  selector: "investor-details",
  templateUrl: "./investorDetails.component.html",
  styleUrls: [
    "./investorDetails.component.scss",
    "../../funds/fund-details.component.scss"
  ],
})
export class InvestorDetailsComponent implements OnInit, AfterViewInit {
  mDataTypes = M_Datatypes;
  FundInvestorConstants = FundInvestorConstants;
  DealTrackRecordInfo = DealTrackRecordStatic;
  investorCompaniesPerformance=InvestorCompanyPerformance;
  exportLoading = false;
  id: any;
  sourceURL: any;
  loading = false;
  msgs: Message[] = [];
  width: number = 0;
  geographicalLocationsDataConfiguration = [];
  investorDetails;
  investorGeographicalLocationsTitle = { displayName: "" };
  staticDataConfiguration = [];
  businessDesc = { displayName: "", value: "" };
  staticDetailsTitle = { displayName: "" };
  hasRegion = false;
  hasCountry = false;
  hasState = false;
  hasCity = false;
  Headquarter = { displayName: "", value: "" };
  HeadquarterData = "";
  NumberDecimalConst = NumberDecimalConst;
  paginationFilterClone: any = {};
  blockedTable: boolean = false;
  totalRecords: number;
  dataTable: any;
  pagerLength: any;
  globalFilter: string = "";
  investorFundHeader: string = "";
  investorFundData: any = [];
  investorFundDataClone: any = [];
  investorTableColumns: any = [];
  investorTableColumnsList: any = [];
  frozenInvestorTableColumns: any = [];
  frozenInvestorTrackRecordTableColumns: any = [];
  tabName: string = "Dashboard";
  tabList: ITab[] = [];
  fundList: any[] = [];
  selectedFund: any = null;
  selectedYear: any = null;
  selectedQuarter: any = null;
  selectedValueUnitType: any = null;
  selectedInvestedValueUnitType: any = null;
  selectedPerformanceValueUnitType: any = null;
  yearOptions: any[] = [];
  quarterOptions: any[] = [];
  valueOptions: any[] = [];
  fundTrackRecordColumns: any[] = [];
  fundTrackRecordData: any[] = [];
  fundTrackRecordDataClone: any[] = [];
  compPerformanceData: any[] = [];
  compPerformanceDataClone: any[] = [];
  compPerformanceColumns: any[] = [];
  FundTrackRecordStatic = FundTrackRecordStatic;
  company_cols = [];
  company_results = [];
  company_resultsClone = [];
  company_table_fundCurrency: string = "NA";
  frozenInvestorCompanyTableColumns = [];
  company_ConversionList = [];
  CompanyGlobalFilter: string = "";
  valuationGlobalFilter: string = "";
  masterCompanyList = [];
  selectedMasterCompany = null;
  selectedcompPerYear: any = null;
  selectedcompPerQuarter: any = null;
  companyPerformanceYearQuarter: any = null;
  companyPerformanceSearchKeyWord: any = null;
  dealCurrencyCode = "";
  valuationSelection = [];
  valuationQuarter = "0";
  valuationYear = "0";
  valuationFundId = 0;
  valuationTable = [];
  valuationTableClone = [];
  valuationColumns = [];
  valuationCurrencyColumns = [];
  valuationYearQuarter = [];
  frozenInvestorValuationTableColumns = [];
  valueUnit: any;
  varErrorLog: any
  isCommonUnitClick:string="";
  performanceTableUnit: any;
  valuationDefaultValues = ValuationTable;
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
    }
  ];
  @ViewChild('menu') uiuxMenu!: MatMenu;
  @ViewChild('filterMenuTrigger') menuTrigger: MatMenuTrigger;
  isTaabo: boolean = false;
  investorStakeTitle:string=null;
  constructor(
    private _investorService: InvestorService,
    private toastrService: ToastrService,
    private _avRoute: ActivatedRoute,
    private miscService: MiscellaneousService,
    private permissionService: PermissionService
  ) {
    if (this._avRoute.snapshot.params["id"]) {
      this.id = this._avRoute.snapshot.params["id"];
    }
  }
  ngOnInit(): void {
    this.getTabList();
    this.sourceURL = this.miscService.GetPriviousPageUrl();
    if (this.id != undefined) {
      this.yearOptions = this.miscService.bindYearList();
      this.quarterOptions = this.miscService.getQuarterList();
      this.valueOptions = this.miscService.getValuesPreferenceList();
      this.selectedValueUnitType = this.valueOptions[2];
      this.selectedInvestedValueUnitType = this.valueOptions[2];
      this.selectedPerformanceValueUnitType = this.valueOptions[2];
      this.getInvestorDetails();
      this.getFundsByInvestors();
      let model = {
        encryptedFundInvestorId: this.id,
        fundId: 0,
        quarter: null,
        year: 0,
        fundInvestorId: 0
      };
      this.getFundTrackRecord(model);
      this.getValuationTableSelection();
      this.getValuationDetails();
      this.getCompanyPerformanceCompanyMasterList();
      this.yearOptions.forEach(el => {
        this.quarterOptions.forEach(ql => {
          this.valuationYearQuarter.push({ value: ql.value + ' ' + el.value.toString(), text: ql.value + ' ' + el.value.toString() });
        });
      })
    }
    this.isTaabo = this.permissionService.isCheckTaabo();
  }
  ngAfterViewInit() {
    if (this.uiuxMenu != undefined) {
    (this.uiuxMenu as any).closed = this.uiuxMenu.closed 
     	 this.configureMenuClose(this.uiuxMenu.closed);
    }
  }
  configureMenuClose(old: MatMenu['close']): MatMenu['close'] {
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
  fromQuarterYear(event: any) {
    this.valuationQuarter = event.quarter + ' ' + event.year;
    this.getValuationDetails();
  }
  fetchValuationDetailsSearch(value: any) {
    if (this.isEmptyOrSpaces(value)) {
      value = "";
    }
    this.valuationGlobalFilter = value;
    this.getValuationDetails();
  }
  getValuationSelectionChange() {
    this.getValuationDetails();
  }
  getValuationTableSelection() {
    this._investorService.getInvestorByValuationTableSelection({ encryptedInvestorId: this.id, paginationFilter: null }).subscribe((result) => {
      this.valuationQuarter = result.quarter;
      this.valuationSelection = result.fundWiseInvestorModels || [];
      this.valuationFundId = result.fundId;
    })
  }
  getCompanyPerformanceCompanyMasterList() {
    this._investorService.getCompanyPerformanceCompanyMasterList({ encryptedFundInvestorId: this.id }).subscribe(result => {
      this.masterCompanyList = result?.masterCompanies || [];
      this.selectedMasterCompany = this.masterCompanyList[0];
      this.companyPerformanceYearQuarter = result?.quarterYear?.keyValue;
      this.getCompanyPerformance();
    })
  }
  valuation_fundCurrency = "";
  getValuationDetails() {
    this._investorService.getFundInvestorWiseValuationTable({ encryptedInvestorId: this.id, quarter: this.valuationQuarter, fundId: this.valuationFundId, searchKeyWord: this.valuationGlobalFilter }).subscribe((results) => {
      this.valuationTable = results.companyDealTrackRecord || [];
      this.valuationTableClone = results.companyDealTrackRecord || [];
      this.valuationColumns = results?.columns || [];
      this.valuationCurrencyColumns = results?.currencyFields || [];
      this.valuation_fundCurrency = results?.fundCurrency;
      this.valuationColumns = this.valuationColumns.filter(
        (x) =>
          x.name != "Quarter/Month"
      );
      this.frozenInvestorValuationTableColumns = [
        {
          name: 'Quarter/Month',
          displayName: 'Quarter/Month',
          isCustom: false
        }
      ];
      this.valueUnit = this.unitTypeList[2];
      this.valuationTableConvertToMillions();
    });
  }
  valuationTableConvertToMillions() {
    setTimeout(function (local: any) {
      local.valuationTable = [];
      local.valuationTableClone.forEach(function (value: any) {
        let valueClone = JSON.parse(JSON.stringify(value));
        local.valuationCurrencyColumns.forEach((element: any) => {
          switch (+local?.valueUnit.typeId) {
            case FinancialValueUnitsEnum.Absolute:
              break;
            case FinancialValueUnitsEnum.Thousands:
              if (element.name == ValuationTable.CapitalCall)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.CapitalDistribution)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.UnrealizedGainOrLoss)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.FeesAndExpenses)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.ClosingNAV)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.CustomField)
                valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName];
              break;
            case FinancialValueUnitsEnum.Millions:
              if (element.name == ValuationTable.CapitalCall)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.CapitalDistribution)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.UnrealizedGainOrLoss)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.FeesAndExpenses)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.ClosingNAV)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.CustomField)
                valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName];
              break;
            case FinancialValueUnitsEnum.Billions:
              if (element.name == ValuationTable.CapitalCall)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.CapitalDistribution)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.UnrealizedGainOrLoss)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.FeesAndExpenses)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.ClosingNAV)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == ValuationTable.CustomField)
                valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName];
              break;
          }

        });
        local.valuationTable.push(valueClone);
      });
    }, 10, this)
  }
  onTabClick(tab: ITab) {
    if (tab != null || tab != undefined) {
      this.tabName = tab.name;
    }
  }
  getTabList() {
    this.tabList = [
      {
        active: true,
        name: "Dashboard",
      },
      {
        active: false,
        name: "Details",
      },
    ];
  }
  onResized(event: any) {
    this.width = event?.newRect?.width;
  }
  getInvestorDetails() {
    this.loading = true;
    this._investorService
      .getInvestorById({ encryptedInvestorId: this.id, paginationFilter: null })
      .subscribe({
        next:(result) => {
          let resp = result["body"];
          if (resp != null && result.code == "OK") {
            this.loading = false;
            let TotalCommitment = resp.staticDataConfiguration.find(
              (x) => x.name == "TotalCommitment"
            );
            if (TotalCommitment != undefined && TotalCommitment.value != "NA") {
              resp.staticDataConfiguration.find(
                (x) => x.name == "TotalCommitment"
              ).value =
                !isNaN(parseFloat(TotalCommitment.value)) &&
                  !isNaN(parseFloat(TotalCommitment.value))
                  ? TotalCommitment.value / 1000000
                  : TotalCommitment.value;
            }
            this.geographicalLocationsDataConfiguration =
              resp.geographicalLocationsDataConfiguration.filter(
                (x) => x.name != "Headquarter"
              );
            this.investorDetails = resp.investorDetails;
            if (document.getElementById("HeaderNameID")) {
              this.miscService.getTitle(this.investorDetails?.investorName);
            }
            localStorage.setItem(
              "headerName",
              this.investorDetails.investorName
            );
            this.investorGeographicalLocationsTitle =
              resp.investorGeographicalLocationsTitle;
            this.staticDataConfiguration = resp.staticDataConfiguration;
            this.staticDetailsTitle = resp.staticDetailsTitle;
            this.businessDesc = resp.staticDataConfiguration.find(
              (x) => x.name == "BusinessDescription"
            );
            this.hasRegion =
              resp.geographicalLocationsDataConfiguration.find(
                (x) => x.name == "Region"
              ) != undefined;
            this.hasCountry =
              resp.geographicalLocationsDataConfiguration.find(
                (x) => x.name == "Country"
              ) != undefined;
            this.hasState =
              resp.geographicalLocationsDataConfiguration.find(
                (x) => x.name == "State"
              ) != undefined;
            this.hasCity =
              resp.geographicalLocationsDataConfiguration.find(
                (x) => x.name == "City"
              ) != undefined;
          } else {
            if (resp?.status != null && resp?.status.message != "") {
              this.msgs = this.miscService.showAlertMessages(
                "error",
                resp?.status?.message
              );
            }
          }

          this.loading = false;
        },
       error: (error) => {
          this.varErrorLog = (error.error)
          this.loading = false;
        }
  });
  }
  getFundInvestors(event) {
    if (event == null) {
      event = {
        first: 0,
        rows: 1000,
        globalFilter: null,
        sortField: null,
        FilterWithoutPaging: true,
        sortOrder: 1,
      };
    }
    if (event.multiSortMeta == undefined) {
      event.multiSortMeta = [{ field: "FundName", order: 1 }];
      event.sortField = "FundName";
      event.FilterWithoutPaging = true;
    }
    this.blockedTable = true;
    this._investorService
      .getFundInvestorsById({
        encryptedInvestorId: this.id,
        paginationFilter: event,
      })
      .subscribe({
        next:(result) => {
          if (result != null) {
            this.investorFundData = result?.investorFundData;
            this.convertInvestedFundValueUnits();
            this.investorFundDataClone = JSON.parse(
              JSON.stringify(result?.investorFundData)
            );
            this.investorTableColumns = result?.dynamicColumns?.filter(
              (x) => x.name != "InvestorId"
            );
            let firmColumn = result?.dynamicColumns?.find(
              (x) => x.name == "FirmName"
            );
            if (firmColumn != undefined) {
              this.frozenInvestorTableColumns = [
                {
                  field: this.investorTableColumns[0]?.displayName,
                  header: this.investorTableColumns[0].name,
                },
                {
                  header: this.investorTableColumns[1].name,
                  field: this.investorTableColumns[1]?.displayName,
                },
              ];
            } else {
              this.frozenInvestorTableColumns = [
                {
                  field: this.investorTableColumns[0]?.displayName,
                  header: this.investorTableColumns[0].name,
                },
              ];
            }
            this.investorTableColumnsList = result?.dynamicColumns?.filter(
              (x) =>
                x.name != "InvestorId" &&
                x.name != "FundId" &&
                x.name != "FirmName"
            );
            if(this.investorStakeTitle == null)
             this.getInvestorStakeTitle();
            this.investorFundHeader = result?.investorFundTableTitle;
          }
          this.loading = false;
        },
        error:(error) => {
          this.loading = false;
        }
  });
  }
  getFundTrackRecord(model: any) {
    this.blockedTable = true;
    this._investorService
      .getFundInvestorTrackRecord(model)
      .subscribe({
        next:(result) => {
          if (result != null) {
            if ((this.selectedFund == null || this.selectedQuarter || this.selectedYear == null) && result?.investorFundTrackData?.length > 0) {
              this.selectedQuarter = this.quarterOptions?.find(x => x.value == result.quarter);
              this.selectedYear = this.yearOptions?.find(x => x.value == result.year);
              this.selectedFund = this.fundList?.find(x => x.fundName == result?.investorFundTrackData[0]?.FundName);

            }
            this.getFundTrackRecordWiseCompany();
            this.fundTrackRecordDataClone = JSON.parse(
              JSON.stringify(result?.investorFundTrackData)
            );
            this.fundTrackRecordColumns = result?.columns;
            this.fundTrackRecordData = result?.investorFundTrackData;
            let fundColumn = result?.columns?.find(
              (x) => x.name == "FundName"
            );
            this.frozenInvestorTrackRecordTableColumns = [
              {
                field: fundColumn.displayName,
                header: fundColumn.name
              }
            ];
            this.fundTrackRecordColumns = result?.columns?.filter(
              (x) =>
                x.name != "FundName"
            );
            this.convertTrackRecordValueUnits();
          }
          else {
            this.fundTrackRecordData = [];
            this.fundTrackRecordDataClone = [];
          }
        },
        error:(error) => {
          this.varErrorLog = (error.error)
          this.fundTrackRecordData = [];
          this.fundTrackRecordDataClone = [];
        }
  });
  }
  getFundsByInvestors() {
    this._investorService.getFundsByInvestor(this.id).subscribe({
      next:(result) => {
        if (result != null && result?.length > 0) {
          this.fundList = result;
        }
        this.loading = false;
      },
      error:(error) => {
        this.loading = false;
      }
  });
  }
  getInvestorStakeTitle() {
    this._investorService.getInvestorStakeTitle().subscribe(
      (result) => {
        this.investorStakeTitle = result?.title;
      }
    );
  }

  loadFundInvestorLazy(event: LazyLoadEvent) {
    this.getFundInvestors(event);
  }
  convertTrackRecordValueUnits() {
    setTimeout(
      function (local: any) {
        local.fundTrackRecordData = [];
        local?.fundTrackRecordDataClone?.forEach(function (value: any) {
          let valueClone = JSON.parse(JSON.stringify(value));
          local?.fundTrackRecordColumns?.forEach((element: any) => {
            switch (+local?.selectedValueUnitType.typeId) {
              case FinancialValueUnitsEnum.Absolute:
                break;
              case FinancialValueUnitsEnum.Thousands:
                if (element.name == FundTrackRecordStatic.TotalInvestedCost)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalRealizedValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalUnRealizedValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
                if (element.name == FundTrackRecordStatic.Customfield) {
                  (M_Datatypes.CurrencyValue == element.dataType
                  ) ? (valueClone[element.displayName] = valueClone[element.displayName] != "NA" ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName]) : null;
                }
                break;
              case FinancialValueUnitsEnum.Millions:

                if (element.name == FundTrackRecordStatic.TotalInvestedCost)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalRealizedValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalUnRealizedValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
                if (element.name == FundTrackRecordStatic.Customfield) {
                  (M_Datatypes.CurrencyValue == element.dataType
                  ) ? (valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName]) : null;
                }
                break;
              case FinancialValueUnitsEnum.Billions:
                if (element.name == FundTrackRecordStatic.TotalInvestedCost)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalRealizedValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalUnRealizedValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];

                if (element.name == FundTrackRecordStatic.TotalValue)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
                if (element.name == FundTrackRecordStatic.Customfield) {
                  (M_Datatypes.CurrencyValue == element.dataType
                  ) ? (valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName]) : null;
                }
                break;
            }
          });
          local.fundTrackRecordData.push(valueClone);
        });
      },
      10,
      this
    );
  }
  convertInvestedFundValueUnits() {
    setTimeout(
      function (local: any) {
        local.investorFundData = [];
        local?.investorFundDataClone?.forEach(function (value: any) {
          let valueClone = JSON.parse(JSON.stringify(value));
          local?.investorTableColumns?.forEach((element: any) => {
            switch (+local?.selectedInvestedValueUnitType.typeId) {
              case FinancialValueUnitsEnum.Absolute:
                break;
              case FinancialValueUnitsEnum.Millions:
                if (element.name == FundInvestorConstants.Commitment || element.name == FundInvestorConstants.NetDrawn || element.name == FundInvestorConstants.Recallable || element.name == FundInvestorConstants.UndrawnCommitment ||
                  element.name == FundInvestorConstants.AstreaTransfer || element.name == FundInvestorConstants.CommitmentAfterAstreaTransfer)
                  valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
                if (element.name == FundTrackRecordStatic.Customfield) {
                  (M_Datatypes.CurrencyValue == element.dataType
                  ) ? (valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName]) : null;
                }
                break;
            }
          });
          local.investorFundData.push(valueClone);
        });
      },
      10,
      this
    );
  }
  getTRByFund() {
    let model = {
      encryptedFundInvestorId: this.id,
      fundId: this.selectedFund?.fundID,
      quarter: null,
      year: 0,
      fundInvestorId: 0
    };
    this.selectedValueUnitType = this.valueOptions[2];
    this.getFundTrackRecord(model);
  }
  getTRByQuarterAndYear() {
    let model = {
      encryptedFundInvestorId: this.id,
      fundId: this.selectedFund?.fundID,
      quarter: this.selectedQuarter?.value,
      year: this.selectedYear?.value,
      fundInvestorId: 0
    };
    this.selectedValueUnitType = this.valueOptions[2];
    this.getFundTrackRecord(model);
  }
  isNumberCheck(str: any) {
    return isNumeric(str);
  }
  getFundTrackRecordWiseCompany() {
    this._investorService.getFundInvestorWiseDealTrackRecord({ encryptedInvestorId: this.id, quarter: this.selectedQuarter?.value, year: this.selectedYear?.value, fundId: this.selectedFund?.fundID, searchKeyWord: this.CompanyGlobalFilter }).subscribe((result: any) => {
      this.company_table_fundCurrency = result?.fundCurrency;
      this.company_cols = result?.columns || [];
      this.company_results = result?.companyDealTrackRecord || [];
      this.company_resultsClone = result?.companyDealTrackRecord || [];
      this.company_ConversionList = result?.currencyFields || []
      this.company_cols = this.company_cols.filter(
        (x) =>
          x.name != "PortfolioCompanyName"
      )
      this.frozenInvestorCompanyTableColumns = [
        {
          name: 'PortfolioCompanyName',
          displayName: 'Portfolio CompanyName',
          isCustom: false
        }
      ];
      this.convertToMillions();
    });
  }
  isEmptyOrSpaces(str) {
    return str === null || str.match(/^ *$/) !== null;
  }
  fetchItemDetailsSearch(value: any) {
    if (this.isEmptyOrSpaces(value)) {
      value = "";
    }
    this.CompanyGlobalFilter = value;
    this.getFundTrackRecordWiseCompany();
  }
  performanceFromQuarterYear(event: any) {
    this.companyPerformanceYearQuarter = event.quarter + ' ' + event.year;
    this.getCompanyPerformance();
  }
  convertToMillions() {
    setTimeout(function (local: any) {
      local.company_results = [];
      local.company_resultsClone.forEach(function (value: any) {
        let valueClone = JSON.parse(JSON.stringify(value));
        local.company_ConversionList.forEach((element: any) => {
          switch (+local?.selectedValueUnitType.typeId) {
            case FinancialValueUnitsEnum.Absolute:
              break;
            case FinancialValueUnitsEnum.Thousands:
              if (element.name == DealTrackRecordStatic.InvestmentCost)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.RealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.UnrealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.TotalValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.Customfield) {
                (M_Datatypes.CurrencyValue == element.dataType
                ) ? (valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000).toFixed(2) : valueClone[element.displayName]) : null;
              }
              break;
            case FinancialValueUnitsEnum.Millions:
              if (element.name == DealTrackRecordStatic.InvestmentCost)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.RealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.UnrealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.TotalValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.Customfield) {
                (M_Datatypes.CurrencyValue == element.dataType
                ) ? (valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000000).toFixed(2) : valueClone[element.displayName]) : null;
              }
              break;
            case FinancialValueUnitsEnum.Billions:
              if (element.name == DealTrackRecordStatic.InvestmentCost)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.RealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.UnrealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.TotalValue)
                valueClone[element.name] = valueClone[element.name] != null ? (valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == DealTrackRecordStatic.Customfield) {
                (M_Datatypes.CurrencyValue == element.dataType
                ) ? (valueClone[element.displayName] = valueClone[element.displayName] != null ? (valueClone[element.displayName] / 1000000000).toFixed(2) : valueClone[element.displayName]) : null;
              }
              break;
          }

        });
        local.company_results.push(valueClone);
      });
    }, 10, this)
  }
  fetchPerformanceItemDetailsSearch(value: any) {
    if (this.isEmptyOrSpaces(value)) {
      value = "";
    }
    this.companyPerformanceSearchKeyWord = value;
    this.getCompanyPerformance();
  }
  isNullOrWhitespace( input ) {
    if (typeof input === 'undefined' || input == null) return true;
    return input.replace(/\s/g, '')?.length < 1;
}
  companyTotal_TotalValue=null;
  companyPerformanceHeaderText="Company Performance";
  getCompanyPerformance() {
    this._investorService
      .getCompanyPerformanceData({
        masterCompanyName: this.selectedMasterCompany?.masterCompanyName,
        encryptedInvestorId: this.id, quarter: this.companyPerformanceYearQuarter,
        searchKeyWord: this.companyPerformanceSearchKeyWord
      })
      .subscribe(
        (result) => {
          if (result != null) {
            this.companyPerformanceHeaderText=result?.headerText;
            this.compPerformanceColumns = result?.columns||[];
            this.compPerformanceData =this.isNullOrWhitespace(this.companyPerformanceYearQuarter)?[]:result?.investorFundTrackData||[];
            this.compPerformanceDataClone =this.isNullOrWhitespace(this.companyPerformanceYearQuarter)?[]:result?.investorFundTrackData||[];
            let fundColumn = result?.columns?.find(
              (x) => x.name == "FundName"
            );
            this.frozenInvestorTrackRecordTableColumns = [
              {
                field: fundColumn.displayName,
                header: fundColumn.name
              }
            ];
            this.compPerformanceColumns = result?.columns?.filter(
              (x) =>
                x.name != "FundName"
            );
            this.performanceTableUnit=this.unitTypeList[2];
            this.convertCompPerfToMillions();
            this.dealCurrencyCode=this.compPerformanceData?.length>0?this.compPerformanceData[0]['Currency']:'';
          }
        });
  }
  convertCompPerfToMillions() {
    setTimeout(function (local: any) {
      local.compPerformanceData = [];
      local.compPerformanceDataClone.forEach(function (value: any) {
        let valueClone = JSON.parse(JSON.stringify(value));
        local.compPerformanceColumns.forEach((element: any) => {
          switch (+local?.performanceTableUnit.typeId) {
            case FinancialValueUnitsEnum.Absolute:
              break;
            case FinancialValueUnitsEnum.Thousands:
              if (element.name == InvestorCompanyPerformance.FundSize)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.CommitmentAfterAstreaTransfer)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalInvestedCapital)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalRealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalUnrealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalTotalValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.InvestmentCost)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.RealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.UnrealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.TotalValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
                if (element.name == InvestorCompanyPerformance.CurrentEquityValueCalculated)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000).toFixed(2) : valueClone[element.name];
              break;
            case FinancialValueUnitsEnum.Millions:
              if (element.name == InvestorCompanyPerformance.FundSize)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.CommitmentAfterAstreaTransfer)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.OriginalInvestedCapital)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.OriginalRealizedValue)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.OriginalUnrealizedValue)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.OriginalTotalValue)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.InvestmentCost)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.RealizedValue)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.UnrealizedValue)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
            if (element.name == InvestorCompanyPerformance.TotalValue)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.CurrentEquityValueCalculated)
              valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000).toFixed(2) : valueClone[element.name];
              break;
            case FinancialValueUnitsEnum.Billions:
              if (element.name == InvestorCompanyPerformance.FundSize)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.CommitmentAfterAstreaTransfer)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalInvestedCapital)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalRealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalUnrealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.OriginalTotalValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.InvestmentCost)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.RealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.UnrealizedValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              if (element.name == InvestorCompanyPerformance.TotalValue)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
                if (element.name == InvestorCompanyPerformance.CurrentEquityValueCalculated)
                valueClone[element.name] = valueClone[element.name] != null ? (+valueClone[element.name] / 1000000000).toFixed(2) : valueClone[element.name];
              break;
          }

        });
        local.compPerformanceData.push(valueClone);
      });
    }, 10, this)
  }
}
function feed<T>(from: Observable<T>, to: Subject<T>): Subscription {
  return from.subscribe({
    next: data => to.next(data),
    error: err => to.error(err),
    complete: () => to.complete(),
  });
}
