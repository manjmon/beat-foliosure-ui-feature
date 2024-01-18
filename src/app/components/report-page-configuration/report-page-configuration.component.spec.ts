import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { Router } from '@angular/router';
import { ReportPageConfigurationComponent } from './report-page-configuration.component';

describe('ReportPageConfigurationComponent', () => {
  let component: ReportPageConfigurationComponent;
  let fixture: ComponentFixture<ReportPageConfigurationComponent>;

  beforeEach(() => {
    const pageConfigurationServiceStub = () => ({
      getConfiguration: () => ({ subscribe: f => f({}) })
    });
    const routerStub = () => ({ navigateByUrl: string => ({}) });
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ReportPageConfigurationComponent],
      providers: [
        {
          provide: PageConfigurationService,
          useFactory: pageConfigurationServiceStub
        },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(ReportPageConfigurationComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`configurationList has default value`, () => {
    expect(component.configurationList).toEqual([]);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getConfiguration').and.callThrough();
      component.ngOnInit();
      expect(component.getConfiguration).toHaveBeenCalled();
    });
  });

  describe('getConfiguration', () => {
    it('makes expected calls', () => {
      const pageConfigurationServiceStub: PageConfigurationService = fixture.debugElement.injector.get(
        PageConfigurationService
      );
      spyOn(pageConfigurationServiceStub, 'getConfiguration').and.callThrough();
      component.getConfiguration();
      expect(pageConfigurationServiceStub.getConfiguration).toHaveBeenCalled();
    });
  });
});
