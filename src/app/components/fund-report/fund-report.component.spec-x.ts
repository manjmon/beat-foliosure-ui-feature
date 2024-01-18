import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from "@angular/core";
import { PageConfigurationService } from "src/app/services/page-configuration.service";
import { FormBuilder, ReactiveFormsModule,FormsModule } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FundReportService } from "../../services/fund-report.service";
import { ReportService } from "src/app/services/report.service";
import { DatePipe } from "@angular/common";
import { FundReportComponent } from "./fund-report.component";
import { TemplateSections } from "src/app/common/constants";

describe("FundReportComponent", () => {
  let component: FundReportComponent;
  let fixture: ComponentFixture<FundReportComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const pageConfigurationServiceStub = () => ({
      lpReportPeriodTypes: () => ({ subscribe: f => f({}) }),
      getFundReportSectionList: () => ({ subscribe: f => f({}) })
    });
    const formBuilderStub = () => ({
      group: object => ({ addControl: () => ({}) }),
      array: array => ({ push: () => ({}) })
    });
    const toastrServiceStub = () => ({
      success: (arg, string, object) => ({}),
      error: (string, string1, object) => ({})
    });
    const miscellaneousServiceStub = () => ({
      getSideBarWidth: () => ({}),
      sortArray: (fundList, string) => ({}),
      getCountryListByRegionIds: regionIds => ({ subscribe: f => f({}) })
    });
    const fundReportServiceStub = () => ({
      getFundReportTemplates: () => ({ subscribe: f => f({}) }),
      getLoadFundReportTemplates: id => ({ subscribe: f => f({}) }),
      saveFundTemplate: fund_ReportTemplateDetails => ({
        subscribe: f => f({})
      }),
      fundtemplateConfig: configObj => ({ subscribe: f => f({}) })
    });
    const reportServiceStub = () => ({
      getReportMasterData: () => ({ subscribe: f => f({}) }),
      ReportTypeList: { filter: () => ({}) }
    });
    const datePipeStub = () => ({ transform: (arg, string) => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule,ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [FundReportComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        {
          provide: PageConfigurationService,
          useFactory: pageConfigurationServiceStub
        },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: FundReportService, useFactory: fundReportServiceStub },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: DatePipe, useFactory: datePipeStub }
      ]
    });
    fixture = TestBed.createComponent(FundReportComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`sectionList has default value`, () => {
    expect(component.sectionList).toEqual([]);
  });

  it(`allFeature has default value`, () => {
    expect(component.allFeature).toEqual([]);
  });

  it(`actions has default value`, () => {
    expect(component.actions).toEqual([]);
  });

  it(`unique_key has default value`, () => {
    expect(component.unique_key).toEqual(0);
  });

  it(`windowHeight has default value`, () => {
    expect(component.windowHeight).toEqual(0);
  });

  it(`allTemplates has default value`, () => {
    expect(component.allTemplates).toEqual([]);
  });

  it(`isPageLoaded has default value`, () => {
    expect(component.isPageLoaded).toEqual(false);
  });

  it(`showpopup has default value`, () => {
    expect(component.showpopup).toEqual(false);
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`Save as`);
  });

  it(`issection has default value`, () => {
    expect(component.issection).toEqual(false);
  });

  it(`isTemplateNameEmpty has default value`, () => {
    expect(component.isTemplateNameEmpty).toEqual(false);
  });

  it(`disableConfirmSavebtn has default value`, () => {
    expect(component.disableConfirmSavebtn).toEqual(true);
  });

  it(`default has default value`, () => {
    expect(component.default).toEqual(TemplateSections.Default);
  });

  it(`isexits has default value`, () => {
    expect(component.isexits).toEqual(false);
  });

  it(`periodList has default value`, () => {
    expect(component.periodList).toEqual([]);
  });

  it(`isPopup has default value`, () => {
    expect(component.isPopup).toEqual(false);
  });

  it(`disableRenameConfirm has default value`, () => {
    expect(component.disableRenameConfirm).toEqual(true);
  });

  it(`activeTemplateName has default value`, () => {
    expect(component.activeTemplateName).toEqual(TemplateSections.Default);
  });

  it(`isAction has default value`, () => {
    expect(component.isAction).toEqual(false);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`hasMultipleFilters has default value`, () => {
    expect(component.hasMultipleFilters).toEqual(false);
  });

  it(`isFiltersOpen has default value`, () => {
    expect(component.isFiltersOpen).toEqual(false);
  });

  it(`isChartOpen has default value`, () => {
    expect(component.isChartOpen).toEqual(false);
  });

  it(`filterCategories has default value`, () => {
    expect(component.filterCategories).toEqual([
      `Attribution Type`,
      `Strategies`,
      `Regions`,
      `Countries`,
      `Evaluation Date`
    ]);
  });

  it(`activeFilterCategory has default value`, () => {
    expect(component.activeFilterCategory).toEqual(`Attribution Type`);
  });

  it(`activeFilterList has default value`, () => {
    expect(component.activeFilterList).toEqual([]);
  });

  it(`ResetAdvFilters has default value`, () => {
    expect(component.ResetAdvFilters).toEqual(false);
  });

  it(`results has default value`, () => {
    expect(component.results).toEqual([]);
  });

  it(`attributionTypes has default value`, () => {
    expect(component.attributionTypes).toEqual([]);
  });

  it(`chartarray has default value`, () => {
    expect(component.chartarray).toEqual([{
      name: 'Capital invested',
      isDisable: false
    }, {
      name: 'Unrealized value',
      isDisable: false
    }, {
      name: 'Realized value',
      isDisable: false
    }, {
      name: 'Total value',
      isDisable: false
    }, {
      name: 'Total value Paid in (TVPI)',
      isDisable: false
    }, {
      name: 'Number of Investments',
      isDisable: false
    }
    ]);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "loadFundReportTemplates").and.callThrough();
      spyOn(component, "listOfItemsLoad").and.callThrough();
      spyOn(component, "filtersMasterList").and.callThrough();
      component.ngOnInit();
      expect(component.loadFundReportTemplates).toHaveBeenCalled();
      expect(component.listOfItemsLoad).toHaveBeenCalled();
      expect(component.filtersMasterList).toHaveBeenCalled();
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

  describe("filtersMasterList", () => {
    it("makes expected calls", () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(reportServiceStub, "getReportMasterData").and.callThrough();
      component.filtersMasterList();
      expect(reportServiceStub.getReportMasterData).toHaveBeenCalled();
    });
  });

  describe("loadFundReportTemplates", () => {
    it("makes expected calls", () => {
      const fundReportServiceStub: FundReportService = fixture.debugElement.injector.get(
        FundReportService
      );
      spyOn(component, "multiFilter").and.callThrough();
      spyOn(component, "stringIsEmpty").and.callThrough();
      spyOn(component, "loadFundReportSectionsData").and.callThrough();
      spyOn(component, "resetForm").and.callThrough();
      spyOn(component, "actionsDropDownDisable").and.callThrough();
      spyOn(component, "statusWiseLoadActions").and.callThrough();
      spyOn(fundReportServiceStub, "getFundReportTemplates").and.callThrough();
      component.loadFundReportTemplates();
      expect(component.multiFilter).toHaveBeenCalled();
      expect(component.stringIsEmpty).toHaveBeenCalled();
      expect(component.loadFundReportSectionsData).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.actionsDropDownDisable).toHaveBeenCalled();
      expect(component.statusWiseLoadActions).toHaveBeenCalled();
      expect(fundReportServiceStub.getFundReportTemplates).toHaveBeenCalled();
    });
  });

  describe("loadFundReportSectionsData", () => {
    it("makes expected calls", () => {
      spyOn(component, "stringIsEmpty").and.callThrough();
      component.loadFundReportSectionsData();
      expect(component.stringIsEmpty).toHaveBeenCalled();
      });
  });

  describe("confirmSave", () => {
    it("makes expected calls", () => {
      spyOn(component, "SetDisableConfirmSave").and.callThrough();
      component.confirmSave();
      expect(component.SetDisableConfirmSave).toHaveBeenCalled();
    });
  });

  describe("ngAfterViewInit", () => {
    it("makes expected calls", () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      spyOn(changeDetectorRefStub, "detectChanges").and.callThrough();
      component.ngAfterViewInit();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });

  describe("addSectionList", () => {
    it("makes expected calls", () => {
      spyOn(component, "addFundReportFormGroup").and.callThrough();
      spyOn(component, "nestedReportItems").and.callThrough();
      component.addSectionList();
      expect(component.addFundReportFormGroup).toHaveBeenCalled();
      expect(component.nestedReportItems).toHaveBeenCalled();
    });
  });

  describe("resetCntrl", () => {
    it("makes expected calls", () => {
      spyOn(component, "resetForm").and.callThrough();
      spyOn(component, "loadFundReportSectionsData").and.callThrough();
      component.resetCntrl();
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.loadFundReportSectionsData).toHaveBeenCalled();
    });
  });

  describe("listOfItemsLoad", () => {
    it("makes expected calls", () => {
      const pageConfigurationServiceStub: PageConfigurationService = fixture.debugElement.injector.get(
        PageConfigurationService
      );
      spyOn(component, "masterListItems").and.callThrough();
      spyOn(
        pageConfigurationServiceStub,
        "lpReportPeriodTypes"
      ).and.callThrough();
      component.listOfItemsLoad();
      expect(component.masterListItems).toHaveBeenCalled();
      expect(
        pageConfigurationServiceStub.lpReportPeriodTypes
      ).toHaveBeenCalled();
    });
  });

  describe("masterListItems", () => {
    it("makes expected calls", () => {
      const pageConfigurationServiceStub: PageConfigurationService = fixture.debugElement.injector.get(
        PageConfigurationService
      );
      spyOn(
        pageConfigurationServiceStub,
        "getFundReportSectionList"
      ).and.callThrough();
      component.masterListItems();
      expect(
        pageConfigurationServiceStub.getFundReportSectionList
      ).toHaveBeenCalled();
    });
  });

  describe("reportFilters", () => {
    it("makes expected calls", () => {
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(formBuilderStub, "group").and.callThrough();
      component.reportFilters();
      expect(formBuilderStub.group).toHaveBeenCalled();
    });
  });

  describe("configurationRequest", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const fundReportServiceStub: FundReportService = fixture.debugElement.injector.get(
        FundReportService
      );
      spyOn(component, "loadFundReportTemplates").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      spyOn(fundReportServiceStub, "fundtemplateConfig").and.callThrough();
      component.configurationRequest();
      expect(component.loadFundReportTemplates).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(fundReportServiceStub.fundtemplateConfig).toHaveBeenCalled();
    });
  });
});
