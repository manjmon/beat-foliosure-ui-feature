import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AddPipelineComponent } from './add-pipeline.component';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { AngularResizeEventModule } from 'angular-resize-event';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    CalendarModule,
    SharedComponentModule,
    AngularResizeEventModule,
    RouterModule.forChild([
      { path: '', component: AddPipelineComponent }
    ])
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AddPipelineComponent],
})
export class AddPipelineModule { }
