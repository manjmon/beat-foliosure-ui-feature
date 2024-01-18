import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { PageConfigurationService } from './page-configuration.service';

describe('PageConfigurationService', () => {
  let service: PageConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PageConfigurationService,
        { provide: 'BASE_URL', useValue: 'http://localhost'}]
    });
    service = TestBed.get(PageConfigurationService);
  });

  it('can load instance', () => {
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
  describe('getConfiguration', () =>{
    it('spyOn getConfiguration', () =>{
      spyOn(service, 'getConfiguration').and.callThrough();
      service.getConfiguration();
      expect(service.getConfiguration).toHaveBeenCalled();
    })
  });
  describe('http getConfiguration',() => {
    it('http getConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        service.getConfiguration().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/configuration/get", "");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('pageConfigurationSaveData', () =>{
    it('spyOn pageConfigurationSaveData', () =>{
      let dataObj = 'Test';
      spyOn(service, 'pageConfigurationSaveData').and.callThrough();
      service.pageConfigurationSaveData(dataObj);
      expect(service.pageConfigurationSaveData).toHaveBeenCalled();
    })
  });
  describe('http pageConfigurationSaveData',() => {
    it('http pageConfigurationSaveData', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone'
        let dataObj = 'Test'
        service.pageConfigurationSaveData(dataObj).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/pageconfiguration/SaveSettings", dataObj);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getTrackrecordDataTypes', () =>{
    it('spyOn getTrackrecordDataTypes', () =>{
      spyOn(service, 'getTrackrecordDataTypes').and.callThrough();
      service.getTrackrecordDataTypes();
      expect(service.getTrackrecordDataTypes).toHaveBeenCalled();
    })
  });
  describe('http getTrackrecordDataTypes',() => {
    it('http getTrackrecordDataTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getTrackrecordDataTypes().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/pageconfiguration/getTrackrecordDataTypes");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getAllReportTemplates', () =>{
    it('spyOn getAllReportTemplates', () =>{
      spyOn(service, 'getAllReportTemplates').and.callThrough();
      service.getAllReportTemplates();
      expect(service.getAllReportTemplates).toHaveBeenCalled();
    })
  });
  describe('http getAllReportTemplates',() => {
    it('http getAllReportTemplates', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getAllReportTemplates().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/GetAllReportTemplates");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getLPReportMasterList', () =>{
    it('spyOn getLPReportMasterList', () =>{
      spyOn(service, 'getLPReportMasterList').and.callThrough();
      service.getLPReportMasterList();
      expect(service.getLPReportMasterList).toHaveBeenCalled();
    })
  });
  describe('http getLPReportMasterList',() => {
    it('http getLPReportMasterList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getLPReportMasterList().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/LPReportMasterList");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('savetemplate', () =>{
    it('spyOn savetemplate', () =>{
      let templateObj = 'templeate.xslx';
      spyOn(service, 'savetemplate').and.callThrough();
      service.savetemplate(templateObj);
      expect(service.savetemplate).toHaveBeenCalled();
    })
  });
  describe('http savetemplate',() => {
    it('http savetemplate', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let templateObj = 'templeate.xslx';
        service.savetemplate(templateObj).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/AddNewTemplate", templateObj);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('lpreportMappingItems', () =>{
    it('spyOn lpreportMappingItems', () =>{
      spyOn(service, 'lpreportMappingItems').and.callThrough();
      service.lpreportMappingItems();
      expect(service.lpreportMappingItems).toHaveBeenCalled();
    })
  });
  describe('http lpreportMappingItems',() => {
    it('http lpreportMappingItems', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.lpreportMappingItems().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/LPReportMappingLineItems");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('lpreport_KPI_Mapping_ItemsBY_ModuleName', () =>{
    it('spyOn lpreport_KPI_Mapping_ItemsBY_ModuleName', () =>{
      spyOn(service, 'lpreport_KPI_Mapping_ItemsBY_ModuleName').and.callThrough();
      service.lpreport_KPI_Mapping_ItemsBY_ModuleName();
      expect(service.lpreport_KPI_Mapping_ItemsBY_ModuleName).toHaveBeenCalled();
    })
  });
  describe('http lpreport_KPI_Mapping_ItemsBY_ModuleName',() => {
    it('http lpreport_KPI_Mapping_ItemsBY_ModuleName', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.lpreport_KPI_Mapping_ItemsBY_ModuleName().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/LPReportMappingLineItems");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('lpReportPeriodTypes', () =>{
    it('spyOn lpReportPeriodTypes', () =>{
      spyOn(service, 'lpReportPeriodTypes').and.callThrough();
      service.lpReportPeriodTypes();
      expect(service.lpReportPeriodTypes).toHaveBeenCalled();
    })
  });
  describe('http lpReportPeriodTypes',() => {
    it('http lpReportPeriodTypes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.lpReportPeriodTypes().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/LPReportPeriodTypes");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('requestDataFromMultipleSources', () =>{
    it('spyOn requestDataFromMultipleSources', () =>{
      spyOn(service, 'requestDataFromMultipleSources').and.callThrough();
      service.requestDataFromMultipleSources();
      expect(service.requestDataFromMultipleSources).toHaveBeenCalled();
    })
  });
  describe('lptemplateConfig', () =>{
    it('spyOn lptemplateConfig', () =>{
      let templateObj = 'templeate.xslx';
      spyOn(service, 'lptemplateConfig').and.callThrough();
      service.lptemplateConfig(templateObj);
      expect(service.lptemplateConfig).toHaveBeenCalled();
    })
  });
  describe('http lptemplateConfig',() => {
    it('http lptemplateConfig', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let templateObj = 'templeate.xslx';
        service.lptemplateConfig(templateObj).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/LpConfigurationSettings", templateObj);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('lpReportSectionItems', () =>{
    it('spyOn lpReportSectionItems', () =>{
      let templateId = 23;
      spyOn(service, 'lpReportSectionItems').and.callThrough();
      service.lpReportSectionItems(templateId);
      expect(service.lpReportSectionItems).toHaveBeenCalled();
    })
  });
  describe('http lpReportSectionItems',() => {
    it('http lpReportSectionItems', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        let templateId = 23;
        service.lpReportSectionItems(templateId).subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ `api/LPTemplateSections/${templateId}`);
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getFundReportSectionList', () =>{
    it('spyOn getFundReportSectionList', () =>{
      spyOn(service, 'getFundReportSectionList').and.callThrough();
      service.getFundReportSectionList();
      expect(service.getFundReportSectionList).toHaveBeenCalled();
    })
  });
  describe('http getFundReportSectionList',() => {
    it('http getFundReportSectionList', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getFundReportSectionList().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/FundReportSectionList");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPageConfiguration', () =>{
    it('spyOn getPageConfiguration', () =>{
      spyOn(service, 'getPageConfiguration').and.callThrough();
      service.getPageConfiguration();
      expect(service.getPageConfiguration).toHaveBeenCalled();
    })
  });
  describe('http getPageConfiguration',() => {
    it('http getPageConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getPageConfiguration().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/pageconfiguration/get");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('getPageConfigSettingById', () =>{
    it('spyOn getPageConfigSettingById', () =>{
      let pageId =111;
      spyOn(service, 'getPageConfigSettingById').and.callThrough();
      service.getPageConfigSettingById(pageId);
      expect(service.getPageConfigSettingById).toHaveBeenCalled();
    })
  });
  describe('getPageFieldAttributes', () =>{
    it('spyOn getPageFieldAttributes', () =>{
      spyOn(service, 'getPageFieldAttributes').and.callThrough();
      service.getPageFieldAttributes();
      expect(service.getPageFieldAttributes).toHaveBeenCalled();
    })
  });
  describe('http getPageFieldAttributes',() => {
    it('http getPageFieldAttributes', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.getPageFieldAttributes().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/GetAllPageFieldAttributes");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
   describe('SavePageConfiguration', () =>{
    it('spyOn SavePageConfiguration', () =>{
      spyOn(service, 'SavePageConfiguration').and.callThrough();
      service.SavePageConfiguration();
      expect(service.SavePageConfiguration).toHaveBeenCalled();
    })
  });
  describe('http SavePageConfiguration',() => {
    it('http SavePageConfiguration', () => {
      const httpTestingController = TestBed.get(HttpTestingController);
        const expected = 'Reportedone';
        service.SavePageConfiguration().subscribe((data) =>{
          expect(data).toEqual(expected);
        });
         const req = httpTestingController.expectOne(service.appUrl+ "api/SavePageConfiguration");
         req.flush(expected);
         httpTestingController.verify();
      }
    )}
   );
});