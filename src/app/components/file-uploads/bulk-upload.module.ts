import { SharedComponentModule } from './../../custom-modules/shared-component.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BulkUploadComponent } from './bulk-upload.component';
import { MaterialModule } from '../../custom-modules/material.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    ReactiveFormsModule,
    DropdownModule,
    MaterialModule,
    SharedComponentModule,
    HttpClientModule,
    CalendarModule,
    MultiSelectModule,
    RouterModule.forChild([
      { path: '', component: BulkUploadComponent }
    ])
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [BulkUploadComponent]
})
export class BulkUploadModule { }