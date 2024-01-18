import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { AttributionReportsComponent } from './attribution.report';
import { AttributionHomeReportsComponent } from './attribution-home.report';
import { AngularResizeEventModule } from 'angular-resize-event';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedComponentModule,
    SharedDirectiveModule,
    RouterModule.forChild([
      { path: '', component: AttributionHomeReportsComponent }
    ]),
    AngularResizeEventModule
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AttributionHomeReportsComponent,AttributionReportsComponent],
})
export class AttributionReportsModule { }
