import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WorkflowAccessService } from 'src/app/services/workflow-access.service';
import { WorkflowGroupAccessComponent } from './workflow-group-access.component';

describe('WorkflowGroupAccessComponent', () => {
  let component: WorkflowGroupAccessComponent;
  let fixture: ComponentFixture<WorkflowGroupAccessComponent>;

  beforeEach(() => {
    const workflowAccessServiceStub = () => ({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowGroupAccessComponent],
      providers: [
        {
          provide: WorkflowAccessService,
          useFactory: workflowAccessServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(WorkflowGroupAccessComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`groupList has default value`, () => {
    expect(component.groupList).toEqual([]);
  });

  it(`tabList has default value`, () => {
    expect(component.tabList).toEqual([]);
  });

  it(`windowHeight has default value`, () => {
    expect(component.windowHeight).toEqual(0);
  });

  it(`selectedGroupId has default value`, () => {
    expect(component.selectedGroupId).toEqual(`0`);
  });

  it(`isReloadGroups has default value`, () => {
    expect(component.isReloadGroups).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getTabList').and.callThrough();
      component.ngOnInit();
      expect(component.getTabList).toHaveBeenCalled();
    });
  });
});
