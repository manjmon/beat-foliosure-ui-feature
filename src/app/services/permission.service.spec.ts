import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { AccountService } from "./account.service";
import { CryptoService } from "./crypto.service";
import { OidcAuthService } from "./oidc-auth.service";
import { PermissionService } from "./permission.service";

describe("PermissionService", () => {
  let service: PermissionService;

  beforeEach(() => {
    const routerStub = () => ({});
    const accountServiceStub = () => ({ errorHandler: {} });
    const cryptoServiceStub = () => ({ getDecryptedValue: arg => ({}) });
    const oidcAuthServiceStub = () => ({ environment: {} });
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PermissionService,
        { provide: Router, useFactory: routerStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: CryptoService, useFactory: cryptoServiceStub },
        { provide: OidcAuthService, useFactory: oidcAuthServiceStub },
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.get(PermissionService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
   describe('addGroup',()=>{
    it('should spy on addGroup', () =>{
      let portfoliocompany = 'test';
      spyOn(service, 'addGroup').and.callThrough();
      service.addGroup(portfoliocompany);
      expect(service.addGroup).toHaveBeenCalled();
    });
   });
   describe('http addGroup',() => {
    it('http addGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let portfoliocompany = 'test';
        service.addGroup(portfoliocompany).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+"api/group/add", portfoliocompany);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getGroupList',()=>{
    it('should spy on getGroupList', () =>{
      let filter = 'test';
      spyOn(service, 'getGroupList').and.callThrough();
      service.getGroupList(filter);
      expect(service.getGroupList).toHaveBeenCalled();
    });
   });
   describe('http getGroupList',() => {
    it('http getGroupList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getGroupList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/group/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getGroupById',()=>{
    it('should spy on getGroupById', () =>{
      let filter = 'test';
      spyOn(service, 'getGroupById').and.callThrough();
      service.getGroupById(filter);
      expect(service.getGroupById).toHaveBeenCalled();
    });
   });
   describe('http getGroupById',() => {
    it('http getGroupById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.getGroupById(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/group/getbyid", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateGroup',()=>{
    it('should spy on updateGroup', () =>{
      let filter = 'test';
      spyOn(service, 'updateGroup').and.callThrough();
      service.updateGroup(filter);
      expect(service.updateGroup).toHaveBeenCalled();
    });
   });
   describe('http updateGroup',() => {
    it('http updateGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let filter = 'test';
        service.updateGroup(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/group/add", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('isFullAccess',()=>{
    it('should spy on isFullAccess', () =>{
      let groupId = 'test';
      spyOn(service, 'isFullAccess').and.callThrough();
      service.isFullAccess(groupId);
      expect(service.isFullAccess).toHaveBeenCalled();
    });
   });
   describe('http isFullAccess',() => {
    it('http isFullAccess', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let groupId = 'test';
        service.isFullAccess(groupId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+  `api/feature/isFullAccess/${groupId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFeatureList',()=>{
    it('should spy on getFeatureList', () =>{
      let groupId = 'test';
      spyOn(service, 'getFeatureList').and.callThrough();
      service.getFeatureList(groupId);
      expect(service.getFeatureList).toHaveBeenCalled();
    });
   });
   describe('http getFeatureList',() => {
    it('http getFeatureList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let groupId = 'test';
        service.getFeatureList(groupId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/feature/get", groupId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getUserSubFeature',()=>{
    it('should spy on getUserSubFeature', () =>{
      let groupId = 'test';
      spyOn(service, 'getUserSubFeature').and.callThrough();
      service.getUserSubFeature(groupId);
      expect(service.getUserSubFeature).toHaveBeenCalled();
    });
   });
   describe('http getUserSubFeature',() => {
    it('http getUserSubFeature', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let groupId = 'test';
        service.getUserSubFeature(groupId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/user/getuserpermission", groupId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getSubFeatureByGroup',()=>{
    it('should spy on getSubFeatureByGroup', () =>{
      let groupId = 'test';
      spyOn(service, 'getSubFeatureByGroup').and.callThrough();
      service.getSubFeatureByGroup(groupId);
      expect(service.getSubFeatureByGroup).toHaveBeenCalled();
    });
   });
   describe('http getSubFeatureByGroup',() => {
    it('http getSubFeatureByGroup', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let groupId = 'test';
        service.getSubFeatureByGroup(groupId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/access/subfeatures/get", groupId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFeatures',()=>{
    it('should spy on getFeatures', () =>{
      spyOn(service, 'getFeatures').and.callThrough();
      service.getFeatures();
      expect(service.getFeatures).toHaveBeenCalled();
    });
   });
   describe('http getFeatures',() => {
    it('http getFeatures', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        service.getFeatures().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/group/getFeatures");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('updateUserSubFeature',()=>{
    it('should spy on updateUserSubFeature', () =>{
      let permissionModel = 'test';
      spyOn(service, 'updateUserSubFeature').and.callThrough();
      service.updateUserSubFeature(permissionModel);
      expect(service.updateUserSubFeature).toHaveBeenCalled();
    });
   });
   describe('http updateUserSubFeature',() => {
    it('http updateUserSubFeature', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let permissionModel = 'test';
        service.updateUserSubFeature(permissionModel).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ "api/user/updateuserpermission", permissionModel);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('exportGroupList',()=>{
    it('should spy on exportGroupList', () =>{
      let feature = 'test';
      spyOn(service, 'exportGroupList').and.callThrough();
      service.exportGroupList(feature);
      expect(service.exportGroupList).toHaveBeenCalled();
    });
   });
});
