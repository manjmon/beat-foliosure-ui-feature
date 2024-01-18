import { TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";
import { Router } from "@angular/router";
import { FirmService } from "./firm.service";

describe("FirmService", () => {
  let service: FirmService;

  beforeEach(() => {
    const routerStub = () => ({});
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FirmService, 
        { provide: Router, useFactory: routerStub},
        { provide: 'BASE_URL', useValue: 'http://localhost'}
      ]
    });
    service = TestBed.get(FirmService);
  });

  it("can load instance", () => {
    expect(service).toBeTruthy();
  });
  describe('errorHandler', () =>{
    it('spyOn errorHandler', () =>{
      let error = 'Errors occured'
      spyOn(service, 'errorHandler').and.callThrough();
      service.errorHandler(error);
      expect(service.errorHandler).toHaveBeenCalled();
    })
  });
  describe('addFirm', () =>{
    it('spyOn addFirm', () =>{
      let firm = 'test';
      spyOn(service, 'addFirm').and.callThrough();
      service.addFirm(firm);
      expect(service.addFirm).toHaveBeenCalled();
    })
  });
  describe('http addFirm',() => {
    it('http addFirm', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let firm = 'test';
        service.addFirm(firm).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/firm/add", firm);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('updateFirm', () =>{
    it('spyOn updateFirm', () =>{
      let firm = 'test';
      spyOn(service, 'updateFirm').and.callThrough();
      service.updateFirm(firm);
      expect(service.updateFirm).toHaveBeenCalled();
    })
  });
  describe('http updateFirm',() => {
    it('http updateFirm', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let firm = 'test';
        service.updateFirm(firm).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl +"api/updatefirm", firm);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getMasterFirmModel', () =>{
    it('spyOn getMasterFirmModel', () =>{
      spyOn(service, 'getMasterFirmModel').and.callThrough();
      service.getMasterFirmModel();
      expect(service.getMasterFirmModel).toHaveBeenCalled();
    })
  });
  describe('http getMasterFirmModel',() => {
    it('http getMasterFirmModel', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getMasterFirmModel().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/firm/mastermodel");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFirmList', () =>{
    it('spyOn getFirmList', () =>{
      let filter = 'test';
      spyOn(service, 'getFirmList').and.callThrough();
      service.getFirmList(filter);
      expect(service.getFirmList).toHaveBeenCalled();
    })
  });
  describe('http getFirmList',() => {
    it('http getFirmList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let filter = 'test';
        service.getFirmList(filter).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/firm/get", filter);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('getFirmById', () =>{
    it('spyOn getFirmById', () =>{
      let firmId = 'test';
      spyOn(service, 'getFirmById').and.callThrough();
      service.getFirmById(firmId);
      expect(service.getFirmById).toHaveBeenCalled();
    })
  });
  describe('http getFirmById',() => {
    it('http getFirmById', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let firmId = 'test';
        service.getFirmById(firmId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl + "api/firm/getbyid", firmId);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
  );
  describe('exportFirmList', () =>{
    it('spyOn exportFirmList', () =>{
      let filter = 'test';
      spyOn(service, 'exportFirmList').and.callThrough();
      service.exportFirmList(filter);
      expect(service.exportFirmList).toHaveBeenCalled();
    })
  });
});