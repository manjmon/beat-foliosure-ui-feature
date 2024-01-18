import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FxratesComponent } from './fxrates.component';
import { CurrencyService } from "src/app/services/currency.service";
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { InputSwitchModule } from 'primeng/inputswitch'; 

describe('FxratesComponent', () => {
  let component: FxratesComponent;
  let fixture: ComponentFixture<FxratesComponent>;
  let currencyService: CurrencyService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FxratesComponent],
      providers: [
        CurrencyService, // Provide your service
        { provide: 'BASE_URL', useValue: 'http://your-base-url.com' } // Provide BASE_URL
      ],
      imports: [
        HttpClientModule, // Add HttpClientModule to the imports array
        InputSwitchModule // Add InputSwitchModule to the imports array
      ]
    }).compileComponents();

    // ... rest of your code
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FxratesComponent);
    component = fixture.componentInstance;
    currencyService = TestBed.inject(CurrencyService);
    spyOn(currencyService, 'GetFxratesBulkUpload').and.returnValue(of({ code: 'OK', body: [] }));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getBulkuploadfxrates method on component initialization', () => {
    spyOn(component, 'getBulkuploadfxrates');
    component.ngOnInit();
    expect(component.getBulkuploadfxrates).toHaveBeenCalled();
  });

  it('should set fxrateslist and fxrateslistResults properties after calling getBulkuploadfxrates method', () => {
    component.getBulkuploadfxrates();
    expect(component.fxrateslist).toEqual([]);
    expect(component.fxrateslistResults).toEqual([]);
  });

  it('should generate columns correctly', () => {
    component.fxrateslist = [
      { date: '2022-01-01' },
      { date: '2022-01-02' },
      { date: '2022-01-03' }
    ];
    component.generateColumns();
    expect(component.fxrateslistColumns).toEqual([
      { field: '2022-01-01', header: '2022-01-01' },
      { field: '2022-01-02', header: '2022-01-02' },
      { field: '2022-01-03', header: '2022-01-03' }
    ]);
  });

  // it('should generate results correctly', () => {
  //   component.fxrateslistResults = [
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'EUR', rate: 1.2, date: '2022-01-01' },
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'EUR', rate: 1.3, date: '2022-01-02' },
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'GBP', rate: 1.4, date: '2022-01-01' },
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'GBP', rate: 1.5, date: '2022-01-02' }
  //   ];
  //   component.fxrateslistColumns = [
  //     { field: '2022-01-01', header: '2022-01-01' },
  //     { field: '2022-01-02', header: '2022-01-02' }
  //   ];
  //   component.generateResults();
  //   expect(component.fxrateslistResultsfinal).toEqual(component.fxrateslistResults);
  //   expect(component.fxrateslistResults).toEqual([
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'EUR', rate: 1.2, date: '2022-01-01', '2022-01-01': 1.2 },
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'EUR', rate: 1.3, date: '2022-01-02', '2022-01-02': 1.3 },
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'GBP', rate: 1.4, date: '2022-01-01', '2022-01-01': 1.4 },
  //     { fromCurrencyCode: 'USD', toCurrencyCode: 'GBP', rate: 1.5, date: '2022-01-02', '2022-01-02': 1.5 }
  //   ]);
  // });
 
  it('should call GetFxratesBulkUpload method of CurrencyService when calling getBulkuploadfxrates method', () => {
    component.getBulkuploadfxrates();
    expect(currencyService.GetFxratesBulkUpload).toHaveBeenCalled();
  });

  // Add more tests for other methods and properties of the component as needed
});