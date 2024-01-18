import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountService } from 'src/app/services/account.service';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { ToastrService } from 'ngx-toastr';
import { FeaturesEnum } from 'src/app/services/permission.service';
import { FormsModule } from '@angular/forms';
import { WorkflowUsersComponent } from './workflow-users.component';


describe('WorkflowUsersComponent', () => {
  let component: WorkflowUsersComponent;
  let fixture: ComponentFixture<WorkflowUsersComponent>;

  beforeEach(() => {
    const accountServiceStub = () => ({
      getUserList: object => ({ subscribe: f => f({}) }),
      UpdateUserSubGroups: usersToBeUpdated => ({ subscribe: f => f({}) })
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (message, string, object) => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [WorkflowUsersComponent],
      providers: [
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub }
      ]
    });
    fixture = TestBed.createComponent(WorkflowUsersComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`users has default value`, () => {
    expect(component.users).toEqual([]);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`checkAll has default value`, () => {
    expect(component.checkAll).toEqual(false);
  });

  it(`usersToBeUpdated has default value`, () => {
    expect(component.usersToBeUpdated).toEqual([]);
  });

  it(`selectedSubGroupId has default value`, () => {
    expect(component.selectedSubGroupId).toEqual(0);
  });

  it(`allUsers has default value`, () => {
    expect(component.allUsers).toEqual([]);
  });

  it(`isOpenAddUser has default value`, () => {
    expect(component.isOpenAddUser).toEqual(false);
  });

  it(`headers has default value`, () => {
    expect(component.headers).toEqual( [{header:'Email',field:'emailID'},{header:'Organization',field:'organization'},
    {header:'Country',field:'countryName'},{header:'Phone No',field:'phoneNumber'},
    {header:'Status',field:'status'},{header:'Action',field:'action'}]);
  });

  it(`frozenProfitAndLossCols has default value`, () => {
    expect(component.frozenProfitAndLossCols).toEqual([{ field: "checkbox", header: "checkbox" },{header:'Name',field:'fullName'}]);
  });

  it(`loading has default value`, () => {
    expect(component.loading).toEqual(false);
  });

  describe('loadUsersLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'getUserList').and.callThrough();
      component.loadUsersLazy(lazyLoadEventStub);
      expect(component.getUserList).toHaveBeenCalled();
    });
  });

  describe('ngOnChanges', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getUsers').and.callThrough();
      component.ngOnChanges();
      expect(component.getUsers).toHaveBeenCalled();
    });
  });

  describe('mapUsers', () => {
    it('makes expected calls', () => {
      const accountServiceStub: AccountService = fixture.debugElement.injector.get(
        AccountService
      );
      const toastrServiceStub: ToastrService = fixture.debugElement.injector.get(
        ToastrService
      );
      spyOn(component, 'getUserList').and.callThrough();
      spyOn(component, 'resetUserMapping').and.callThrough();
      spyOn(accountServiceStub, 'UpdateUserSubGroups').and.callThrough();
      spyOn(toastrServiceStub, 'success').and.callThrough();
      spyOn(toastrServiceStub, 'error').and.callThrough();
      component.mapUsers();
      expect(component.getUserList).toHaveBeenCalled();
      expect(component.resetUserMapping).toHaveBeenCalled();
      expect(accountServiceStub.UpdateUserSubGroups).toHaveBeenCalled();
      expect(toastrServiceStub.success).toHaveBeenCalled();
      expect(toastrServiceStub.error).toHaveBeenCalled();
    });
  });

  describe('resetUserMapping', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getUsers').and.callThrough();
      component.resetUserMapping();
      expect(component.getUsers).toHaveBeenCalled();
    });
  });
});
