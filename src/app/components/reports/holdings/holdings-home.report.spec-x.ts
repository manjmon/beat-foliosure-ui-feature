import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { MessageService } from "primeng/api";
import { FeaturesEnum } from "../../../services/permission.service";
import { ReportType } from "../../../services/report.service";
import { HoldingsReportsComponent } from "./holdings-home.report";

describe("HoldingsReportsComponent", () => {
  let component: HoldingsReportsComponent;
  let fixture: ComponentFixture<HoldingsReportsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const messageServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HoldingsReportsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: MessageService, useFactory: messageServiceStub }
      ]
    });
    fixture = TestBed.createComponent(HoldingsReportsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`tabName has default value`, () => {
    expect(component.tabName).toEqual(`Funds`);
  });

  it(`fundList has default value`, () => {
    expect(component.fundList).toEqual([]);
  });

  it(`regionList has default value`, () => {
    expect(component.regionList).toEqual([]);
  });

  it(`countryList has default value`, () => {
    expect(component.countryList).toEqual([]);
  });

  it(`strategyList has default value`, () => {
    expect(component.strategyList).toEqual([]);
  });

  it(`fundHoldingStatusList has default value`, () => {
    expect(component.fundHoldingStatusList).toEqual([]);
  });

  it(`portfolioCompanyList has default value`, () => {
    expect(component.portfolioCompanyList).toEqual([]);
  });

  it(`filterSection has default value`, () => {
    expect(component.filterSection).toEqual(true);
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

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`collapsed has default value`, () => {
    expect(component.collapsed).toEqual(true);
  });

  it(`tabToggle has default value`, () => {
    expect(component.tabToggle).toEqual(false);
  });

  it(`types has default value`, () => {
    expect(component.types).toEqual([]);
  });

  it(`subReportTypeList has default value`, () => {
    expect(component.subReportTypeList).toEqual([]);
  });

  it(`isDataAvailableInReports has default value`, () => {
    expect(component.isDataAvailableInReports).toEqual(false);
  });

  it(`optionListData has default value`, () => {
    expect(component.optionListData).toEqual([]);
  });

  it(`fundListClone has default value`, () => {
    expect(component.fundListClone).toEqual([]);
  });

  it(`strategyListClone has default value`, () => {
    expect(component.strategyListClone).toEqual([]);
  });

  it(`regionCountryMappingList has default value`, () => {
    expect(component.regionCountryMappingList).toEqual([]);
  });

  it(`regionListClone has default value`, () => {
    expect(component.regionListClone).toEqual([]);
  });

  it(`countryListClone has default value`, () => {
    expect(component.countryListClone).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getTabList").and.callThrough();
      component.ngOnInit();
      expect(component.getTabList).toHaveBeenCalled();
    });
  });
});
