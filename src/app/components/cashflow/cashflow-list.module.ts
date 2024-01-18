import { SharedComponentModule } from 'src/app/custom-modules/shared-component.module';
import { CashflowUploadComponent } from './cashflow-upload/cashflow-upload.component';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { CashflowListComponent } from './cashflow-list.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedDirectiveModule } from 'src/app/directives/shared-directive.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PrimeNgModule,
    SharedDirectiveModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: CashflowListComponent }
    ])
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [CashflowListComponent,CashflowUploadComponent],
})
export class CashflowListModule { }