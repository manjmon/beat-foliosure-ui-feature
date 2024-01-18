import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { InvestorService } from "../../../services/investor.service";
import { FinancialValueUnitsEnum, MiscellaneousService } from "../../../services/miscellaneous.service";
import { LazyLoadEvent } from "primeng/api";
import { PermissionService } from "src/app/services/permission.service";
import { M_Datatypes,ValuationTable,FundTrackRecordStatic,FundInvestorConstants,DealTrackRecordStatic ,InvestorCompanyPerformance,NumberDecimalConst} from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { InvestorDetailsComponent } from "./investorDetails.component";
import { MatMenu } from "@angular/material/menu";

describe("InvestorDetailsComponent", () => {  
  let component: InvestorDetailsComponent;
  let fixture: ComponentFixture<InvestorDetailsComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const toastrServiceStub = () => ({});
    const investorServiceStub = () => ({
      getInvestorByValuationTableSelection: object => ({
        subscribe: f => f({})
      }),
      getCompanyPerformanceCompanyMasterList: object => ({
        subscribe: f => f({})
      }),
      getFundInvestorWiseValuationTable: object => ({ subscribe: f => f({}) }),
      getInvestorById: object => ({ subscribe: f => f({}) }),
      getFundInvestorsById: object => ({ subscribe: f => f({}) }),
      getFundInvestorTrackRecord: model => ({ subscribe: f => f({}) }),
      getFundsByInvestor: id => ({ subscribe: f => f({}) }),
      getFundInvestorWiseDealTrackRecord: object => ({ subscribe: f => f({}) }),
      getCompanyPerformanceData: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      GetPriviousPageUrl: () => ({}),
      bindYearList: () => ({}),
      getQuarterList: () => ({}),
      getValuesPreferenceList: () => ({}),
      getTitle: arg => ({}),
      showAlertMessages: (string, message) => ({})
    });
    const permissionServiceStub = () => ({ isCheckTaabo: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InvestorDetailsComponent, MatMenu],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: InvestorService, useFactory: investorServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub }
      ]
    });
    fixture = TestBed.createComponent(InvestorDetailsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`mDataTypes has default value`, () => {
    expect(component.mDataTypes).toEqual(M_Datatypes);
  });

  it(`FundInvestorConstants has default value`, () => {
    expect(component.FundInvestorConstants).toEqual(FundInvestorConstants);
  });

  it(`DealTrackRecordInfo has default value`, () => {
    expect(component.DealTrackRecordInfo).toEqual(DealTrackRecordStatic);
  });

  it(`investorCompaniesPerformance has default value`, () => {
    expect(component.investorCompaniesPerformance).toEqual(
      InvestorCompanyPerformance
    );
  });

  it(`exportLoading has default value`, () => {
    expect(component.exportLoading).toEqual(false);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual(component.msgs);
  });

  it(`width has default value`, () => {
    expect(component.width).toEqual(0);
  });

  it(`geographicalLocationsDataConfiguration has default value`, () => {
    expect(component.geographicalLocationsDataConfiguration).toEqual([]);
  });

  it(`staticDataConfiguration has default value`, () => {
    expect(component.staticDataConfiguration).toEqual([]);
  });

  it(`hasRegion has default value`, () => {
    expect(component.hasRegion).toEqual(false);
  });

  it(`hasCountry has default value`, () => {
    expect(component.hasCountry).toEqual(false);
  });

  it(`hasState has default value`, () => {
    expect(component.hasState).toEqual(false);
  });

  it(`hasCity has default value`, () => {
    expect(component.hasCity).toEqual(false);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`investorFundData has default value`, () => {
    expect(component.investorFundData).toEqual([]);
  });

  it(`investorFundDataClone has default value`, () => {
    expect(component.investorFundDataClone).toEqual([]);
  });

  it(`investorTableColumns has default value`, () => {
    expect(component.investorTableColumns).toEqual([]);
  });

  it(`investorTableColumnsList has default value`, () => {
    expect(component.investorTableColumnsList).toEqual([]);
  });

  it(`frozenInvestorTableColumns has default value`, () => {
    expect(component.frozenInvestorTableColumns).toEqual([]);
  });

  it(`frozenInvestorTrackRecordTableColumns has default value`, () => {
    expect(component.frozenInvestorTrackRecordTableColumns).toEqual([]);
  });

  it(`tabName has default value`, () => {
    expect(component.tabName).toEqual(`Dashboard`);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`fundList has default value`, () => {
    expect(component.fundList).toEqual([]);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual([]);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual([]);
  });

  it(`valueOptions has default value`, () => {
    expect(component.valueOptions).toEqual([]);
  });

  it(`fundTrackRecordColumns has default value`, () => {
    expect(component.fundTrackRecordColumns).toEqual([]);
  });

  it(`fundTrackRecordData has default value`, () => {
    expect(component.fundTrackRecordData).toEqual([]);
  });

  it(`fundTrackRecordDataClone has default value`, () => {
    expect(component.fundTrackRecordDataClone).toEqual([]);
  });

  it(`compPerformanceData has default value`, () => {
    expect(component.compPerformanceData).toEqual([]);
  });

  it(`compPerformanceDataClone has default value`, () => {
    expect(component.compPerformanceDataClone).toEqual([]);
  });

  it(`compPerformanceColumns has default value`, () => {
    expect(component.compPerformanceColumns).toEqual([]);
  });

  it(`FundTrackRecordStatic has default value`, () => {
    expect(component.FundTrackRecordStatic).toEqual(FundTrackRecordStatic);
  });

  it(`company_cols has default value`, () => {
    expect(component.company_cols).toEqual([]);
  });

  it(`company_results has default value`, () => {
    expect(component.company_results).toEqual([]);
  });

  it(`company_resultsClone has default value`, () => {
    expect(component.company_resultsClone).toEqual([]);
  });

  it(`company_table_fundCurrency has default value`, () => {
    expect(component.company_table_fundCurrency).toEqual(`NA`);
  });

  it(`frozenInvestorCompanyTableColumns has default value`, () => {
    expect(component.frozenInvestorCompanyTableColumns).toEqual([]);
  });

  it(`company_ConversionList has default value`, () => {
    expect(component.company_ConversionList).toEqual([]);
  });

  it(`masterCompanyList has default value`, () => {
    expect(component.masterCompanyList).toEqual([]);
  });

  it(`valuationSelection has default value`, () => {
    expect(component.valuationSelection).toEqual([]);
  });

  it(`valuationQuarter has default value`, () => {
    expect(component.valuationQuarter).toEqual(`0`);
  });

  it(`valuationYear has default value`, () => {
    expect(component.valuationYear).toEqual(`0`);
  });

  it(`valuationFundId has default value`, () => {
    expect(component.valuationFundId).toEqual(0);
  });

  it(`valuationTable has default value`, () => {
    expect(component.valuationTable).toEqual([]);
  });

  it(`valuationTableClone has default value`, () => {
    expect(component.valuationTableClone).toEqual([]);
  });

  it(`valuationColumns has default value`, () => {
    expect(component.valuationColumns).toEqual([]);
  });

  it(`valuationCurrencyColumns has default value`, () => {
    expect(component.valuationCurrencyColumns).toEqual([]);
  });

  it(`valuationYearQuarter has default value`, () => {
    expect(component.valuationYearQuarter).toEqual([]);
  });

  it(`frozenInvestorValuationTableColumns has default value`, () => {
    expect(component.frozenInvestorValuationTableColumns).toEqual([]);
  });

  it(`valuationDefaultValues has default value`, () => {
    expect(component.valuationDefaultValues).toEqual(ValuationTable);
  });

  it(`unitTypeList has default value`, () => {
    expect(component.unitTypeList).toEqual([{
      typeId: FinancialValueUnitsEnum.Absolute,
      unitType: FinancialValueUnitsEnum[FinancialValueUnitsEnum.Absolute]
    }]);
  });

  it(`isTaabo has default value`, () => {
    expect(component.isTaabo).toEqual(false);
  });

  it(`companyPerformanceHeaderText has default value`, () => {
    expect(component.companyPerformanceHeaderText).toEqual(
      `Company Performance`
    );
  });

  describe("loadFundInvestorLazy", () => {
    it("makes expected calls", () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, "getFundInvestors").and.callThrough();
      component.loadFundInvestorLazy(lazyLoadEventStub);
      expect(component.getFundInvestors).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, "getTabList").and.callThrough();
      spyOn(component, "getInvestorDetails").and.callThrough();
      spyOn(component, "getFundsByInvestors").and.callThrough();
      spyOn(component, "getFundTrackRecord").and.callThrough();
      spyOn(component, "getValuationTableSelection").and.callThrough();
      spyOn(component, "getValuationDetails").and.callThrough();
      spyOn(component, "getCompanyPerformanceCompanyMasterList").and.callThrough();
      spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
      spyOn(miscellaneousServiceStub, "bindYearList").and.callThrough();
      spyOn(miscellaneousServiceStub, "getQuarterList").and.callThrough();
      spyOn(miscellaneousServiceStub,  "getValuesPreferenceList").and.callThrough();
      spyOn(permissionServiceStub, "isCheckTaabo").and.callThrough();
      component.ngOnInit();
      expect(component.getTabList).toHaveBeenCalled();
      expect(component.getInvestorDetails).toHaveBeenCalled();
      expect(component.getFundsByInvestors).toHaveBeenCalled();
      expect(component.getFundTrackRecord).toHaveBeenCalled();
      expect(component.getValuationTableSelection).toHaveBeenCalled();
      expect(component.getValuationDetails).toHaveBeenCalled();
      expect(
        component.getCompanyPerformanceCompanyMasterList
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(miscellaneousServiceStub.bindYearList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getQuarterList).toHaveBeenCalled();
      expect(
        miscellaneousServiceStub.getValuesPreferenceList
      ).toHaveBeenCalled();
      expect(permissionServiceStub.isCheckTaabo).toHaveBeenCalled();
    });
  });

  describe("ngAfterViewInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "configureMenuClose").and.callThrough();
      component.ngAfterViewInit();
    });
  });

  describe("getValuationSelectionChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "getValuationDetails").and.callThrough();
      component.getValuationSelectionChange();
      expect(component.getValuationDetails).toHaveBeenCalled();
    });
  });

  describe("getValuationTableSelection", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(
        investorServiceStub,
        "getInvestorByValuationTableSelection"
      ).and.callThrough();
      component.getValuationTableSelection();
      expect(
        investorServiceStub.getInvestorByValuationTableSelection
      ).toHaveBeenCalled();
    });
  });

  describe("getCompanyPerformanceCompanyMasterList", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(component, "getCompanyPerformance").and.callThrough();
      spyOn(
        investorServiceStub,
        "getCompanyPerformanceCompanyMasterList"
      ).and.callThrough();
      component.getCompanyPerformanceCompanyMasterList();
      expect(component.getCompanyPerformance).toHaveBeenCalled();
      expect(
        investorServiceStub.getCompanyPerformanceCompanyMasterList
      ).toHaveBeenCalled();
    });
  });

  describe("getValuationDetails", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(component, "valuationTableConvertToMillions").and.callThrough();
      spyOn(
        investorServiceStub,
        "getFundInvestorWiseValuationTable"
      ).and.callThrough();
      component.getValuationDetails();
      expect(component.valuationTableConvertToMillions).toHaveBeenCalled();
      expect(
        investorServiceStub.getFundInvestorWiseValuationTable
      ).toHaveBeenCalled();
    });
  });

  describe("getInvestorDetails", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getTitle").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.getInvestorDetails();
      expect(miscellaneousServiceStub.getTitle).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("getFundsByInvestors", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(investorServiceStub, "getFundsByInvestor").and.callThrough();
      component.getFundsByInvestors();
      expect(investorServiceStub.getFundsByInvestor).toHaveBeenCalled();
    });
  });

  describe("getTRByFund", () => {
    it("makes expected calls", () => {
      spyOn(component, "getFundTrackRecord").and.callThrough();
      component.getTRByFund();
      expect(component.getFundTrackRecord).toHaveBeenCalled();
    });
  });

  describe("getTRByQuarterAndYear", () => {
    it("makes expected calls", () => {
      spyOn(component, "getFundTrackRecord").and.callThrough();
      component.getTRByQuarterAndYear();
      expect(component.getFundTrackRecord).toHaveBeenCalled();
    });
  });

  describe("getFundTrackRecordWiseCompany", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(component, "convertToMillions").and.callThrough();
      spyOn(
        investorServiceStub,
        "getFundInvestorWiseDealTrackRecord"
      ).and.callThrough();
      component.getFundTrackRecordWiseCompany();
      expect(component.convertToMillions).toHaveBeenCalled();
      expect(
        investorServiceStub.getFundInvestorWiseDealTrackRecord
      ).toHaveBeenCalled();
    });
  });

  describe("getCompanyPerformance", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(component, "isNullOrWhitespace").and.callThrough();
      spyOn(component, "convertCompPerfToMillions").and.callThrough();
      spyOn(investorServiceStub, "getCompanyPerformanceData").and.callThrough();
      component.getCompanyPerformance();
      expect(component.isNullOrWhitespace).toHaveBeenCalled();
      expect(component.convertCompPerfToMillions).toHaveBeenCalled();
      expect(investorServiceStub.getCompanyPerformanceData).toHaveBeenCalled();
    });
  });
});
