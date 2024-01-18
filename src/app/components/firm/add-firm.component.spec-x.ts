import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from "@angular/core";
import { NgForm, FormControl, FormGroup,FormsModule} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ConfirmationService } from "primeng/api";
import { AccountService } from "../../services/account.service";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastrService } from "ngx-toastr";
import { AddFirmComponent } from "./add-firm.component";
import { observable, of} from "rxjs";

describe("AddFirmComponent", () => {
  let component: AddFirmComponent;
  let fixture: ComponentFixture<AddFirmComponent>;
  beforeEach(() => {
    const changeDetectorRefStub = () => ({
      markForCheck: () => ({}),
      detectChanges: () => ({})
    });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const confirmationServiceStub = () => ({ confirm: object => ({}) });
    const accountServiceStub = () => ({});
    const firmServiceStub = () => ({
      getMasterFirmModel: () => ({ subscribe: f => f({}) }),
      getFirmById: object => ({ subscribe: f => f({}) }),
      addFirm: model => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getDesignationList: () => ({ subscribe: f => f({}) }),
      getSideBarWidth: () => ({})
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (message, string, object) => ({}),
      success: (message, string, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddFirmComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ConfirmationService, useFactory: confirmationServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AddFirmComponent);
    component = fixture.componentInstance;
  });
  it("can load instance", () => {
    expect(component).toBeTruthy();
  });
  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });
  it(`deleteConfirmationMessage has default value`, () => {
    expect(component.deleteConfirmationMessage).toEqual(
      `Are you sure that you want to delete this record?`
    );
  });
  it(`title has default value`, () => {
    expect(component.title).toEqual(`Create`);
  });
  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });
  it(`firmStatus has default value`, () => {
    expect(component.firmStatus).toEqual(true);
  });
  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });
  it(`employeeEditMode has default value`, () => {
    expect(component.employeeEditMode).toEqual(false);
  });
  describe("addEmployees", () => {
    it("makes expected calls", () => {
      const form = new FormGroup({
        $key: new FormControl(null)

      });
      const ngFormStub: NgForm = <NgForm>{
        form: form,
        valid: true
      }
      component.employeeEditMode = true;
      component.firmEmployee.employeeName = "fake";
      component.firmEmployee.emailId = "fake@gmail.com";
      component.firmEmployee.employeeId = "123";
      component.model.firmEmployees = [{
        employeeId: 123, emailId: "fake@gmail.com", employeeName: "fake"
      }];

      spyOn(component, "updateEmployee").withArgs(ngFormStub).and.callThrough();
      spyOn(component, "clearEmployees").withArgs(ngFormStub).and.callThrough();
      component.addEmployees(ngFormStub);
      expect(component.updateEmployee).toHaveBeenCalled();
      expect(component.clearEmployees).toHaveBeenCalled();
    });
  });
  describe("updateEmployee", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      const form = new FormGroup({
        $key: new FormControl(null)
      });
      const ngFormStub: NgForm = <NgForm>{
        form: form
      }

      component.firmEmployee.employeeName = "fake";
      component.firmEmployee.emailId = "fake@gmail.com";
      component.firmEmployee.employeeId = "123";
      component.model.firmEmployees = [{
        employeeId: 123, emailId: "fake@gmail.com", employeeName: "fake"
      }];

      spyOn(component, "clearEmployees").withArgs(ngFormStub).and.callThrough();
      spyOn(changeDetectorRefStub.constructor.prototype, "detectChanges").and.callThrough();
      component.updateEmployee(ngFormStub);
      expect(component.clearEmployees).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });
  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "getTabList").and.callThrough();
      spyOn(component, "setDefaultValues").and.callThrough();
      spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
      spyOn(miscellaneousServiceStub, "getDesignationList").and.callThrough();
      component.ngOnInit();
      expect(component.getTabList).toHaveBeenCalled();
      expect(component.setDefaultValues).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(miscellaneousServiceStub.getDesignationList).toHaveBeenCalled();
    });
  });
  describe("getSideNavWidth", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getSideBarWidth").and.callThrough();
      component.getSideNavWidth();
      expect(miscellaneousServiceStub.getSideBarWidth).toHaveBeenCalled();
    });
  });
  describe("setDefaultValues", () => {
    it("makes expected calls", () => {
      const firmServiceStub: FirmService = fixture.debugElement.injector.get(
        FirmService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const res:any = {
        body : {
          status : {
            message : "test"}
        }
      }
      spyOn(firmServiceStub, "getFirmById").and.callThrough().and.returnValue(of(res));
      spyOn(toastrServiceStub, "error").and.callThrough();
      component.id = 1;
      component.setDefaultValues();
      expect(firmServiceStub.getFirmById).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });
});