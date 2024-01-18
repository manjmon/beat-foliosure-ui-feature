import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { WorkflowAccessService } from 'src/app/services/workflow-access.service';
import { FormsModule } from '@angular/forms';
import { WorkflowGroupsComponent } from './workflow-groups.component';
import { MatMenuModule } from '@angular/material/menu';

describe('WorkflowGroupsComponent', () => {
  let component: WorkflowGroupsComponent;
  let fixture: ComponentFixture<WorkflowGroupsComponent>;

  beforeEach(() => {
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (arg, string, object) => ({}),
      error: (message, string, object) => ({})
    });
    const workflowAccessServiceStub = () => ({
      checkIfAdmin: () => ({ subscribe: f => f({}) }),
      getGroups: filter => ({ subscribe: f => f({}) }),
      createGroup: group => ({ subscribe: f => f({}) }),
      createSubGroup: subGroup => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowGroupsComponent],
      providers: [
        { provide: ToastrService, useFactory: toastrServiceStub },
        {
          provide: WorkflowAccessService,
          useFactory: workflowAccessServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(WorkflowGroupsComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`windowHeight has default value`, () => {
    expect(component.windowHeight).toEqual(0);
  });

  it(`groupList has default value`, () => {
    expect(component.groupList).toEqual([]);
  });

  it(`isOpenPopup has default value`, () => {
    expect(component.isOpenPopup).toEqual(false);
  });

  it(`isDescPopup has default value`, () => {
    expect(component.isDescPopup).toEqual(false);
  });

  it(`placeholderGroupName has default value`, () => {
    expect(component.placeholderGroupName).toEqual(`Enter Group Name`);
  });

  it(`disableAdd has default value`, () => {
    expect(component.disableAdd).toEqual(true);
  });

  it(`disableSubGroupAdd has default value`, () => {
    expect(component.disableSubGroupAdd).toEqual(true);
  });

  it(`isGroupEdit has default value`, () => {
    expect(component.isGroupEdit).toEqual(false);
  });

  it(`isSubGroupEdit has default value`, () => {
    expect(component.isSubGroupEdit).toEqual(false);
  });

  it(`groupTitle has default value`, () => {
    expect(component.groupTitle).toEqual(`Add Group`);
  });

  it(`primaryButtonName has default value`, () => {
    expect(component.primaryButtonName).toEqual(`Add`);
  });

  it(`subGroupTitle has default value`, () => {
    expect(component.subGroupTitle).toEqual(`Add Sub Group`);
  });

  it(`subGroupprimaryButtonName has default value`, () => {
    expect(component.subGroupprimaryButtonName).toEqual(`Add`);
  });

  it(`isDeletePopup has default value`, () => {
    expect(component.isDeletePopup).toEqual(false);
  });

  it(`isDeleteSubGroupPopup has default value`, () => {
    expect(component.isDeleteSubGroupPopup).toEqual(false);
  });

  it(`isOpenSubGroupPopup has default value`, () => {
    expect(component.isOpenSubGroupPopup).toEqual(false);
  });

  it(`isStatusPopup has default value`, () => {
    expect(component.isStatusPopup).toEqual(false);
  });

  it(`isError has default value`, () => {
    expect(component.isError).toEqual(false);
  });

  it(`isAdmin has default value`, () => {
    expect(component.isAdmin).toEqual(false);
  });

  it(`showMoveProfilesPopUp has default value`, () => {
    expect(component.showMoveProfilesPopUp).toEqual(false);
  });

  it(`isReloadGroups has default value`, () => {
    expect(component.isReloadGroups).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getGroups').and.callThrough();
      spyOn(component, 'setAdmin').and.callThrough();
      component.ngOnInit();
      expect(component.getGroups).toHaveBeenCalled();
      expect(component.setAdmin).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
       component.ngOnChanges();
      });
  });

  describe('setAdmin', () => {
    it('makes expected calls', () => {
      const workflowAccessServiceStub: WorkflowAccessService = fixture.debugElement.injector.get(
        WorkflowAccessService
      );
      spyOn(workflowAccessServiceStub, 'checkIfAdmin').and.callThrough();
      component.setAdmin();
      expect(workflowAccessServiceStub.checkIfAdmin).toHaveBeenCalled();
    });
  });

  describe('getGroups', () => {
    it('makes expected calls', () => {
      const workflowAccessServiceStub: WorkflowAccessService = fixture.debugElement.injector.get(
        WorkflowAccessService
      );
      spyOn(workflowAccessServiceStub, 'getGroups').and.callThrough();
      component.getGroups();
      expect(workflowAccessServiceStub.getGroups).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getGroups').and.callThrough();
      component.search();
      expect(component.getGroups).toHaveBeenCalled();
    });
  });

  describe('createGroup', () => {
    it('makes expected calls', () => {
      const workflowAccessServiceStub: WorkflowAccessService = fixture.debugElement.injector.get(
        WorkflowAccessService
      );
       spyOn(workflowAccessServiceStub, 'createGroup').and.callThrough();
      component.createGroup();
      expect(workflowAccessServiceStub.createGroup).toHaveBeenCalled();
    });
  });

  describe('onDescChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkValidation').and.callThrough();
      component.onDescChange();
      expect(component.checkValidation).toHaveBeenCalled();
    });
  });

  describe('onSubGroupDescChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkSubGroupValidation').and.callThrough();
      component.onSubGroupDescChange();
      expect(component.checkSubGroupValidation).toHaveBeenCalled();
    });
  });

  describe('createSubGroup', () => {
    it('makes expected calls', () => {
      const workflowAccessServiceStub: WorkflowAccessService = fixture.debugElement.injector.get(
        WorkflowAccessService
      );
      spyOn(workflowAccessServiceStub, 'createSubGroup').and.callThrough();
      component.createSubGroup();
      expect(workflowAccessServiceStub.createSubGroup).toHaveBeenCalled();
    });
  });
});
