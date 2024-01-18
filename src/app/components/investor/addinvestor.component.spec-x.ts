import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { InvestorService } from "../../services/investor.service";
import { FirmService } from "src/app/services/firm.service";
import { MiscellaneousService } from "src/app/services/miscellaneous.service";
import { InvestorStatic } from "src/app/common/constants";
import { FormsModule } from "@angular/forms";
import { AddinvestorComponent } from "./addinvestor.component";

describe("AddinvestorComponent", () => {
  let component: AddinvestorComponent;
  let fixture: ComponentFixture<AddinvestorComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const toastrServiceStub = () => ({
      success: (message, string, object) => ({}),
      error: (message, string, object) => ({})
    });
    const investorServiceStub = () => ({
      getInvestorAddEditConfiuration: object => ({ subscribe: f => f({}) }),
      getMasterGeoLocations: () => ({ subscribe: f => f({}) }),
      investorAddEdit: object => ({ subscribe: f => f({}) })
    });
    const firmServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({ getSideBarWidth: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddinvestorComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: InvestorService, useFactory: investorServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AddinvestorComponent);
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

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`investorinfo has default value`, () => {
    expect(component.investorinfo).toEqual(InvestorStatic);
  });

  it(`regionList has default value`, () => {
    expect(component.regionList).toEqual([]);
  });

  it(`countryCloneList has default value`, () => {
    expect(component.countryCloneList).toEqual([]);
  });

  it(`countryList has default value`, () => {
    expect(component.countryList).toEqual([]);
  });

  it(`stateCloneList has default value`, () => {
    expect(component.stateCloneList).toEqual([]);
  });

  it(`stateList has default value`, () => {
    expect(component.stateList).toEqual([]);
  });

  it(`cityList has default value`, () => {
    expect(component.cityList).toEqual([]);
  });

  it(`cityCloneList has default value`, () => {
    expect(component.cityCloneList).toEqual([]);
  });

  it(`investortypes has default value`, () => {
    expect(component.investortypes).toEqual([]);
  });

  it(`dynamicfielddata has default value`, () => {
    expect(component.dynamicfielddata).toEqual([]);
  });

  it(`dynamicBusinessData has default value`, () => {
    expect(component.dynamicBusinessData).toEqual([]);
  });

  it(`dynamicGeoLocationData has default value`, () => {
    expect(component.dynamicGeoLocationData).toEqual([]);
  });

  it(`tablegeographicLocationsModel has default value`, () => {
    expect(component.tablegeographicLocationsModel).toEqual([]);
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

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      spyOn(component, "getConfigurationDetails").and.callThrough();
      spyOn(component, "getMasterGeoLocations").and.callThrough();
      spyOn(component, "setDefaultValues").and.callThrough();
      component.ngOnInit();
      expect(component.getConfigurationDetails).toHaveBeenCalled();
      expect(component.getMasterGeoLocations).toHaveBeenCalled();
      expect(component.setDefaultValues).toHaveBeenCalled();
    });
  });

  describe("getConfigurationDetails", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(component, "addExistingGeographicLocation").and.callThrough();
      spyOn(
        investorServiceStub,
        "getInvestorAddEditConfiuration"
      ).and.callThrough();
      component.getConfigurationDetails();
      expect(component.addExistingGeographicLocation).toHaveBeenCalled();
      expect(
        investorServiceStub.getInvestorAddEditConfiuration
      ).toHaveBeenCalled();
    });
  });

  describe("getMasterGeoLocations", () => {
    it("makes expected calls", () => {
      const investorServiceStub: InvestorService = fixture.debugElement.injector.get(
        InvestorService
      );
      spyOn(investorServiceStub, "getMasterGeoLocations").and.callThrough();
      component.getMasterGeoLocations();
      expect(investorServiceStub.getMasterGeoLocations).toHaveBeenCalled();
    });
  });
});
