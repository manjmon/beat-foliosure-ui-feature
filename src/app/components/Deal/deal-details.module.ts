import { RadioButtonModule } from 'primeng/radiobutton';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { SharedComponentModule } from '../../custom-modules/shared-component.module';
import { DealDetailsComponent } from './deal-details.component';
import { SharedDirectiveModule } from '../../directives/shared-directive.module';
import { TableModule } from 'primeng/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpServiceInterceptor } from 'src/app/interceptors/http-service-interceptor';
import { PrimeNgModule } from 'src/app/custom-modules/prime-ng.module';
import { SavePortfolioFundHoldingComponent } from './portfolio-fundHolding.component';
import { MaterialModule } from 'src/app/custom-modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TableModule,
    OverlayPanelModule,
    RadioButtonModule,
    SharedDirectiveModule,
    PrimeNgModule,
    SharedComponentModule,
    RouterModule.forChild([
      { path: '', component: DealDetailsComponent }
    ])
  ],
  providers: [    {
    provide: HTTP_INTERCEPTORS,
    useClass: HttpServiceInterceptor,
    multi: true,
  }],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  declarations: [DealDetailsComponent,SavePortfolioFundHoldingComponent]
})
export class DealDetailsModule { }
