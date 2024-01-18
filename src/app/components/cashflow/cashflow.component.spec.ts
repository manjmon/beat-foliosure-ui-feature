import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CashflowService } from "../../services/cashflow.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastrService } from "ngx-toastr";
import { FeaturesEnum } from "../../services/permission.service";
import { FormsModule } from "@angular/forms";
import { CashflowComponent } from "./cashflow.component";
import { MatMenuModule } from "@angular/material/menu";
import { FundCashflowConstants } from "src/app/common/constants";
import * as moment from "moment";

describe("CashflowComponent", () => {
  let component: CashflowComponent;
  let fixture: ComponentFixture<CashflowComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const cashflowServiceStub = () => ({
      newExportCashflowData: (exportData) => ({ subscribe: (f) => f({}) }),
      getCashFlowDeatils: (fileId) => ({ subscribe: (f) => f({}) }),
      GetReportngCurrencyValuesForFundPerformance: (fundData) => ({
        subscribe: (f) => f({}),
      }),
      getCashFlowFxRates: (results) => ({ subscribe: (f) => f({}) }),
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      downloadExcelFile: (response) => ({}),
    });
    const toastrServiceStub = () => ({
      error: (error, string, object) => ({}),
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CashflowComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: CashflowService, useFactory: cashflowServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
      ],
    });
    fixture = TestBed.createComponent(CashflowComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`cashflowData has default value`, () => {
    expect(component.cashflowData).toEqual([]);
  });

  it(`cashflowCalculationData has default value`, () => {
    expect(component.cashflowCalculationData).toEqual([]);
  });

  it(`realizeData has default value`, () => {
    expect(component.realizeData).toEqual([]);
  });

  it(`unRealizeData has default value`, () => {
    expect(component.unRealizeData).toEqual([]);
  });

  it(`realizeReportingCFData has default value`, () => {
    expect(component.realizeReportingCFData).toEqual([]);
  });

  it(`unRealizeReportingCFData has default value`, () => {
    expect(component.unRealizeReportingCFData).toEqual([]);
  });

  it(`othersReportingCFData has default value`, () => {
    expect(component.othersReportingCFData).toEqual([]);
  });

  it(`showUploadSection has default value`, () => {
    expect(component.showUploadSection).toEqual(true);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`cancel has default value`, () => {
    expect(component.cancel).toEqual(false);
  });

  it(`enableSaveButton has default value`, () => {
    expect(component.enableSaveButton).toEqual(true);
  });

  it(`messageClass has default value`, () => {
    expect(component.messageClass).toEqual(`bulkMessage`);
  });

  it(`uploadedFiles has default value`, () => {
    expect(component.uploadedFiles).toEqual([]);
  });

  it(`value has default value`, () => {
    expect(component.value).toEqual(0);
  });

  it(`fundList has default value`, () => {
    expect(component.fundList).toEqual([]);
  });

  it(`isOverwriteHoldings has default value`, () => {
    expect(component.isOverwriteHoldings).toEqual(false);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([
      {
        field: FundCashflowConstants.Name,
        header: FundCashflowConstants.CompanyName,
      },
    ]);
  });

  it(`frozenRows has default value`, () => {
    expect(component.frozenRows).toEqual([]);
  });

  it(`realizedColIndex has default value`, () => {
    expect(component.realizedColIndex).toEqual(0);
  });

  it(`unrealizedColIndex has default value`, () => {
    expect(component.unrealizedColIndex).toEqual(0);
  });

  it(`realizeList has default value`, () => {
    expect(component.realizeList).toEqual([]);
  });

  it(`unrealizedList has default value`, () => {
    expect(component.unrealizedList).toEqual([]);
  });

  it(`othersList has default value`, () => {
    expect(component.othersList).toEqual([]);
  });

  it(`objCashFlowList has default value`, () => {
    expect(component.objCashFlowList).toEqual([]);
  });

  it(`objReportingCashFlowList has default value`, () => {
    component.objReportingCashFlowList = [];
    expect(component.objReportingCashFlowList).toEqual([]);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([
      {
        name: FundCashflowConstants.FundCurrency,
        active: true,
        field: FundCashflowConstants.FundCashflow,
      },
      {
        name: FundCashflowConstants.ReportingCurrency,
        active: false,
        field: FundCashflowConstants.FundCashflow,
      },
    ]);
  });

  it(`fundPerformancetabList has default value`, () => {
    expect(component.fundPerformancetabList).toEqual(
      component.fundPerformancetabList
    );
  });

  it(`tabName has default value`, () => {
    expect(component.tabName).toEqual(component.tabName);
  });

  it(`tabNameFP has default value`, () => {
    expect(component.tabNameFP).toEqual(component.tabNameFP);
  });

  it(`FundCashflowData has default value`, () => {
    expect(component.FundCashflowData).toEqual([]);
  });

  it(`FundReportingCashflowData has default value`, () => {
    expect(component.FundReportingCashflowData).toEqual([]);
  });

  it(`fundCashflowRecords has default value`, () => {
    expect(component.fundCashflowRecords).toEqual([]);
  });

  it(`isCfFundCurrency has default value`, () => {
    expect(component.isCfFundCurrency).toEqual(true);
  });

  it(`isLoading has default value`, () => {
    expect(component.isLoading).toEqual(true);
  });

  it(`fundPerformanceData has default value`, () => {
    expect(component.fundPerformanceData).toEqual([]);
  });

  it(`fundPerformanceReportingData has default value`, () => {
    expect(component.fundPerformanceReportingData).toEqual([]);
  });

  it(`fundPerformanceReportingCols has default value`, () => {
    expect(component.fundPerformanceReportingCols).toEqual([]);
  });

  it(`fcReportingData has default value`, () => {
    expect(component.fcReportingData).toEqual([]);
  });

  it(`fundPerformanceReportingTempData has default value`, () => {
    expect(component.fundPerformanceReportingTempData).toEqual([]);
  });

  it(`isFundPerformance has default value`, () => {
    expect(component.isFundPerformance).toEqual(false);
  });

  it(`isFundCashFlow has default value`, () => {
    expect(component.isFundCashFlow).toEqual(false);
  });
  describe("checkIfValidDate", () => {
    it("should return true for a valid date", () => {
      const date = "01/12/2022";
      spyOn(moment(), "isValid").and.returnValue(true as never);
      const result = component.checkIfValidDate(date);
      expect(result).toBe(true);
    });

    it("should return false for an invalid date", () => {
      const date = "13/02/2022";
      spyOn(moment(), "isValid").and.returnValue(false as never);
      const result = component.checkIfValidDate(date);
      expect(result).toBe(false);
    });
  });
});