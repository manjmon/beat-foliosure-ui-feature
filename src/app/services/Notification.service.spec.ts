import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { NotificationService } from './Notification.service';
import { MatMenuModule } from "@angular/material/menu";
import { FormsModule } from "@angular/forms";



describe("NotificationService", () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientTestingModule, MatMenuModule],
      providers: [NotificationService, { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(NotificationService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('getNotificationStatus', () =>{
    it('spyOn getNotificationStatus', () =>{
      spyOn(service, 'getNotificationStatus').and.callThrough();
      service.getNotificationStatus();
      expect(service.getNotificationStatus).toHaveBeenCalled();
    })
  });
  describe('http getNotificationStatus',() => {
    it('http getNotificationStatus', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let url = `${service.appUrl}api/notification/get`;
        service.getNotificationStatus().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(url);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('createNotification', () =>{
    it('spyOn createNotification', () =>{
      let model = 'test';
      spyOn(service, 'createNotification').and.callThrough();
      service.createNotification(model);
      expect(service.createNotification).toHaveBeenCalled();
    })
  });
  describe('http createNotification',() => {
    it('http createNotification', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let model = 'test';
        let url = `${service.appUrl}api/notification/create`;
        service.createNotification(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(url);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('clearNotifications', () =>{
    it('spyOn clearNotifications', () =>{
      spyOn(service, 'clearNotifications').and.callThrough();
      service.clearNotifications();
      expect(service.clearNotifications).toHaveBeenCalled();
    })
  });
  describe('http clearNotifications',() => {
    it('http clearNotifications', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let url = `${service.appUrl}api/notification/delete`;
        service.clearNotifications().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(url);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('clearAllNotifications', () =>{
    it('spyOn clearAllNotifications', () =>{
      spyOn(service, 'clearAllNotifications').and.callThrough();
      service.clearAllNotifications();
      expect(service.clearAllNotifications).toHaveBeenCalled();
    })
  });
  describe('http clearAllNotifications',() => {
    it('http clearAllNotifications', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let url = `${service.appUrl}api/notification/deleteAll`;
        service.clearAllNotifications().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(url);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateNotifications', () =>{
    it('spyOn updateNotifications', () =>{
      let model = 'test';
      spyOn(service, 'updateNotifications').and.callThrough();
      service.updateNotifications(model);
      expect(service.updateNotifications).toHaveBeenCalled();
    })
  });
  describe('http updateNotifications',() => {
    it('http updateNotifications', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let model = 'test';
        let url = `${service.appUrl}api/notification/update`;
        service.updateNotifications(model).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(url);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getNotification', () =>{
    it('spyOn getNotification', () =>{
      spyOn(service, 'getNotification').and.callThrough();
      service.getNotification();
      expect(service.getNotification).toHaveBeenCalled();
    })
  });
  describe('http getNotification',() => {
    it('http getNotification', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let url = `${service.appUrl}api/notification/getmessage`;
        service.getNotification().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(url);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});