import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LazyLoadEvent } from "primeng/api";
import { AccountService } from "../../../services/account.service";
import { DealService } from "../../../services/deal.service";
import { FundService } from "../../../services/funds.service";
import { MiscellaneousService ,FinancialValueUnitsEnum} from "../../../services/miscellaneous.service";
import { ReportService } from "../../../services/report.service";
import { DealTrackRecordStatic,FundTrackRecordStatic,NumberDecimalConst,M_Datatypes } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { TrackrecordsComponent } from "./trackrecords.component";
import { MatMenuModule } from "@angular/material/menu";
import { fakeAsync, tick } from '@angular/core/testing';
import { of } from "rxjs";

describe("TrackrecordsComponent", () => {
  let component: TrackrecordsComponent;
  let fixture: ComponentFixture<TrackrecordsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const ngbModalStub = () => ({
      open: (addFundTrackRecordComponent, modalOption) => ({})
    });
    const accountServiceStub = () => ({});
    const dealServiceStub = () => ({
      getPortfolioCompanyFundHolding: object => ({ subscribe: f => f({}) })
    });
    const fundServiceStub = () => ({
      GetPortfolioCompanyFundHolding: queryParams => ({
        subscribe: f => of({})
      }),
      getFundById: object => ({ subscribe: f => f({}) }),
      getFundTrackRecordList: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      getSmallPagerLength: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getSideBarWidth: () => ({}),
      downloadExcelFile: response => ({})
    });
    const reportServiceStub = () => ({
      getReportData: reportModel => ({ subscribe: f => of({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TrackrecordsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgbModal, useFactory: ngbModalStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ReportService, useFactory: reportServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TrackrecordsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`isOpenTrackRecord has default value`, () => {
    expect(component.isOpenTrackRecord).toEqual(false);
  });

  it(`isUpdated has default value`, () => {
    expect(component.isUpdated).toEqual(false);
  });

  it(`financialValueUnits has default value`, () => {
    expect(component.financialValueUnits).toEqual(FinancialValueUnitsEnum);
  });

  it(`DealTrackRecordInfo has default value`, () => {
    expect(component.DealTrackRecordInfo).toEqual(DealTrackRecordStatic);
  });

  it(`FundTrackRecordStatic has default value`, () => {
    expect(component.FundTrackRecordStatic).toEqual(FundTrackRecordStatic);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`Mdatatypes has default value`, () => {
    expect(component.Mdatatypes).toEqual(M_Datatypes);
  });

  it(`deals has default value`, () => {
    expect(component.deals).toEqual([]);
  });

  it(`fundTrackRecords has default value`, () => {
    expect(component.fundTrackRecords).toEqual([]);
  });

  it(`fundTrackRecordsold has default value`, () => {
    expect(component.fundTrackRecordsold).toEqual([]);
  });

  it(`fundTrackRecordsClone has default value`, () => {
    expect(component.fundTrackRecordsClone).toEqual([]);
  });

  it(`portfolioCompanyFundHolding has default value`, () => {
    expect(component.portfolioCompanyFundHolding).toEqual([]);
  });

  it(`portfolioCompanyFundHoldingClone has default value`, () => {
    expect(component.portfolioCompanyFundHoldingClone).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`blockedDealsTable has default value`, () => {
    expect(component.blockedDealsTable).toEqual(false);
  });

  it(`isExportLoading has default value`, () => {
    expect(component.isExportLoading).toEqual(false);
  });

  it(`blockedTrackRecordTable has default value`, () => {
    expect(component.blockedTrackRecordTable).toEqual(false);
  });

  it(`blockedPortfolioCompanyFundHoldingTable has default value`, () => {
    expect(component.blockedPortfolioCompanyFundHoldingTable).toEqual(false);
  });

  it(`displayCompanyFundHoldingsDialog has default value`, () => {
    expect(component.displayCompanyFundHoldingsDialog).toEqual(false);
  });

  it(`showTrackRecordValueDecimals has default value`, () => {
    expect(component.showTrackRecordValueDecimals).toEqual(true);
  });

  it(`holdingValueUnit has default value`, () => {
    expect(component.holdingValueUnit).toEqual(
      FinancialValueUnitsEnum.Millions
    );
  });

  it(`showHoldingValueDecimals has default value`, () => {
    expect(component.showHoldingValueDecimals).toEqual(true);
  });

  it(`funddynamicCoulmns has default value`, () => {
    expect(component.funddynamicCoulmns).toEqual([]);
  });

  it(`frozenFundTrackTableColumns has default value`, () => {
    expect(component.frozenFundTrackTableColumns).toEqual([]);
  });

  it(`fundTrakRecordMultiSortMeta has default value`, () => {
    expect(component.fundTrakRecordMultiSortMeta).toEqual( [
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ]);
  });

  it(`fundHoldingMultiSortMeta has default value`, () => {
    component.fundHoldingMultiSortMeta = [
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ];
    expect(component.fundHoldingMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ]);
  });

  it(`noRecords has default value`, () => {
    expect(component.noRecords).toEqual(false);
  });

  it(`isOpenAdd has default value`, () => {
    expect(component.isOpenAdd).toEqual(false);
  });

  it(`unitTypeList has default value`, () => {
    expect(component.unitTypeList).toEqual([
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
    ]);
  });

  it(`portfolioCompanyFundHoldingColumns has default value`, () => {
    expect(component.portfolioCompanyFundHoldingColumns).toEqual([]);
  });

  // describe("ngAfterViewInit", () => {
  //   it("makes expected calls", fakeAsync(() => { // Use fakeAsync
  //     spyOn(component, "configureMenuClose").and.callThrough();
  //     component.ngAfterViewInit();
  //     tick(); // Use tick to simulate the passage of time
  //     fixture.detectChanges(); // Add this line to trigger change detection
  //     expect(component.configureMenuClose).toHaveBeenCalled();
  //   }));
  // });

  // Add this value accessor for the form control 'trackRecordValueUnitGroup'

  // describe("getFundDetails", () => {
  //   it("makes expected calls", () => {
  //     const fundServiceStub: FundService = fixture.debugElement.injector.get(
  //       FundService
  //     );
  //     spyOn(component, "getFundTrackRecords").and.callThrough();
  //     spyOn(component, "getChartData").and.callThrough();
  //     spyOn(fundServiceStub, "getFundById").and.callThrough();
  //     component.getFundDetails();
  //     expect(component.getFundTrackRecords).toHaveBeenCalled();
  //     expect(component.getChartData).toHaveBeenCalled();
  //     expect(fundServiceStub.getFundById).toHaveBeenCalled();
  //   });
  // });

  describe("getChartData", () => {
    it("makes expected calls", () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, "getReportData").and.callThrough();
      component.getChartData();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });
});
