import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NotificationService } from 'src/app/services/Notification.service';
import { NotificationSideNavComponent } from './notification-side-nav.component';
import { of } from 'rxjs';

describe('NotificationSideNavComponent', () => {
  let component: NotificationSideNavComponent;
  let fixture: ComponentFixture<NotificationSideNavComponent>;

  beforeEach(() => {
    const notificationServiceStub = () => ({
      getNotification: () => ({ subscribe: f => of({}) }),
      clearNotifications: () => ({ subscribe: f => of({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [NotificationSideNavComponent],
      providers: [
        { provide: NotificationService, useFactory: notificationServiceStub }
      ]
    });
    fixture = TestBed.createComponent(NotificationSideNavComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`notificationList has default value`, () => {
    expect(component.notificationList).toEqual([]);
  });

  it(`display has default value`, () => {
    expect(component.display).toEqual(false);
  });

  it(`isOpen has default value`, () => {
    expect(component.isOpen).toEqual(false);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getNotificationMessage').and.callThrough();
      component.ngOnInit();
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

  describe('clearNotification', () => {
    it('makes expected calls', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      spyOn(notificationServiceStub, 'clearNotifications').and.callThrough();
      component.clearNotification();
      expect(notificationServiceStub.clearNotifications).toHaveBeenCalled();
    });
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.notificationList).toEqual([]);
    expect(component.display).toBeFalse();
    expect(component.isOpen).toBeFalse();
  });

  describe('ngOnInit', () => {
    it('should set display and call getNotificationMessage', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      component.isOpen = true;
      spyOn(notificationServiceStub, 'getNotification').and.callFake(() => of([]));

      component.ngOnInit();

      expect(component.display).toBeTrue();
      expect(notificationServiceStub.getNotification).toHaveBeenCalled();
      expect(component.notificationList).toEqual([]);
    });
  });

  describe('getNotificationMessage', () => {
    it('should call notificationService.getNotification and update notificationList', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      const mockNotificationList = [{ id: 1, message: 'Notification 1' }];
      spyOn(notificationServiceStub, 'getNotification').and.callFake(() => {
        return of(mockNotificationList);
      });

      component.getNotificationMessage();

      expect(notificationServiceStub.getNotification).toHaveBeenCalled();
      expect(component.notificationList).toEqual(mockNotificationList);
    });
  });

  describe('clearNotification', () => {
    it('should call notificationService.clearNotifications and update notificationList', () => {
      const notificationServiceStub: NotificationService = fixture.debugElement.injector.get(
        NotificationService
      );
      const mockNotificationList = [];
      spyOn(notificationServiceStub, 'clearNotifications').and.callFake(() => {
        return of(mockNotificationList);
      });

      component.clearNotification();

      expect(notificationServiceStub.clearNotifications).toHaveBeenCalled();
      expect(component.notificationList).toEqual(mockNotificationList);
    });
  });

  describe('sidenavClosed', () => {
    it('should set isOpen to false', () => {
      component.sidenavClosed();

      expect(component.isOpen).toBeFalse();
    });
  });
});
