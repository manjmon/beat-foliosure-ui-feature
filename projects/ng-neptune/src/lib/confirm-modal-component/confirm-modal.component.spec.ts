import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ConfirmModalComponent } from "./confirm-modal.component";

describe("ConfirmModalComponent", () => {
  let component: ConfirmModalComponent;
  let fixture: ComponentFixture<ConfirmModalComponent>;

  beforeEach(() => {
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (toasterMessage, string, object) => ({}),
      error: (toasterMessage, string, object) => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ConfirmModalComponent],
      providers: [{ provide: ToastrService, useFactory: toastrServiceStub }]
    });
    fixture = TestBed.createComponent(ConfirmModalComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`customwidth has default value`, () => {
    expect(component.customwidth).toEqual(`456px`);
  });

  it(`disablePrimaryButton has default value`, () => {
    expect(component.disablePrimaryButton).toEqual(false);
  });

  it(`IsInfoPopup has default value`, () => {
    expect(component.IsInfoPopup).toEqual(false);
  });

  it(`customTop has default value`, () => {
    expect(component.customTop).toEqual(`35%`);
  });

  it(`isToasterSuccess has default value`, () => {
    expect(component.isToasterSuccess).toEqual(true);
  });

  it(`hasHeaderStyle has default value`, () => {
    expect(component.hasHeaderStyle).toEqual(false);
  });

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, "success").and.callThrough();
      spyOn(toastrServiceStub, "error").and.callThrough();
      component.ngOnChanges();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });
});
