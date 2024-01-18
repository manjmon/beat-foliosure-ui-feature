import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA ,ChangeDetectorRef} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermissionService } from 'src/app/services/permission.service';
import { FormsModule } from '@angular/forms';
import { WorkflowFeaturesComponent } from './workflow-features.component';

describe('WorkflowFeaturesComponent', () => {
  let component: WorkflowFeaturesComponent;
  let fixture: ComponentFixture<WorkflowFeaturesComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      error: (response, string, object) => ({}),
      success: (string, string1, object) => ({})
    });
    const permissionServiceStub = () => ({
      getGroupById: object => ({ subscribe: f => f({}) }),
      isFullAccess: groupId => ({ subscribe: f => f({}) }),
      updateGroup: modelClone => ({ subscribe: f => f({}) }),
      getFeatureList: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowFeaturesComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub }
      ]
    });
    fixture = TestBed.createComponent(WorkflowFeaturesComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`featureListOriginal has default value`, () => {
    expect(component.featureListOriginal).toEqual([]);
  });

  it(`isDisabledBtn has default value`, () => {
    expect(component.isDisabledBtn).toEqual(false);
  });

  it(`mappedFeatureList has default value`, () => {
    expect(component.mappedFeatureList).toEqual([]);
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(true);
  });

  it(`featuresToBeUpdated has default value`, () => {
    expect(component.featuresToBeUpdated).toEqual([]);
  });

  it(`groupStatus has default value`, () => {
    expect(component.groupStatus).toEqual(true);
  });

  it(`enableFeature has default value`, () => {
    expect(component.enableFeature).toEqual(true);
  });

  it(`msgs has default value`, () => {
    expect(component.msgs).toEqual([]);
  });

  it(`successMessage has default value`, () => {
    expect(component.successMessage).toEqual(true);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`selectedValues has default value`, () => {
    expect(component.selectedValues).toEqual([]);
  });

  it(`isConfirmFullAccess has default value`, () => {
    expect(component.isConfirmFullAccess).toEqual(false);
  });

  it(`featureFullAccess has default value`, () => {
    expect(component.featureFullAccess).toEqual(false);
  });

  it(`loadingMap has default value`, () => {
    expect(component.loadingMap).toEqual(false);
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getFeatureList').and.callThrough();
      spyOn(component, 'setDefaultValues').and.callThrough();
      component.ngOnChanges();
      expect(component.getFeatureList).toHaveBeenCalled();
      expect(component.setDefaultValues).toHaveBeenCalled();
    });
  });

  describe('setDefaultValues', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, 'createHierarchicalFeatureSelection').and.callThrough();
      spyOn(component, 'enableDisableFeatures').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(permissionServiceStub, 'getGroupById').and.callThrough();
      component.setDefaultValues();
      expect(component.createHierarchicalFeatureSelection).toHaveBeenCalled();
      expect(component.enableDisableFeatures).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(permissionServiceStub.getGroupById).toHaveBeenCalled();
    });
  });

  describe('isFullAccess', () => {
    it('makes expected calls', () => {
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(permissionServiceStub, 'isFullAccess').and.callThrough();
      component.isFullAccess();
      expect(permissionServiceStub.isFullAccess).toHaveBeenCalled();
    });
  });

  describe('saveFeature', () => {
    it('makes expected calls', () => {
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, 'serializeFeatureList').and.callThrough();
      spyOn(component, 'createHierarchicalFeature').and.callThrough();
      spyOn(component, 'formReset').and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      spyOn(permissionServiceStub, 'updateGroup').and.callThrough();
      component.saveFeature();
      expect(component.serializeFeatureList).toHaveBeenCalled();
      expect(component.createHierarchicalFeature).toHaveBeenCalled();
      expect(component.formReset).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
      expect(permissionServiceStub.updateGroup).toHaveBeenCalled();
    });
  });

  describe('resetMapping', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getFeatureList').and.callThrough();
      spyOn(component, 'setDefaultValues').and.callThrough();
      component.resetMapping();
      expect(component.getFeatureList).toHaveBeenCalled();
      expect(component.setDefaultValues).toHaveBeenCalled();
    });
  });

  describe('getFeatureList', () => {
    it('makes expected calls', () => {
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, 'enableDisableFeatures').and.callThrough();
      spyOn(component, 'isFullAccess').and.callThrough();
      spyOn(permissionServiceStub, 'getFeatureList').and.callThrough();
      component.getFeatureList();
      expect(component.enableDisableFeatures).toHaveBeenCalled();
      expect(component.isFullAccess).toHaveBeenCalled();
      expect(permissionServiceStub.getFeatureList).toHaveBeenCalled();
    });
  });

  describe('enableDisableFeatures', () => {
    it('makes expected calls', () => {
      spyOn(component, 'enableDisableMainFeatureList').and.callThrough();
      component.enableDisableFeatures();
      expect(component.enableDisableMainFeatureList).toHaveBeenCalled();
    });
  });

  describe('formReset', () => {
    it('makes expected calls', () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      spyOn(component, 'getFeatureList').and.callThrough();
      spyOn(component, 'setDefaultValues').and.callThrough();
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      component.formReset();
      expect(component.getFeatureList).toHaveBeenCalled();
      expect(component.setDefaultValues).toHaveBeenCalled();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });
});
