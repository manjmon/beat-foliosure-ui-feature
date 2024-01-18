import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { ValuationModelService } from './valuation-model.service';
import { ValuationModelComponent } from '../components/Valuation-Model/valuation-model/valuation-model.component';

describe('ValuationModelService', () => {
  let service: ValuationModelService;
  let component: ValuationModelComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ValuationModelService,
        { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.inject(ValuationModelService);
  });

  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
 describe('setRedirectionStatus',()=>{
  it('should spy on', () =>{
    const value = true;
    spyOn(service, 'setRedirectionStatus').and.callThrough();
    service.setRedirectionStatus(value)
    expect(service.setRedirectionStatus).toHaveBeenCalled();
  });
 });
 describe('errorHandler',()=>{
  it('should spy on', () =>{
    const value = true;
    spyOn(service, 'errorHandler').and.callThrough();
    service.errorHandler(value)
    expect(service.errorHandler).toHaveBeenCalled();
  });
 })
 describe('getFundList',()=>{
  it('should spy on', () =>{
    spyOn(service, 'getFundList').and.callThrough();
    service.getFundList();
    expect(service.getFundList).toHaveBeenCalled();
  });
 });
 describe('httpgetfundlist',() => {
  it('http GetFundList', () => {
    const httpTestingController = TestBed.get(HttpTestingController);
      const expected = 'demo company'
      service.getFundList().subscribe((data) =>{
        expect(data).toEqual(expected);
      });
       const req = httpTestingController.expectOne(service.myAppUrl+"api/Valuation/valuation-model/fund_list/get");
       req.flush(expected);
       httpTestingController.verify();
    }
  )}
 );
 describe('SaveImpliedEvValue',()=>{
  it('should spy on', () =>{
    spyOn(service, 'SaveImpliedEvValue').and.callThrough();
    service.SaveImpliedEvValue();
    expect(service.SaveImpliedEvValue).toHaveBeenCalled();
  });
 });
 describe('httpSaveImpliedEvValue',() => {
  it('http SaveImpliedEvValue', () => {
    const httpTestingController = TestBed.get(HttpTestingController);
      const expected = 'demo company'
      service.SaveImpliedEvValue().subscribe((data) =>{
        expect(data).toEqual(expected);
      });
       const req = httpTestingController.expectOne(service.myAppUrl+"api/Valuation/valuation-model/ImpliedEv");
       req.flush(expected);
       httpTestingController.verify();
    }
  )}
 );
 describe('getCompanyList',()=>{
  it('should spy on', () =>{
    const fund = 'Demo company';
    spyOn(service, 'getCompanyList').and.callThrough();
    service.getCompanyList(fund);
    expect(service.getCompanyList).toHaveBeenCalled();
  });
 });
 describe('getCompanyList',() => {
  it('http getCompanyList', () => {
    const httpTestingController = TestBed.get(HttpTestingController);
      const expected = 'demo company';
      const fund = 'test';
      service.getCompanyList(fund).subscribe((data) =>{
        expect(data).toEqual(expected);
      });
       const req = httpTestingController.expectOne(service.myAppUrl+`api/Valuation/valuation-model/company_list/get?fund=${fund}`);
       req.flush(expected);
       httpTestingController.verify();
    }
  )}
 );
 describe('downloadValuationTemplate',()=>{
  it('should spy on', () =>{
    const fund = 'Demo company';
    spyOn(service, 'downloadValuationTemplate').and.callThrough();
    service.downloadValuationTemplate(fund);
    expect(service.downloadValuationTemplate).toHaveBeenCalled();
  });
 });
 describe('getValuationModel',()=>{
  it('should spy on', () =>{
    const fund = 'Demo company';
    spyOn(service, 'getValuationModel').and.callThrough();
    service.getValuationModel(fund);
    expect(service.getValuationModel).toHaveBeenCalled();
  });
 });
 describe('httpgetValuationModel',() => {
  it('http getCompanyList', () => {
    const httpTestingController = TestBed.get(HttpTestingController);
      const expected = 'demo company';
      const fund = 'test';
      service.getValuationModel(fund).subscribe((data) =>{
        expect(data).toEqual(expected);
      });
       const req = httpTestingController.expectOne(service.myAppUrl+'api/Valuation/valuation-model-list/get');
       req.flush(expected);
       httpTestingController.verify();
    }
  )}
 );
 describe('importValuationBulkData',()=>{
  it('should spy on', () =>{
    let fund : FormData;
    spyOn(service, 'importValuationBulkData').and.callThrough();
    service.importValuationBulkData(fund);
    expect(service.importValuationBulkData).toHaveBeenCalled();
  });
 });
});