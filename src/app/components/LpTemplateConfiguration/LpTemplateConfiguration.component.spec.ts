import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { PageConfigurationService } from "src/app/services/page-configuration.service";
import { FormBuilder, ReactiveFormsModule ,FormsModule} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { LpTemplateConfigurationComponent } from "./LpTemplateConfiguration.component";
import { of } from "rxjs";
import { TemplateSections } from "src/app/common/constants";

describe("LpTemplateConfigurationComponent", () => {
  let component: LpTemplateConfigurationComponent;
  let fixture: ComponentFixture<LpTemplateConfigurationComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const pageConfigurationServiceStub = () => ({
      lpreportMappingItems: () => ({ subscribe: f => f({}) }),
      requestDataFromMultipleSources: () => ({ subscribe: f => f({}) }),
      lpReportPeriodTypes: () => ({ subscribe: f => f({}) }),
      getLPReportMasterList: () => ({ subscribe: f => f({}) }),
      getAllReportTemplates: () => ({ subscribe: f => of({}) }),
      savetemplate: templatedetails => ({ subscribe: f => f({}) }),
      lptemplateConfig: configObj => ({ subscribe: f => f({}) }),
      lpReportSectionItems: id => ({ subscribe: f => f({}) })
    });
    const formBuilderStub = () => ({
      group: object => ({ addControl: () => ({}) }),
      array: array => ({})
    });
    const toastrServiceStub = () => ({
      success: (arg, string, object) => ({}),
      error: (string, string1, object) => ({})
    });
    const miscellaneousServiceStub = () => ({ getSideBarWidth: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule,ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [LpTemplateConfigurationComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: PageConfigurationService,
          useFactory: pageConfigurationServiceStub
        },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(LpTemplateConfigurationComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`allTemplates has default value`, () => {
    expect(component.allTemplates).toEqual([]);
  });

  it(`masterListClone has default value`, () => {
    expect(component.masterListClone).toEqual([]);
  });

  it(`notindexs has default value`, () => {
    expect(component.notindexs).toEqual(component.notindexs);
  });

  it(`arrayitems has default value`, () => {
    expect(component.arrayitems).toEqual([]);
  });

  it(`masteritemCount has default value`, () => {
    expect(component.masteritemCount).toEqual(0);
  });

  it(`unique_key has default value`, () => {
    expect(component.unique_key).toEqual(0);
  });

  it(`isTemplateNameEmpty has default value`, () => {
    expect(component.isTemplateNameEmpty).toEqual(false);
  });

  it(`issection has default value`, () => {
    expect(component.issection).toEqual(false);
  });

  it(`isexits has default value`, () => {
    expect(component.isexits).toEqual(false);
  });

  it(`actions has default value`, () => {
    expect(component.actions).toEqual([]);
  });

  it(`dargItems has default value`, () => {
    expect(component.dargItems).toEqual([]);
  });

  it(`masterList has default value`, () => {
    expect(component.masterList).toEqual([]);
  });

  it(`allSections has default value`, () => {
    expect(component.allSections).toEqual([]);
  });

  it(`kpi_items_DRP has default value`, () => {
    expect(component.kpi_items_DRP).toEqual([]);
  });

  it(`filtersMonthly has default value`, () => {
    expect(component.filtersMonthly).toEqual([`M`, `Y`]);
  });

  it(`filtersQuarterly has default value`, () => {
    expect(component.filtersQuarterly).toEqual([`Q`, `Y`]);
  });

  it(`props has default value`, () => {
    expect(component.props).toEqual([`id`, `name`]);
  });

  it(`showpopup has default value`, () => {
    expect(component.showpopup).toEqual(false);
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`Save as`);
  });

  it(`fixedHeight has default value`, () => {
    expect(component.fixedHeight).toEqual(600);
  });

  it(`windowHeight has default value`, () => {
    expect(component.windowHeight).toEqual(0);
  });

  it(`isScroll has default value`, () => {
    expect(component.isScroll).toEqual(false);
  });

  it(`disableConfirmSave has default value`, () => {
    expect(component.disableConfirmSave).toEqual(true);
  });

  it(`periodTypes has default value`, () => {
    expect(component.periodTypes).toEqual([]);
  });

  it(`periodTypesCopy has default value`, () => {
    expect(component.periodTypesCopy).toEqual(component.periodTypesCopy);
  });

  it(`periodTypesQuarterly has default value`, () => {
    expect(component.periodTypesQuarterly).toEqual([]);
  });

  it(`periodTypesMonthly has default value`, () => {
    expect(component.periodTypesMonthly).toEqual([]);
  });

  it(`creditKPI_LineItems has default value`, () => {
    expect(component.creditKPI_LineItems).toEqual([]);
  });

  it(`isPopup has default value`, () => {
    expect(component.isPopup).toEqual(false);
  });

  it(`isAction has default value`, () => {
    expect(component.isAction).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`restrictTextKpis has default value`, () => {
    expect(component.restrictTextKpis).toEqual([`Text`]);
  });

  it(`default has default value`, () => {
    expect(component.default).toEqual(TemplateSections.Default);
  });

  it(`isArrayOriginalLength has default value`, () => {
    expect(component.isArrayOriginalLength).toEqual([]);
  });

  it(`isCopyArrayOriginalLength has default value`, () => {
    expect(component.isCopyArrayOriginalLength).toEqual([]);
  });

  it(`isOriginalLength has default value`, () => {
    expect(component.isOriginalLength).toEqual(0);
  });

  it(`disableRenameConfirm has default value`, () => {
    expect(component.disableRenameConfirm).toEqual(true);
  });

  it(`modalTitle has default value`, () => {
    expect(component.modalTitle).toEqual(`Confirmation`);
  });

  it(`activeTemplateName has default value`, () => {
    expect(component.activeTemplateName).toEqual('Default Template');
  });

  it(`isPageLoaded has default value`, () => {
    expect(component.isPageLoaded).toEqual(false);
  });

  it(`isNearBottom has default value`, () => {
    expect(component.isNearBottom).toEqual(true);
  });

  it(`kpiIdentifyLocalValue has default value`, () => {
    expect(component.kpiIdentifyLocalValue).toEqual([]);
  });

  it(`kpiFinancialsIdentifyLocalValue has default value`, () => {
    expect(component.kpiFinancialsIdentifyLocalValue).toEqual([]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "listOfItemsLoad").and.callThrough();
      component.ngOnInit();
      expect(component.listOfItemsLoad).toHaveBeenCalled();
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

  describe("listOfItemsLoad", () => {
    it("makes expected calls", () => {
      spyOn(component, "masterListItems").and.callThrough();
      spyOn(component, "getAllReportTemplates").and.callThrough();
      spyOn(component, "mappingKpis_List").and.callThrough();
      component.listOfItemsLoad();
      expect(component.masterListItems).toHaveBeenCalled();
      expect(component.getAllReportTemplates).toHaveBeenCalled();
      expect(component.mappingKpis_List).toHaveBeenCalled();
    });
  });

  describe("mappingKpis_List", () => {
    it("makes expected calls", () => {
      const pageConfigurationServiceStub: PageConfigurationService = fixture.debugElement.injector.get(
        PageConfigurationService
      );
      spyOn(component, "arrayIncludeFilter").and.callThrough();
      spyOn(component, "arrayNotIncludesFilter").and.callThrough();
      spyOn(
        pageConfigurationServiceStub,
        "lpreportMappingItems"
      ).and.callThrough();
      spyOn(
        pageConfigurationServiceStub,
        "requestDataFromMultipleSources"
      ).and.callThrough();
      spyOn(
        pageConfigurationServiceStub,
        "lpReportPeriodTypes"
      ).and.callThrough();
      component.mappingKpis_List();
      expect(
        pageConfigurationServiceStub.lpreportMappingItems
      ).toHaveBeenCalled();
      expect(
        pageConfigurationServiceStub.requestDataFromMultipleSources
      ).toHaveBeenCalled();
      expect(
        pageConfigurationServiceStub.lpReportPeriodTypes
      ).toHaveBeenCalled();
    });
  });

  describe("confirmSave", () => {
    it("makes expected calls", () => {
      spyOn(component, "SetDisableConfirmSave").and.callThrough();
      spyOn(component, "resetupopvalidations").and.callThrough();
      spyOn(component, "submitActions").and.callThrough();
      component.confirmSave();
      expect(component.SetDisableConfirmSave).toHaveBeenCalled();
    });
  });

  describe("onClose", () => {
    it("makes expected calls", () => {
      spyOn(component, "resetupopvalidations").and.callThrough();
      component.onClose();
      expect(component.resetupopvalidations).toHaveBeenCalled();
    });
  });

  describe("AddSectionList", () => {
    it("makes expected calls", () => {
      spyOn(component, "addFormGroup").and.callThrough();
      spyOn(component, "AddSectionList").and.callThrough();
      spyOn(component, "scrollToBottom").and.callThrough();
      component.AddSectionList();
      expect(component.AddSectionList).toHaveBeenCalled();
    });
  });

  describe("masterListItems", () => {
    it("makes expected calls", () => {
      const pageConfigurationServiceStub: PageConfigurationService = fixture.debugElement.injector.get(
        PageConfigurationService
      );
      spyOn(component, "insertAt").and.callThrough();
      spyOn(component, "removeGraphValidation").and.callThrough();
      spyOn(
        pageConfigurationServiceStub,
        "getLPReportMasterList"
      ).and.callThrough();
      component.masterListItems();
      expect(
        pageConfigurationServiceStub.getLPReportMasterList
      ).toHaveBeenCalled();
    });
  });

  describe("getAllReportTemplates", () => {
    it("makes expected calls", () => {
      const pageConfigurationServiceStub: PageConfigurationService = fixture.debugElement.injector.get(
        PageConfigurationService
      );
      spyOn(component, "actionsDropDownDisable").and.callThrough();
      spyOn(component, "dynamicallyLoadSelectionitems").and.callThrough();
      spyOn(component, "resetcntrl").and.callThrough();
      spyOn(component, "statusWiseLoadActions").and.callThrough();
      spyOn(
        pageConfigurationServiceStub,
        "getAllReportTemplates"
      ).and.callThrough();
      component.getAllReportTemplates();
      expect(
        pageConfigurationServiceStub.getAllReportTemplates
      ).toHaveBeenCalled();
    });
  });

  describe("configurationRequest", () => {
    it("makes expected calls", () => {
      const pageConfigurationServiceStub: PageConfigurationService = fixture.debugElement.injector.get(
        PageConfigurationService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, "getAllReportTemplates").and.callThrough();
      spyOn(pageConfigurationServiceStub, "lptemplateConfig").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.configurationRequest();
      expect(component.getAllReportTemplates).toHaveBeenCalled();
      expect(pageConfigurationServiceStub.lptemplateConfig).toHaveBeenCalled();
    });
  });
});
