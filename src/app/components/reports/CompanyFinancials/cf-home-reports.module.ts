import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { CFReportsComponent } from './cf-home.report';
import { CompanyFinancialsReportComponent } from './company-financials.report';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedComponentModule,
    SharedDirectiveModule,
    RouterModule.forChild([
      { path: '', component: CFReportsComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CFReportsComponent,CompanyFinancialsReportComponent],
})
export class CFHomeReportsModule { }
