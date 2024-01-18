import { TestBed } from "@angular/core/testing";
import { AbstractFilterStrategy } from "./reports";

describe("AbstractFilterStrategy", () => {
  let service: AbstractFilterStrategy;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AbstractFilterStrategy] });
    service = TestBed.inject(AbstractFilterStrategy);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });

  it(`IsEnabled has default value`, () => {
    expect(service.IsEnabled).toEqual(false);
  });

  it(`ReportId has default value`, () => {
    expect(service.ReportId).toEqual(0);
  });

  describe("IFilter", () => {
    it("should call GetItems method", () => {
      const item = "test";
      const reportFilters = [];
      spyOn(service, "GetItems");
      service.GetItems(item, reportFilters);
      expect(service.GetItems).toHaveBeenCalledWith(item, reportFilters);
    });

    it("should call Init method", () => {
      const reportId = 1;
      spyOn(service, "Init");
      service.Init(reportId);
      expect(service.Init).toHaveBeenCalledWith(reportId);
    });

    it("should call DoEnableFilters method", () => {
      spyOn(service, "DoEnableFilters");
      service.DoEnableFilters();
      expect(service.DoEnableFilters).toHaveBeenCalled();
    });

    it("should call LoadSavedFilter method", () => {
      const item = "test";
      spyOn(service, "LoadSavedFilter");
      service.LoadSavedFilter(item);
      expect(service.LoadSavedFilter).toHaveBeenCalledWith(item);
    });
  });
});