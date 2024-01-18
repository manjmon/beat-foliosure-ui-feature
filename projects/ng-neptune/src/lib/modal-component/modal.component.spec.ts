import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ModalComponent } from "./modal.component";

describe("ModalComponent", () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(() => {
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (toasterMessage, string, object) => ({})
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ModalComponent],
      providers: [{ provide: ToastrService, useFactory: toastrServiceStub }]
    });
    fixture = TestBed.createComponent(ModalComponent);
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

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.ngOnChanges();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });
});
