import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FormsModule } from "@angular/forms";
import { AddQueryComponent } from "./add-queries.component";

describe("AddQueryComponent", () => {
  let component: AddQueryComponent;
  let fixture: ComponentFixture<AddQueryComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const routerStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getQueryById: object => ({ subscribe: f => f({}) }),
      showAlertMessages: (string, response) => ({}),
      nativeWindow: {
        editor: { setValue: () => ({}), getValue: () => ({ trim: () => ({}) }) }
      },
      redirectToLogin: error => ({}),
      AddUpdateQuery: model => ({ subscribe: f => f({}) }),
      getDynamicQueriesPreview: object => ({ subscribe: f => f({}) }),
      exportEditorQueryList: object => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddQueryComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: Router, useFactory: routerStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AddQueryComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`Create`);
  });

  it(`resetText has default value`, () => {
    expect(component.resetText).toEqual(`Reset`);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`masterDataLoadRequired has default value`, () => {
    expect(component.masterDataLoadRequired).toEqual(true);
  });

  it(`loadPreview has default value`, () => {
    expect(component.loadPreview).toEqual(false);
  });

  it(`loadSave has default value`, () => {
    expect(component.loadSave).toEqual(false);
  });

  it(`loadExport has default value`, () => {
    expect(component.loadExport).toEqual(false);
  });

  it(`loadClean has default value`, () => {
    expect(component.loadClean).toEqual(false);
  });

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`showSqlError has default value`, () => {
    expect(component.showSqlError).toEqual(true);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "setDefaultValues").and.callThrough();
      spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
      component.ngOnInit();
      expect(component.setDefaultValues).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
    });
  });
});
