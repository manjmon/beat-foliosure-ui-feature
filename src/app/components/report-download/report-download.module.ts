import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDownloadComponent } from './report-download.component';
import { InternalReportDownloadComponent } from './internal-report-download/internal-report-download.component';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { ReportDownloadService } from 'src/app/services/report-download.service';
import { ConsolidatedReportDownloadComponent } from './consolidated-report-download/consolidated-report-download.component';
@NgModule({
  declarations: [
    
    ReportDownloadComponent,
    InternalReportDownloadComponent,
    ConsolidatedReportDownloadComponent
  ],
  imports: [
    CommonModule,
    PrimeNgModule,
    MaterialModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: ReportDownloadComponent }
    ])
  ],
  providers: [
    ReportDownloadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    }
  ],
})
export class ReportDownloadModule { }
