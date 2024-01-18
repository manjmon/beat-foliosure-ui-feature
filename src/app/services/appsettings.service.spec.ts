import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppSettingService } from './appsettings.service';
import { AppConfig } from '../common/models';

describe('AppSettingService', () => {
  let service: AppSettingService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AppSettingService, { provide: 'BASE_URL', useValue: 'http://localhost/' }]
    });

    service = TestBed.inject(AppSettingService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get app configuration', () => {
    const mockResponse = { isWorkflow: true };

    service.getAppConfiguration().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost/api/appconfiguration/get');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });


  it('should remove config', () => {
    const expectedKey = service.appName + "_config";
    spyOn(sessionStorage, 'removeItem');
  
    service.removeConfig();
  
    expect(sessionStorage.removeItem).toHaveBeenCalledWith(expectedKey);
  });

  it('should get config', () => {
  const expectedAppName = window.location.href.replace(window.location.hash, '');
  const mockAppConfig: AppConfig = {
    AppName: expectedAppName,
    IsWorkflowEnable: true,
    DefaultNumberSystem: 1000000,
    DefaultDateFormat: 'mm-dd-yyyy',
    WorkflowDefaultDateFormat: 'mm-dd-yyyy'
  };

  spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(mockAppConfig));

  const config = service.getConfig();

  expect(config).toEqual(mockAppConfig);
});
});