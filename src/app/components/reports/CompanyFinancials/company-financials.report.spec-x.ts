import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { AccountService } from "../../../services/account.service";
import { FundService } from "../../../services/funds.service";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../../services/portfolioCompany.service";
import {ReportCategory, ReportService ,ReportType} from "../../../services/report.service";
import { FormsModule } from "@angular/forms";
import { CompanyFinancialsReportComponent } from "./company-financials.report";

describe("CompanyFinancialsReportComponent", () => {
  let component: CompanyFinancialsReportComponent;
  let fixture: ComponentFixture<CompanyFinancialsReportComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const ngxSpinnerServiceStub = () => ({ hide: () => ({}) });
    const accountServiceStub = () => ({});
    const fundServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({ getMessageTimeSpan: () => ({}) });
    const portfolioCompanyServiceStub = () => ({
      GetOperationalKPIList: arg => ({ subscribe: f => f({}) })
    });
    const reportServiceStub = () => ({
      getReportData: model => ({ subscribe: f => f({}) }),
      setDataAvailabilityInReport: arg => ({}),
      ReportTypeList: { filter: () => ({ filter: () => ({}), value: {} }) }
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CompanyFinancialsReportComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ReportService, useFactory: reportServiceStub }
      ]
    });
    spyOn(CompanyFinancialsReportComponent.prototype, "setReportTypeList");
    fixture = TestBed.createComponent(CompanyFinancialsReportComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`cols has default value`, () => {
    expect(component.cols).toEqual([]);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`reportType has default value`, () => {
    expect(component.reportType).toEqual(ReportType);
  });

  it(`reportCategory has default value`, () => {
    expect(component.reportCategory).toEqual(ReportCategory);
  });

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`filterSection has default value`, () => {
    expect(component.filterSection).toEqual(true);
  });

  it(`showKPIFilter has default value`, () => {
    expect(component.showKPIFilter).toEqual(false);
  });

  it(`data has default value`, () => {
    expect(component.data).toEqual([]);
  });

  it(`sectorWiseOperationalKPIs has default value`, () => {
    expect(component.sectorWiseOperationalKPIs).toEqual([]);
  });

  it(`IsEnabled has default value`, () => {
    expect(component.IsEnabled).toEqual(false);
  });

  it(`ReportId has default value`, () => {
    expect(component.ReportId).toEqual(0);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`selectedKPIs has default value`, () => {
    expect(component.selectedKPIs).toEqual([]);
  });

  describe("constructor", () => {
    it("makes expected calls", () => {
      expect(
        CompanyFinancialsReportComponent.prototype.setReportTypeList
      ).toHaveBeenCalled();
    });
  });

  describe("bindReportMasterModel", () => {
    it("makes expected calls", () => {
      (<jasmine.Spy>component.setReportTypeList).calls.reset();
      spyOn(component, "getCompanyFinancialReports").and.callThrough();
      component.bindReportMasterModel();
      expect(component.setReportTypeList).toHaveBeenCalled();
      expect(component.getCompanyFinancialReports).toHaveBeenCalled();
    });
  });

  describe("getCompanyFinancialReports", () => {
    it("makes expected calls", () => {
      const ngxSpinnerServiceStub: NgxSpinnerService = fixture.debugElement.injector.get(
        NgxSpinnerService
      );
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(component, "CheckIfNoDataInReport").and.callThrough();
      spyOn(ngxSpinnerServiceStub, "hide").and.callThrough();
      spyOn(reportServiceStub, "getReportData").and.callThrough();
      component.getCompanyFinancialReports();
      expect(component.CheckIfNoDataInReport).toHaveBeenCalled();
      expect(ngxSpinnerServiceStub.hide).toHaveBeenCalled();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });

  describe("CheckIfNoDataInReport", () => {
    it("makes expected calls", () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, "setDataAvailabilityInReport").and.callThrough();
      component.CheckIfNoDataInReport();
      expect(reportServiceStub.setDataAvailabilityInReport).toHaveBeenCalled();
    });
  });

  describe("onCompanyChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "getOperationalKPIs").and.callThrough();
      spyOn(component, "getCompanyFinancialReports").and.callThrough();
      component.onCompanyChange();
      expect(component.getOperationalKPIs).toHaveBeenCalled();
      expect(component.getCompanyFinancialReports).toHaveBeenCalled();
    });
  });
});
