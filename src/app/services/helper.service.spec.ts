import { TestBed } from '@angular/core/testing';
import { HelperService } from './helper.service';

describe('HelperService', () => {
  let service: HelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return correct icon path', () => {
    const iconName = 'deleteicon';
    const expectedPath = 'assets/dist/images/Delete Grey.svg';
    expect(service.getstaticIconPath(iconName)).toEqual(expectedPath);
  });

  it('should return correct icon path from file name', () => {
    const fileName = 'test.pdf';
    const expectedPath = 'assets/dist/images/Adobe-acrobat.svg';
    expect(service.getIconFromFileName(fileName)).toEqual(expectedPath);
  });

  it('should return correct financial KPI header', () => {
    const header = '(Actual) Revenue';
    const expectedHeader = 'Revenue';
    expect(service.getFinancialKpiHeader(header)).toEqual(expectedHeader);
  });
});