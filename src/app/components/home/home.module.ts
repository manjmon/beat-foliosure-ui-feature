import { SharedComponentModule } from '../../custom-modules/shared-component.module';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { CounterCardComponent } from './counter-card/counter-card.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { DataAnalyticsComponent } from '../data-analytics/data-analytics.component';
import { ClientReportingService } from 'src/app/services/client-reporting.service';
import { ConfirmationService } from 'primeng/api';
import { DataAnalyticsService } from 'src/app/services/data-analytics.service';
import { DataAnalyticsFilterComponent } from '../data-analytics/data-analytics-filter/data-analytics-filter.component';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { CurrencyService } from "../../services/currency.service";
import { DataAnalyticsUploadComponent } from '../data-analytics/data-analytics-upload/data-analytics-upload.component';
@NgModule({
  imports: [
    CommonModule,
    SharedDirectiveModule,
    SharedComponentModule,
    CommonModule,
    FormsModule,
    PrimeNgModule,
    FormsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: HomeComponent }
    ]),
    AngularResizeEventModule
  ],
  providers: [ 
    ClientReportingService,
    ConfirmationService,
    DataAnalyticsService,
    CurrencyService,
    DatePipe
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomeComponent,CounterCardComponent,DataAnalyticsFilterComponent,DataAnalyticsComponent,DataAnalyticsUploadComponent]
})
export class HomeModule { }