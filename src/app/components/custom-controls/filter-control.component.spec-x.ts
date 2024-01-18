import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA ,SimpleChanges} from "@angular/core";
import { AccountService } from "src/app/services/account.service";
import { FilterService } from "src/app/services/filter.services";
import { FormsModule } from "@angular/forms";
import { FilterControlComponent } from "./filter-control.component";

describe("FilterControlComponent", () => {
  let component: FilterControlComponent;
  let fixture: ComponentFixture<FilterControlComponent>;

  beforeEach(() => {
    const accountServiceStub = () => ({ redirectToLogin: error => ({}) });
    const filterServiceStub = () => ({
      SaveFilter: filters => ({ subscribe: f => f({}) }),
      DeleteFilter: userReportId => ({ subscribe: f => f({}) }),
      getFilter: userReportId => ({ subscribe: f => f({}) }),
      UpdateFilter: response => ({ subscribe: f => f({}) }),
      getFilters: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FilterControlComponent],
      providers: [
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: FilterService, useFactory: filterServiceStub }
      ]
    });
    fixture = TestBed.createComponent(FilterControlComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`IsEnabled has default value`, () => {
    expect(component.IsEnabled).toEqual(false);
  });

  it(`EditMode has default value`, () => {
    expect(component.EditMode).toEqual(false);
  });

  it(`disablePrimaryButton has default value`, () => {
    expect(component.disablePrimaryButton).toEqual(true);
  });

  it(`confirmSave has default value`, () => {
    expect(component.confirmSave).toEqual(false);
  });

  it(`confirmDelete has default value`, () => {
    expect(component.confirmDelete).toEqual(false);
  });

  it(`DeleteDisabled has default value`, () => {
    expect(component.DeleteDisabled).toEqual(true);
  });

  it(`IsItemSelected has default value`, () => {
    expect(component.IsItemSelected).toEqual(false);
  });

  it(`ShowFilterUpdated has default value`, () => {
    expect(component.ShowFilterUpdated).toEqual(false);
  });

  it(`DuplicateRecord has default value`, () => {
    expect(component.DuplicateRecord).toEqual(false);
  });

  it(`EditDuplicateRecord has default value`, () => {
    expect(component.EditDuplicateRecord).toEqual(false);
  });

  it(`NewlyAddedId has default value`, () => {
    expect(component.NewlyAddedId).toEqual(0);
  });

  describe("ngOnChanges", () => {
    it("makes expected calls", () => {
      const simpleChangesStub: SimpleChanges = <any>{};
      spyOn(component, "ResetFilters").and.callThrough();
      component.ngOnChanges(simpleChangesStub);
      expect(component.ResetFilters).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "LoadFilters").and.callThrough();
      component.ngOnInit();
      expect(component.LoadFilters).toHaveBeenCalled();
    });
  });

  describe("ResetFilters", () => {
    it("makes expected calls", () => {
      spyOn(component, "LoadFilters").and.callThrough();
      component.ResetFilters();
      expect(component.LoadFilters).toHaveBeenCalled();
    });
  });

  describe("search", () => {
    it("makes expected calls", () => {
      spyOn(component, "LoadFilters").and.callThrough();
      component.search();
      expect(component.LoadFilters).toHaveBeenCalled();
    });
  });

  describe("onSave", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(component, "LoadFilters").and.callThrough();
      spyOn(accountServiceStub, "redirectToLogin").and.callThrough();
      spyOn(filterServiceStub, "SaveFilter").and.callThrough();
      component.onSave();
      expect(component.LoadFilters).toHaveBeenCalled();
      expect(accountServiceStub.redirectToLogin).toHaveBeenCalled();
      expect(filterServiceStub.SaveFilter).toHaveBeenCalled();
    });
  });

  describe("Delete", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(component, "LoadFilters").and.callThrough();
      spyOn(accountServiceStub, "redirectToLogin").and.callThrough();
      spyOn(filterServiceStub, "DeleteFilter").and.callThrough();
      component.Delete();
      expect(component.LoadFilters).toHaveBeenCalled();
      expect(accountServiceStub.redirectToLogin).toHaveBeenCalled();
      expect(filterServiceStub.DeleteFilter).toHaveBeenCalled();
    });
  });

  describe("Update", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(accountServiceStub, "redirectToLogin").and.callThrough();
      spyOn(filterServiceStub, "getFilter").and.callThrough();
      spyOn(filterServiceStub, "UpdateFilter").and.callThrough();
      component.Update();
      expect(accountServiceStub.redirectToLogin).toHaveBeenCalled();
      expect(filterServiceStub.getFilter).toHaveBeenCalled();
      expect(filterServiceStub.UpdateFilter).toHaveBeenCalled();
    });
  });

  describe("OnFiltersSelected", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(accountServiceStub, "redirectToLogin").and.callThrough();
      spyOn(filterServiceStub, "getFilter").and.callThrough();
      component.OnFiltersSelected();
      expect(accountServiceStub.redirectToLogin).toHaveBeenCalled();
      expect(filterServiceStub.getFilter).toHaveBeenCalled();
    });
  });

  describe("LoadFilters", () => {
    it("makes expected calls", () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(accountServiceStub, "redirectToLogin").and.callThrough();
      spyOn(filterServiceStub, "getFilters").and.callThrough();
      component.LoadFilters();
      expect(accountServiceStub.redirectToLogin).toHaveBeenCalled();
      expect(filterServiceStub.getFilters).toHaveBeenCalled();
    });
  });
});
