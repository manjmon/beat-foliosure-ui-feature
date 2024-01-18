import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WorkflowStatusService } from 'src/app/services/workflow-status.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { WorkflowStatusComponent } from './workflow-status.component';

describe('WorkflowStatusComponent', () => {
  let component: WorkflowStatusComponent;
  let fixture: ComponentFixture<WorkflowStatusComponent>;

  beforeEach(() => {
    const workflowStatusServiceStub = () => ({
      getWorkflowStatus: () => ({ subscribe: f => f({}) }),
      addOrUpdateWorkflowStatus: status => ({ subscribe: f => f({}) }),
      deleteWorkflowStatus: statusId => ({ subscribe: f => f({}) }),
      MapStatusToGroup: statuslistToBeMappedOrUnmapped => ({
        subscribe: f => f({})
      })
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowStatusComponent],
      providers: [
        {
          provide: WorkflowStatusService,
          useFactory: workflowStatusServiceStub
        },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(WorkflowStatusComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`StatusList has default value`, () => {
    expect(component.StatusList).toEqual([]);
  });

  it(`isAddStatus has default value`, () => {
    expect(component.isAddStatus).toEqual(false);
  });

  it(`StatusToBeUpdatedOrDeleted has default value`, () => {
    expect(component.StatusToBeUpdatedOrDeleted).toEqual(undefined);
  });

  it(`isDescPopup has default value`, () => {
    expect(component.isDescPopup).toEqual(false);
  });

  it(`isToasterSuccess has default value`, () => {
    expect(component.isToasterSuccess).toEqual(true);
  });

  it(`showDelStatusConfirmation has default value`, () => {
    expect(component.showDelStatusConfirmation).toEqual(false);
  });

  it(`showMoveProfilesPopUp has default value`, () => {
    expect(component.showMoveProfilesPopUp).toEqual(false);
  });

  it(`selectedSubGroupId has default value`, () => {
    expect(component.selectedSubGroupId).toEqual(0);
  });

  it(`StatuslistToBeMappedOrUnmapped has default value`, () => {
    expect(component.StatuslistToBeMappedOrUnmapped).toEqual([]);
  });

  it(`workflowStatusList has default value`, () => {
    expect(component.workflowStatusList).toEqual([]);
  });

  it(`disableMapBtn has default value`, () => {
    expect(component.disableMapBtn).toEqual(true);
  });

  it(`disableResetBtn has default value`, () => {
    expect(component.disableResetBtn).toEqual(true);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getStatusList').and.callThrough();
      component.ngOnInit();
      expect(component.getStatusList).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getMappedStatus').and.callThrough();
      component.ngOnChanges();
      expect(component.getMappedStatus).toHaveBeenCalled();
    });
  });

  describe('getStatusList', () => {
    it('makes expected calls', () => {
      const workflowStatusServiceStub: WorkflowStatusService = fixture.debugElement.injector.get(
        WorkflowStatusService
      );
      spyOn(component, 'getMappedStatus').and.callThrough();
      spyOn(workflowStatusServiceStub, 'getWorkflowStatus').and.callThrough();
      component.getStatusList();
      expect(component.getMappedStatus).toHaveBeenCalled();
      expect(workflowStatusServiceStub.getWorkflowStatus).toHaveBeenCalled();
    });
  });

  describe('CloseAddStatusPopup', () => {
    it('makes expected calls', () => {
      spyOn(component, 'resetAddStatusPopup').and.callThrough();
      component.CloseAddStatusPopup();
      expect(component.resetAddStatusPopup).toHaveBeenCalled();
    });
  });

  describe('resetAddStatusPopup', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getStatusList').and.callThrough();
      component.resetAddStatusPopup();
      expect(component.getStatusList).toHaveBeenCalled();
    });
  });

  describe('addOrUpdateWorkflowStatus', () => {
    it('makes expected calls', () => {
      const workflowStatusServiceStub: WorkflowStatusService = fixture.debugElement.injector.get(
        WorkflowStatusService
      );
      spyOn(component, 'resetAddStatusPopup').and.callThrough();
      spyOn(component, 'closeAfterUpdate').and.callThrough();
      spyOn(
        workflowStatusServiceStub,
        'addOrUpdateWorkflowStatus'
      ).and.callThrough();
      component.addOrUpdateWorkflowStatus();
      expect(component.resetAddStatusPopup).toHaveBeenCalled();
      expect(component.closeAfterUpdate).toHaveBeenCalled();
      expect(
        workflowStatusServiceStub.addOrUpdateWorkflowStatus
      ).toHaveBeenCalled();
    });
  });

  describe('closeAfterUpdate', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, 'CloseAddStatusPopup').and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      component.closeAfterUpdate();
      expect(component.CloseAddStatusPopup).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
    });
  });

  describe('deleteStatus', () => {
    it('makes expected calls', () => {
      const workflowStatusServiceStub: WorkflowStatusService = fixture.debugElement.injector.get(
        WorkflowStatusService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, 'getStatusList').and.callThrough();
      spyOn(component, 'closeDelStatusConfirmation').and.callThrough();
      spyOn(
        workflowStatusServiceStub,
        'deleteWorkflowStatus'
      ).and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.deleteStatus();
      expect(component.getStatusList).toHaveBeenCalled();
      expect(component.closeDelStatusConfirmation).toHaveBeenCalled();
      expect(workflowStatusServiceStub.deleteWorkflowStatus).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('mapOrUnmapStatus', () => {
    it('makes expected calls', () => {
      const workflowStatusServiceStub: WorkflowStatusService = fixture.debugElement.injector.get(
        WorkflowStatusService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, 'getStatusList').and.callThrough();
      spyOn(component, 'resetStatusMapping').and.callThrough();
      spyOn(workflowStatusServiceStub, 'MapStatusToGroup').and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.mapOrUnmapStatus();
      expect(component.getStatusList).toHaveBeenCalled();
      expect(component.resetStatusMapping).toHaveBeenCalled();
      expect(workflowStatusServiceStub.MapStatusToGroup).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('resetStatusMapping', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getMappedStatus').and.callThrough();
      component.resetStatusMapping();
      expect(component.getMappedStatus).toHaveBeenCalled();
    });
  });
});
