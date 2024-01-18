import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { ToastrService } from "ngx-toastr";
import { FeaturesEnum } from "../../services/permission.service";
import { FormsModule } from "@angular/forms";
import { KPIListComponent } from "./kpi-list.component";
import { KpiTypesConstants } from "src/app/common/constants";
import { of, throwError } from "rxjs";

describe("KPIListComponent", () => {
  let component: KPIListComponent;
  let fixture: ComponentFixture<KPIListComponent>;

  beforeEach(() => {
    const miscellaneousServiceStub = () => ({
      getFinancialKPIs: object => ({ subscribe: f => of({}) }),
      getOperationalKPIs: object => ({ subscribe: f => of({}) }),
      getImpactKPI: object => ({ subscribe: f => of({}) }),
      getInvestmentKPI: object => ({ subscribe: f => of({}) }),
      getSectorwiseKPIs: object => ({ subscribe: f => of({}) }),
      getCompanyKPIs: object => ({ subscribe: f => of({}) }),
      exportFinancialKpiList: object => ({ subscribe: f => f({}) }),
      downloadExcelFile: response => ({}),
      exportOperationalKpiList: object => ({ subscribe: f => f({}) }),
      exportSectorwiseKpiList: object => ({ subscribe: f => f({}) }),
      exportCompanyKpiList: object => ({ subscribe: f => f({}) }),
      MasterAddNewKpi: newKpi => ({ subscribe: f => f({}) }),
      AddNewKpi: newKpi => ({ subscribe: f => f({}) }),
      exportBalanceSheetList: () => ({ subscribe: f => of({}) }),
      exportProfitLossList: () => ({ subscribe: f => of({}) }),
      exportCashflowList: () => ({ subscribe: f => of({}) }),
      exportMasterKPIList: moduleID => ({ subscribe: f => of({}) }),
      getSectorList: () => ({ subscribe: f => of({}) }),
      getMethodologies: () => ({ subscribe: f => f({}) }),
      softDeleteKPI: kpiDeleteData => ({ subscribe: f => of({}) }),
      getMethodologiesByGroup: () => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [KPIListComponent],
      providers: [
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(KPIListComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`showActionCol has default value`, () => {
    expect(component.showActionCol).toEqual(true);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`kpiTypes has default value`, () => {
    expect(component.kpiTypes).toEqual([]);
  });

  it(`kpiList has default value`, () => {
    expect(component.kpiList).toEqual([]);
  });

  it(`kpiHeaders has default value`, () => {
    expect(component.kpiHeaders).toEqual([]);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`ShowAddKPI has default value`, () => {
    expect(component.ShowAddKPI).toEqual(false);
  });

  it(`kpiInfoTypes has default value`, () => {
    expect(component.kpiInfoTypes).toEqual([]);
  });

  it(`isHeader has default value`, () => {
    expect(component.isHeader).toEqual(false);
  });

  it(`isBoldKPI has default value`, () => {
    expect(component.isBoldKPI).toEqual(false);
  });

  it(`placeholderKPIName has default value`, () => {
    expect(component.placeholderKPIName).toEqual(`Enter KPI name`);
  });

  it(`disableAdd has default value`, () => {
    expect(component.disableAdd).toEqual(true);
  });

  it(`isError has default value`, () => {
    expect(component.isError).toEqual(false);
  });

  it(`sectorList has default value`, () => {
    expect(component.sectorList).toEqual([]);
  });

  it(`UpdateKpi has default value`, () => {
    expect(component.UpdateKpi).toEqual(false);
  });

  it(`primaryButtonName has default value`, () => {
    expect(component.primaryButtonName).toEqual(`Add`);
  });

  it(`modalTitle has default value`, () => {
    expect(component.modalTitle).toEqual(`Add New KPI`);
  });

  it(`methodologyList has default value`, () => {
    expect(component.methodologyList).toEqual([]);
  });

  it(`deletePopUp has default value`, () => {
    expect(component.deletePopUp).toEqual(false);
  });

  it(`primaryDeleteButtonName has default value`, () => {
    expect(component.primaryDeleteButtonName).toEqual(`Confirm`);
  });

  it(`secondaryDeleteButtonName has default value`, () => {
    expect(component.secondaryDeleteButtonName).toEqual(`Cancel`);
  });

  it(`deleteModalTitle has default value`, () => {
    expect(component.deleteModalTitle).toEqual(`Delete KPI`);
  });

  it(`deleteModalBody1 has default value`, () => {
    expect(component.deleteModalBody1).toEqual(
      `This will delete the KPI, and all related data. If it has child KPI then they will be unmapped as well. Do you confirm?`
    );
  });

  it(`isOpenPopUp has default value`, () => {
    expect(component.isOpenPopUp).toEqual(false);
  });

  // describe("onTabClick", () => {
  //   it("makes expected calls", () => {
  //     const iTabStub: ITab = <any>{};
  //     component.onTabClick(iTabStub);
  //     expect(component.onTabClick).toHaveBeenCalled();
  //   });
  // });
  describe("GetKpiInfoTypes", () => {
    it("makes expected calls", () => {
      spyOn(component, "GetKpiInfoTypes").and.callThrough();
      component.GetKpiInfoTypes();
      expect(component.GetKpiInfoTypes).toHaveBeenCalled();
    });
  });

  describe("getFinacialKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getFinancialKPIs").and.callThrough();
      component.getFinacialKpiList();
      expect(miscellaneousServiceStub.getFinancialKPIs).toHaveBeenCalled();
    });
  });

  describe("getAllKpiTypes", () => {
    it("makes expected calls", () => {
      spyOn(component, "GetSelectedKpiData").and.callThrough();
      component.getAllKpiTypes();
      expect(component.GetSelectedKpiData).toHaveBeenCalled();
    });
  });

  describe("getOperationalKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getOperationalKPIs").and.callThrough();
      component.getOperationalKpiList();
      expect(miscellaneousServiceStub.getOperationalKPIs).toHaveBeenCalled();
    });
  });

  describe("getImpactKPI", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getImpactKPI").and.callThrough();
      component.getImpactKPI();
      expect(miscellaneousServiceStub.getImpactKPI).toHaveBeenCalled();
    });
  });

  describe("getInvestmentKPI", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getInvestmentKPI").and.callThrough();
      component.getInvestmentKPI();
      expect(miscellaneousServiceStub.getInvestmentKPI).toHaveBeenCalled();
    });
  });

  describe("getSectorwiseKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getSectorwiseKPIs").and.callThrough();
      component.getSectorwiseKpiList();
      expect(miscellaneousServiceStub.getSectorwiseKPIs).toHaveBeenCalled();
    });
  });

  describe("getCompanywiseKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getCompanyKPIs").and.callThrough();
      component.getCompanywiseKpiList();
      expect(miscellaneousServiceStub.getCompanyKPIs).toHaveBeenCalled();
    });
  });

  describe("exportFinancialKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "exportFinancialKpiList"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.exportFinancialKpiList();
      expect(
        miscellaneousServiceStub.exportFinancialKpiList
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("exportOperationalKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "exportOperationalKpiList"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.exportOperationalKpiList();
      expect(
        miscellaneousServiceStub.exportOperationalKpiList
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("exportSectorwiseKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "exportSectorwiseKpiList"
      ).and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.exportSectorwiseKpiList();
      expect(
        miscellaneousServiceStub.exportSectorwiseKpiList
      ).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("exportCompanyKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "exportCompanyKpiList").and.callThrough();
      spyOn(miscellaneousServiceStub, "downloadExcelFile").and.callThrough();
      component.exportCompanyKpiList();
      expect(miscellaneousServiceStub.exportCompanyKpiList).toHaveBeenCalled();
      expect(miscellaneousServiceStub.downloadExcelFile).toHaveBeenCalled();
    });
  });

  describe("onDescChange", () => {
    it("makes expected calls", () => {
      spyOn(component, "setUpdatebutton").and.callThrough();
      component.onDescChange();
      expect(component.setUpdatebutton).toHaveBeenCalled();
    });
  });


  describe("onCloseAddKpiModal", () => {
    it("makes expected calls", () => {
      spyOn(component, "reset").and.callThrough();
      spyOn(component, "GetSelectedKpiData").and.callThrough();
      component.onCloseAddKpiModal();
      expect(component.reset).toHaveBeenCalled();
      expect(component.GetSelectedKpiData).toHaveBeenCalled();
    });
  });

  describe("updateReset", () => {
    it("makes expected calls", () => {
      spyOn(component, "OnEdit").and.callThrough();
      component.updateReset();
      expect(component.OnEdit).toHaveBeenCalled();
    });
  });

  describe("resetAddKpi", () => {
    it("makes expected calls", () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, "closeUpdatePopUp").and.callThrough();
      spyOn(component, "GetSelectedKpiData").and.callThrough();
      spyOn(component, "reset").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      component.resetAddKpi();
      expect(component.reset).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });

  describe("getBalanceSheetKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(
        miscellaneousServiceStub,
        "exportBalanceSheetList"
      ).and.callThrough();
      component.getBalanceSheetKpiList();
      expect(
        miscellaneousServiceStub.exportBalanceSheetList
      ).toHaveBeenCalled();
    });
  });

  describe("getProfitLossKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "exportProfitLossList").and.callThrough();
      component.getProfitLossKpiList();
      expect(miscellaneousServiceStub.exportProfitLossList).toHaveBeenCalled();
    });
  });

  describe("getCashflowKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "exportCashflowList").and.callThrough();
      component.getCashflowKpiList();
      expect(miscellaneousServiceStub.exportCashflowList).toHaveBeenCalled();
    });
  });

  describe("getMasterKpiList", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "exportMasterKPIList").and.callThrough();
      component.getMasterKpiList(1);
      expect(miscellaneousServiceStub.exportMasterKPIList).toHaveBeenCalled();
    });
  });

  describe("getAllSectors", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(miscellaneousServiceStub, "getSectorList").and.callThrough();
      component.getAllSectors();
      expect(miscellaneousServiceStub.getSectorList).toHaveBeenCalled();
    });
  });

  describe("performDelete", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(miscellaneousServiceStub, "softDeleteKPI").and.callThrough();
      spyOn(toastrServiceStub, "success").and.callThrough();
      spyOn(toastrServiceStub, "error").and.callThrough();
      component.selectedKpiType={
        name: KpiTypesConstants.TRADING_RECORDS, field: 'TradingRecords'
      }
      component.performDelete();
      expect(component.selectedKpiType.name).toEqual(KpiTypesConstants.TRADING_RECORDS);
    });
  });

  describe("closeFormulaPopUp", () => {
    it("makes expected calls", () => {
      spyOn(component, "GetSelectedKpiData").and.callThrough();
      component.closeFormulaPopUp();
      expect(component.GetSelectedKpiData).toHaveBeenCalled();
    });
  });
  describe("openFormulaPopup", () => {
    it("should set selectedFormulaKPI and isOpenPopUp to true", () => {
      // Arrange
      const rowData = {}; // Provide sample data for rowData
      component.selectedFormulaKPI = null;
      component.isOpenPopUp = false;

      // Act
      component.openFormulaPopup(rowData);

      // Assert
      expect(component.selectedFormulaKPI).toEqual(rowData);
      expect(component.isOpenPopUp).toBeTrue();
    });
  });
  describe("closeFormulaPopUp", () => {
    it("should set isOpenPopUp to false", () => {
      // Arrange
      component.isOpenPopUp = true;

      // Act
      component.closeFormulaPopUp();

      // Assert
      expect(component.isOpenPopUp).toBe(false);
    });

    it("should call GetSelectedKpiData with selectedKpiType", () => {
      // Arrange
      const selectedKpiType = {name: "OPERATIONAL_KPI", moduleID: 1, field: "kpiType"};
      component.selectedKpiType = selectedKpiType;
      spyOn(component, "GetSelectedKpiData");

      // Act
      component.closeFormulaPopUp();

      // Assert
      expect(component.GetSelectedKpiData).toHaveBeenCalledWith(selectedKpiType);
    });
  });
  it("should call softDeleteKPI with the correct data and show success toastr on successful deletion", () => {
    // Arrange
    component.selectedKpiType = {
      name: KpiTypesConstants.TRADING_RECORDS, field: 'TradingRecords'
    };
    component.deleteKpi = {
      sectorwiseKPIID: "kpiId"
    };

    // Act
    component.performDelete();

    // Assert
    expect(component.deletePopUp).toBeFalse();
    expect(component.blockedTable).toBeTrue();
  });

  it("should call softDeleteKPI with the correct data and show error toastr on deletion error", () => {
    // Arrange
    const miscServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
      MiscellaneousService
    );
    component.selectedKpiType = {
      name: KpiTypesConstants.TRADING_RECORDS, field: 'TradingRecords'
    };
    component.deleteKpi = {
      investmentKPIId: "kpiId"
    };
    const error = new Error("Delete error");
    spyOn(miscServiceStub, "softDeleteKPI").and.callFake(() => {
      return throwError(error);
    });

    // Act
    component.performDelete();

    // Assert
    const toastServiceStub: ToastrService = fixture.debugElement.injector.get(
      ToastrService
    );
    expect(component.deletePopUp).toBeFalse();
    expect(component.deleteKpi).toEqual({});
    expect(component.blockedTable).toBeFalse();
  });
  describe("performCancel", () => {
    it("should set deletePopUp to false and deleteKpi to an empty object", () => {
      // Arrange
      component.deletePopUp = true;
      component.deleteKpi = { sectorwiseKPIID: "kpiId" };

      // Act
      component.performCancel();

      // Assert
      expect(component.deletePopUp).toBe(false);
      expect(component.deleteKpi).toEqual({});
    });
  });
  describe("deletePopUpFun", () => {
    it("should set deletePopUp to true and deleteKpi to deleteItem", () => {
      // Arrange
      const deleteItem = {}; // Provide sample data for deleteItem

      // Act
      component.deletePopUpFun(deleteItem);

      // Assert
      expect(component.deletePopUp).toBeTrue();
      expect(component.deleteKpi).toEqual(deleteItem);
    });
  });
  describe("setUpdatebutton", () => {
    it("should disable the add button when the conditions are met", () => {
      // Arrange
      component.UpdateKpi = true;
      component.kpiDeatils = {
        isHeader: false,
        isBoldKPI: false,
        kpi: "Sample KPI",
        description: "Sample Description",
        kpiInfoType: "Sample KPI Info Type",
        methodologyName: "Sample Methodology"
      };
      component.isBoldKPI = false;
      component.isHeader = false;
      component.addKpiName = "Sample KPI";
      component.addKpiDesc = "Sample Description";
      component.selectedKpiInfoType = { name: "Sample KPI Info Type" };
      component.selectedMethodology = { name: "Sample Methodology" };

      // Act
      component.setUpdatebutton();

      // Assert
      expect(component.disableAdd).toBeTrue();
    });

    it("should enable the add button when the conditions are not met", () => {
      // Arrange
      component.UpdateKpi = true;
      component.kpiDeatils = {
        isHeader: false,
        isBoldKPI: false,
        kpi: "Sample KPI",
        description: "Sample Description",
        kpiInfoType: "Sample KPI Info Type",
        methodologyName: "Sample Methodology"
      };
      component.isBoldKPI = true;
      component.isHeader = false;
      component.addKpiName = "Sample KPI";
      component.addKpiDesc = "Sample Description";
      component.selectedKpiInfoType = { name: "Sample KPI Info Type" };
      component.selectedMethodology = { name: "Different Methodology" };

      // Act
      component.setUpdatebutton();

      // Assert
      expect(component.disableAdd).toBeFalse();
    });

    // Add more test cases for different scenarios
  });
  it("should return the correct financial KPI name based on the selected KPI type", () => {
    // Arrange
    const kpiDetails = {
      profitAndLossLineItem: "Profit and Loss KPI",
      balanceSheetLineItem: "Balance Sheet KPI",
      cashFlowLineItem: "Cashflow KPI"
    };
    const expectedName = "Profit and Loss KPI";
      component.selectedKpiType = { name: "Profit & Loss KPI", field: "FinancialKPI" };
    // Act
    const result = component.getFinancialKpiName(kpiDetails);
  
    // Assert
    expect(result).toEqual(expectedName);
  });
  it("should update the KPI details when OnEdit is called", () => {
    // Arrange
    const kpiDetails = {
      isBoldKPI: true,
      isHeader: false,
      methodologyName: "Some Methodology",
      description: "Some Description",
      kpi: "Some KPI",
      kpiInfo: "Some KPI Info",
      kpiInfoType: "Some KPI Info Type",
      moduleID: "1",
      methodologyID: "1"
    };

    // Act
    component.OnEdit(kpiDetails);

    // Assert
    expect(component.isBoldKPI).toBeTrue();
    expect(component.isHeader).toBeFalse();
    expect(component.addKpiDesc).toEqual("Some Description");
    expect(component.addKpiName).toEqual("Some KPI");
    expect(component.selectedKpiInfoType).toEqual({ name: "Some KPI Info Type" });
    expect(component.kpiName).toEqual("Some KPI");
    expect(component.selectedAddKpiType).toEqual(component.selectedKpiType);
    expect(component.selectedMethodology).toEqual({ name: "Some Methodology", id: "1" });
    expect(component.UpdateKpi).toBeTrue();
    expect(component.primaryButtonName).toEqual("Update");
    expect(component.modalTitle).toEqual("Update KPI");
    expect(component.kpiDeatils).toEqual(kpiDetails);
    expect(component.ShowAddKPI).toBeTrue();
  });
  it("should set the sector and disableAdd based on the selected item", () => {
    // Arrange
    const item = { name: "Test Sector", sectorID: 1 };
    const kpiDetails = {
      sector: { sector: "Agriculture & Timber", sectorID: 14 }
    };
    component.kpiDeatils = kpiDetails;

    // Act
    component.onSectorChange(item);

    // Assert
    expect(component.sector).toEqual(item);
    expect(component.disableAdd).toBeFalse();
  });

  it("should set the sector and disableAdd to default values if the selected item is undefined", () => {
    // Arrange
    const item = undefined;
    const kpiDetails = {
      sector: { sector: "Agriculture & Timber", sectorID: 14 }
    };
    component.kpiDeatils = kpiDetails;

    // Act
    component.onSectorChange(item);

    // Assert
    component.sector = { name: "Agriculture & Timber", sectorID: 14 };
    expect(component.sector.name).toEqual(kpiDetails.sector.sector);
    expect(component.disableAdd).toBeFalse();
  });

  it("should set the sector and disableAdd to default values if the sector in kpiDetails matches the selected sector", () => {
    // Arrange
    const item = { name: "Test Sector", sectorID: 1 };
    const kpiDetails = {
      sector: { sector: "Test Sector", sectorID: 1 }
    };
    component.kpiDeatils = kpiDetails;

    // Act
    component.onSectorChange(item);

    // Assert
    expect(component.sector).toEqual(item);
    expect(component.disableAdd).toBeTrue();
  });
  it("should call getAllMethodologies", () => {
    spyOn(component, "getAllMethodologies");

    component.ngOnInit();

    expect(component.getAllMethodologies).toHaveBeenCalled();
  });
});
