import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
import { RouterModule } from '@angular/router';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { HoldingsReportsComponent } from './holdings-home.report';
import { TopHoldingsComponent } from './top-holdings.report';
import { MaterialModule } from '../../../custom-modules/material.module';
import { TopHoldingsInvestorsComponent } from './top-holdings-investors.report';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedComponentModule,
    SharedDirectiveModule,
    MaterialModule,
    RouterModule.forChild([
      { path: '', component: HoldingsReportsComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HoldingsReportsComponent,TopHoldingsComponent,TopHoldingsInvestorsComponent],
})
export class HoldingReportsModule { }
