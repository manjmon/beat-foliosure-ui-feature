import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HorizontalNavBarComponent } from "./horizontal-navbar.component";

describe("HorizontalNavBarComponent", () => {
  let component: HorizontalNavBarComponent;
  let fixture: ComponentFixture<HorizontalNavBarComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HorizontalNavBarComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub }
      ]
    });
    fixture = TestBed.createComponent(HorizontalNavBarComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`itemList has default value`, () => {
    expect(component.itemList).toEqual([]);
  });

  it(`showLeftScroll has default value`, () => {
    expect(component.showLeftScroll).toEqual(false);
  });

  it(`showRightScroll has default value`, () => {
    expect(component.showRightScroll).toEqual(true);
  });

  it(`toggle has default value`, () => {
    expect(component.toggle).toEqual(false);
  });

  describe("setScrollButtonVisibility", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      spyOn(component, "stopRightScrolling").and.callThrough();
      spyOn(component, "stopLeftScrolling").and.callThrough();
      spyOn(changeDetectorRefStub, "detectChanges").and.callThrough();
      component.setScrollButtonVisibility();
      expect(component.stopRightScrolling).toHaveBeenCalled();
      expect(component.stopLeftScrolling).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });
});
