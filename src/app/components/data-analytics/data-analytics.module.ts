import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { ClientReportingService } from 'src/app/services/client-reporting.service';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { AngularResizeEventModule } from 'angular-resize-event';
import { DataAnalyticsComponent } from './data-analytics.component';
import { DataAnalyticsFilterComponent } from './data-analytics-filter/data-analytics-filter.component'
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { DataAnalyticsService } from 'src/app/services/data-analytics.service';
import { CurrencyService } from "../../services/currency.service";
@NgModule({
  imports: [
    CommonModule,
    SharedDirectiveModule,
    SharedComponentModule,
    CommonModule,
    FormsModule,
    PrimeNgModule,
    FormsModule,
    HttpClientModule,
    MaterialModule,
    AngularResizeEventModule,
    RouterModule.forChild([
      { path: '', component: DataAnalyticsComponent }
    ])
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true
  },
  ClientReportingService,
  ConfirmationService,
  DataAnalyticsService,
  CurrencyService,
  DatePipe

],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DataAnalyticsFilterComponent,DataAnalyticsComponent],
})
export class DataAnalyticsModule { }
