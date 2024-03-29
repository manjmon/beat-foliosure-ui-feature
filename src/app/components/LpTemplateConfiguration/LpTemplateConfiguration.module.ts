import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LpTemplateConfigurationComponent } from './LpTemplateConfiguration.component';
import { RouterModule } from '@angular/router';
import { PageConfigurationService } from 'src/app/services/page-configuration.service';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { MaterialModule } from '../../custom-modules/material.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularResizeEventModule } from 'angular-resize-event';
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedComponentModule,
    MaterialModule,
    PrimeNgModule,
    AngularResizeEventModule,
    ReactiveFormsModule,FormsModule,
    RouterModule.forChild([
      { path: '', component: LpTemplateConfigurationComponent }
    ])
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [LpTemplateConfigurationComponent],
  providers: [PageConfigurationService, {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  },]
})
export class LpTemplateConfigurationModule { }
