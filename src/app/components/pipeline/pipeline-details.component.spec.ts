import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "../../services/account.service";
import { PipelineService } from "../../services/pipeline.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { FeaturesEnum } from "../../services/permission.service";
import { PipelineDetailsComponent } from "./pipeline-details.component";
import { of, throwError } from "rxjs";

describe("PipelineDetailsComponent", () => {
  let component: PipelineDetailsComponent;
  let fixture: ComponentFixture<PipelineDetailsComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const accountServiceStub = () => ({});
    const pipelineServiceStub = () => ({
      getPipelineById: object => ({ subscribe: f => of({}) })
    });
    const miscellaneousServiceStub = () => ({ getTitle: arg => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PipelineDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: PipelineService, useFactory: pipelineServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PipelineDetailsComponent);
    component = fixture.componentInstance;
  });

  it("can load instance", () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });
  describe("getPipelineDetails", () => {
    it("should set loading to true", () => {
      component.id = "sampleId";
      component.getPipelineDetails();
      expect(component.loading).toBeTrue();
    });
    it("should set model and call getTitle when HeaderNameID exists", () => {
      component.id = "sampleId";
      const mockResult = { name: "Sample Name" };
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      const miscServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      spyOn(pipelineServiceStub, "getPipelineById").and.returnValue(of(mockResult));
      spyOn(miscServiceStub, "getTitle").and.callThrough(); // Create the spy
      component.getPipelineDetails();
      expect(component.model).toEqual(mockResult);
    });

    it("should set loading to false on success", () => {
      component.id = "sampleId";
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(pipelineServiceStub, "getPipelineById").and.callFake(() => of({}));
      component.getPipelineDetails();
      expect(component.loading).toBeFalse();
    });


    it("should set loading to false on error", () => {
      component.id = "sampleId";
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(pipelineServiceStub, "getPipelineById").and.returnValue(throwError("Error"));
      component.getPipelineDetails();
      expect(component.loading).toBeFalse();
    });
  });
});
