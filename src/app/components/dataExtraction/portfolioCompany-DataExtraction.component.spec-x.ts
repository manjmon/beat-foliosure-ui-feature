import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef} from "@angular/core";
import { AccountService } from "../../services/account.service";
import { FundService } from "../../services/funds.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FormsModule } from "@angular/forms";
import { PortfolioCompanyDataExtractionComponent } from "./portfolioCompany-DataExtraction.component";

describe("PortfolioCompanyDataExtractionComponent", () => {
  let component: PortfolioCompanyDataExtractionComponent;
  let fixture: ComponentFixture<PortfolioCompanyDataExtractionComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const accountServiceStub = () => ({});
    const fundServiceStub = () => ({
      getFundsList: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      bindYearList: () => ({}),
      bindMonthList: () => ({}),
      getMessageTimeSpan: () => ({}),
      getPortfolioCompanyList: object => ({ subscribe: f => f({}) }),
      getKPIListByPCIdsKPIType: kpiQueryModel => ({ subscribe: f => f({}) }),
      showAlertMessages: (string, message) => ({}),
      getDateRangeForDataExtractionReport: previewDateRangeModel => ({
        subscribe: f => f({})
      }),
      exportFinancialReport: model => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({}),
      getQuarterLastDateByQuarter: (value, value1) => ({}),
      getMonthNumber: value => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyDataExtractionComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PortfolioCompanyDataExtractionComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`KPITypeList has default value`, () => {
    expect(component.KPITypeList).toEqual(component.KPITypeList);
  });

  it(`periods has default value`, () => {
    expect(component.periods).toEqual([]);
  });

  it(`periodTypes has default value`, () => {
    expect(component.periodTypes).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`selectedMonths has default value`, () => {
    expect(component.selectedMonths).toEqual([]);
  });

  it(`IsEnabled has default value`, () => {
    expect(component.IsEnabled).toEqual(false);
  });

  it(`ReportId has default value`, () => {
    expect(component.ReportId).toEqual(100);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual(component.yearOptions);
  });

  it(`monthOptions has default value`, () => {
    expect(component.monthOptions).toEqual(component.monthOptions);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual([
      { value: "Q1", text: "Q1", number: 1 },
      { value: "Q2", text: "Q2", number: 2 },
      { value: "Q3", text: "Q3", number: 3 },
      { value: "Q4", text: "Q4", number: 4 },
    ]);
  });

  it(`NoRecordFound has default value`, () => {
    expect(component.NoRecordFound).toEqual(false);
  });

  it(`exportFinancialReportLoading has default value`, () => {
    expect(component.exportFinancialReportLoading).toEqual(false);
  });

  it(`companyKPIsList has default value`, () => {
    expect(component.companyKPIsList).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "InitializeDataExtractionPage").and.callThrough();
      component.ngOnInit();
      expect(component.InitializeDataExtractionPage).toHaveBeenCalled();
    });
  });

  describe("InitializeDataExtractionPage", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "getFundList").and.callThrough();
      spyOn(component, "getPortfolioCompanyList").and.callThrough();
      spyOn(miscellaneousServiceStub, "getMessageTimeSpan").and.callThrough();
      component.InitializeDataExtractionPage();
      expect(component.getFundList).toHaveBeenCalled();
      expect(component.getPortfolioCompanyList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMessageTimeSpan).toHaveBeenCalled();
    });
  });

  describe("getPortfolioCompanyList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "getPortfolioCompanyList"
      ).and.callThrough();
      component.getPortfolioCompanyList();
      expect(
        miscellaneousServiceStub.getPortfolioCompanyList
      ).toHaveBeenCalled();
    });
  });

  describe("GetDateRangeForDataExtractionReport", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "getDateRangeForDataExtractionReport"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.GetDateRangeForDataExtractionReport();
      expect(
        miscellaneousServiceStub.getDateRangeForDataExtractionReport
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("onPeriodTypeSelect", () => {
    it("makes expected calls", () => {
      spyOn(component, "DoEnableFilters").and.callThrough();
      component.onPeriodTypeSelect();
      expect(component.DoEnableFilters).toHaveBeenCalled();
    });
  });

  describe("onPeriodSelect", () => {
    it("makes expected calls", () => {
      spyOn(component, "setPeriodDatesForModel").and.callThrough();
      spyOn(component, "DoEnableFilters").and.callThrough();
      component.onPeriodSelect();
      expect(component.setPeriodDatesForModel).toHaveBeenCalled();
      expect(component.DoEnableFilters).toHaveBeenCalled();
    });
  });

  describe("ExportFinancialReport", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      spyOn(
        miscellaneousServiceStub,
        "exportFinancialReport"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.ExportFinancialReport();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
      expect(miscellaneousServiceStub.exportFinancialReport).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("setPeriodDatesForModel", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "getQuarterLastDateByQuarter"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "getMonthNumber").and.callThrough();
      component.setPeriodDatesForModel();
      expect(
        miscellaneousServiceStub.getQuarterLastDateByQuarter
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getMonthNumber).toHaveBeenCalled();
    });
  });

  describe("validateFromQuarter", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "DoEnableFilters").and.callThrough();
      spyOn(changeDetectorRefStub, "detectChanges").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.validateFromQuarter();
      expect(component.DoEnableFilters).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("validateToQuarter", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "DoEnableFilters").and.callThrough();
      spyOn(changeDetectorRefStub, "detectChanges").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.validateToQuarter();
      expect(component.DoEnableFilters).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("validateSelectedFromYear", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "DoEnableFilters").and.callThrough();
      spyOn(component, "setPeriodDatesForModel").and.callThrough();
      spyOn(changeDetectorRefStub, "detectChanges").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.validateSelectedFromYear();
      expect(component.DoEnableFilters).toHaveBeenCalled();
      expect(component.setPeriodDatesForModel).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("validateSelectedToYear", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "DoEnableFilters").and.callThrough();
      spyOn(component, "setPeriodDatesForModel").and.callThrough();
      spyOn(changeDetectorRefStub, "detectChanges").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.validateSelectedToYear();
      expect(component.DoEnableFilters).toHaveBeenCalled();
      expect(component.setPeriodDatesForModel).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });
});
