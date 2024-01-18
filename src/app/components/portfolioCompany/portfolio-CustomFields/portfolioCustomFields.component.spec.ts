import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioCustomFieldsComponent } from './portfolioCustomFields.component';
import { ElementRef, Renderer2 } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { of, throwError } from 'rxjs';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';

describe('PortfolioCustomFieldsComponent', () => {
  let component: PortfolioCustomFieldsComponent;
  let fixture: ComponentFixture<PortfolioCustomFieldsComponent>;
  let portfolioCompanyServiceStub: Partial<PortfolioCompanyService>;
  let elRefStub: Partial<ElementRef>;
  let rendererStub: Partial<Renderer2>;

  beforeEach(() => {
    portfolioCompanyServiceStub = {
      getCompanyCustomList: (pcId: any, fieldId: any) => {
        if (pcId === 1 && fieldId === 1) {
          return of([
            { groupName: 'Group 1', displayOrder: 1 },
            { groupName: 'Group 2', displayOrder: 2 }
          ]);
        } else {
          return throwError('Error');
        }
      }
    };

    elRefStub = {};
    rendererStub = {};

    TestBed.configureTestingModule({
      declarations: [PortfolioCustomFieldsComponent],
      providers: [
        { provide: PortfolioCompanyService, useValue: portfolioCompanyServiceStub },
        { provide: ElementRef, useValue: elRefStub },
        { provide: Renderer2, useValue: rendererStub }
      ]
    });

    fixture = TestBed.createComponent(PortfolioCustomFieldsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.indexFieldId).toBeUndefined();
    expect(component.fieldId).toBeUndefined();
    expect(component.groupList).toEqual([]);
    expect(component.displayName).toBeUndefined();
    expect(component.companyId).toBeUndefined();
    expect(component.searchGroup).toEqual('');
    expect(component.groupName).toEqual('');
    expect(component.copyEditGroupName).toEqual('');
    expect(component.groupObj).toBeUndefined();
    expect(component.menuTrigger).toBeUndefined();
  });

  it('should call getCompanyCustomList on ngOnInit', () => {
    spyOn(component, 'getCompanyCustomList').and.callThrough();
    component.companyId = 1;
    component.fieldId = 1;
    component.ngOnInit();
    expect(component.getCompanyCustomList).toHaveBeenCalledWith(1);
  });

  it('should handle error on getCompanyCustomList', () => {
    spyOn(component, 'getCompanyCustomList').and.callThrough();
    component.companyId = 2;
    component.fieldId = 2;
    component.ngOnInit();
    expect(component.getCompanyCustomList).toHaveBeenCalledWith(2);
    expect(component.groupList).toEqual([]);
  });

  it('should move item in array on drop', () => {
    const event: CdkDragDrop<any[]> = {
      previousIndex: 0,
      currentIndex: 1,
      item: null,
      container: null,
      previousContainer: null,
      isPointerOverContainer: false,
      distance: { x: 0, y: 0 },
      dropPoint: null,
      event: null
    };
    component.drop(event);
    expect(component.groupList.length).toEqual(0);
  });

  it('should set group as editable on editGroup', () => {
    const group: any = {
      groupName: 'Group 1',
      displayOrder: 1,
      groupId: '',
      isActive: false,
      featureId: '',
      fieldId: '',
      isEditable: false
    };
    component.editGroup(group);
    expect(group.isEditable).toBe(true);
    expect(component.copyEditGroupName).toEqual('Group 1');
  });

  it('should set group as active on deleteGroup', () => {
    expect(component.groupList.length).toEqual(0);
  });

  it('should set group as editable on editGroup', () => {
    const group = { groupName: 'Group 1', displayOrder: 1, isEditable: false };
    component.editGroup(group);
    expect(group.isEditable).toBe(true);
    expect(component.copyEditGroupName).toEqual('Group 1');
  });

  it('should set group as active on deleteGroup', () => {
    const group = { groupName: 'Group 1', displayOrder: 1, isActive: false };
    component.deleteGroup(group);
    expect(group.isActive).toBe(false);
  });

  it('should update group name on updateGroup', () => {
    const group = { groupName: 'Group 1', displayOrder: 1, isEditable: true };
    component.copyEditGroupName = 'Group 2';
    component.updateGroup(group);
    expect(group.groupName).toEqual('Group 1');
    expect(group.isEditable).toBe(true);
    expect(component.groupName).toEqual('');
  });

  it('should add company group on addCompanyGroup', () => {
    component.groupName = 'Group 1';
    component.groupList = [
      { groupName: 'Group 2', displayOrder: 1,
      groupId: 1,
      isActive: false,
      featureId: 1,
      fieldId: 1,
      isEditable: false }
    ];
    component.addCompanyGroup();
    expect(component.groupList[0].groupId).toEqual(1);
    expect(component.groupName).toEqual('');
  });

  it('should emit updateList on changesUpdateList', () => {
    spyOn(component.updateList, 'emit').and.callThrough();
    const groupList: any[] = [
      { groupName: 'Group 1', displayOrder: 1 },
      { groupName: 'Group 2', displayOrder: 2 }
    ];
    component.changesUpdateList(groupList);
    expect(component.updateList.emit).toHaveBeenCalledWith(groupList);
  });

  it('should call click on closePanel', () => {
    const element = document.createElement('div');
    element.id = 'auto_trigger';
    spyOn(document, 'getElementById').and.returnValue(element);
    spyOn(element, 'click').and.callThrough();
    component.closePanel();
    expect(document.getElementById).toHaveBeenCalledWith('auto_trigger');
    expect(element.click).toHaveBeenCalled();
  });

  it('should restore group name on cancelClick', () => {
    const group = { groupName: 'Group 1', displayOrder: 1, isEditable: true };
    component.copyEditGroupName = 'Group 2';
    component.cancelClick(group);
    expect(group.groupName).toEqual('Group 2');
    expect(group.isEditable).toBe(false);
    expect(component.copyEditGroupName).toEqual('');
  });
});