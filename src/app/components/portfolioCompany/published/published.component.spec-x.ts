import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder,FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { MiscellaneousService } from 'src/app/services/miscellaneous.service';
import { PermissionService,FeaturesEnum } from 'src/app/services/permission.service';
import { PortfolioCompanyService } from 'src/app/services/portfolioCompany.service';
import { PublishedComponent } from './published.component';
import { CommonConstants } from 'src/app/common/constants';
import {MatMenuModule } from '@angular/material/menu';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { AppSettingService } from 'src/app/services/appsettings.service';
import { of } from 'rxjs';

describe('PublishedComponent', () => {
  let component: PublishedComponent;
  let fixture: ComponentFixture<PublishedComponent>;

  beforeEach(() => {
    const formBuilderStub = () => ({ group: object => ({}) });
    const routerStub = () => ({ navigate: (array, object) => ({}) });
    const toastrServiceStub = () => ({
      overlayContainer: {},
      success: (string, string1, object) => ({}),
      error: (string, string1, object) => ({})
    });
    const miscellaneousServiceStub = () => ({
      bindPrevAndNextYearList: () => ({}),
      downloadExcelFile: response => ({})
    });
    const permissionServiceStub = () => ({ isCheckTaabo: () => ({}) });
    const portfolioCompanyServiceStub = () => ({
      getPortfolioCompanyByGroup: object => ({ subscribe: f => f({}) }),
      exportPortfolioCompanyList: object => ({ subscribe: f => f({}) }),
      exportPortfolioCompanyKPIDataList: () => ({ subscribe: f => f({}) }),
      createDraft: model => ({ subscribe: f => f({}) })
    });
    const appSettingsServiceStub = () => ({ setGetConfig: () => ({}) });
    const activatedRouteStub = {
      // Add any needed properties or methods here
    };
    TestBed.configureTestingModule({
      imports: [FormsModule, MatMenuModule,PrimeNgModule],
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PublishedComponent],
      providers: [
        { provide: FormBuilder, useFactory: formBuilderStub },
        { provide: Router, useFactory: routerStub },
        { provide: ToastrService, useFactory: toastrServiceStub },
        { provide: MiscellaneousService, useFactory: miscellaneousServiceStub },
        { provide: PermissionService, useFactory: permissionServiceStub },
        { provide: AppSettingService, useFactory: appSettingsServiceStub },
        {
          provide: PortfolioCompanyService,
          useFactory: portfolioCompanyServiceStub
        },
        { provide: ActivatedRoute, useValue: activatedRouteStub }
      ]
    });
    fixture = TestBed.createComponent(PublishedComponent);
    component = fixture.componentInstance;
  });

  it('can load instance', () => {
    expect(component).toBeTruthy();
  });
});
