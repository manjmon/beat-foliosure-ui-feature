import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FundReportComponent } from './fund-report.component';
import { RouterModule } from '@angular/router';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { MaterialModule } from '../../custom-modules/material.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FundReportTrueOrFalse } from 'src/app/pipes/enum-fund.pipe';
import { FundReportService } from 'src/app/services/fund-report.service';
import {  NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FundDynamicFilter } from 'src/app/pipes/fund-dynamicfilters.pipe';
import { FundChartFilter } from 'src/app/pipes/fund-charts-filter.pipe';
import { AngularResizeEventModule } from 'angular-resize-event';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedComponentModule,
    MaterialModule,
    PrimeNgModule,
    ReactiveFormsModule, FormsModule,
    AngularResizeEventModule,
    NgbModule,
    RouterModule.forChild([
      { path: '', component: FundReportComponent }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [FundChartFilter,FundReportComponent,FundReportTrueOrFalse,FundDynamicFilter],
  providers: [FundReportService,PageConfigurationService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  },]
})
export class FundreportModule { }