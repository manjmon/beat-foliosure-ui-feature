import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataAnalyticsFilterComponent } from './/data-analytics-filter.component';

describe('DataAnalyticsComponent', () => {
  let component: DataAnalyticsFilterComponent;
  let fixture: ComponentFixture<DataAnalyticsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataAnalyticsFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataAnalyticsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
