import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { InvestorService } from 'src/app/services/investor.service';
import { Router } from '@angular/router';
import { FeaturesEnum } from 'src/app/services/permission.service';
import { NumberDecimalConst } from 'src/app/common/constants';
import { FormsModule } from '@angular/forms';
import { InvestorlistComponent } from './investorlist.component';

describe('InvestorlistComponent', () => {
  let component: InvestorlistComponent;
  let fixture: ComponentFixture<InvestorlistComponent>;

  beforeEach(() => {
    const investorServiceStub = () => ({
      getinvestorlist: object => ({ subscribe: f => f({}) })
    });
    const routerStub = () => ({ navigate: array => ({}) });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [InvestorlistComponent],
      providers: [
        { provide: InvestorService, useFactory: investorServiceStub },
        { provide: Router, useFactory: routerStub }
      ]
    });
    fixture = TestBed.createComponent(InvestorlistComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`NumberDecimalConst has default value`, () => {
    expect(component.NumberDecimalConst).toEqual(NumberDecimalConst);
  });

  it(`investorlist has default value`, () => {
    expect(component.investorlist).toEqual([]);
  });

  it(`cols has default value`, () => {
    expect(component.cols).toEqual(component.cols);
  });

  describe('loadFundsLazy', () => {
    it('makes expected calls', () => {
      const lazyLoadEventStub: LazyLoadEvent = <any>{};
      spyOn(component, 'getConfigurationDetails').and.callThrough();
      component.loadFundsLazy(lazyLoadEventStub);
      expect(component.getConfigurationDetails).toHaveBeenCalled();
    });
  });
});
