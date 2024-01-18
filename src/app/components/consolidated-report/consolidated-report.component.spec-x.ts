import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ToastrService, TOAST_CONFIG } from 'ngx-toastr';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { ConsolidatedReportService } from 'src/app/services/consolidated-report.service';
import { ConsolidatedReportComponent } from './consolidated-report.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DropdownModule } from 'primeng/dropdown';
import { MatMenuModule } from '@angular/material/menu';
import { ConsolidatedReportModuleFilter } from './filters/module-filter-pipe';
import { of } from 'rxjs';

describe('ConsolidatedReportComponent', () => {
  let component: ConsolidatedReportComponent;
  let fixture: ComponentFixture<ConsolidatedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ConsolidatedReportComponent,
        ConsolidatedReportModuleFilter
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [DropdownModule, MatMenuModule],
      providers: [
        FormBuilder,
        { provide: ToastrService, useValue: {} },
        { 
          provide: ConsolidatedReportService, 
          useValue: {
            getConsolidatedReportConfiguration: () => of({}), // Mock implementation
            // Add other methods as needed
          } 
        },
        { 
          provide: PortfolioCompanyService, 
          useValue: {
            // Add mock methods here
          } 
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ...

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsolidatedReportComponent], // Add ModuleFilterPipe to the declarations
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [DropdownModule, MatMenuModule],
      providers: [
        FormBuilder,
        { provide: ToastrService, useValue: {} },
        { provide: PortfolioCompanyService, useValue: {} },
        { provide: ConsolidatedReportService, useValue: {} },
        { provide: TOAST_CONFIG, useValue: {} }, // Provide a mock value for the token
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(ConsolidatedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.isCompanyPopup).toBe(false);
    expect(component.selectConfirmCompany).toBeNull();
    // Add assertions for other properties
  });

  it('should handle checkbox click and update isCheckAll property', () => {
    // Arrange
    const rowData = { isSelected: true };
    const event = { target: { checked: false } };
    component.kpiMappingList = [
      { isSelected: true },
      { isSelected: true },
      { isSelected: true },
    ];

    // Act
    component.handleCheckBox(rowData, event);

    // Assert
    expect(rowData.isSelected).toBe(false);
    expect(component.isCheckAll).toBe(false);
  });
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize component properties', () => {
    expect(component.isCompanyPopup).toBe(false);
    expect(component.selectConfirmCompany).toBeNull();
    // Add assertions for other properties
  });

  it('should handle checkbox click and update isCheckAll property', () => {
    // Arrange
    const rowData = { isSelected: true };
    const event = { target: { checked: false } };
    component.kpiMappingList = [
      { isSelected: true },
      { isSelected: true },
      { isSelected: true },
    ];

    // Act
    component.handleCheckBox(rowData, event);

    // Assert
    expect(rowData.isSelected).toBe(false);
    expect(component.isCheckAll).toBe(false);
  });

  // Add more test cases for other methods and scenarios

 
});