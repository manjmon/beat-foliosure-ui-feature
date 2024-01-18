import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FormsModule } from "@angular/forms";
import { TypeAheadControlComponent } from "./typeahead-control.component";

describe("TypeAheadControlComponent", () => {
  let component: TypeAheadControlComponent;
  let fixture: ComponentFixture<TypeAheadControlComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const miscellaneousServiceStub = () => ({});
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TypeAheadControlComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TypeAheadControlComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`isRequired has default value`, () => {
    expect(component.isRequired).toEqual(false);
  });

  it(`disabled has default value`, () => {
    expect(component.disabled).toEqual(false);
  });

  it(`placeholder has default value`, () => {
    expect(component.placeholder).toEqual(`Select`);
  });

  it(`loadingOptions has default value`, () => {
    expect(component.loadingOptions).toEqual(false);
  });

  it(`readonly has default value`, () => {
    expect(component.readonly).toEqual(false);
  });

  describe("onBlur", () => {
    it("makes expected calls", () => {
      spyOn(component, "onClear").and.callThrough();
      component.onBlur();
      expect(component.onClear).toHaveBeenCalled();
    });
  });

  describe("onLocationChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "writeValue").and.callThrough();
      component.onLocationChange();
      expect(component.writeValue).toHaveBeenCalled();
    });
  });
});
