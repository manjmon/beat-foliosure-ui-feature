import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef} from "@angular/core";
import { ActivatedRoute,Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LazyLoadEvent } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { DealService } from "../../services/deal.service";
import { FundService } from "../../services/funds.service";
import { MiscellaneousService,FinancialValueUnitsEnum } from "../../services/miscellaneous.service";
import { ReportService } from "../../services/report.service";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { FundReportService } from "src/app/services/fund-report.service";
import { AppSettingService } from "../../services/appsettings.service";
import { ToastrService } from "ngx-toastr";
import { FormsModule } from "@angular/forms";
import { FundDetailsComponent } from "./fund-details.component";
import { MatMenuModule } from "@angular/material/menu";
import { of, throwError } from 'rxjs'; // Import the missing 'of' and 'throwError' symbols

describe("FundDetailsComponent", () => {
  let component: FundDetailsComponent;
  let fixture: ComponentFixture<FundDetailsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({ navigate: array => ({}) });
    const ngbModalStub = () => ({
      open: (addFundTrackRecordComponent, modalOption) => ({})
    });
    const accountServiceStub = () => ({});
    const dealServiceStub = () => ({
      getDealsList: object => ({ subscribe: f => f({}) }),
      getPortfolioCompanyFundHolding: object => ({ subscribe: f => f({}) })
    });
    const fundServiceStub = () => ({
      getFundExcelDownload: cmodel => ({ subscribe: f => of({}) }),
      getFundById: object => ({ subscribe: f => f({}) }),
      getFundTrackRecordList: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      getSmallPagerLength: () => ({}),
      bindYearList: () => ({}),
      GetPriviousPageUrl: () => ({}),
      downloadExcelFile: results => ({}),
      downloadPDFFile: results => ({}),
      getTitle: arg => ({}),
      showAlertMessages: (string, message) => ({})
    });
    const reportServiceStub = () => ({
      getReportData: reportModel => ({ subscribe: f => f({}) })
    });
    const portfolioCompanyServiceStub = () => ({
      pdfExport: object => ({ subscribe: f => of({}) })
    });
    const fundReportServiceStub = () => ({
      fundReportGraphs: id => ({ subscribe: f => f({}) })
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    const toastrServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],  
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FundDetailsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgbModal, useFactory: ngbModalStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ReportService, useFactory: reportServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: FundReportService, useFactory: fundReportServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    spyOn(FundDetailsComponent.prototype, "CombinedLPReport");
    spyOn(FundDetailsComponent.prototype, "FundReportLatest");
    spyOn(FundDetailsComponent.prototype, "triggerFalseClick");
    fixture = TestBed.createComponent(FundDetailsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`investorList has default value`, () => {
    expect(component.investorList).toEqual(component.investorList);
  });

  it(`isOpenAddEditTrackRecord has default value`, () => {
    expect(component.isOpenAddEditTrackRecord).toEqual(component.isOpenAddEditTrackRecord);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(component.NumberDecimalConst);
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(component.feature);
  });

  it(`financialValueUnits has default value`, () => {
    expect(component.financialValueUnits).toEqual(component.financialValueUnits);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`deals has default value`, () => {
    expect(component.deals).toEqual(component.deals);
  });

  it(`fundTrackRecords has default value`, () => {
    expect(component.fundTrackRecords).toEqual([]);
  });

  it(`fundTrackRecordsClone has default value`, () => {
    expect(component.fundTrackRecordsClone).toEqual(component.fundTrackRecordsClone);
  });

  it(`portfolioCompanyFundHolding has default value`, () => {
    expect(component.portfolioCompanyFundHolding).toEqual([]);
  });

  it(`portfolioCompanyFundHoldingClone has default value`, () => {
    expect(component.portfolioCompanyFundHoldingClone).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(component.loading);
  });

  it(`blockedDealsTable has default value`, () => {
    expect(component.blockedDealsTable).toEqual(component.blockedDealsTable);
  });

  it(`blockedTrackRecordTable has default value`, () => {
    expect(component.blockedTrackRecordTable).toEqual(false);
  });

  it(`blockedPortfolioCompanyFundHoldingTable has default value`, () => {
    expect(component.blockedPortfolioCompanyFundHoldingTable).toEqual(component.blockedPortfolioCompanyFundHoldingTable);
  });

  it(`isOpenAdd has default value`, () => {
    expect(component.isOpenAdd).toEqual(false);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual(component.yearOptions);
  });

  it(`isOpenTR has default value`, () => {
    expect(component.isOpenTR).toEqual(false);
  });

  it(`displayCompanyFundHoldingsDialog has default value`, () => {
    expect(component.displayCompanyFundHoldingsDialog).toEqual(false);
  });

  it(`trackRecordValueUnit has default value`, () => {
    expect(component.trackRecordValueUnit).toEqual(
      component.trackRecordValueUnit
    );
  });

  it(`showTrackRecordValueDecimals has default value`, () => {
    expect(component.showTrackRecordValueDecimals).toEqual(component.showTrackRecordValueDecimals);
  });

  it(`holdingValueUnit has default value`, () => {
    expect(component.holdingValueUnit).toEqual(
      FinancialValueUnitsEnum.Thousands
    );
  });

  it(`showHoldingValueDecimals has default value`, () => {
    expect(component.showHoldingValueDecimals).toEqual(component.showHoldingValueDecimals);
  });

  it(`fundTrakRecordMultiSortMeta has default value`, () => {
    expect(component.fundTrakRecordMultiSortMeta).toEqual([{ field: "year", order: -1 }, { field: "quarter", order: -1 }]);
  });

  it(`fundHoldingMultiSortMeta has default value`, () => {
    expect(component.fundHoldingMultiSortMeta).toEqual([{ field: "year", order: -1 }, { field: "quarter", order: -1 }]);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(component.width);
  });

  it(`chart1Data has default value`, () => {
    expect(component.chart1Data).toEqual(component.chart1Data);
  });

  it(`chart2Data has default value`, () => {
    expect(component.chart2Data).toEqual(component.chart2Data);
  });

  it(`exportLoading has default value`, () => {
    expect(component.exportLoading).toEqual(component.exportLoading);
  });

  it(`fundStaticConfiguartionData has default value`, () => {
    expect(component.fundStaticConfiguartionData).toEqual(component.fundStaticConfiguartionData);
  });

  it(`fundTermsConfiguartionData has default value`, () => {
    expect(component.fundTermsConfiguartionData).toEqual(component.fundTermsConfiguartionData);
  });

  it(`fundLocationConfiguartionData has default value`, () => {
    expect(component.fundLocationConfiguartionData).toEqual([]);
  });

  it(`fundStaticConfiguartionData_Custom has default value`, () => {
    expect(component.fundStaticConfiguartionData_Custom).toEqual([]);
  });

  it(`fundTermsConfiguartionData_Custom has default value`, () => {
    expect(component.fundTermsConfiguartionData_Custom).toEqual(component.fundTermsConfiguartionData_Custom);
  });

  it(`companyInformationConstants has default value`, () => {
    expect(component.companyInformationConstants).toEqual(
      component.companyInformationConstants
    );
  });

  it(`isDataUpdated has default value`, () => {
    expect(component.isDataUpdated).toEqual(component.isDataUpdated);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual(component.quarterOptions);
  });

  it(`isdownloadfilter has default value`, () => {
    expect(component.isdownloadfilter).toEqual(true);
  });

  it(`isLazyLoad has default value`, () => {
    expect(component.isLazyLoad).toEqual(component.isLazyLoad);
  });

  it(`headerText has default value`, () => {
    expect(component.headerText).toEqual(`Track Record`);
  });

  it(`chartDataLoading has default value`, () => {
    expect(component.chartDataLoading).toEqual(component.chartDataLoading);
  });

  it(`isPageLoaded has default value`, () => {
    expect(component.isPageLoaded).toEqual(false);
  });

  it(`isPageLoadedAfterView has default value`, () => {
    expect(component.isPageLoadedAfterView).toEqual(false);
  });

  it(`reportGraphData has default value`, () => {
    expect(component.reportGraphData).toEqual(component.reportGraphData);
  });

  it(`graphList has default value`, () => {
    expect(component.graphList).toEqual(component.graphList);
  });

  // describe("loadFundHoldingsLazy", () => {
  //   it("makes expected calls", () => {
  //     const lazyLoadEventStub: LazyLoadEvent = <any>{};
  //     spyOn(component, "getPortfolioCompanyFundHoldingList").and.callThrough();
  //     spyOn(component, "loadFundHoldingsLazy").and.callThrough();
  //     component.loadFundHoldingsLazy(lazyLoadEventStub);
  //     expect(component.getPortfolioCompanyFundHoldingList).toHaveBeenCalled();
  //     expect(component.loadFundHoldingsLazy).toHaveBeenCalled();
  //   });
  // });

  // describe("loadDealsLazy", () => {
  //   it("makes expected calls", () => {
  //     const lazyLoadEventStub: LazyLoadEvent = <any>{};
  //     spyOn(component, "getDeals").and.callThrough();
  //     spyOn(component, "loadDealsLazy").and.callThrough();
  //     component.loadDealsLazy(lazyLoadEventStub);
  //     expect(component.getDeals).toHaveBeenCalled();
  //     expect(component.loadDealsLazy).toHaveBeenCalled();
  //   });
  // });

  // describe("constructor", () => {
  //   it("makes expected calls", () => {
  //     spyOn(FundDetailsComponent.prototype, "triggerFalseClick").and.callThrough();
  //     spyOn(FundDetailsComponent.prototype, "CombinedLPReport").and.callThrough();
  //     spyOn(FundDetailsComponent.prototype, "FundReportLatest").and.callThrough();
  //     // Remove the unnecessary object instantiation
  //     // new FundDetailsComponent();
  //     expect(FundDetailsComponent.prototype.triggerFalseClick).toHaveBeenCalled();
  //     expect(FundDetailsComponent.prototype.CombinedLPReport).toHaveBeenCalled();
  //     expect(FundDetailsComponent.prototype.FundReportLatest).toHaveBeenCalled();
  //   });
  // });

  // describe("ngOnInit", () => {
  //   it("makes expected calls", () => {
  //     const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
  //       MiscellaneousService
  //     );
  //     spyOn(component, "getFundDetails").and.callThrough();
  //     spyOn(component, "FundGraphsReport").and.callThrough();
  //     spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
  //     component.ngOnInit();
  //     expect(component.getFundDetails).toHaveBeenCalled();
  //     expect(component.FundGraphsReport).toHaveBeenCalled();
  //     expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
  //   });
  // });

  // describe("onFundExcelSubmit", () => {
  //   it("makes expected calls", () => {
  //     const fundServiceStub: FundService = fixture.debugElement.injector.get(
  //       FundService
  //     );
  //     const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
  //       MiscellaneousService
  //     );
  //     spyOn(fundServiceStub, "getFundExcelDownload").and.callThrough();
  //     spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
  //     spyOn(component, "ExcelExportFund").and.callThrough(); // Call the ExcelExportFund method
  //     spyOn(component, "onFundExcelSubmit").and.callThrough();
  //     component.onFundExcelSubmit();
  //     expect(fundServiceStub.getFundExcelDownload).toHaveBeenCalled();
  //     expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
  //     expect(component.ExcelExportFund).toHaveBeenCalled(); // Assert that ExcelExportFund is called
  //     expect(component.onFundExcelSubmit).toHaveBeenCalled();
  //   });
  // });


  describe("FundReportLatest", () => {
    it("makes expected calls", () => {
      spyOn(component, "FundGraphsReport").and.returnValue(); // Add a mock implementation for FundGraphsReport
      (<jasmine.Spy>component.FundReportLatest).and.callThrough();
      component.FundReportLatest();
      expect(component.FundGraphsReport).toHaveBeenCalled();
    });
  });


  // describe("getFundDetails", () => {
  //   it("makes expected calls", () => {
  //     const fundServiceStub: FundService = fixture.debugElement.injector.get(
  //       FundService
  //     );
  //     const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
  //       MiscellaneousService
  //     );
  //     spyOn(component, "sortByKey").and.callThrough();
  //     spyOn(component, "getChartData").and.callThrough();
  //     spyOn(component, "getDeals").and.callThrough();
  //     spyOn(fundServiceStub, "getFundById").and.callThrough();
  //     spyOn(miscellaneousServiceStub, "getTitle").and.callThrough();
  //     spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
  //     spyOn(component, "getFundDetails").and.callThrough();
  //     component.getFundDetails();
  //     expect(component.sortByKey).toHaveBeenCalled();
  //     expect(component.getChartData).toHaveBeenCalled();
  //     expect(component.getDeals).toHaveBeenCalled();
  //     expect(fundServiceStub.getFundById).toHaveBeenCalled();
  //     expect(miscellaneousServiceStub.getTitle).toHaveBeenCalled();
  //     expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
  //     expect(component.getFundDetails).toHaveBeenCalled();
  //   });
  // });

 
  it('should handle error when loading chart data', () => {
    // Arrange
    spyOn((component as any).reportService, 'getReportData').and.returnValue(throwError('Error')); // Make the 'reportService' property public

    // Act
    component.getChartData();

    // Assert
    expect(component.chartDataLoading).toBeFalse();
  });

  // describe("FundGraphsReport", () => {
  //   it("makes expected calls", () => {
  //     const fundReportServiceStub: fundReportService = fixture.debugElement.injector.get(
  //       fundReportService
  //     );
  //     spyOn(fundReportServiceStub, "fundReportGraphs").and.callThrough();
  //     spyOn(component, "getChartData").and.stub(); // Add a mock implementation for getChartData
  //     component.FundGraphsReport();
  //     expect(fundReportServiceStub.fundReportGraphs).toHaveBeenCalled();
  //     expect(component.getChartData).toHaveBeenCalled();
  //   });
  // });

  // describe("ngAfterViewInit", () => {
  //   it("makes expected calls", () => {
  //     spyOn(component, "ngForRendred" as keyof FundDetailsComponent).and.callThrough();
  //     spyOn(component, "configureMenuClose").and.callThrough();
  //     spyOn(component, "ngAfterViewInit").and.callThrough();
  //     component.ngAfterViewInit();
  //     expect(component.ngForRendred).toHaveBeenCalled();
  //     expect(component.configureMenuClose).toHaveBeenCalled();
  //     expect(component.ngAfterViewInit).toHaveBeenCalled();
  //   });
  // });

 
});
