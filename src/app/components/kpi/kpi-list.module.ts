import { SharedPageModule } from './../../custom-modules/shared-page.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/custom-modules/material.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { KPIListComponent } from './kpi-list.component';
import { RouterModule } from '@angular/router';
import { KpiMappingComponent } from './kpi-mapping/kpi-mapping.component';
import { PortfolioCompanyMappingComponent } from './portfolio-company-mapping/portfolio-company-mapping.component';
import { AngularResizeEventModule } from 'angular-resize-event';
import { KpiFormulaBuilderComponent } from '../kpi-formula-builder/kpi-formula-builder.component';
import { KPIDataService } from 'src/app/services/kpi-data.service';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedDirectiveModule,
    SharedComponentModule,
    SharedPageModule,
    MaterialModule,
    PrimeNgModule,
    AngularResizeEventModule,
    RouterModule.forChild([
      { path: '', component: KPIListComponent }
    ])
  ],
  providers: [
    KPIDataService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpServiceInterceptor,
      multi: true,
    },
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [KPIListComponent,KpiMappingComponent,PortfolioCompanyMappingComponent,KpiFormulaBuilderComponent]
})
export class KpiListModule { }
