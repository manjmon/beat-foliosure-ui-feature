import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ActivatedRoute } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { SaveKPIComponent } from "./save-kpi.component";
import { of } from "rxjs";

describe("SaveKPIComponent", () => {
  let component: SaveKPIComponent;
  let fixture: ComponentFixture<SaveKPIComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ markForCheck: () => ({}) });
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      getPagerLength: () => ({ subscribe: f => of({}) }),
      getSectorList: () => ({ subscribe: f => of({}) }),
      getCompanySubKpiList: portfolioCompanyID => ({ subscribe: f => f({}) }),
      getPortfolioCompanyList: object => ({ subscribe: f => f({}) }),
      getFinancialKpiById: id => ({ subscribe: f => f({}) }),
      showAlertMessages: (string, message) => ({}),
      getOperationalKpiById: id => ({ subscribe: f => of({}) }),
      getSectorwiseKpiById: id => ({ subscribe: f => of({}) }),
      getCompanyKpiById: id => ({ subscribe: f => of({}) }),
      saveKPI: finalModel => ({ subscribe: f => f({}) })
    });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SaveKPIComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub }
      ]
    });
    fixture = TestBed.createComponent(SaveKPIComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`Create`);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`forUpdate has default value`, () => {
    expect(component.forUpdate).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "setDefaultValues").and.callThrough();
      spyOn(miscellaneousServiceStub, "getSectorList").and.callThrough();
      component.ngOnInit();
      expect(component.setDefaultValues).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getSectorList).toHaveBeenCalled();
    });
  });

  describe("setDefaultValues", () => {
    it("makes expected calls", () => {
      const spy = spyOn(component, 'setDefaultValues').and.callThrough();
      spyOn(component, "onKPIChange").and.callThrough();
      spyOn(component, "getFinancialKpiById").and.callThrough();
      spyOn(component, "getOperationalKpiById").and.callThrough();
      spyOn(component, "getSectorwiseKpiById").and.callThrough();
      component.setDefaultValues();
      expect(component.setDefaultValues).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });
  });

  describe("getFinancialKpiById", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getFinancialKpiById").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.getFinancialKpiById();
      expect(miscellaneousServiceStub.getFinancialKpiById).toHaveBeenCalled();
      expect(miscellaneousServiceStub.showAlertMessages).toHaveBeenCalled();
    });
  });

  describe("getOperationalKpiById", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "getOperationalKpiById"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.getOperationalKpiById();
      expect(miscellaneousServiceStub.getOperationalKpiById).toHaveBeenCalled();
    });
  });

  describe("getSectorwiseKpiById", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getSectorwiseKpiById").and.callThrough();
      spyOn(miscellaneousServiceStub, "showAlertMessages").and.callThrough();
      component.getSectorwiseKpiById();
      expect(miscellaneousServiceStub.getSectorwiseKpiById).toHaveBeenCalled();
    });
  });

  describe("getCompanywiseKpiById", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getCompanyKpiById").and.callThrough();
      component.getCompanywiseKpiById();
      expect(miscellaneousServiceStub.getCompanyKpiById).toHaveBeenCalled();
    });
  });
});
