import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientReportingComponent } from './client-reporting.component';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { ClientReportingService } from 'src/app/services/client-reporting.service';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { SafeHtmlPipe } from 'src/app/pipes/safe-html.pipe';
import { AngularResizeEventModule } from 'angular-resize-event';
import { ClientReportTabs } from './client-report-tabs/client-report-tab';
@NgModule({
  declarations: [
    ClientReportingComponent,
    SafeHtmlPipe,
    ClientReportTabs
  ],
  imports: [
    CommonModule,
    SharedDirectiveModule,
    SharedComponentModule,
    PrimeNgModule,
    MaterialModule,
    AngularResizeEventModule,
    RouterModule.forChild([
      { path: '', component: ClientReportingComponent }
    ])
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  },
  ClientReportingService
],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ClientReportingModule { }
