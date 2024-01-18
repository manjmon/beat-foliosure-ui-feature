import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InternalReportComponent } from './internal-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { InternalReportService } from 'src/app/services/internal-report.service';
import { InternalReportCompanyFilter } from './filters/company-filter-pipe';
import { InternalReportModuleFilter } from './filters/module-filter-pipe';
import { TemplateFilter } from './filters/templateFilter.pipe';
@NgModule({
  declarations: [
    InternalReportComponent,
    InternalReportCompanyFilter,
    InternalReportModuleFilter,
    TemplateFilter
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    },
    InternalReportService,
    DatePipe
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
      { path: '', component: InternalReportComponent }
    ])
  ]
})
export class InternalReportModule { }
