import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, ElementRef,SimpleChange } from '@angular/core';
import { ClientReportTabs } from './client-report-tab';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';

describe('ClientReportTabs', () => {
  let component: ClientReportTabs;
  let fixture: ComponentFixture<ClientReportTabs>;
  let mockElementRef: any;
  let mockChangeDetectorRef: any;

  beforeEach(async () => {
    mockElementRef = {
      nativeElement: {
        scrollWidth: 1000,
        offsetWidth: 500,
        scrollLeft: 0,
        scrollTo: jasmine.createSpy('scrollTo'),
      },
    };
    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      declarations: [ ClientReportTabs ],
      imports: [ SelectButtonModule,FormsModule ],
      providers: [
        { provide: ElementRef, useValue: mockElementRef },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientReportTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
 
  it('should create', () => {
    expect(component).toBeTruthy();
  });
if(component){
  component?.ngOnChanges({ selectedPeriodType: new SimpleChange(null, component.selectedPeriodType, true) });
}
  // ...

   

  component?.ngOnChanges({ selectedPeriodType: new SimpleChange(null, component.selectedPeriodType, true) });

  it('should scroll right when moveRight is called', () => {
    // Arrange
    component.panel = { nativeElement: { scrollWidth: 1000, offsetWidth: 500, scrollLeft: 0, scrollTo: jasmine.createSpy('scrollTo') } };
    
    // Act
    component.moveRight();

    // Assert
    expect(component.panel.nativeElement.scrollTo).toHaveBeenCalled();
  });

  
  it('should emit onSelectedActiveTab when changeTabType is called', () => {
    // Arrange
    const tab = { MonthYear: '2022-01' };
    spyOn(component.onSelectedActiveTab, 'emit');
    
    // Act
    component.changeTabType(tab);

    // Assert
    expect(component.onSelectedActiveTab.emit).toHaveBeenCalledWith(tab);
  });

});