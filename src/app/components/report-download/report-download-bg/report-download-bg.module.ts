import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportDownloadBgComponent } from './report-download-bg.component';
import { RouterModule } from '@angular/router';
import { ReportDownloadService } from 'src/app/services/report-download.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ReportDownloadBgComponent }
    ])
  ],
  declarations: [ReportDownloadBgComponent],
  providers: [
    ReportDownloadService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    }
  ],
})
export class ReportDownloadBgModule { }
