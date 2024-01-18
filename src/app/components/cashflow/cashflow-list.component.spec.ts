import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LazyLoadEvent } from 'primeng/api';
import { AccountService } from '../../services/account.service';
import { CashflowService } from '../../services/cashflow.service';
import { MiscellaneousService } from '../../services/miscellaneous.service';
import { FeaturesEnum } from '../../services/permission.service';
import { FormsModule } from '@angular/forms';
import { CashflowListComponent } from './cashflow-list.component';

describe('CashflowListComponent', () => {
  let component: CashflowListComponent;
  let fixture: ComponentFixture<CashflowListComponent>;

  beforeEach(() => {
    const changeDetectorRefStub = () => ({});
    const routerStub = () => ({});
    const ngxSpinnerServiceStub = () => ({});
    const accountServiceStub = () => ({});
    const cashflowServiceStub = () => ({
      getCashflowFileList: object => ({ subscribe: f => f({}) }),
      downloadCashflowFile: fileUploadDetails => ({ subscribe: f => f({}) })
    });
    const miscellaneousServiceStub = () => ({
      getPagerLength: () => ({}),
      downloadExcelFile: response => ({})
    });
    TestBed.configureTestingModule({
      imports: [FormsModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [CashflowListComponent],
      providers: [
        { provide: ChangeDetectorRef, useFactory: changeDetectorRefStub },
        { provide: Router, useFactory: routerStub },
        { provide: NgxSpinnerService, useFactory: ngxSpinnerServiceStub },
        { provide: AccountService, useFactory: accountServiceStub },
        { provide: CashflowService, useFactory: cashflowServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub }
      ]
    });
    fixture = TestBed.createComponent(CashflowListComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });

  it(`feature has default value`, () => {
    expect(component.feature).toEqual(FeaturesEnum);
  });

  it(`isOpenUpload has default value`, () => {
    expect(component.isOpenUpload).toEqual(false);
  });

  it(`blockedTable has default value`, () => {
    expect(component.blockedTable).toEqual(false);
  });

  it(`uploadedFileArray has default value`, () => {
    expect(component.uploadedFileArray).toEqual([]);
  });

  it(`windowHeight has default value`, () => {
    expect(component.windowHeight).toEqual(0);
  });

  it(`isLoading has default value`, () => {
    expect(component.isLoading).toEqual(true);
  });

  describe('getCashflowFileListOk', () => {
    it('should update cashflows and uploadedFileArray correctly', () => {
      // Arrange
      const resp = {
        cashFlowList: [
          { fund: { fundName: 'Fund A' } },
          { fund: { fundName: 'Fund B' } },
          { fund: { fundName: 'Fund A' } },
          { fund: { fundName: 'Fund C' } },
        ]
      };

      // Act
      component.getCashflowFileListOk(resp);

      // Assert
      expect(component.cashflows).toEqual(resp.cashFlowList);
      expect(component.uploadedFileArray).toEqual([
        {
          cashflowUplaodedFiles: [
            { fund: { fundName: 'Fund A' } },
            { fund: { fundName: 'Fund A' } }
          ],
          fundName: 'Fund A',
          isExpanded: false
        },
        {
          cashflowUplaodedFiles: [
            { fund: { fundName: 'Fund B' } }
          ],
          fundName: 'Fund B',
          isExpanded: false
        },
        {
          cashflowUplaodedFiles: [
            { fund: { fundName: 'Fund C' } }
          ],
          fundName: 'Fund C',
          isExpanded: false
        }
      ]);
      expect(component.totalRecords).toEqual(3);
    });
  });
});
