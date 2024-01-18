import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FirmDetailsComponent } from "./firm-details.component";

describe("FirmDetailsComponent", () => {
  let component: FirmDetailsComponent;
  let fixture: ComponentFixture<FirmDetailsComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const accountServiceStub = () => ({});
    const firmServiceStub = () => ({
      getFirmById: object => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      GetPriviousPageUrl: () => ({}),
      getTitle: arg => ({}),
      showAlertMessages: (string, message) => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FirmDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(FirmDetailsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const firmServiceStub: FirmService = fixture.debugElement.injector.get(
        FirmService
      );
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(firmServiceStub, "getFirmById").and.callThrough();
      spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
      component.ngOnInit();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(firmServiceStub.getFirmById).toHaveBeenCalled();
    });
  });
});
