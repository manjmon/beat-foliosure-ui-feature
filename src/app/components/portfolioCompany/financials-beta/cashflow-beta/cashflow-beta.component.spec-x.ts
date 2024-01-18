/* tslint:disable:no-unused-variable */
import {ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';


import { CashflowBetaComponent } from './cashflow-beta.component';

describe('CashflowBetaComponent', () => {
  let component: CashflowBetaComponent;
  let fixture: ComponentFixture<CashflowBetaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CashflowBetaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CashflowBetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
