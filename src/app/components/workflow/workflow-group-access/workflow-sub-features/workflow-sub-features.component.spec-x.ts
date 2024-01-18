import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA,ChangeDetectorRef } from '@angular/core';
import { WorkflowAccessService } from './../../../../services/workflow-access.service';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';
import { PermissionService,FeaturesEnum } from 'src/app/services/permission.service';
import { WorkflowFeatureService } from 'src/app/services/workflow-feature.service';
import { LazyLoadEvent } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { WorkflowSubFeaturesComponent } from './workflow-sub-features.component';

describe('WorkflowSubFeaturesComponent', () => {
  let component: WorkflowSubFeaturesComponent;
  let fixture: ComponentFixture<WorkflowSubFeaturesComponent>;

  beforeEach(() => {
    const workflowAccessServiceStub = () => ({
      updateGroupPermission: permissionModel => ({ subscribe: f => f({}) })
    });
    const changeDetectorRefStub = () => ({ detectChanges: () => ({}) });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    const accountServiceStub = () => ({});
    const permissionServiceStub = () => ({
      getSubFeatureByGroup: permissionModel => ({ subscribe: f => f({}) })
    });
    const workflowFeatureServiceStub = () => ({
      getFeaturesList: groupId => ({ subscribe: f => f({}) }),
      getCompanyList: arg => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowSubFeaturesComponent],
      providers: [
        {
          provide: WorkflowAccessService,
          useFactory: workflowAccessServiceStub
        },
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        {
          provide: WorkflowFeatureService,
          useFactory: workflowFeatureServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(WorkflowSubFeaturesComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`isCheckAll has default value`, () => {
    expect(component.isCheckAll).toEqual(false);
  });

  it(`isDisabledBtn has default value`, () => {
    expect(component.isDisabledBtn).toEqual(true);
  });

  it(`mappedSubFeatureList has default value`, () => {
    expect(component.mappedSubFeatureList).toEqual([]);
  });

  it(`featureList has default value`, () => {
    expect(component.featureList).toEqual([]);
  });

  it(`permissionList has default value`, () => {
    expect(component.permissionList).toEqual([]);
  });

  it(`permissionListOriginal has default value`, () => {
    expect(component.permissionListOriginal).toEqual([]);
  });

  it(`frozenCols has default value`, () => {
    expect(component.frozenCols).toEqual([{ field: "checkbox", header: "checkbox" }, { field: "subFeatureName", header: "List of Features" }]);
  });

  it(`companyList has default value`, () => {
    expect(component.companyList).toEqual([]);
  });

  it(`permissioncols has default value`, () => {
    expect(component.permissioncols).toEqual(component.permissioncols);
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`selectedCopyToCompanyList has default value`, () => {
    expect(component.selectedCopyToCompanyList).toEqual([]);
  });

  it(`companyFilterList has default value`, () => {
    expect(component.companyFilterList).toEqual([]);
  });

  describe('loadSubFeaturesLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'getUserPermissions').and.callThrough();
      component.loadSubFeaturesLazy(lazyLoadEventStub);
      expect(component.getUserPermissions).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getAll').and.callThrough();
      component.ngOnInit();
      expect(component.getAll).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getAll').and.callThrough();
      component.ngOnChanges();
      expect(component.getAll).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getUserPermissions').and.callThrough();
      spyOn(component, 'getFeatureList').and.callThrough();
      spyOn(component, 'reload').and.callThrough();
      component.getAll();
      expect(component.getUserPermissions).toHaveBeenCalled();
      expect(component.getFeatureList).toHaveBeenCalled();
      expect(component.reload).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      const changeDetectorRefStub: ChangeDetectorRef = fixture.debugElement.injector.get(
        ChangeDetectorRef
      );
      spyOn(changeDetectorRefStub, 'detectChanges').and.callThrough();
      component.ngAfterViewInit();
      expect(changeDetectorRefStub.detectChanges).toHaveBeenCalled();
    });
  });

  describe('resetSubFeature', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getUserPermissions').and.callThrough();
      component.resetSubFeature();
      expect(component.getUserPermissions).toHaveBeenCalled();
    });
  });

  describe('mapSubFeature', () => {
    it('makes expected calls', () => {
      spyOn(component, 'updateUserPermissions').and.callThrough();
      component.mapSubFeature();
      expect(component.updateUserPermissions).toHaveBeenCalled();
    });
  });

  describe('getUserPermissions', () => {
    it('makes expected calls', () => {
      const permissionServiceStub: PermissionService = fixture.debugElement.injector.get(
        PermissionService
      );
      spyOn(component, 'setDefaultSelectedFeature').and.callThrough();
      spyOn(component, 'setCheckAll').and.callThrough();
      spyOn(permissionServiceStub, 'getSubFeatureByGroup').and.callThrough();
      component.getUserPermissions();
      expect(component.setDefaultSelectedFeature).toHaveBeenCalled();
      expect(component.setCheckAll).toHaveBeenCalled();
      expect(permissionServiceStub.getSubFeatureByGroup).toHaveBeenCalled();
    });
  });

  describe('setDefaultSelectedFeature', () => {
    it('makes expected calls', () => {
      spyOn(component, 'isCheckParent').and.callThrough();
      component.setDefaultSelectedFeature();
      expect(component.isCheckParent).toHaveBeenCalled();
    });
  });

  describe('checkAnyDataChange', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setCheckAll').and.callThrough();
      component.checkAnyDataChange();
      expect(component.setCheckAll).toHaveBeenCalled();
    });
  });

  describe('updateUserPermissions', () => {
    it('makes expected calls', () => {
      const workflowAccessServiceStub: WorkflowAccessService = fixture.debugElement.injector.get(
        WorkflowAccessService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, 'getUserPermissions').and.callThrough();
      spyOn(
        workflowAccessServiceStub,
        'updateGroupPermission'
      ).and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.updateUserPermissions();
      expect(component.getUserPermissions).toHaveBeenCalled();
      expect(
        workflowAccessServiceStub.updateGroupPermission
      ).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('getFeatureList', () => {
    it('makes expected calls', () => {
      const workflowFeatureServiceStub: WorkflowFeatureService = fixture.debugElement.injector.get(
        WorkflowFeatureService
      );
      spyOn(component, 'getCompanyList').and.callThrough();
      spyOn(workflowFeatureServiceStub, 'getFeaturesList').and.callThrough();
      component.getFeatureList();
      expect(component.getCompanyList).toHaveBeenCalled();
      expect(workflowFeatureServiceStub.getFeaturesList).toHaveBeenCalled();
    });
  });

  describe('getCompanyList', () => {
    it('makes expected calls', () => {
      const workflowFeatureServiceStub: WorkflowFeatureService = fixture.debugElement.injector.get(
        WorkflowFeatureService
      );
      spyOn(component, 'reload').and.callThrough();
      spyOn(workflowFeatureServiceStub, 'getCompanyList').and.callThrough();
      component.getCompanyList();
      expect(component.reload).toHaveBeenCalled();
      expect(workflowFeatureServiceStub.getCompanyList).toHaveBeenCalled();
    });
  });

  describe('getCompanySelected', () => {
    it('makes expected calls', () => {
      spyOn(component, 'checkAnyDataChange').and.callThrough();
      component.getCompanySelected();
      expect(component.checkAnyDataChange).toHaveBeenCalled();
    });
  });
});
