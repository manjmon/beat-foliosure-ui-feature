import { SharedDirectiveModule } from './../../directives/shared-directive.module';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { DealListComponent } from './deal-list.component';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { MaterialModule } from 'src/app/custom-modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    SharedComponentModule,
    SharedDirectiveModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: DealListComponent }
    ])
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DealListComponent]
})
export class DealListModule { }
