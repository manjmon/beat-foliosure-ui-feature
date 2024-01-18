import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { NotificationService } from 'src/app/services/Notification.service';
import { OidcAuthService } from 'src/app/services/oidc-auth.service';
import { HelperService } from 'src/app/services/helper.service';
import { Router } from '@angular/router';
import { HeaderComponent } from './header.component';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { UploadService } from 'src/app/services/upload.service';
import { HttpClientModule } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { DocumentService } from 'src/app/services/document.service';
import { PermissionService } from 'src/app/services/permission.service';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    const primeNGConfigStub = () => ({ ripple: {} });
    const notificationServiceStub = () => ({
      getNotificationStatus: () => ({ subscribe: f => f instanceof Function ? f({}) : null }),
      getNotification: () => ({ subscribe: f => f instanceof Function ? f({}) : null }),
      updateNotifications: updateNotification => ({ subscribe: f => f instanceof Function ? f({}) : null }),
      clearAllNotifications: () => ({ subscribe: f => f instanceof Function ? f({}) : null }),
      clearNotifications: () => ({ subscribe: f => f instanceof Function ? f({}) : null })
    });
    const uploadServiceStub = () => ({
      uploadCompleted$: () => ({ subscribe: f => f({}) })
    });
    const oidcAuthServiceStub = () => ({
      getEnvironmentConfig: () => ({ reset_password: {} }),
      getToken: () => ({ token: {} })
      
    });
    const subscribeNotification = () => ({ subscribe: f => f instanceof Function ? f({}) : null });
    const helperServiceStub = () => ({ getIconFromFileName: filename => ({}) });
    const routerStub = () => ({
      navigateByUrl: (string, object) => ({ then: () => ({}) }),
      navigate: array => ({})
    });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (toasterMessage, string, object) => ({}),
      error: (toasterMessage, string, object) => ({})
    });
    const documentServiceStub = () => ({
      downloadFile: () => ({ subscribe: f => f({}) }),
      getExcelPluginDownload: () => ({ subscribe: f => f({}) })
    });
    const permissionServiceStub = () => ({
      checkFeaturePermission: () => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule,HttpClientModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HeaderComponent],
      providers: [
        { provide: PrimeNGConfig, useFactory: primeNGConfigStub },
        { provide: NotificationService, useFactory: notificationServiceStub },
        { provide: OidcAuthService, useFactory: oidcAuthServiceStub },
        { provide: HelperService, useFactory: helperServiceStub },
        { provide: UploadService, useFactory: uploadServiceStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: DocumentService, useFactory: documentServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        { provide: Router, useFactory: routerStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.subscribeNotification = subscribeNotification;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`position has default value`, () => {
    expect(component.position).toEqual(`left`);
  });

  it(`panelOpenState has default value`, () => {
    expect(component.panelOpenState).toEqual(false);
  });

  it(`isShow has default value`, () => {
    expect(component.isShow).toEqual(false);
  });

  it(`isNotify has default value`, () => {
    expect(component.isNotify).toEqual(true);
  });

  it(`isOpenSideNav has default value`, () => {
    expect(component.isOpenSideNav).toEqual(false);
  });

  it(`notificationList has default value`, () => {
    expect(component.notificationList).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      const oidcAuthServiceStub: OidcAuthService = fixture.debugElement.injector.get(
        OidcAuthService
      );
      spyOn(component, 'getNotificationStatus').and.callThrough();
      spyOn(component, 'subscribeNotification').and.callThrough();
      spyOn(oidcAuthServiceStub, 'getEnvironmentConfig').and.callThrough();
      component.ngOnInit();
      expect(component.getNotificationStatus).toHaveBeenCalled();
      expect(component.subscribeNotification).toHaveBeenCalled();
      expect(oidcAuthServiceStub.getEnvironmentConfig).toHaveBeenCalled();
    });
  });

  describe('getNotificationStatus', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'getNotificationStatus').and.callThrough();
      component.getNotificationStatus();
      expect(notificationServiceStub.getNotificationStatus).toHaveBeenCalled();
    });
  });

  describe('openSideNav', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getNotificationMessage').and.callThrough();
      component.openSideNav();
      expect(component.getNotificationMessage).toHaveBeenCalled();
    });
  });

  describe('getNotificationMessage', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'getNotification').and.callThrough();
      component.getNotificationMessage();
      expect(notificationServiceStub.getNotification).toHaveBeenCalled();
    });
  });

  describe('updateMarkAll', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'clearAllNotifications').and.callThrough();
      component.updateMarkAll();
      expect(notificationServiceStub.clearAllNotifications).toHaveBeenCalled();
    });
  });

  describe('clearAll', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'clearNotifications').and.callThrough();
      component.clearAll();
      expect(notificationServiceStub.clearNotifications).toHaveBeenCalled();
    });
  });

  describe('reloadNotification', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getNotificationMessage').and.callThrough();
      spyOn(component, 'getNotificationStatus').and.callThrough();
      component.reloadNotification();
      expect(component.getNotificationMessage).toHaveBeenCalled();
      expect(component.getNotificationStatus).toHaveBeenCalled();
    });
  });
});
