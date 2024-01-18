import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DocumentService } from '../../services/document.service';
import { FirmService } from 'src/app/services/firm.service';
import { FundService } from 'src/app/services/funds.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { DealService } from 'src/app/services/deal.service';
import { FormsModule } from '@angular/forms';
import { AdvanceFiltersComponentComponent } from './advance-filters.component';
import { of, throwError } from 'rxjs';

describe('AdvanceFiltersComponentComponent', () => {
  let component: AdvanceFiltersComponentComponent;
  let fixture: ComponentFixture<AdvanceFiltersComponentComponent>;

  beforeEach(() => {
    const documentServiceStub = () => ({
      GetAllFilterCategories: () => ({ subscribe: f => f({}) }),
      GetAllFileFormats: () => ({ subscribe: f => f({}) }),
      getAllDocumentTypes: number => ({ subscribe: f => f({}) }),
      getAllSubDocumentTypes: () => ({ subscribe: f => f({}) })
    });
    const firmServiceStub = () => ({
      getFirmList: object => ({ subscribe: f => of({}) })
    });
    const fundServiceStub = () => ({
      getFundsList: object => ({ subscribe: f => of({}) })
    });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyList: object => ({ subscribe: f => f({}) })
    });
    const dealServiceStub = () => ({
      getDealsList: object => ({ subscribe: f => f({body: { dealList: [
        { id: 1, name: 'Deal 1' },
        { id: 2, name: 'Deal 2' },
        { id: 3, name: 'Deal 3' },
      ] } }) })
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AdvanceFiltersComponentComponent],
      providers: [
        { provide: DocumentService, useFactory: documentServiceStub },
        { provide: FirmService, useFactory: firmServiceStub },
        { provide: FundService, useFactory: fundServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: DealService, useFactory: dealServiceStub }
      ]
    });
    fixture = TestBed.createComponent(AdvanceFiltersComponentComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`fileFormats has default value`, () => {
    expect(component.fileFormats).toEqual([]);
  });

  it(`docTypes has default value`, () => {
    expect(component.docTypes).toEqual([
    ]);
  });

  it(`subDocTypes has default value`, () => {
    expect(component.subDocTypes).toEqual([]);
  });

  it(`firms has default value`, () => {
    expect(component.firms).toEqual([]);
  });

  it(`funds has default value`, () => {
    expect(component.funds).toEqual([]);
  });

  it(`portfolioComapanies has default value`, () => {
    expect(component.portfolioComapanies).toEqual([]);
  });

  it(`deals has default value`, () => {
    expect(component.deals).toEqual([]);
  });

  it(`ResetAdvFilters has default value`, () => {
    expect(component.ResetAdvFilters).toEqual(false);
  });

  it(`appliedFilters has default value`, () => {
    expect(component.appliedFilters).toEqual([]);
  });

  it(`filterCategories has default value`, () => {
    expect(component.filterCategories).toEqual([]);
  });

  it(`activeFilterCategory has default value`, () => {
    expect(component.activeFilterCategory).toEqual(`File Format`);
  });

  it(`activeFilterList has default value`, () => {
    expect(component.activeFilterList).toEqual([]);
  });

  it(`disableApplyFilters has default value`, () => {
    expect(component.disableApplyFilters).toEqual(true);
  });

  it(`hasInvalidDateInput has default value`, () => {
    expect(component.hasInvalidDateInput).toEqual(false);
  });

  it(`advancedFilters has default value`, () => {
    expect(component.advancedFilters).toEqual([]);
  });

  it(`DocFormats has default value`, () => {
    expect(component.DocFormats).toEqual([]);
  });

  it(`appliedSubDocTypes has default value`, () => {
    expect(component.appliedSubDocTypes).toEqual([]);
  });

  it(`appliedDocTypes has default value`, () => {
    expect(component.appliedDocTypes).toEqual([]);
  });

  it(`selectedFirms has default value`, () => {
    expect(component.selectedFirms).toEqual([]);
  });

  it(`selectedFunds has default value`, () => {
    expect(component.selectedFunds).toEqual([]);
  });

  it(`selectedPortfolioComapanies has default value`, () => {
    expect(component.selectedPortfolioComapanies).toEqual([]);
  });

  it(`selectedDeals has default value`, () => {
    expect(component.selectedDeals).toEqual([]);
  });

  it(`appliedFirms has default value`, () => {
    expect(component.appliedFirms).toEqual([]);
  });

  it(`appliedFunds has default value`, () => {
    expect(component.appliedFunds).toEqual([]);
  });

  it(`appliedPortfolioComapanies has default value`, () => {
    expect(component.appliedPortfolioComapanies).toEqual([]);
  });

  it(`appliedDeals has default value`, () => {
    expect(component.appliedDeals).toEqual([]);
  });

  describe('getFilterValues', () => {
    beforeEach(() => {
      // Reset the component properties before each test
      component.fileFormats = [];
      component.docTypes =  [{ name: 'Type 1' },
      { name: 'Type 2' },
      { name: 'Type 3' }];
      component.subDocTypes = [
        { name: 'Subtype 1' },
        { name: 'Subtype 2' },
        { name: 'Subtype 3' },
      ];
      component.selectedFirms = [];
      component.selectedFunds = [];
      component.selectedPortfolioComapanies = [];
      component.selectedDeals = [];
      component.appliedFilters = [];
      component.fromDate = new Date();
      component.toDate = new Date();
    });

    it('should call GetAllFileFormats if fileFormats is empty', () => {
      // Arrange
      spyOn(component, 'GetAllFileFormats');

      // Act
      component.getFilterValues();

      // Assert
      expect(component.GetAllFileFormats).toHaveBeenCalled();
    });

    it('should not call GetAllFileFormats if fileFormats is not empty', () => {
      // Arrange
      component.fileFormats = [{ name: 'Format 1' }];

      spyOn(component, 'GetAllFileFormats');

      // Act
      component.getFilterValues();

      // Assert
      expect(component.GetAllFileFormats).not.toHaveBeenCalled();
    });

    // Add more test cases for the other conditions in the method
  });

  describe('GetAllFilterCategories', () => {
    it('should populate filterCategories with data from the service', () => {
      // Arrange
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      const mockResult = [
        { name: 'Category 1' },
        { name: 'Category 2' },
        { name: 'Category 3' },
      ];
      spyOn(documentServiceStub, 'GetAllFilterCategories').and.returnValue(of(mockResult));

      // Act
      component.GetAllFilterCategories();

      // Assert
      expect(component.filterCategories).toEqual([
        { name: 'Category 1' },
        { name: 'Category 2' },
        { name: 'Category 3' },
      ]);
    });

    it('should handle error from the service', () => {
      // Arrange
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, 'GetAllFilterCategories').and.returnValue(throwError('Error'));

      // Act
      component.GetAllFilterCategories();

      // Assert
      expect(component.filterCategories).toEqual([]);
    });
  });
  describe('GetAllFileFormats', () => {
    it('makes expected calls', () => {
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      spyOn(documentServiceStub, 'GetAllFileFormats').and.callThrough();
      component.GetAllFileFormats();
      expect(documentServiceStub.GetAllFileFormats).toHaveBeenCalled();
    });
  });

  describe('GetAllTypes', () => {
    it('should populate docTypes and appliedDocTypes with data from the service', () => {
      // Arrange
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      const mockResult = [
        { name: 'Type 1' },
        { name: 'Type 2' },
        { name: 'Type 3' },
      ];
      spyOn(documentServiceStub, 'getAllDocumentTypes').and.returnValue(of(mockResult));

      // Act
      component.GetAllTypes();

      // Assert
      expect(component.docTypes).toEqual([
        { name: 'Type 1', isChecked: false },
        { name: 'Type 2', isChecked: false },
        { name: 'Type 3', isChecked: false },
      ]);
      expect(component.appliedDocTypes).toEqual([
        { name: 'Type 1', isChecked: false },
        { name: 'Type 2', isChecked: false },
        { name: 'Type 3', isChecked: false },
      ]);
    });

    it('should handle empty result from the service', () => {
      // Arrange
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      const mockResult = null;
      spyOn(documentServiceStub, 'getAllDocumentTypes').and.returnValue(of(mockResult));

      // Act
      component.GetAllTypes();

      // Assert
      expect(component.docTypes).toEqual([]);
      expect(component.appliedDocTypes).toEqual([]);
    });
  });

  describe('GetAllSubTypes', () => {
    it('should populate subDocTypes and appliedSubDocTypes with data from the service', () => {
      // Arrange
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      const mockResult = [
        { name: 'Subtype 1' },
        { name: 'Subtype 2' },
        { name: 'Subtype 3' },
      ];
      spyOn(documentServiceStub, 'getAllSubDocumentTypes').and.returnValue(of(mockResult));

      // Act
      component.GetAllSubTypes();

      // Assert
      expect(component.subDocTypes).toEqual([
        { name: 'Subtype 1', isChecked: false },
        { name: 'Subtype 2', isChecked: false },
        { name: 'Subtype 3', isChecked: false },
      ]);
      expect(component.appliedSubDocTypes).toEqual([
        { name: 'Subtype 1', isChecked: false },
        { name: 'Subtype 2', isChecked: false },
        { name: 'Subtype 3', isChecked: false },
      ]);
    });

    it('should handle empty result from the service', () => {
      // Arrange
      const documentServiceStub: DocumentService = fixture.debugElement.injector.get(
        DocumentService
      );
      const mockResult = null;
      spyOn(documentServiceStub, 'getAllSubDocumentTypes').and.returnValue(of(mockResult));

      // Act
      component.GetAllSubTypes();

      // Assert
      expect(component.subDocTypes).toEqual([]);
      expect(component.appliedSubDocTypes).toEqual([]);
    });
  });

  describe('onApplyFilters', () => {
    it('makes expected calls', () => {
      spyOn(component, 'GetDocumentsByAdvFilter').and.callThrough();
      component.onApplyFilters();
      expect(component.GetDocumentsByAdvFilter).toHaveBeenCalled();
    });
  });

  describe('onCancelFilters', () => {
    it('makes expected calls', () => {
      spyOn(component, 'cancel').and.callThrough();
      component.onCancelFilters();
      expect(component.cancel).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('makes expected calls', () => {
      spyOn(component, 'reset').and.callThrough();
      spyOn(component, 'setDisableApplyFilters').and.callThrough();
      spyOn(component, 'cancel').and.callThrough();
      component.cancel();
      expect(component.setDisableApplyFilters).toHaveBeenCalled();
      expect(component.cancel).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('makes expected calls', () => {
      spyOn(component, 'resetCheckList').and.callThrough();
      component.reset();
      expect(component.resetCheckList).toHaveBeenCalled();
    });
  });

  describe('clearAll', () => {
    it('makes expected calls', () => {
      spyOn(component, 'reset').and.callThrough();
      component.clearAll();
      expect(component.reset).toHaveBeenCalled();
    });
  });

  describe('updateAdvFiltersDocDate', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setDisableApplyFilters').and.callThrough();
      component.updateAdvFiltersDocDate();
      expect(component.setDisableApplyFilters).toHaveBeenCalled();
    });
  });

  describe('onFromDateClear', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setDisableApplyFilters').and.callThrough();
      component.onFromDateClear();
      expect(component.setDisableApplyFilters).toHaveBeenCalled();
    });
  });

  describe('onToDateClear', () => {
    it('makes expected calls', () => {
      spyOn(component, 'setDisableApplyFilters').and.callThrough();
      component.onToDateClear();
      expect(component.setDisableApplyFilters).toHaveBeenCalled();
    });
  });

  describe('getAllFirms', () => {
    it('makes expected calls', () => {
      const firmServiceStub: FirmService = fixture.debugElement.injector.get(
        FirmService
      );
      spyOn(firmServiceStub, 'getFirmList').and.callThrough();
      component.getAllFirms();
      expect(firmServiceStub.getFirmList).toHaveBeenCalled();
    });
  });

  describe('getAllFunds', () => {
    it('makes expected calls', () => {
      const fundServiceStub: FundService = fixture.debugElement.injector.get(
        FundService
      );
      spyOn(fundServiceStub, 'getFundsList').and.callThrough();
      component.getAllFunds();
      expect(fundServiceStub.getFundsList).toHaveBeenCalled();
    });
  });

  describe('getAllPortfolioCompanies', () => {
    it('makes expected calls', () => {
      const portfolioCompanyServiceStub: PortfolioCompanyService = fixture.debugElement.injector.get(
        PortfolioCompanyService
      );
      spyOn(
        portfolioCompanyServiceStub,
        'getPortfolioCompanyList'
      ).and.callThrough();
      component.getAllPortfolioCompanies();
      expect(
        portfolioCompanyServiceStub.getPortfolioCompanyList
      ).toHaveBeenCalled();
    });
  });

  describe('getAllDeals', () => {
    it('should populate the deals array with data from the service', () => {
      // Arrange
      const dealService: DealService = fixture.debugElement.injector.get(
        DealService
      );
      const mockDeals = [
        { id: 1, name: 'Deal 1' },
        { id: 2, name: 'Deal 2' },
        { id: 3, name: 'Deal 3' },
      ];
      spyOn(dealService, 'getDealsList').and.returnValue(of({ body: { dealList: mockDeals } }));

      // Act
      component.getAllDeals();

      // Assert
      expect(component.deals).toEqual(mockDeals);
    });

    it('should handle empty result from the service', () => {
      // Arrange
      const dealService: DealService = fixture.debugElement.injector.get(
        DealService
      );
      spyOn(dealService, 'getDealsList').and.returnValue(of({ body: { dealList: [] } }));

      // Act
      component.getAllDeals();

      // Assert
      expect(component.deals).toEqual([]);
    });
  });
});
