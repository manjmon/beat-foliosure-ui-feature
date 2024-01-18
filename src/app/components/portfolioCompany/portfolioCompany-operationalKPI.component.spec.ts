import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { NgForm,FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ConfirmationService,MessageService } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PortfolioCompanyService } from "../../services/portfolioCompany.service";
import { SavePortfolioOperationalKPIComponent } from "./portfolioCompany-operationalKPI.component";

describe("SavePortfolioOperationalKPIComponent", () => {
  let component: SavePortfolioOperationalKPIComponent;
  let fixture: ComponentFixture<SavePortfolioOperationalKPIComponent>;
  let form: { reset: jasmine.Spy };
  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const ngbActiveModalStub = () => ({});
    const confirmationServiceStub = () => ({ confirm: object => ({}) });
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
      SavePortfolioCompanyOperationalKPIValue: kpiModel => ({
        subscribe: f => f({})
      })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [SavePortfolioOperationalKPIComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: NgbActiveModal, useFactory: ngbActiveModalStub },
        { provide: ConfirmationService, useFactory: confirmationServiceStub },
        { provide: MessageService, useFactory: messageServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(SavePortfolioOperationalKPIComponent);
    component = fixture.componentInstance;
    form = { reset: jasmine.createSpy('reset') };
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`sectorwiseOperationalKPIList has default value`, () => {
    expect(component.sectorwiseOperationalKPIList).toEqual([]);
  });

  it(`companyOperationalKPIList has default value`, () => {
    expect(component.companyOperationalKPIList).toEqual([]);
  });

  it(`operationalKPIValues has default value`, () => {
    expect(component.operationalKPIValues).toEqual([]);
  });

  it(`saveText has default value`, () => {
    expect(component.saveText).toEqual(`Create`);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
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

  it(`deleteConfirmationMessage has default value`, () => {
    expect(component.deleteConfirmationMessage).toEqual(
      `Are you sure that you want to remove this KPI value for the selected quarter?`
    );
  });

  it(`message has default value`, () => {
    expect(component.message).toEqual([]);
  });

  describe("save", () => {
    it("makes expected calls", () => {
      //const ngFormStub: NgForm = <any>{};
      const messageServiceStub: MessageService = fixture.debugElement.injector.get(
        MessageService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(component, "formReset").and.callThrough();
      spyOn(messageServiceStub, "clear").and.callThrough();
      spyOn(miscellaneousServiceStub, "showInlineMessage").and.callThrough();
      spyOn(
        portfolioCompanyServiceStub,
        "SavePortfolioCompanyOperationalKPIValue"
      ).and.callThrough();
      const ngFormStub: NgForm = <any>{ reset: jasmine.createSpy('reset') };
      component.save(ngFormStub);
      expect(miscellaneousServiceStub.showInlineMessage).toHaveBeenCalled();
    });
  });
});
