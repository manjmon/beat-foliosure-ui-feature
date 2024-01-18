import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToastrService } from "ngx-toastr";
import { DataAnalyticsUploadComponent } from './data-analytics-upload.component';
import { DataAnalyticsService } from "src/app/services/data-analytics.service";
describe('DataAnalyticsComponent', () => {
  let component: DataAnalyticsUploadComponent;
  let fixture: ComponentFixture<DataAnalyticsUploadComponent>;
  let dataAnalyticsServiceSpy: jasmine.SpyObj<DataAnalyticsService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataAnalyticsUploadComponent ],
      providers: [
        { provide: DataAnalyticsService, useValue: dataAnalyticsServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    })
    .compileComponents();
    component = TestBed.createComponent(DataAnalyticsUploadComponent).componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAnalyticsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
 
 
  
});
