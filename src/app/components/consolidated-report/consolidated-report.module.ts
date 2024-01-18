import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsolidatedReportComponent } from './consolidated-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from 'src/app/custom-modules/material.module';

import { InternalReportService } from 'src/app/services/internal-report.service';
import { ConsolidatedReportModuleFilter } from '../consolidated-report/filters/module-filter-pipe';
@NgModule({
  declarations: [
    ConsolidatedReportComponent,
    ConsolidatedReportModuleFilter
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    },
    InternalReportService
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    MaterialModule,
    SharedComponentModule,
    CommonModule,
    ScrollingModule,
    RouterModule.forChild([
      { path: '', component: ConsolidatedReportComponent }
    ])
  ]
})
export class ConsolidatedReportModule { }
