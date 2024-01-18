import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { HoldingValuesComponent } from './holding-values.report';
import { ValuationReportsComponent } from './valuation-home.report';
import { AngularResizeEventModule } from 'angular-resize-event';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedComponentModule,
    SharedDirectiveModule,
    RouterModule.forChild([
      { path: '', component: ValuationReportsComponent }
    ]),
    AngularResizeEventModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [ValuationReportsComponent,HoldingValuesComponent],
})
export class ValuationReportsModule { }
