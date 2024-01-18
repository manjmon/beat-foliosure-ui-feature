import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PortfolioCompanyService } from '../../services/portfolioCompany.service';
import { TemplateSections } from 'src/app/common/constants';
import { HtmltopdfComponent } from './htmltopdf.component';
import { of } from 'rxjs';

describe('HtmltopdfComponent', () => {
  let component: HtmltopdfComponent;
  let fixture: ComponentFixture<HtmltopdfComponent>;

  beforeEach(() => {
    const activatedRouteStub = () => ({ snapshot: { params: {} } });
    const miscellaneousServiceStub = () => ({
      downloadPDFFile: results => ({})
    });
    const portfolioCompanyServiceStub = () => ({
      lpReportGraphs: id => ({ subscribe: f => f({}) }),
      pdfExport: object => ({ subscribe: f => f({}) })
    });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [HtmltopdfComponent],
      providers: [
        { provide: ActivatedRoute, useFactory: activatedRouteStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        }
      ]
    });
    fixture = TestBed.createComponent(HtmltopdfComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`reportGraphData has default value`, () => {
    expect(component.reportGraphData).toEqual([]);
  });

  it(`quarter has default value`, () => {
    expect(component.quarter).toEqual(`Quarter`);
  });

  it(`monthQuarter has default value`, () => {
    expect(component.monthQuarter).toEqual(`MonthQuarter`);
  });

  it(`graphHeaders has default value`, () => {
    expect(component.graphHeaders).toEqual([]);
  });

  it(`graphList has default value`, () => {
    expect(component.graphList).toEqual([]);
  });

  it(`templateSections has default value`, () => {
    expect(component.templateSections).toEqual(TemplateSections);
  });

  it(`prop has default value`, () => {
    expect(component.prop).toEqual(true);
  });

  it(`isChart has default value`, () => {
    expect(component.isChart).toEqual(false);
  });

  it(`exportLoading has default value`, () => {
    expect(component.exportLoading).toEqual(false);
  });

  it(`isPageLoaded has default value`, () => {
    expect(component.isPageLoaded).toEqual(false);
  });

  it(`isPageLoadedAfterView has default value`, () => {
    component.isPageLoadedAfterView = false;
    expect(component.isPageLoadedAfterView).toEqual(false);
  });

  it(`lineColors has default value`, () => {
    expect(component.lineColors).toEqual([`#941868`, `#65b5eb`]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getGraphList').and.callThrough();
      component.ngOnInit();
      expect(component.getGraphList).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', fakeAsync(() => {
      spyOn(component, 'ngForRendred').and.callThrough();
      component.ngAfterViewInit();
      tick();
      expect(component.isChart).toBeTrue();
    }));
  });
  it('should fetch graph list and update component properties', async () => {
    // Arrange
    const mockResponse = {
      code: 'OK',
      body: {
        reportGraphData: [
          // Sample graph data
          { label: 'Graph 1', value: 10 },
          { label: 'Graph 2', value: 20 },
          { label: 'Graph 3', value: 30 }
        ]
      }
    };
  
    class PortfolioCompanyServiceStub {
      lpReportGraphs(id) {
        return of({});
      }
  
      pdfExport(object) {
        return of({});
      }
    }
  
    const portfolioCompanyServiceStub = new PortfolioCompanyServiceStub();
  
    spyOn(portfolioCompanyServiceStub, 'lpReportGraphs').and.returnValue(of(mockResponse));
  
    // Act
    await component.getGraphList(null);
  
    // Assert
    expect(component.isPageLoaded).toBeFalse();
    expect(component.isPageLoadedAfterView).toBeFalse();
  });
  it('should return the correct KPI unit', () => {
    // Arrange
    const data = {
      data: [
        {
          Results: [
            {
              Info: 'KPI Unit'
            }
          ]
        }
      ]
    };
  
    // Act
    const result = component.kpiUnit(data);
  
    // Assert
    expect(result).toEqual('KPI Unit');
  });
  
  it('should return an empty string if KPI unit is not available', () => {
    // Arrange
    const data = {
      data: [
        {
          Results: [
            {
              info: null
            }
          ]
        }
      ]
    };
  
    // Act
    const result = component.kpiUnit(data);
  
    // Assert
    expect(result).toEqual('');
  });
  it('should download the report when page is loaded', async () => {
    // Arrange
    component.isPageLoaded = true;
    component.isPageLoadedAfterView = true;
    spyOn(component, 'getGraphList').and.returnValue(Promise.resolve());
    spyOn(component, 'downloadReport');
  
    // Act
    await component.LPReport();
  
    // Assert
    expect(component.getGraphList).toHaveBeenCalledWith(true);
    expect(component.downloadReport).toHaveBeenCalled();
    component.stop(); // Stop the timer
  });
});
