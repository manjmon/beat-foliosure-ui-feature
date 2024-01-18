import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { WorkflowFeatureService } from './workflow-feature.service';

describe('WorkflowFeatureService', () => {
  let service: WorkflowFeatureService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkflowFeatureService,  { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(WorkflowFeatureService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('errorHandler',()=>{
    it('should spy on', () =>{
      const value = true;
      spyOn(service, 'errorHandler').and.callThrough();
      service.errorHandler(value)
      expect(service.errorHandler).toHaveBeenCalled();
    });
   })
   describe('getFeaturesList',()=>{
    it('should spy on getFeaturesList', () =>{
      let groupId = 234;
      spyOn(service, 'getFeaturesList').and.callThrough();
      service.getFeaturesList(groupId);
      expect(service.getFeaturesList).toHaveBeenCalled();
    });
   });
   describe('http getFeaturesList',() => {
    it('http getFeaturesList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let groupId = 343;
        service.getFeaturesList(groupId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/access/features/get/${groupId}`,'');
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getCompanyList',()=>{
    it('should spy on getCompanyList', () =>{
        let feature = 'test';
      spyOn(service, 'getCompanyList').and.callThrough();
      service.getCompanyList(feature);
      expect(service.getCompanyList).toHaveBeenCalled();
    });
   });
   describe('http getCompanyList',() => {
    it('http getCompanyList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'demo company';
        let feature = 'test';
        service.getCompanyList(feature).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.myAppUrl+ `api/access/company/get/${feature}`,'');
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   )
});