import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PortfolioCompanyDraftService } from 'src/app/services/portfolio-company-draft.service';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { Router } from '@angular/router';
import { AppSettingService } from 'src/app/services/appsettings.service';
import { FormsModule } from '@angular/forms';
import { PortfolioCompanyDraftComponent } from './portfolio-company-draft-list.component';

describe('PortfolioCompanyDraftComponent', () => {
  let component: PortfolioCompanyDraftComponent;
  let fixture: ComponentFixture<PortfolioCompanyDraftComponent>;

  beforeEach(() => {
    const portfolioCompanyDraftServiceStub = () => ({
      getPortfolioCompanyDraftList: event => ({ subscribe: f => f({}) })
    });
    const pageConfigurationServiceStub = () => ({});
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const appSettingServiceStub = () => ({ getConfig: () => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PortfolioCompanyDraftComponent],
      providers: [
        {
          provide: PortfolioCompanyDraftService,
          useFactory: portfolioCompanyDraftServiceStub
        },
        {
          provide: PageConfigurationService,
          useFactory: pageConfigurationServiceStub
        },
        { provide: Router, useFactory: routerStub },
        { provide: AppSettingService, useFactory: appSettingServiceStub }
      ]
    });
    fixture = TestBed.createComponent(PortfolioCompanyDraftComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`isLoader has default value`, () => {
    expect(component.isLoader).toEqual(false);
  });

  it(`pcDraftListHeaderData has default value`, () => {
    expect(component.pcDraftListHeaderData).toEqual([]);
  });

  it(`pcDraftListData has default value`, () => {
    expect(component.pcDraftListData).toEqual([]);
  });

  it(`masterSectionList has default value`, () => {
    expect(component.masterSectionList).toEqual([]);
  });

  it(`tablePosition has default value`, () => {
    expect(component.tablePosition).toEqual(`unset`);
  });

  describe('ngOnInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getConfigurationList').and.callThrough();
      spyOn(component, 'getWidth').and.callThrough();
      component.ngOnInit();
      expect(component.getConfigurationList).toHaveBeenCalled();
      expect(component.getWidth).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getConfigurationList').and.callThrough();
      spyOn(component, 'getWidth').and.callThrough();
      component.ngAfterViewInit();
      expect(component.getConfigurationList).toHaveBeenCalled();
      expect(component.getWidth).toHaveBeenCalled();
    });
  });

  describe('searchDraftList', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getPcDraftList').and.callThrough();
      component.searchDraftList();
      expect(component.getPcDraftList).toHaveBeenCalled();
    });
  });
  describe('getPcDraftListPageWise', () => {
    it('makes expected calls', () => {
      spyOn(component, 'getPcDraftListPageWise').and.callThrough();
      let event = JSON.parse(JSON.stringify({}));
    event.PageNumber = 2;
    event.RecordsPerPage = 100;
    event.SearchText = ''
      component.getPcDraftListPageWise(event);
      expect(component.getPcDraftListPageWise).toHaveBeenCalled();
    });
  });
});
