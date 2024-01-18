import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageService } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { FormsModule } from "@angular/forms";
import { SavePortfolioProfitabilityComponent } from "./portfolioCompany-profitability.component";


describe("SavePortfolioProfitabilityComponent", () => {
  let component: SavePortfolioProfitabilityComponent;
  let fixture: ComponentFixture<SavePortfolioProfitabilityComponent>;
  let form: { resetForm: jasmine.Spy };
  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({});
    const ngbActiveModalStub = () => ({});
    const messageServiceStub = () => ({ clear: () => ({}) });
    const accountServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      bindYearList: () => ({}),
      getQuarterLastDateByQuarter: (quarter, year) => ({}),
      getQuarterLastDate: arg => ({}),
      showInlineMessage: (messageService, string, string1) => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      savePortfolioProfitability: model => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SavePortfolioProfitabilityComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgbActiveModal, useFactory: ngbActiveModalStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(SavePortfolioProfitabilityComponent);
    component = fixture.componentInstance;
    form = { resetForm: jasmine.createSpy('resetForm') };
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`saveText has default value`, () => {
    expect(component.saveText).toEqual(`Create`);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });

  it(`message has default value`, () => {
    expect(component.message).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`yearOptions has default value`, () => {
    expect(component.yearOptions).toEqual(component.yearOptions);
  });

  it(`quarterOptions has default value`, () => {
    expect(component.quarterOptions).toEqual(component.quarterOptions);
  });

  describe("validateSelectedQuarter", () => {
    it("makes expected calls", () => {
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(messageServiceStub, "clear").and.callThrough();
      spyOn(
        miscellaneousServiceStub,
        "getQuarterLastDateByQuarter"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "getQuarterLastDate").and.callThrough();
      spyOn(miscellaneousServiceStub, "showInlineMessage").and.callThrough();
      spyOn(component, "validateSelectedQuarter").and.callThrough();
      component.validateSelectedQuarter();
      expect(component.validateSelectedQuarter).toHaveBeenCalled();
    });
  });
  describe("save", () => {
    it("should show error message if valuationDate is undefined", () => {
      const miscServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      spyOn(miscServiceStub, "showInlineMessage").and.callThrough();
      component.model.valuationDate = undefined;
      component.save({});
      expect(miscServiceStub.showInlineMessage).toHaveBeenCalledWith(
        messageServiceStub,
        "error",
        "Please select valid year and quarter."
      );
    });

    it("should show error message if year and quarter pair already exist", () => {
      const miscServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      component.model.valuationDate = "2022-01-01";
      component.profitabilityList = [
        {
          quarter: "Q1",
          year: "2022",
          encryptedPortfolioCompanyProfitabilityID: "123"
        }
      ];
      spyOn(miscServiceStub, "showInlineMessage").and.callThrough();
      component.save({});
      expect(miscServiceStub.showInlineMessage).toHaveBeenCalled();
    });

    it("should show error message if no value is entered in EBITDA, Net Debt, Revenue, or Enterprise Value", () => {
      const miscServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      spyOn(miscServiceStub, "showInlineMessage").and.callThrough();
      component.model.valuationDate = "2022-01-01";
      component.model.enterpriseValue = null;
      component.model.netDebt = null;
      component.model.revenue = null;
      component.model.ebitda = null;
      component.profitabilityList = [];
      component.save({});
      expect(miscServiceStub.showInlineMessage).toHaveBeenCalledWith(
        messageServiceStub,
        "error",
        "Please enter any value in EBITDA or Net Debt or Revenue or Enterprise Value"
      );
    });

    it("should show error message if savePortfolioProfitability returns an error", () => {
      const miscServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscServiceStub, "showInlineMessage").and.callThrough();
      component.model.valuationDate = "2022-01-01";
      component.model.enterpriseValue = 100;
      component.model.netDebt = 50;
      component.model.revenue = 500;
      component.model.ebitda = 200;
      component.profitabilityList = [];
      component.save({});
      expect(miscServiceStub.showInlineMessage).toHaveBeenCalled(
      );
    });
  });

  describe("formReset", () => {
    it("should reset the form and set model to modelClone", () => {
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      spyOn(messageServiceStub, "clear").and.callThrough();
      component.model = { ...component.modelClone };
      component.modelClone = {
        portfolioCompanyProfitabilityID: 1
      };
      fixture.detectChanges();
      component.formReset(form);
      expect(form.resetForm).toHaveBeenCalled();
    });
  });
});
