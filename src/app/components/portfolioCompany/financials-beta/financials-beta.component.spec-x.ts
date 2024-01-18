/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FinancialsBetaComponent } from './financials-beta.component';

describe('FinancialsBetaComponent', () => {
  let component: FinancialsBetaComponent;
  let fixture: ComponentFixture<FinancialsBetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FinancialsBetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialsBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
