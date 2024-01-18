import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { PrimeNgModule } from './../../custom-modules/prime-ng.module';
import { SharedDirectiveModule } from './../../directives/shared-directive.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { AddPortfolioCompanyComponent } from './add-portfolioCompany.component';
import { SharedPipeModule } from './../../custom-modules/shared-pipe.module';
import { AngularResizeEventModule } from 'angular-resize-event';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { CompanyGroupFilter } from './filters/company-filter-pipe';
import { PortfolioCustomFieldsComponent } from './portfolio-CustomFields/portfolioCustomFields.component';
@NgModule({
  imports: [
    SharedPipeModule,
    CommonModule,
    FormsModule,
    PrimeNgModule,
    MaterialModule,
    DragDropModule,
    ReactiveFormsModule,
    SharedComponentModule,
    AngularResizeEventModule,
    SharedDirectiveModule,
    RouterModule.forChild([
      { path: '', component: AddPortfolioCompanyComponent }
    ])
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AddPortfolioCompanyComponent,CompanyGroupFilter,PortfolioCustomFieldsComponent]
})
export class AddPCModule { }
