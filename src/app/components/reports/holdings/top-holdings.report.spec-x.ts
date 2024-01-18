import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from "@angular/core";
import { MiscellaneousService } from "../../../services/miscellaneous.service";
import { ReportService ,ReportType} from "../../../services/report.service";
import { AppSettingService } from "../../../services/appsettings.service";
import { ITab } from "projects/ng-neptune/src/lib/Tab/tab.model";
import { PortfolioCompanyService } from "src/app/services/portfolioCompany.service";
import { FilterService } from "src/app/services/filter.services";
import { ToastrService } from "ngx-toastr";
import { DealService } from "src/app/services/deal.service";
import { NumberDecimalConst,TopHoldings } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { TopHoldingsComponent } from "./top-holdings.report";

describe("TopHoldingsComponent", () => {
  let component: TopHoldingsComponent;
  let fixture: ComponentFixture<TopHoldingsComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      sortArray: (fundList, string) => ({}),
      removeDuplicates: arg => ({ includes: () => ({}) }),
      downloadExcelFile: response => ({})
    });
    const reportServiceStub = () => ({
      getReportData: model => ({ subscribe: f => f({}) }),
      getReportMasterData: () => ({ subscribe: f => f({}) }),
      exportReports: model => ({ subscribe: f => f({}) })
    });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    const portfolioCompanyServiceStub = () => ({
      get_RegionCountrys_ByFundId: fundIds => ({ subscribe: f => f({}) })
    });
    const filterServiceStub = () => ({
      SaveFilter: saveFilter => ({ subscribe: f => f({}) }),
      DeleteFilter: userReportId => ({ subscribe: f => f({}) }),
      getFilters: () => ({ subscribe: f => f({}) }),
      getFilter: userReportId => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      success: (string, string1, object) => ({})
    });
    const dealServiceStub = () => ({
      getLatestDealQuarterYear: () => ({ subscribe: f => f({}) }),
      getFilterLatestDealQuarterYearCount: model => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [TopHoldingsComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ReportService, useFactory: reportServiceStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: FilterService, useFactory: filterServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: DealService, useFactory: dealServiceStub }
      ]
    });
    fixture = TestBed.createComponent(TopHoldingsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`pcStatus has default value`, () => {
    expect(component.pcStatus).toEqual([]);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`topholdingsConstants has default value`, () => {
    expect(component.topholdingsConstants).toEqual(TopHoldings);
  });

  it(`filterSection has default value`, () => {
    expect(component.filterSection).toEqual(false);
  });

  it(`cols has default value`, () => {
    expect(component.cols).toEqual([]);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`reportType has default value`, () => {
    expect(component.reportType).toEqual(ReportType);
  });

  it(`reportData has default value`, () => {
    expect(component.reportData).toEqual([]);
  });

  it(`frozenTableColumns has default value`, () => {
    expect(component.frozenTableColumns).toEqual([]);
  });

  it(`tableColumns has default value`, () => {
    expect(component.tableColumns).toEqual([]);
  });

  it(`tableData has default value`, () => {
    expect(component.tableData).toEqual([]);
  });

  it(`collapsed has default value`, () => {
    expect(component.collapsed).toEqual(true);
  });

  it(`topholdingReportId has default value`, () => {
    expect(component.topholdingReportId).toEqual(0);
  });

  it(`types has default value`, () => {
    expect(component.types).toEqual([]);
  });

  it(`sortTypes has default value`, () => {
    expect(component.sortTypes).toEqual([]);
  });

  it(`isexits has default value`, () => {
    expect(component.isexits).toEqual(false);
  });

  it(`reportID has default value`, () => {
    expect(component.reportID).toEqual(0);
  });

  it(`editMode has default value`, () => {
    expect(component.editMode).toEqual(false);
  });

  it(`isSaveFilterPopup has default value`, () => {
    expect(component.isSaveFilterPopup).toEqual(false);
  });

  it(`title has default value`, () => {
    expect(component.title).toEqual(`Save Filter`);
  });

  it(`placeholderFilterName has default value`, () => {
    expect(component.placeholderFilterName).toEqual(`Enter filter Name`);
  });

  it(`isApplySavePreset has default value`, () => {
    expect(component.isApplySavePreset).toEqual(false);
  });

  it(`disableConfirmSave has default value`, () => {
    expect(component.disableConfirmSave).toEqual(true);
  });

  it(`saveFiltersOptionsList has default value`, () => {
    expect(component.saveFiltersOptionsList).toEqual([]);
  });

  it(`sortByValue has default value`, () => {
    expect(component.sortByValue).toEqual(`desc`);
  });

  it(`placeholderName has default value`, () => {
    expect(component.placeholderName).toEqual(`Number of Companies`);
  });

  it(`numberOfCompanies has default value`, () => {
    expect(component.numberOfCompanies).toEqual(20);
  });

  it(`numberCount has default value`, () => {
    expect(component.numberCount).toEqual(20);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`fundHoldingStatusList has default value`, () => {
    expect(component.fundHoldingStatusList).toEqual([]);
  });

  it(`portfolioCompanyList has default value`, () => {
    expect(component.portfolioCompanyList).toEqual([]);
  });

  it(`regionCountryMappingList has default value`, () => {
    expect(component.regionCountryMappingList).toEqual([]);
  });

  it(`fundListClone has default value`, () => {
    expect(component.fundListClone).toEqual([]);
  });

  it(`strategyListClone has default value`, () => {
    expect(component.strategyListClone).toEqual([]);
  });

  it(`regionListClone has default value`, () => {
    expect(component.regionListClone).toEqual([]);
  });

  it(`countryListClone has default value`, () => {
    expect(component.countryListClone).toEqual([]);
  });

  it(`masterCompaniesCount has default value`, () => {
    expect(component.masterCompaniesCount).toEqual(0);
  });

  it(`confirmDelete has default value`, () => {
    expect(component.confirmDelete).toEqual(false);
  });

  it(`masterModelClone has default value`, () => {
    expect(component.masterModelClone).toEqual([]);
  });

  it(`customWidth has default value`, () => {
    expect(component.customWidth).toEqual(`602px`);
  });

  it(`isLarissa has default value`, () => {
    expect(component.isLarissa).toEqual(false);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`isMorethanNumber has default value`, () => {
    expect(component.isMorethanNumber).toEqual(false);
  });

  it(`fundItems has default value`, () => {
    expect(component.fundItems).toEqual([]);
  });

  it(`isExportLoading has default value`, () => {
    expect(component.isExportLoading).toEqual(false);
  });

  describe("selectTab", () => {
    it("makes expected calls", () => {
      const iTabStub: ITab = <any>{};
      spyOn(component, "getTopHoldingReports").and.callThrough();
      spyOn(component, "dataChangeCheck").and.callThrough();
      component.selectTab(iTabStub);
      expect(component.getTopHoldingReports).toHaveBeenCalled();
      expect(component.dataChangeCheck).toHaveBeenCalled();
    });
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getReportItems").and.callThrough();
      spyOn(component, "getReportMasterData").and.callThrough();
      component.ngOnInit();
      expect(component.getReportItems).toHaveBeenCalled();
      expect(component.getReportMasterData).toHaveBeenCalled();
    });
  });

  describe("getDealLatestQuarter", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(component, "defaultMasterModelClone").and.callThrough();
      spyOn(component, "dataChangeCheck").and.callThrough();
      spyOn(component, "getTopHoldingReports").and.callThrough();
      spyOn(dealServiceStub, "getLatestDealQuarterYear").and.callThrough();
      component.getDealLatestQuarter();
      expect(component.defaultMasterModelClone).toHaveBeenCalled();
      expect(component.dataChangeCheck).toHaveBeenCalled();
      expect(component.getTopHoldingReports).toHaveBeenCalled();
      expect(dealServiceStub.getLatestDealQuarterYear).toHaveBeenCalled();
    });
  });

  describe("getFilterCount", () => {
    it("makes expected calls", () => {
      const dealServiceStub: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(
        dealServiceStub,
        "getFilterLatestDealQuarterYearCount"
      ).and.callThrough();
      component.getFilterCount();
      expect(
        dealServiceStub.getFilterLatestDealQuarterYearCount
      ).toHaveBeenCalled();
    });
  });

  describe("ngAfterViewInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "configureMenuClose").and.callThrough();
      component.ngAfterViewInit();
      expect(component.configureMenuClose).toHaveBeenCalled();
    });
  });

  describe("getReportItems", () => {
    it("makes expected calls", () => {
      spyOn(component, "getDealLatestQuarter").and.callThrough();
      component.getReportItems();
      expect(component.getDealLatestQuarter).toHaveBeenCalled();
    });
  });

  describe("getTopHoldingReports", () => {
    it("makes expected calls", () => {
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(component, "getFilterCount").and.callThrough();
      spyOn(component, "toMillion").and.callThrough();
      spyOn(component, "toCompanyValuationMillion").and.callThrough();
      spyOn(component, "LoadFilters").and.callThrough();
      spyOn(reportServiceStub, "getReportData").and.callThrough();
      component.getTopHoldingReports();
      expect(component.getFilterCount).toHaveBeenCalled();
      expect(component.toMillion).toHaveBeenCalled();
      expect(component.toCompanyValuationMillion).toHaveBeenCalled();
      expect(component.LoadFilters).toHaveBeenCalled();
      expect(reportServiceStub.getReportData).toHaveBeenCalled();
    });
  });

  describe("getReportMasterData", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(component, "getRegion_Countrys").and.callThrough();
      spyOn(component, "bindReportMasterModel").and.callThrough();
      spyOn(miscellaneousServiceStub, "sortArray").and.callThrough();
      spyOn(reportServiceStub, "getReportMasterData").and.callThrough();
      component.getReportMasterData();
      expect(component.getRegion_Countrys).toHaveBeenCalled();
      expect(component.bindReportMasterModel).toHaveBeenCalled();
      expect(miscellaneousServiceStub.sortArray).toHaveBeenCalled();
      expect(reportServiceStub.getReportMasterData).toHaveBeenCalled();
    });
  });

  describe("bindReportMasterModel", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "sortArray").and.callThrough();
      component.bindReportMasterModel();
      expect(miscellaneousServiceStub.sortArray).toHaveBeenCalled();
    });
  });

  describe("exportTopHoldingReport", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const reportServiceStub: ReportService = fixture.debugElement.injector.get(
        ReportService
      );
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      spyOn(reportServiceStub, "exportReports").and.callThrough();
      component.exportTopHoldingReport();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
      expect(reportServiceStub.exportReports).toHaveBeenCalled();
    });
  });

  describe("onPcStatusChanged", () => {
    it("makes expected calls", () => {
      spyOn(component, "dataChangeCheck").and.callThrough();
      spyOn(component, "allLabelSelectionPlusCount").and.callThrough();
      component.onPcStatusChanged();
      expect(component.dataChangeCheck).toHaveBeenCalled();
      expect(component.allLabelSelectionPlusCount).toHaveBeenCalled();
    });
  });

  describe("OnFundChanged", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(component, "getRegion_Countrys").and.callThrough();
      spyOn(component, "dataChangeCheck").and.callThrough();
      spyOn(component, "allLabelSelectionPlusCount").and.callThrough();
      spyOn(miscellaneousServiceStub, "sortArray").and.callThrough();
      component.OnFundChanged();
      expect(component.getRegion_Countrys).toHaveBeenCalled();
      expect(component.dataChangeCheck).toHaveBeenCalled();
      expect(component.allLabelSelectionPlusCount).toHaveBeenCalled();
      expect(miscellaneousServiceStub.sortArray).toHaveBeenCalled();
    });
  });

  describe("OnStatusChanged", () => {
    it("makes expected calls", () => {
      spyOn(component, "dataChangeCheck").and.callThrough();
      spyOn(component, "allLabelSelectionPlusCount").and.callThrough();
      component.OnStatusChanged();
      expect(component.dataChangeCheck).toHaveBeenCalled();
      expect(component.allLabelSelectionPlusCount).toHaveBeenCalled();
    });
  });

  describe("onSaveFilters", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, "resetForm").and.callThrough();
      spyOn(component, "LoadFilters").and.callThrough();
      spyOn(filterServiceStub, "SaveFilter").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.onSaveFilters();
      expect(component.resetForm).toHaveBeenCalled();
      expect(component.LoadFilters).toHaveBeenCalled();
      expect(filterServiceStub.SaveFilter).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });

  describe("deleteFilter", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(component, "LoadFilters").and.callThrough();
      spyOn(component, "resetForm").and.callThrough();
      spyOn(filterServiceStub, "DeleteFilter").and.callThrough();
      component.deleteFilter();
      expect(component.LoadFilters).toHaveBeenCalled();
      expect(component.resetForm).toHaveBeenCalled();
      expect(filterServiceStub.DeleteFilter).toHaveBeenCalled();
    });
  });

  describe("LoadFilters", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(filterServiceStub, "getFilters").and.callThrough();
      component.LoadFilters();
      expect(filterServiceStub.getFilters).toHaveBeenCalled();
    });
  });

  describe("apply", () => {
    it("makes expected calls", () => {
      spyOn(component, "getTopHoldingReports").and.callThrough();
      component.apply();
      expect(component.getTopHoldingReports).toHaveBeenCalled();
    });
  });

  describe("resetForm", () => {
    it("makes expected calls", () => {
      spyOn(component, "getDealLatestQuarter").and.callThrough();
      component.resetForm();
      expect(component.getDealLatestQuarter).toHaveBeenCalled();
    });
  });

  describe("confirmSave", () => {
    it("makes expected calls", () => {
      spyOn(component, "onSaveFilters").and.callThrough();
      component.confirmSave();
      expect(component.onSaveFilters).toHaveBeenCalled();
    });
  });

  describe("loadSelectedFilters", () => {
    it("makes expected calls", () => {
      const filterServiceStub: FilterService = fixture.debugElement.injector.get(
        FilterService
      );
      spyOn(component, "onChangeSelectedFilter").and.callThrough();
      spyOn(filterServiceStub, "getFilter").and.callThrough();
      component.loadSelectedFilters();
      expect(component.onChangeSelectedFilter).toHaveBeenCalled();
      expect(filterServiceStub.getFilter).toHaveBeenCalled();
    });
  });

  describe("toggleableApply", () => {
    it("makes expected calls", () => {
      spyOn(component, "getTopHoldingReports").and.callThrough();
      component.toggleableApply();
      expect(component.getTopHoldingReports).toHaveBeenCalled();
    });
  });
});
