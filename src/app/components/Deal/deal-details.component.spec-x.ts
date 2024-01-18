import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA, ChangeDetectorRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { LazyLoadEvent } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { DealService } from "../../services/deal.service";
import { MiscellaneousService,FinancialValueUnitsEnum } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { OverlayContainer } from "@angular/cdk/overlay";
import { ToastrService } from "ngx-toastr";
import { FeaturesEnum } from "../../services/permission.service";
import { DealTrackRecordStatic,M_Datatypes,NumberDecimalConst } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { DealDetailsComponent } from "./deal-details.component";
import { MatMenuModule } from "@angular/material/menu";

describe("DealDetailsComponent", () => {
  let component: DealDetailsComponent;
  let fixture: ComponentFixture<DealDetailsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const ngbModalStub = () => ({
      open: (savePortfolioFundHoldingComponent, modalOption) => ({})
    });
    const accountServiceStub = () => ({});
    const dealServiceStub = () => ({
      getDealsPageConfiguration: object => ({ subscribe: f => f({}) }),
      getPortfolioCompanyFundHolding: object => ({ subscribe: f => f({}) }),
      GetPortfolioCompanyFundHolding: queryParams => ({
        subscribe: f => f({})
      }),
      GetMasterPortfolioFundHoldingModel: () => ({ subscribe: f => f({}) }),
      deleteTrackRecord: (arg, arg1) => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getSmallPagerLength: () => ({}),
      getMessageTimeSpan: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getTitle: arg => ({}),
      showAlertMessages: (string, message) => ({}),
      downloadExcelFile: response => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyProfitabilityList: object => ({
        subscribe: f => f({})
      })
    });
    const overlayContainerStub = () => ({});
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DealDetailsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgbModal, useFactory: ngbModalStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: DealService, useFactory: dealServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: OverlayContainer, useFactory: overlayContainerStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(DealDetailsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`financialValueUnits has default value`, () => {
    expect(component.financialValueUnits).toEqual(FinancialValueUnitsEnum);
  });

  it(`DealTrackRecordInfo has default value`, () => {
    expect(component.DealTrackRecordInfo).toEqual(DealTrackRecordStatic);
  });

  it(`M_DatatypesEnum has default value`, () => {
    expect(component.M_DatatypesEnum).toEqual(M_Datatypes);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`blockedPortfolioCompanyFundHoldingTable has default value`, () => {
    expect(component.blockedPortfolioCompanyFundHoldingTable).toEqual([]);
  });

  it(`portfolioCompanyFundHolding has default value`, () => {
    expect(component.portfolioCompanyFundHolding).toEqual([]);
  });

  it(`portfolioCompanyFundHoldingClone has default value`, () => {
    expect(component.portfolioCompanyFundHoldingClone).toEqual([]);
  });

  it(`blockedPortfolioCompanyProfitabilityTable has default value`, () => {
    expect(component.blockedPortfolioCompanyProfitabilityTable).toEqual([]);
  });

  it(`portfolioCompanyProfitability has default value`, () => {
    expect(component.portfolioCompanyProfitability).toEqual([]);
  });

  it(`portfolioCompanyProfitabilityClone has default value`, () => {
    expect(component.portfolioCompanyProfitabilityClone).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`holdingValueUnit has default value`, () => {
    expect(component.holdingValueUnit).toEqual(
      FinancialValueUnitsEnum.Millions
    );
  });

  it(`showHoldingValueDecimals has default value`, () => {
    expect(component.showHoldingValueDecimals).toEqual(true);
  });

  it(`profitabilityValueUnit has default value`, () => {
    expect(component.profitabilityValueUnit).toEqual(
      FinancialValueUnitsEnum.Absolute
    );
  });

  it(`showProfitabilityValueDecimals has default value`, () => {
    expect(component.showProfitabilityValueDecimals).toEqual(true);
  });

  it(`profitabilityMultiSortMeta has default value`, () => {
    expect(component.profitabilityMultiSortMeta).toEqual( [
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ]);
  });

  it(`fundHoldingMultiSortMeta has default value`, () => {
    expect(component.fundHoldingMultiSortMeta).toEqual([
      { field: "year", order: -1 },
      { field: "quarter", order: -1 },
    ]);
  });

  it(`dealData has default value`, () => {
    expect(component.dealData).toEqual([]);
  });

  it(`isProfitability has default value`, () => {
    expect(component.isProfitability).toEqual(true);
  });

  it(`isExportLoading has default value`, () => {
    expect(component.isExportLoading).toEqual(false);
  });

  it(`isdownloadfilter has default value`, () => {
    expect(component.isdownloadfilter).toEqual(true);
  });

  it(`isConfirmPopUp has default value`, () => {
    expect(component.isConfirmPopUp).toEqual(false);
  });

  it(`unitTypeList has default value`, () => {
    expect(component.unitTypeList).toEqual(component.unitTypeList);
  });

  it(`frozenDealTableColumns has default value`, () => {
    expect(component.frozenDealTableColumns).toEqual([]);
  });

  it(`portfolioCompanyFundHoldingColumns has default value`, () => {
    expect(component.portfolioCompanyFundHoldingColumns).toEqual([]);
  });

  describe("loadPortfolioFundHoldingLazy", () => {
    it("makes expected calls", () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      component.loadPortfolioFundHoldingLazy(lazyLoadEventStub);
    });
  });

  describe("loadPortfolioProfitabilityLazy", () => {
    it("makes expected calls", () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(
        component,
        "getPortfolioCompanyProfitabilityList"
      ).and.callThrough();
      component.loadPortfolioProfitabilityLazy(lazyLoadEventStub);
      expect(component.getPortfolioCompanyProfitabilityList).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "checkHost").and.callThrough();
      spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
      component.ngOnInit();
      expect(component.checkHost).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
    });
  });

  describe("ngAfterViewInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "configureMenuClose").and.callThrough();
      component.ngAfterViewInit();
      expect(component.configureMenuClose).toHaveBeenCalled();
    });
  });

  describe("getDealDetails", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "getMasterPortfolioFundHoldingModel").and.callThrough();
      spyOn(component, "getPortfolioCompanyFundHoldingList").and.callThrough();
      spyOn(dealServiceStub, "getDealsPageConfiguration").and.callThrough();
      spyOn(miscellaneousServiceStub, "getTitle").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.getDealDetails();
      expect(component.getMasterPortfolioFundHoldingModel).toHaveBeenCalled();
      expect(component.getPortfolioCompanyFundHoldingList).toHaveBeenCalled();
      expect(dealServiceStub.getDealsPageConfiguration).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getTitle).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("exportFundHoldingValues", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        dealServiceStub,
        "GetPortfolioCompanyFundHolding"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.exportFundHoldingValues();
      expect(dealServiceStub.GetPortfolioCompanyFundHolding).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("getMasterPortfolioFundHoldingModel", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(
        dealServiceStub,
        "GetMasterPortfolioFundHoldingModel"
      ).and.callThrough();
      component.getMasterPortfolioFundHoldingModel();
      expect(
        dealServiceStub.GetMasterPortfolioFundHoldingModel
      ).toHaveBeenCalled();
    });
  });
});
