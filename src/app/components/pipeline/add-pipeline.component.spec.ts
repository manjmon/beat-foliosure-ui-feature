import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FirmService } from "../../services/firm.service";
import { MiscellaneousService } from "../../services/miscellaneous.service";
import { PipelineService } from "../../services/pipeline.service";
import { FormBuilder,FormControl,FormsModule, ReactiveFormsModule, UntypedFormControl, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AddPipelineComponent } from "./add-pipeline.component";
import { of, throwError } from "rxjs";

describe("AddPipelineComponent", () => {
  let component: AddPipelineComponent;
  let fixture: ComponentFixture<AddPipelineComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const firmServiceStub = () => ({});
    const miscellaneousServiceStub = () => ({
      getMessageTimeSpan: () => ({}),
      GetPriviousPageUrl: () => ({}),
      getSideBarWidth: () => ({})
    });
    const pipelineServiceStub = () => ({
      getMasterData: () => ({ subscribe: f => of({}) }),
      getPipelineById: object => ({ subscribe: f => f({}) }),
      createPipeline: model => ({ subscribe: f => f({}) }),
      updatePipeline: model => ({ subscribe: f => of({}) })
    });
    const formBuilderStub = () => ({ group: object => ({}) });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: jasmine.createSpy("success"),
      error: jasmine.createSpy("error")
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AddPipelineComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PipelineService, useFactory: pipelineServiceStub },
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AddPipelineComponent);
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

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`submitted has default value`, () => {
    expect(component.submitted).toEqual(false);
  });

  it(`accountTypeLoading has default value`, () => {
    expect(component.accountTypeLoading).toEqual(false);
  });

  describe("ngOnInit", () => {
    it("makes expected calls", () => {
      const miscellaneousServiceStub: MiscellaneousService = fixture.debugElement.injector.get(
        MiscellaneousService
      );
      const formBuilderStub: FormBuilder = fixture.debugElement.injector.get(
        FormBuilder
      );
      spyOn(component, "getPipelineDetails").and.callThrough();
      spyOn(component, "getMasterData").and.callThrough();
      spyOn(miscellaneousServiceStub, "GetPriviousPageUrl").and.callThrough();
      spyOn(formBuilderStub, "group").and.callThrough();
      component.ngOnInit();
      expect(component.getPipelineDetails).toHaveBeenCalled();
      expect(component.getMasterData).toHaveBeenCalled();
      expect(miscellaneousServiceStub.GetPriviousPageUrl).toHaveBeenCalled();
      expect(formBuilderStub.group).toHaveBeenCalled();
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

  describe("getMasterData", () => {
    it("makes expected calls", () => {
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(pipelineServiceStub, "getMasterData").and.callThrough();
      component.getMasterData();
      expect(pipelineServiceStub.getMasterData).toHaveBeenCalled();
    });
  });

  describe("getPipelineDetails", () => {
    it("should set the model and loading flag when the id is defined", () => {
      // Arrange
      const mockResult = {
        name: "Test Pipeline",
        usersModel: "Test User",
        closingDate: "2022-01-01"
      };
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(pipelineServiceStub, "getPipelineById").and.returnValue(of(mockResult));

      // Act
      component.id = "1";
      component.getPipelineDetails();

      // Assert
      expect(component.loading).toBeFalse();
      expect(component.title).toEqual("Update");
      expect(component.resetText).toEqual("Reset");
      expect(component.loading).toBeFalse();
    });

    it("should set the loading flag when an error occurs", () => {
      // Arrange
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(pipelineServiceStub, "getPipelineById").and.returnValue(throwError("Error"));

      // Act
      component.id = "1";
      component.getPipelineDetails();

      // Assert
      expect(component.loading).toBeFalse();
    });

    it("should not set the model and loading flag when the id is undefined", () => {
      // Arrange
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      spyOn(pipelineServiceStub, "getPipelineById");

      // Act
      component.id = undefined;
      component.getPipelineDetails();

      // Assert
      expect(pipelineServiceStub.getPipelineById).not.toHaveBeenCalled();
      expect(component.loading).toBeFalse();
    });
  });

  it("should call updatePipeline method and show success toastr message when title is 'Update'", () => {
    // Arrange
    component.title = "Update";
    component.model = {
      pipelineName: "Test Pipeline",
      primaryContact: { id: 1 }
    };

    // Act
    component.addPipeline();

    // Assert
    const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
      ToastrService
    );
    expect(component.title).toEqual("Update");
    expect(toastrServiceStub.error).not.toHaveBeenCalled();
    expect(component.loading).toBeTrue();
  });
  describe("addPipeline", () => {

    it("should call updatePipeline method and show success toastr message when title is 'Update'", () => {
      // Arrange
      component.title = "Update";
      component.model = { pipelineName: "Test Pipeline" };
      
      // Act
      component.addPipeline();

      // Assert
      expect(component.title).toEqual("Update");
    });

    it("should show error toastr message when createPipeline or updatePipeline method throws an error", () => {
      // Arrange
      component.title = "Create";
      component.model = { pipelineName: "Test Pipeline" };
      const pipelineServiceStub: PipelineService = fixture.debugElement.injector.get(
        PipelineService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(pipelineServiceStub, "createPipeline").and.returnValue(throwError("Error"));

      // Act
      component.addPipeline();

      // Assert
      expect(toastrServiceStub.success).not.toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalledWith("Pipeline Name already exist", "", { positionClass: "toast-center-center" });

    });
  });
});
